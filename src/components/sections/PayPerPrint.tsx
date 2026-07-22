"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function PayPerPrint() {
  const t = useTranslations("payPerPrint");
  const params = useParams();
  const blogHref = `/${params.locale}/${params.region}/blog/pay-per-print`;

  const bullets = ["bullet1", "bullet2", "bullet3"] as const;

  return (
    <section id="pay-per-print" className="py-16 md:py-24 bg-bg-accent overflow-x-clip">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            {/* "New" badge — pill with a live dot */}
            <span className="inline-flex items-center gap-2.5 rounded-full bg-bg-primary border border-border px-4 py-1.5 mb-5 shadow-sm">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full w-2 h-2 bg-emerald-500" />
              </span>
              <span className="text-xs font-medium tracking-[0.14em] uppercase text-text-secondary">
                {t("eyebrow")}
              </span>
            </span>

            <h2 className="text-4xl md:text-5xl font-display text-text-primary leading-tight">
              {t("title")}
            </h2>
            <p className="mt-5 text-lg text-text-secondary leading-relaxed max-w-xl">
              {t("pitch")}
            </p>

            <ul className="mt-7 space-y-3">
              {bullets.map((key) => (
                <li key={key} className="flex items-start gap-3 text-text-secondary">
                  <svg
                    className="w-5 h-5 mt-0.5 shrink-0 text-text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <Button
                href={`mailto:contact@poembooth.com?subject=${encodeURIComponent(t("ctaEmailSubject"))}`}
                variant="primary"
                size="lg"
              >
                {t("cta")}
              </Button>
              <p className="mt-3 text-sm text-text-muted">{t("ctaNote")}</p>
              <Link
                href={blogHref}
                className="mt-2 inline-block text-sm text-text-primary underline hover:no-underline"
              >
                {t("blogLink")} →
              </Link>
            </div>
          </div>

          {/* Phone-style demo video of the payment flow */}
          <div className="flex justify-center lg:justify-end">
            <video
              className="w-full max-w-[300px] sm:max-w-[320px] rounded-3xl shadow-2xl border-4 border-white"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/pay-per-print-poster.webp"
              aria-label={t("videoAlt")}
            >
              <source src="/videos/pay-per-print.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </Container>
    </section>
  );
}
