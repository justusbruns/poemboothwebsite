// Safe wrappers for analytics events — no-op if scripts haven't loaded yet

import posthog from "posthog-js";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    ml?: (...args: unknown[]) => void;
  }
}

export function trackLeadIntent() {
  window.gtag?.("event", "voorstel_aangevraagd", {
    event_category: "conversie",
    event_label: "cta_click",
    value: 1,
  });
  window.fbq?.("track", "Lead", { content_name: "voorstel_aangevraagd" });
  if (posthog.__loaded) {
    posthog.capture("voorstel_aangevraagd", { source: "cta_click" });
  }
}
