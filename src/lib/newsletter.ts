// Newsletter on Resend, double opt-in. SERVER ONLY (RESEND_API_KEY, NEWSLETTER_SECRET,
// NEWSLETTER_DB_KEY). Same flow as vouw.com (vouw-website lib/newsletter.js):
//
//   startSignup()   → contact created/kept as unsubscribed=true, added to the segments,
//                     confirmation mail with a signed link (7 days).
//   confirmSignup() → verifies the link, sets unsubscribed=false + topics opt_in.
// Every step is written to `newsletter_events` (shared with vouw.com, proof of consent).
import "server-only";
import crypto from "node:crypto";
import dns from "node:dns/promises";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { renderEmail, esc } from "@/emails/layout.mjs";
import { CONFIRM_EMAIL, CONSENT_TEXT, normLocale } from "@/lib/newsletter-copy";
import { regions, type Locale } from "@/i18n/routing";

const API = "https://api.resend.com";
export const SOURCE = "poembooth.com";
// Everyone here is event/venue audience: always both segments (looked up by name).
const SEGMENTS = ["Poembooth.com subscribers", "Audience: Events"];
const TOPICS_ON = ["Letters from the studio", "Product news & offers"];
const FROM = process.env.NEWSLETTER_FROM || "Poem Booth <hello@news.poembooth.com>";
const REPLY_TO = process.env.NEWSLETTER_REPLY_TO || "contact@poembooth.com";
// Always the public host: links and redirects never use the request origin.
export const SITE = "https://www.poembooth.com";
const TOKEN_TTL_MS = 7 * 24 * 3600e3;
const RATE_PER_IP_HOUR = 5;

export const EMAIL_RE = /^[^@\s"<>()\[\],;:]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/;
export function normEmail(e: unknown): string | null {
  const s = String(e || "").trim().toLowerCase();
  return s.length <= 254 && EMAIL_RE.test(s) ? s : null;
}
export const normRegion = (r: unknown): string => ((regions as readonly string[]).includes(r as string) ? (r as string) : "nl");

// ── Event log (VOUW Supabase, api.vouw.com) ──────────────────────────────────
let _db: SupabaseClient | null = null;
function db(): SupabaseClient | null {
  const url = process.env.NEWSLETTER_DB_URL || "https://api.vouw.com";
  const key = process.env.NEWSLETTER_DB_KEY;
  if (!key) return null;
  _db ??= createClient(url, key, { auth: { persistSession: false } });
  return _db;
}

type Row = Record<string, unknown> & { email: string; event: string };
export async function logEvent(row: Row) {
  const c = db();
  if (!c) return console.error("newsletter log skipped: NEWSLETTER_DB_KEY missing", row.event);
  try {
    const { error } = await c.from("newsletter_events").insert({ source: SOURCE, ...row });
    if (error) console.error("newsletter log failed", error.message);
  } catch (e) {
    console.error("newsletter log failed", (e as Error)?.message);
  }
}

export async function overIpLimit(ip: string | null) {
  const c = db();
  if (!ip || !c) return false;
  const since = new Date(Date.now() - 3600e3).toISOString();
  const { count } = await c.from("newsletter_events").select("id", { count: "exact", head: true })
    .eq("ip", ip).eq("event", "signup_requested").gte("created_at", since);
  return (count || 0) >= RATE_PER_IP_HOUR;
}

// Real "no such domain / no MX" → undeliverable. Timeout / servfail → unknown (let it through).
async function hasMx(domain: string): Promise<"ok" | "none" | "unknown"> {
  try {
    const recs = await Promise.race([
      dns.resolveMx(domain),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("mx_timeout")), 4000)),
    ]);
    if (Array.isArray(recs) && recs.length > 0) return "ok";
    try { await dns.resolve(domain); return "ok"; } catch { return "none"; }
  } catch (e) {
    const code = (e as NodeJS.ErrnoException)?.code;
    if (code === "ENOTFOUND" || code === "ENODATA" || code === "NXDOMAIN") return "none";
    return "unknown";
  }
}

