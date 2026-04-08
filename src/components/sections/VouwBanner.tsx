"use client";

import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";

export default function VouwBanner() {
  const t = useTranslations("vouwBanner");

  return (
    <section className="relative h-[600px] md:h-[750px] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/vouw-banner-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        suppressHydrationWarning
      >
        <source src="/videos/vouw-banner.webm" type="video/webm" suppressHydrationWarning />
        <source src="/videos/vouw-banner.mp4" type="video/mp4" suppressHydrationWarning />
      </video>

      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white max-w-3xl mb-6">
          {t("heading")}
        </h2>
        <Button
          href="https://vouw.com"
          variant="primary"
          size="lg"
          shimmer={false}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("button")}
        </Button>
      </div>
    </section>
  );
}
