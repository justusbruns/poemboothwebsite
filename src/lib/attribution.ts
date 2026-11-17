// Marketing attribution: first-touch + last-touch UTM/click-id capture,
// shared with book.poembooth.com through a `.poembooth.com` cookie, plus
// decoration of booking links with the last-touch params.

export const ATTR_COOKIE = "pb_attr";
const LS_FIRST = "pb_attr_first";
const LS_LAST = "pb_attr_last";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const ATTR_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
] as const;

/** Params forwarded onto booking links (gclid is captured but not forwarded). */
const FORWARD_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
] as const;

export type Touch = Partial<Record<(typeof ATTR_PARAMS)[number], string>> & {
  referrer?: string;
  landing_path: string;
  ts: string;
};

export interface Attribution {
  first?: Touch;
  last?: Touch;
}

// In-memory copy so links can be decorated in the current session even
// before (or without) consent to persist anything.
let memory: Attribution = {};

function readCookie(): Attribution | null {
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${ATTR_COOKIE}=([^;]*)`));
  if (!m) return null;
  try {
    return JSON.parse(decodeURIComponent(m[1])) as Attribution;
  } catch {
    return null;
  }
}

function readLS(key: string): Touch | undefined {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as Touch) : undefined;
  } catch {
    return undefined;
  }
}

export function getAttribution(): Attribution {
  if (typeof document === "undefined") return memory;
  if (memory.last) return memory;
  const cookie = readCookie();
  return {
    first: readLS(LS_FIRST) ?? cookie?.first,
    last: readLS(LS_LAST) ?? cookie?.last,
  };
}

function persist(attr: Attribution) {
  try {
    if (attr.first) localStorage.setItem(LS_FIRST, JSON.stringify(attr.first));
    if (attr.last) localStorage.setItem(LS_LAST, JSON.stringify(attr.last));
  } catch {
    // ignore
  }
  const value = encodeURIComponent(JSON.stringify(attr));
  const base = `${ATTR_COOKIE}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.cookie = window.location.hostname.endsWith("poembooth.com")
    ? `${base}; Domain=.poembooth.com; Secure`
    : base;
}

function externalReferrer(): string | undefined {
  const ref = document.referrer;
  if (!ref) return undefined;
  try {
    const host = new URL(ref).hostname;
    if (host === window.location.hostname) return undefined;
  } catch {
    return undefined;
  }
  return ref;
}

/**
 * Read attribution params from the current URL. A new touch is recorded when
 * the URL carries any utm_/click-id param, or on an external referral. First
 * touch is only set once; last touch is overwritten on each new touch.
 * `persistAllowed` controls whether anything is written to cookie/localStorage.
 */
export function captureAttribution(persistAllowed: boolean): Attribution {
  const stored = getAttribution();
  const params = new URLSearchParams(window.location.search);
  const touch: Touch = {
    landing_path: window.location.pathname,
    ts: new Date().toISOString(),
  };
  let hasParams = false;
  for (const key of ATTR_PARAMS) {
    const v = params.get(key);
    if (v) {
      touch[key] = v.slice(0, 200);
      hasParams = true;
    }
  }
  const referrer = externalReferrer();
  if (referrer) touch.referrer = referrer.slice(0, 300);

  let next = stored;
  if (hasParams || referrer || !stored.first) {
    next = { first: stored.first ?? touch, last: hasParams || referrer || !stored.last ? touch : stored.last };
  }
  memory = next;
  if (persistAllowed && next.last) persist(next);
  return next;
}

/** Flat props for PostHog etc. */
export function attributionProps(attr: Attribution): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [prefix, touch] of [["first", attr.first], ["last", attr.last]] as const) {
    if (!touch) continue;
    for (const [k, v] of Object.entries(touch)) {
      if (v) out[`${prefix}_${k}`] = String(v);
    }
  }
  return out;
}

export function isBookingHost(hostname: string): boolean {
  const bookingEnv = process.env.NEXT_PUBLIC_BOOKING_URL;
  let envHost: string | null = null;
  if (bookingEnv) {
    try {
      envHost = new URL(bookingEnv).hostname;
    } catch {
      envHost = null;
    }
  }
  return hostname === "book.poembooth.com" || (envHost !== null && hostname === envHost);
}

/**
 * Add last-touch utm_* / fbclid to a booking URL. Existing query params
 * (boothType, style, or an explicit utm_*) are never overwritten.
 */
export function decorateBookingUrl(href: string, attr: Attribution = getAttribution()): string {
  const last = attr.last;
  if (!last) return href;
  let url: URL;
  try {
    url = new URL(href, window.location.href);
  } catch {
    return href;
  }
  if (!isBookingHost(url.hostname)) return href;
  let changed = false;
  for (const key of FORWARD_PARAMS) {
    const v = last[key];
    if (v && !url.searchParams.has(key)) {
      url.searchParams.set(key, v);
      changed = true;
    }
  }
  return changed ? url.toString() : href;
}

export function decorateLinksIn(root: ParentNode, attr: Attribution = getAttribution()) {
  root.querySelectorAll<HTMLAnchorElement>("a[href]").forEach((a) => {
    const href = a.getAttribute("href");
    if (!href || !/^https?:/i.test(href)) return;
    const next = decorateBookingUrl(href, attr);
    if (next !== href) a.setAttribute("href", next);
  });
}
