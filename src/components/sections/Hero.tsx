"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { trackLeadIntent } from "@/lib/tracking";

export interface HeroHolidayStyle {
  id: string;
  name: string;
  image: string;
}

interface HeroProps {
  bookingUrl?: string;
  // Christmas-tagged styles with a result image. The fan beside the CTA is
  // shown only while these are live, so it comes and goes with the season.
  holidayStyles?: HeroHolidayStyle[];
}

// Resting tilt and hover spread (px) per card, left to right
const FAN = [
  { rotate: -14, spread: -20 },
  { rotate: -5, spread: -10 },
  { rotate: 5, spread: 0 },
  { rotate: 14, spread: 6 },
];

// A bordeaux seasonal button with a fan of holiday-style cards poking out of
// it, linking down to the Holiday Edition section; the fan spreads on hover.
function HolidayFan({ styles, badge, label }: { styles: HeroHolidayStyle[]; badge: string; label: string }) {
  const cards = styles.slice(0, FAN.length);
  const offset = Math.floor((FAN.length - cards.length) / 2);

  return (
    <a
      href="#holiday"
      className="group relative flex lg:inline-flex lg:self-stretch items-center gap-5 rounded-lg bg-[#7b1e2e] pl-5 pr-6 py-3 text-white shadow-md transition-colors hover:bg-[#8f2537]"
    >
      <span className="absolute -top-2.5 right-3 rounded-full bg-amber-300 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#5a1420] shadow-sm">
        ❄️ {badge}
      </span>
      <span className="flex shrink-0 items-center -my-5" aria-hidden>
        {cards.map((style, i) => {
          const { rotate, spread } = FAN[i + offset];
          return (
            <span
              key={style.id}
              className="relative -ml-7 first:ml-0 block w-12 h-[3.75rem] rounded-md bg-[#fdfbf4] p-[3px] shadow-lg ring-1 ring-black/10 transition-transform duration-300 ease-out [transform:translateX(0)_rotate(var(--fan-r))] group-hover:[transform:translateX(var(--fan-x))_translateY(-3px)_rotate(calc(var(--fan-r)*1.5))]"
              style={{
                zIndex: i,
                ["--fan-r" as string]: `${rotate}deg`,
                ["--fan-x" as string]: `${spread}px`,
              }}
            >
              <span className="relative block h-full w-full overflow-hidden rounded-[3px] bg-white">
                <Image src={style.image} alt="" fill sizes="56px" className="object-cover" />
              </span>
            </span>
          );
        })}
      </span>
      <span className="text-left text-base font-medium leading-snug">
        {label}&nbsp;→
      </span>
    </a>
  );
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

export default function Hero({ bookingUrl, holidayStyles = [] }: HeroProps) {
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
            <div className="flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-6">
              <Button
                href={bookingHref}
                variant="primary"
                size="lg"
                onClick={() => trackLeadIntent()}
              >
                {t("ctaButton")}
              </Button>
              {holidayStyles.length > 0 && (
                <HolidayFan styles={holidayStyles} badge={t("holidayNew")} label={t("holidayFan")} />
              )}
            </div>
            <p className="text-text-muted text-sm mt-4">
              {t("ctaEmail")}{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="text-text-primary hover:underline"
              >
                {contactEmail}
              </a>
            </p>
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