// ── Resend helpers ────────────────────────────────────────────────────────────
async function resend(path: string, { method = "GET", body }: { method?: string; body?: unknown } = {}) {
  const r = await fetch(API + path, {
    method,
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await r.json().catch(() => null);
  return { ok: r.ok, status: r.status, data };
}

// Topic + segment IDs are looked up by name (GET /topics, /segments) and cached.
type Ids = { topics: Record<string, string>; segments: Record<string, string> };
let idCache: Ids & { at: number } = { at: 0, topics: {}, segments: {} };
async function ids(): Promise<Ids> {
  if (Date.now() - idCache.at < 3600e3) return idCache;
  const [t, s] = await Promise.all([resend("/topics"), resend("/segments")]);
  const topics: Record<string, string> = {};
  for (const x of t.data?.data || []) topics[x.name] = x.id;
  const segments: Record<string, string> = {};
  for (const x of s.data?.data || []) segments[x.name] = x.id;
  if (t.ok && s.ok) idCache = { at: Date.now(), topics, segments };
  return { topics, segments };
}

async function addToSegments(e: string, segments: Record<string, string>) {
  const missing = SEGMENTS.filter((n) => !segments[n]);
  if (missing.length) throw new Error(`segments missing: ${missing.join(", ")}`);
  for (const n of SEGMENTS) {
    const r = await resend(`/contacts/${enc(e)}/segments/${segments[n]}`, { method: "POST" });
    if (!r.ok) throw new Error(`segment ${n} ${r.status}: ${JSON.stringify(r.data)}`);
  }
}

const enc = (s: string) => encodeURIComponent(s);
async function getContact(email: string) {
  const r = await resend(`/contacts/${enc(email)}`);
  return r.ok ? r.data : null;
}

// ── Signed confirmation token: base64url(json).base64url(hmac) ───────────────
function secret() {
  const s = process.env.NEWSLETTER_SECRET;
  if (!s || s.length < 32) throw new Error("NEWSLETTER_SECRET missing");
  return s;
}
type Payload = { e: string; s?: string; l?: string; r?: string; o?: string | null; exp: number };
export function signToken(payload: Omit<Payload, "exp">, ttl = TOKEN_TTL_MS) {
  const body = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + ttl })).toString("base64url");
  const sig = crypto.createHmac("sha256", secret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}
export function verifyToken(token: unknown): { ok: true; payload: Payload } | { ok: false; reason: "invalid" | "expired"; payload?: Payload } {
  const [body, sig] = String(token || "").split(".");
  if (!body || !sig) return { ok: false, reason: "invalid" };
  const want = crypto.createHmac("sha256", secret()).update(body).digest();
  const got = Buffer.from(sig, "base64url");
  if (got.length !== want.length || !crypto.timingSafeEqual(got, want)) return { ok: false, reason: "invalid" };
  let p: Payload;
  try { p = JSON.parse(Buffer.from(body, "base64url").toString("utf8")); } catch { return { ok: false, reason: "invalid" }; }
  if (!p?.e || typeof p.exp !== "number") return { ok: false, reason: "invalid" };
  // Signature is valid, so the payload can still pick the thank-you page language.
  if (Date.now() > p.exp) return { ok: false, reason: "expired", payload: p };
  return { ok: true, payload: p };
}

