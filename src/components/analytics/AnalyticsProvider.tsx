"use client";

import { useState, useEffect } from "react";
import { GoogleAnalytics } from "./GoogleAnalytics";
import { CookieConsent } from "../consent/CookieConsent";

const CONSENT_KEY = "pb_analytics_consent";
const EU_REGIONS = ["nl", "de", "fr", "it", "be", "row"];
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

interface AnalyticsProviderProps {
  region: string;
  locale: string;
  children: React.ReactNode;
}

export function AnalyticsProvider({
  region,
  locale,
  children,
}: AnalyticsProviderProps) {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);
  const requiresConsent = EU_REGIONS.includes(region);

  useEffect(() => {
    // Check localStorage for existing consent
    const storedConsent = localStorage.getItem(CONSENT_KEY);
    if (storedConsent === "true") {
      setHasConsent(true);
    } else {
      setHasConsent(false);
    }
  }, []);

  const handleAcceptConsent = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    setHasConsent(true);
  };

  // Still loading consent state from localStorage
  if (hasConsent === null) {
    return <>{children}</>;
  }

  // US region: track immediately, no consent needed
  if (!requiresConsent) {
    return (
      <>
        {GA_MEASUREMENT_ID && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}
        {children}
      </>
    );
  }

  // EU region: show consent overlay if not yet consented
  if (!hasConsent) {
    return (
      <>
        {children}
        <CookieConsent
          locale={locale}
          region={region}
          onAccept={handleAcceptConsent}
        />
      </>
    );
  }

  // EU region with consent: load GA
  return (
    <>
      {GA_MEASUREMENT_ID && <GoogleAnalytics measurementId={GA_MEASUREMENT_ID} />}
      {children}
    </>
  );
}
