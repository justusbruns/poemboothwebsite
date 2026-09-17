"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import { CardCarousel, StyleImage } from "./StylesGallery";

interface PublicStyle {
  id: string;
  name: string;
  style_type: "poem" | "image";
  tags: string[];
  example_output_image_url: string | null;
  example_input_image_url: string | null;
}

interface ChristmasStylesProps {
  styles: PublicStyle[];
  bookingBaseUrl: string;
}

// Deterministic pseudo-random so server and client render identical snow
// (no hydration mismatch). mulberry32 with a fixed seed.
function makeSnow(count: number) {
  let s = 0x9e3779b9;
  const rnd = () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: count }, () => {
    const size = 2 + rnd() * 6; // 2–8px
    return {
      left: rnd() * 100,
      size,
      duration: 7 + rnd() * 10, // 7–17s
      delay: -rnd() * 17, // negative so the field is full immediately
      drift: `${(rnd() * 2 - 1) * 60}px`,
      opacity: 0.4 + rnd() * 0.6,
    };
  });
}

const SNOW = makeSnow(45);
// Slight scatter so the cards feel laid out on a table, like Explore our styles
const HOLIDAY_ROTATIONS = [-3, 2.5, -1.5, 3, -2, 2];

// A festive greeting-card frame around one style's artwork, keeping its
// native aspect ratio (postcard vs square carousel) without cropping. A corner
// thumbnail flips the card in 3D to reveal the original photo — same effect as
// the Explore-our-styles cards.
function HolidayCard({
  style,
  index,
  viewLabel,
  originalBadge,
}: {
  style: PublicStyle;
  index: number;
  viewLabel: string;
  originalBadge: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const output = style.example_output_image_url as string;
  const input = style.example_input_image_url;
  const rotation = HOLIDAY_ROTATIONS[index % HOLIDAY_ROTATIONS.length];

  const flip = () => {
    if (timer.current) clearTimeout(timer.current);
    if (!flipped) {
      setFlipped(true);
      timer.current = setTimeout(() => setFlipped(false), 5000);
    } else {
      setFlipped(false);
    }
  };

  const frame = "rounded-2xl bg-[#fdfbf4] p-3.5 shadow-2xl ring-1 ring-black/5";

  return (
    <div style={{ perspective: "1200px" }}>
      <div
        className="relative transition-transform duration-700 ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotate(${rotation}deg) rotateY(${flipped ? 180 : 0}deg)`,
        }}
        onClick={() => input && flip()}
      >
        {/* Front — the AI result */}
        <div className={frame} style={{ backfaceVisibility: "hidden" }}>
          <div className="relative rounded-lg overflow-hidden bg-white">
            <StyleImage src={output} alt={style.name} />
            {input && !flipped && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  flip();
                }}
                aria-label={viewLabel}
                className="absolute bottom-2.5 right-2.5 w-14 h-14 rounded-lg overflow-hidden border-2 border-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                <Image src={input} alt="" fill sizes="64px" className="object-cover" loading="eager" />
              </button>
            )}
          </div>
        </div>

        {/* Back — the original photo, cover-filling the front's box */}
        {input && (
          <div
            className={`absolute inset-0 ${frame}`}
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="relative h-full w-full rounded-lg overflow-hidden bg-white">
              <Image src={input} alt="" fill sizes="(max-width: 640px) 72vw, 380px" className="object-cover" loading="eager" />
              <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/55 backdrop-blur-sm text-xs text-white">
                {originalBadge}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChristmasStyles({ styles, bookingBaseUrl }: ChristmasStylesProps) {
  const t = useTranslations("christmas");
  const [index, setIndex] = useState(0);

  // Only styles with a printable result; nothing to show off-season → hide.
  const visible = styles.filter((s) => s.example_output_image_url);
  const [current] = [index % Math.max(visible.length, 1)];
  if (visible.length === 0) return null;

  const active = visible[current];

  return (
    <section
      id="holiday"
      className="relative overflow-hidden scroll-mt-20 pt-16 md:pt-24 pb-16 md:pb-20 text-white"
      style={{
        background:
          "radial-gradient(1200px 600px at 50% -10%, #1b3a5b 0%, #0d1f33 45%, #081422 100%)",
      }}
    >
      {/* Snow — decorative, hidden for reduced-motion users */}
      <div className="pointer-events-none absolute inset-0 motion-reduce:hidden" aria-hidden>
        {SNOW.map((f, i) => (
          <span
            key={i}
            className="animate-snowfall absolute top-0 rounded-full bg-white"
            style={{
              left: `${f.left}%`,
              width: f.size,
              height: f.size,
              opacity: f.opacity,
              animationDuration: `${f.duration}s`,
              animationDelay: `${f.delay}s`,
              ["--snow-drift" as string]: f.drift,
            }}
          />
        ))}
      </div>

      <Container className="relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs md:text-sm font-medium tracking-[0.22em] uppercase text-amber-200/80 mb-3">
            {t("eyebrow")}
          </p>
          <h2 className="text-4xl md:text-5xl font-display leading-tight">{t("title")}</h2>
          <p className="mt-4 text-lg text-white/70 leading-relaxed">{t("subtitle")}</p>
        </div>
      </Container>

      {/* Same sliding carousel as Explore our styles, but side cards stay fully
          bright (dimSides={false}). Full-bleed so cards run to the edges. */}
      <div className="relative left-1/2 -translate-x-1/2 w-screen mt-12 z-10">
        <CardCarousel
          count={visible.length}
          current={current}
          dimSides={false}
          onNavigate={(delta) =>
            setIndex((i) => (i + delta + visible.length * 10) % visible.length)
          }
          renderCard={(idx) => (
            <HolidayCard
              style={visible[idx]}
              index={idx}
              viewLabel={t("viewOriginal")}
              originalBadge={t("originalBadge")}
            />
          )}
        />
      </div>

      {/* Footer: the centered style's name + a single book button */}
      <Container className="relative z-10 mt-8 text-center">
        <h3 className="text-lg font-display">{active.name}</h3>
        <div className="mt-3">
          <a
            href={`${bookingBaseUrl}?boothType=portrait&style=${active.id}`}
            className="inline-flex items-center justify-center rounded-lg bg-white px-7 py-3 font-body text-text-primary transition-colors hover:bg-white/90"
          >
            {t("bookCta")}
          </a>
        </div>
      </Container>
    </section>
  );
}
