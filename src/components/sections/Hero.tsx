"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { trackLeadIntent } from "@/lib/tracking";

interface HeroProps {
  bookingUrl?: string;
}

// iOS Safari sometimes leaves an autoplay video sitting on its poster
// (and Low Power Mode blocks autoplay outright). Kick playback explicitly
// once the video can play; a tap works as the user-gesture fallback.
function kickstartVideo(el: HTMLVideoElement | null) {
  if (!el) return;
  el.muted = true;
  const tryPlay = () => {
    const p = el.play();
    if (p) p.catch(() => {});
  };
  if (el.readyState >= 2) tryPlay();
  else el.addEventListener("canplay", tryPlay, { once: true });
}

function tapToPlay(e: React.MouseEvent<HTMLVideoElement>) {
  const p = e.currentTarget.play();
  if (p) p.catch(() => {});
}

export default function Hero({ bookingUrl }: HeroProps) {
  const t = useTranslations("hero");
  const params = useParams();
  const locale = params.locale as string;
  const region = params.region as string;

  const rawUrl = bookingUrl || process.env.NEXT_PUBLIC_BOOKING_URL || "https://book.poembooth.com";
  // Extract just the origin (protocol + host) to avoid path duplication
  const baseUrl = rawUrl.replace(/\/+$/, "").split("/").slice(0, 3).join("/");
  const bookingHref = `${baseUrl}/${locale}/booking`;
  const contactEmail = region === "us" ? "jackie@poembooth.com" : "contact@poembooth.com";

  return (
    <section className="pb-6 md:pb-8 bg-bg-secondary md:-mt-20 md:pt-20">
      <Container>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <p className="text-xs md:text-sm font-medium tracking-[0.18em] uppercase text-text-muted mb-3">
              {t("originBadge")}
            </p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-text-primary mb-4 leading-tight">
              {t("headline")}
            </h1>
            <p className="text-base md:text-lg text-text-secondary mb-6 max-w-xl">
              {t("subheadline")}
            </p>
            <div className="flex flex-col lg:flex-row gap-4">
              <Button
                href={bookingHref}
                variant="primary"
                size="lg"
                onClick={() => trackLeadIntent()}
              >
                {t("ctaButton")}
              </Button>
              <p className="text-text-muted text-sm self-center">
                {t("ctaEmail")}{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-text-primary hover:underline"
                >
                  {contactEmail}
                </a>
              </p>
            </div>
          </div>

          {/* Hero Video — transparent WebM, floats on the section background.
              Mobile: full-bleed via negative margins that cancel the Container
              padding exactly — the video spans edge to edge, nothing clipped.
              Desktop: the balanced square framing in the right grid column. */}
          <div className="order-1 md:order-2 relative">
            <div className="md:hidden -mx-4 sm:-mx-6">
              {/* Poster is the video's first frame — playback starts invisibly from the still */}
              <video
                suppressHydrationWarning
                ref={kickstartVideo}
                onClick={tapToPlay}
                className="w-[85%] mx-auto aspect-[1040/996] object-contain"
                autoPlay
                muted
                loop
                playsInline
                poster="/images/hero-mobile-poster.webp?v=3"
                aria-label="Poem Booth in action — a visitor turns their moment into art"
              >
                {/* WebM with alpha for Chrome/Firefox; flat H.264 (background baked to
                    #F7F7F3, matching the section) as the universal Safari fallback */}
                <source suppressHydrationWarning src="/videos/hero-mobile.webm?v=5" type="video/webm" />
                <source suppressHydrationWarning src="/videos/hero-mobile.mp4?v=3" type="video/mp4" />
              </video>
            </div>
            <div className="hidden md:flex items-center justify-center">
              {/* Poster is the video's first frame — playback starts invisibly from the still */}
              <video
                suppressHydrationWarning
                ref={kickstartVideo}
                onClick={tapToPlay}
                className="w-full h-[55vh] object-contain"
                autoPlay
                muted
                loop
                playsInline
                poster="/images/hero-portrait-poster.webp?v=2"
                aria-label="Poem Booth in action — a visitor turns their moment into art"
              >
                {/* WebM with alpha for Chrome/Firefox; flat H.264 (background baked to
                    #F7F7F3, matching the section) as the universal Safari fallback */}
                <source suppressHydrationWarning src="/videos/hero-portrait.webm?v=5" type="video/webm" />
                <source suppressHydrationWarning src="/videos/hero-portrait.mp4?v=2" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
