"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const PORTRAITS = Array.from({ length: 9 }, (_, i) => `/images/custom-style/portrait-${i + 1}.webp`);
const POEMS = ["/images/custom-style/poem-1.webp", "/images/custom-style/poem-2.webp"];

const PORTRAIT_INTERVAL_MS = 3200;
// Poems need reading time before the card swaps
const POEM_INTERVAL_MS = 9000;

type Mode = "portraits" | "poems";

// A real-looking pile: each deeper card sticks out with its own tilt
const STACK_POSES = [
  { rotate: 0, x: 0, y: 0 },
  { rotate: -5, x: -14, y: 8 },
  { rotate: 4, x: 14, y: 14 },
  { rotate: -2, x: -5, y: 20 },
];

function CardDeck({
  images,
  aspect,
  fit,
  intervalMs,
}: {
  images: string[];
  aspect: string;
  // "height": tall cards fill the box height; "width": wide/square cards fill its width
  fit: "height" | "width";
  intervalMs: number;
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || images.length < 2) return;
    const id = setInterval(
      () => setCurrent((c) => (c + 1) % images.length),
      intervalMs
    );
    return () => clearInterval(id);
  }, [paused, images.length, intervalMs]);

  const depths = Math.min(STACK_POSES.length, images.length);
  // Render deepest first so the top card paints last
  const stack = Array.from({ length: depths }, (_, d) => depths - 1 - d).map(
    (depth) => ({ idx: (current + depth) % images.length, depth })
  );

  return (
    // Outer box has a fixed ratio regardless of card shape, so toggling
    // portraits/poems never changes the section height
    <div
      className="relative w-full"
      style={{ aspectRatio: "1 / 1.15" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onClick={() => setCurrent((c) => (c + 1) % images.length)}
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          aspectRatio: aspect,
          ...(fit === "height" ? { height: "100%" } : { width: "100%" }),
        }}
      >
        {stack.map(({ idx, depth }) => {
          const pose = STACK_POSES[depth];
          return (
            <div
              key={idx}
              className="absolute inset-0 rounded-xl overflow-hidden bg-white transition-all duration-700 ease-in-out cursor-pointer"
              style={{
                transform: `rotate(${pose.rotate}deg) translate(${pose.x}px, ${pose.y}px)`,
                zIndex: depths - depth,
                boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              }}
            >
              <Image
                src={images[idx]}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 320px"
                loading="eager"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CustomStyleShowcase() {
  const t = useTranslations("customStyles");
  const [mode, setMode] = useState<Mode>("portraits");
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // Subtle scroll parallax on the photo band. The wrapper is scaled up
  // slightly so the translate never exposes the edges; disabled when the
  // visitor prefers reduced motion.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = sectionRef.current;
      const bg = bgRef.current;
      if (!el || !bg) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // -0.5 .. 0.5 as the section travels through the viewport
      const progress = (r.top + r.height / 2 - vh / 2) / (vh + r.height);
      bg.style.transform = `translateY(${(-progress * 12).toFixed(2)}%) scale(1.12)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Panel content — rendered in the mobile flow and in the desktop overlay
  const panel = (
    <>
      <h2 className="text-3xl md:text-4xl font-display text-text-primary">
        {t("title")}
      </h2>
      <p className="mt-3 text-text-secondary leading-relaxed">
        {t("subtitle")}
      </p>

      {/* The card stack — slimmer on desktop so the panel stays compact */}
      <div className="mt-8 px-6 lg:px-0 lg:max-w-[280px] lg:mx-auto">
        {mode === "portraits" ? (
          <CardDeck key="portraits" images={PORTRAITS} aspect="680 / 1024" fit="height" intervalMs={PORTRAIT_INTERVAL_MS} />
        ) : (
          <CardDeck key="poems" images={POEMS} aspect="1 / 1" fit="width" intervalMs={POEM_INTERVAL_MS} />
        )}
      </div>

      {/* Toggle under the stack */}
      <div className="mt-10 lg:mt-8 flex justify-center gap-2">
        {(["portraits", "poems"] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            aria-pressed={mode === m}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm transition-colors border",
              mode === m
                ? "bg-text-primary text-white border-text-primary"
                : "border-border text-text-secondary hover:border-text-primary/50"
            )}
          >
            {t(`toggle.${m}`)}
          </button>
        ))}
      </div>

      <p className="mt-8 lg:mt-6 text-sm text-text-secondary leading-relaxed">
        {t("story")}
      </p>

      <div className="mt-6 flex gap-8 justify-center">
        <div>
          <p className="text-3xl font-display text-text-primary">{t("statCreationsValue")}</p>
          <p className="text-xs text-text-secondary mt-1">{t("statCreationsLabel")}</p>
        </div>
        <div>
          <p className="text-3xl font-display text-text-primary">{t("statPaceValue")}</p>
          <p className="text-xs text-text-secondary mt-1">{t("statPaceLabel")}</p>
        </div>
      </div>

      <div className="mt-8 lg:mt-6">
        <Button
          href={`mailto:contact@poembooth.com?subject=${encodeURIComponent(t("ctaEmailSubject"))}`}
          variant="primary"
          size="lg"
        >
          {t("cta")}
        </Button>
      </div>
    </>
  );

  return (
    <section id="custom-style" ref={sectionRef} className="bg-bg-primary scroll-mt-20">
      {/* Mobile: photo as a plain block up top, panel below */}
      <div className="lg:hidden">
        <div className="relative">
          <Image
            src="/images/custom-style/event-photo.webp"
            alt={t("photoAlt")}
            width={4032}
            height={3024}
            className="w-full h-auto"
            sizes="100vw"
            quality={90}
          />
          <span className="absolute bottom-3 left-3 bg-white/85 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-text-primary shadow">
            {t("photoCaption")}
          </span>
        </div>
        <Container className="pt-10 pb-12 text-center">{panel}</Container>
      </div>

      {/* Desktop: the photo fills the entire section; the panel floats on the right */}
      {/* Desktop: the photo fills the section edge to edge; the panel is taller
          than the section and overlaps into the neighbouring sections above
          and below (z-20 so it paints over their backgrounds) */}
      <div className="hidden lg:block relative">
        <div className="relative h-[680px] overflow-hidden">
          <div
            ref={bgRef}
            className="absolute inset-0 will-change-transform"
            style={{ transform: "scale(1.12)" }}
          >
            <Image
              src="/images/custom-style/event-photo.webp"
              alt={t("photoAlt")}
              fill
              className="object-cover"
              style={{ objectPosition: "center 30%" }}
              sizes="100vw"
              quality={90}
            />
          </div>
          {/* Light bottom scrim so the caption chip reads */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/30 to-transparent" />
          <span className="absolute bottom-5 left-8 bg-white/85 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-text-primary shadow">
            {t("photoCaption")}
          </span>
        </div>

        {/* Panel overlays the band, sticking out into the sections above and below */}
        <Container className="absolute inset-0 z-20 flex items-center justify-end pointer-events-none">
          <div className="pointer-events-auto w-full max-w-md bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl text-center">
            {panel}
          </div>
        </Container>
      </div>
    </section>
  );
}
