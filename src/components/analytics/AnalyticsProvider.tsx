"use client";

import { useState, useEffect } from "react";
import { GoogleAnalytics } from "./GoogleAnalytics";
import { PostHogAnalytics } from "./PostHogAnalytics";
import { MetaPixel } from "./MetaPixel";
import { CookieConsent } from "../consent/CookieConsent";

const CONSENT_KEY = "pb_analytics_consent";
const EU_REGIONS = ["nl", "de", "fr", "it", "be", "row"];
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

interface AnalyticsProviderProps {
  region: string;
  locale: string;
  posthogKey?: string;
  children: React.ReactNode;
}

export function AnalyticsProvider({
  region,
  locale,
  posthogKey,
  children,
}: AnalyticsProviderProps) {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const requiresConsent = EU_REGIONS.includes(region);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored === "true") {
      setHasConsent(true);
    } else if (stored === "false") {
      setHasConsent(false);
      // showBanner stays false — user explicitly declined, don't ask again
    } else {
      setHasConsent(false);
      setShowBanner(true); // first visit — show banner
    }
  }, []);

  const handleAcceptConsent = () => {
    window.gtag?.("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
    window.fbq?.("consent", "grant");
    localStorage.setItem(CONSENT_KEY, "true");
    setHasConsent(true);
    setShowBanner(false);
  };

  const handleDeclineConsent = () => {
    localStorage.setItem(CONSENT_KEY, "false");
    setHasConsent(false);
    setShowBanner(false);
  };

  // PostHog runs in every branch: cookieless (memory-only) without consent,
  // full persistence with consent — visitor counts survive either way.
  const posthogNode = posthogKey ? (
    <PostHogAnalytics
      apiKey={posthogKey}
      consented={!requiresConsent || hasConsent === true}
    />
  ) : null;

  // Still loading consent state from localStorage
  if (hasConsent === null) {
    return <>{children}</>;
  }

  // US region: track immediately, no consent needed
  if (!requiresConsent) {
    return (
      <>
        {GA_MEASUREMENT_ID && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}
        <MetaPixel />
        {posthogNode}
        {children}
      </>
    );
  }

  // EU region with consent: load GA + Pixel
  if (hasConsent) {
    return (
      <>
        {GA_MEASUREMENT_ID && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}
        <MetaPixel />
        {posthogNode}
        {children}
      </>
    );
  }

  // EU region without consent: cookieless PostHog only; banner on first visit
  return (
    <>
      {posthogNode}
      {children}
      {showBanner && (
        <CookieConsent
          locale={locale}
          region={region}
          onAccept={handleAcceptConsent}
          onDecline={handleDeclineConsent}
        />
      )}
    </>
  );
}
