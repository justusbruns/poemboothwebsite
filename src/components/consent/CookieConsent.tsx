"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

interface CookieConsentProps {
  locale: string;
  region: string;
  onAccept: () => void;
}

export function CookieConsent({ locale, region, onAccept }: CookieConsentProps) {
  const t = useTranslations("consent");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 max-w-md rounded-lg bg-white p-8 shadow-2xl">
        <h2 className="font-display text-2xl text-text-primary mb-4">
          {t("title")}
        </h2>

        <p className="font-body text-text-secondary mb-4 leading-relaxed">
          {t("message")}
        </p>

        <p className="font-body text-text-muted text-sm mb-6">
          {t("privacyNote")}{" "}
          <Link
            href={`/${locale}/${region}/user-agreement`}
            className="text-text-primary underline hover:no-underline"
          >
            {t("privacyLink")}
          </Link>
        </p>

        <button
          onClick={onAccept}
          className="w-full rounded-md bg-button-primary py-3 px-6 font-body text-button-text transition-colors hover:bg-button-primary-hover"
        >
          {t("acceptButton")}
        </button>
      </div>
    </div>
  );
}
