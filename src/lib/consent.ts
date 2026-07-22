// Shared analytics-consent storage for poembooth.com and its subdomains.
//
// The decision is stored in BOTH a cookie and localStorage:
// - The cookie is scoped to `.poembooth.com` so book.poembooth.com and the
//   marketing site see one and the same choice.
// - localStorage is the fallback for local dev / preview domains, and keeps
//   older stored decisions working.

const CONSENT_KEY = "pb_analytics_consent";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export function readStoredConsent(): boolean | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${CONSENT_KEY}=(true|false)`)
  );
  if (match) return match[1] === "true";
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "true") return true;
    if (stored === "false") return false;
  } catch {
    // localStorage unavailable (private mode edge cases) — treat as undecided
  }
  return null;
}

export function storeConsent(value: boolean) {
  try {
    localStorage.setItem(CONSENT_KEY, String(value));
  } catch {
    // ignore
  }
  const base = `${CONSENT_KEY}=${value}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  if (window.location.hostname.endsWith("poembooth.com")) {
    // Parent-domain cookie: readable on every *.poembooth.com subdomain
    document.cookie = `${base}; Domain=.poembooth.com; Secure`;
  } else {
    document.cookie = base;
  }
}
