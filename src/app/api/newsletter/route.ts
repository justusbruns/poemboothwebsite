// Newsletter signup → Resend (double opt-in). The API key never reaches the browser.
// Always answers with the same success payload (no enumeration); only a malformed
// email or missing consent gets a 400 so the form can show a field error.
import { startSignup, normEmail, normRegion, overIpLimit, logEvent, clientIp } from "@/lib/newsletter";
import { normLocale } from "@/lib/newsletter-copy";

export const dynamic = "force-dynamic";

const LOCATIONS = new Set(["footer", "section"]);

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return Response.json({ error: "bad_request" }, { status: 400 }); }
  const { email, organisation, consent, website, location, lang, region } = body || {};
  const ip = clientIp(request);
  const userAgent = (request.headers.get("user-agent") || "").slice(0, 300);
  const loc = LOCATIONS.has(location as string) ? (location as string) : "form";
  const ok = () => Response.json({ ok: true });

  // Honeypot (`website`, visually hidden): pretend success, send nothing.
  if (website) {
    await logEvent({ email: String(email || "").slice(0, 254) || "(none)", event: "honeypot", ip, user_agent: userAgent, detail: { location: loc } });
    return ok();
  }
  const e = normEmail(email);
  if (!e) return Response.json({ error: "invalid_email" }, { status: 400 });
  if (consent !== true) return Response.json({ error: "consent_required" }, { status: 400 });

  if (await overIpLimit(ip)) {
    await logEvent({ email: e, event: "rate_limited", ip, user_agent: userAgent, detail: { location: loc } });
    return ok();
  }
  await startSignup({ email: e, organisation, location: loc, lang: normLocale(lang), region: normRegion(region), ip, userAgent });
  return ok();
}