// ── Signup ────────────────────────────────────────────────────────────────────
// Returns nothing on purpose: callers always show the same message.
export async function startSignup(a: {
  email: string; organisation?: unknown; location: string; lang: Locale; region: string; ip: string | null; userAgent: string;
}) {
  const e = normEmail(a.email);
  if (!e) return;
  const org = String(a.organisation || "").trim().slice(0, 120) || null;
  const base = {
    email: e, consent_text: CONSENT_TEXT[a.lang], lang: a.lang, ip: a.ip, user_agent: a.userAgent,
    audience: "events", detail: { location: a.location, region: a.region, ...(org ? { organisation: org } : {}) },
  };

  await logEvent({ ...base, event: "signup_requested" });
  // Domain can't receive mail (typo, made-up, bot): don't create a contact or
  // send, a bounce only hurts our sender reputation.
  if ((await hasMx(e.split("@")[1])) === "none") {
    await logEvent({ ...base, event: "undeliverable" });
    return;
  }
  try {
    const { segments } = await ids();
    const existing = await getContact(e);

    // Already an active subscriber: no new mail, same success message.
    if (existing && existing.unsubscribed === false) {
      await logEvent({ ...base, event: "already_subscribed" });
      return;
    }

    if (!existing) {
      // Stays unsubscribed until they click the link.
      const r = await resend("/contacts", { method: "POST", body: { email: e, unsubscribed: true } });
      if (!r.ok) throw new Error(`create contact ${r.status}: ${JSON.stringify(r.data)}`);
    }
    await addToSegments(e, segments);

    const token = signToken({ e, s: SOURCE, l: a.lang, r: a.region, o: org });
    const url = `${SITE}/api/newsletter/confirm?token=${token}`;
    const m = await resend("/emails", {
      method: "POST",
      body: {
        from: FROM,
        to: [e],
        reply_to: REPLY_TO,
        subject: CONFIRM_EMAIL[a.lang].subject,
        ...confirmEmail(a.lang, url),
        tags: [{ name: "category", value: "newsletter_confirm" }],
      },
    });
    if (!m.ok) throw new Error(`send ${m.status}: ${JSON.stringify(m.data)}`);
    await logEvent({ ...base, event: "confirmation_sent", detail: { ...base.detail, email_id: m.data?.id } });
  } catch (err) {
    console.error("newsletter signup failed", (err as Error)?.message);
    await logEvent({ ...base, event: "error", detail: { ...base.detail, step: "signup", message: String((err as Error)?.message || err).slice(0, 500) } });
  }
}

// ── Confirm ───────────────────────────────────────────────────────────────────
type ConfirmResult = { status: "ok" | "invalid" | "expired" | "error"; lang: Locale; region: string };
export async function confirmSignup(token: unknown, { ip, userAgent }: { ip: string | null; userAgent: string }): Promise<ConfirmResult> {
  let v: ReturnType<typeof verifyToken>;
  try { v = verifyToken(token); } catch { return { status: "error", lang: "en", region: "nl" }; }
  if (!v.ok) return { status: v.reason, lang: normLocale(v.payload?.l), region: normRegion(v.payload?.r) };
  const { e, o = null } = v.payload;
  const lang = normLocale(v.payload.l);
  const region = normRegion(v.payload.r);
  const base = { email: e, lang, ip, user_agent: userAgent, audience: "events" };
  try {
    const { topics: topicIds, segments } = await ids();
    const existing = await getContact(e);
    if (!existing) return { status: "invalid", lang, region }; // contact deleted meanwhile
    const up = await resend(`/contacts/${enc(e)}`, { method: "PATCH", body: { unsubscribed: false } });
    if (!up.ok) throw new Error(`update ${up.status}`);
    await addToSegments(e, segments);
    const missing = TOPICS_ON.filter((n) => !topicIds[n]);
    if (missing.length) throw new Error(`topics missing: ${missing.join(", ")}`);
    const tr = await resend(`/contacts/${enc(e)}/topics`, {
      method: "PATCH",
      body: TOPICS_ON.map((n) => ({ id: topicIds[n], subscription: "opt_in" })),
    });
    if (!tr.ok) throw new Error(`topics ${tr.status}: ${JSON.stringify(tr.data)}`);
    await logEvent({ ...base, event: "confirmed", topics: TOPICS_ON, consent_text: CONSENT_TEXT[lang], detail: { region, ...(o ? { organisation: o } : {}) } });
    return { status: "ok", lang, region };
  } catch (err) {
    console.error("newsletter confirm failed", (err as Error)?.message);
    await logEvent({ ...base, event: "error", detail: { step: "confirm", message: String((err as Error)?.message || err).slice(0, 500) } });
    return { status: "error", lang, region };
  }
}

// ── Confirmation email (shared base layout, src/emails/layout.mjs) ───────────
function confirmEmail(lang: Locale, url: string) {
  const c = CONFIRM_EMAIL[lang];
  return renderEmail({
    lang,
    title: c.title,
    preheader: c.preheader,
    bodyHtml: `<p style="margin:0 0 16px">${esc(c.hi)}</p><p style="margin:0">${esc(c.body)}</p>`,
    button: { label: c.button, url },
    note: c.note,
  });
}

// Client IP. On Vercel x-real-ip / the first x-forwarded-for entry is set by the
// edge (a client-sent value is overwritten), so it can't be spoofed for the rate limit.
export function clientIp(req: Request): string | null {
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const xff = req.headers.get("x-forwarded-for");
  return xff ? xff.split(",")[0].trim() : null;
}
