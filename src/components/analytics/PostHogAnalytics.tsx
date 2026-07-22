"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";

interface PostHogAnalyticsProps {
  apiKey: string;
  /** Full tracking (cookies/localStorage) vs. anonymous cookieless counting */
  consented: boolean;
  /** Override ingest host, e.g. the reverse proxy v.poembooth.com (beats ad blockers) */
  apiHost?: string;
}

// EU Cloud — data stays in the EU
const DEFAULT_HOST = "https://eu.i.posthog.com";

export function PostHogAnalytics({ apiKey, consented, apiHost }: PostHogAnalyticsProps) {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    if (!apiKey) return;
    if (!initialized.current) {
      posthog.init(apiKey, {
        api_host: apiHost || DEFAULT_HOST,
        // Toolbar/app links keep pointing at PostHog itself, even when
        // events go through the reverse proxy
        ui_host: "https://eu.posthog.com",
        // Without consent: memory-only — no cookies, no localStorage. Visits
        // are still counted (each session is an anonymous id that vanishes on
        // page close). With consent: durable id so return visits connect.
        persistence: consented ? "localStorage+cookie" : "memory",
        // We capture pageviews manually on route change (SPA navigation)
        capture_pageview: false,
        capture_pageleave: true,
        autocapture: false,
      });
      initialized.current = true;
    } else {
      posthog.set_config({
        persistence: consented ? "localStorage+cookie" : "memory",
      });
    }
  }, [apiKey, consented]);

  // Pageview on initial load and every SPA navigation
  useEffect(() => {
    if (!initialized.current) return;
    posthog.capture("$pageview");
  }, [pathname]);

  return null;
}
