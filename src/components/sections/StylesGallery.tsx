"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils/cn";

interface PublicStyle {
  id: string;
  name: string;
  style_type: "poem" | "image";
  description: string | null;
  tags: string[];
  example_input_image_url: string | null;
  example_output_image_url: string | null;
  example_poem_text: string | null;
}

interface StylesGalleryProps {
  styles: PublicStyle[];
  bookingBaseUrl: string;
  watermarkLogoUrl?: string;
}

type Tab = "image" | "poem";

type StyleCarouselItem =
  | { kind: "style"; style: PublicStyle }
  | { kind: "customPortrait" }
  | { kind: "customPoem" }
  | { kind: "customRoast" };

function CustomStyleCard({ label, description }: { label: string; description: string }) {
  return (
    <div className="group flex flex-col">
      <div
        className="relative flex items-center justify-center px-6 cursor-pointer"
        style={{ height: 380, perspective: "1000px" }}
      >
        <div
          className="relative w-full max-w-[85%] rounded-lg overflow-hidden shadow-xl"
          style={{ transform: "rotate(-1.5deg)" }}
        >
          <div className="relative aspect-[4/5] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 p-[2px] rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-400/30 via-fuchsia-300/20 to-amber-300/30 animate-pulse rounded-lg" />
            <div className="relative h-full w-full rounded-[6px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center text-center px-6 gap-4 overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />
              {/* Sparkle dots */}
              <div className="absolute top-6 left-8 w-1.5 h-1.5 bg-violet-400/60 rounded-full animate-pulse" />
              <div className="absolute top-12 right-10 w-1 h-1 bg-amber-400/60 rounded-full animate-pulse delay-300" />
              <div className="absolute bottom-16 left-12 w-1 h-1 bg-fuchsia-400/60 rounded-full animate-pulse delay-500" />
              <div className="absolute bottom-8 right-8 w-1.5 h-1.5 bg-violet-300/60 rounded-full animate-pulse delay-700" />

              <svg className="w-12 h-12 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
              <p className="text-xl font-display text-white">{label}</p>
              <p className="text-sm text-white/60 leading-relaxed">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const CAROUSEL_CARD_W = 380;
const CAROUSEL_GAP = 28;
// Arrow w-10 (40px) + gap-6 (24px)
const CAROUSEL_ARROW_INSET = 40 + 24;

// Sliding 5-slot carousel — same mechanics as the photo gallery carousel.
function CardCarousel({
  count,
  current,
  onNavigate,
  renderCard,
}: {
  count: number;
  current: number;
  onNavigate: (dir: 1 | -1) => void;
  renderCard: (index: number, isCenter: boolean) => ReactNode;
}) {
  const [offset, setOffset] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [animDir, setAnimDir] = useState<0 | 1 | -1>(0);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(CAROUSEL_CARD_W * 3 + CAROUSEL_GAP * 2);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setViewportW(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cardW = Math.min(CAROUSEL_CARD_W, Math.floor(viewportW * 0.88));
  const step = cardW + CAROUSEL_GAP;
  // Translate so the center of slot 2 (index 2 of 0..4) lands exactly at viewport center
  const baseTranslate = viewportW / 2 - 2 * step - cardW / 2;

  const go = (dir: 1 | -1) => {
    if (animating) return;
    setAnimDir(dir);
    setAnimating(true);
    setOffset(-dir * step);
    setTimeout(() => {
      onNavigate(dir);
      setAnimDir(0);
      setOffset(0);
      setAnimating(false);
    }, 450);
  };

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    // Horizontal swipe only — leave vertical page scrolling alone
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      go(dx < 0 ? 1 : -1);
    }
  };

  // During animation: incoming slot (2 + animDir) is the new center — scale starts immediately
  const centerSlot = animating ? 2 + animDir : 2;

  const arrowClass =
    "flex-shrink-0 w-10 h-10 rounded-full border border-text-primary/20 flex items-center justify-center text-text-primary hover:border-text-primary/60 transition-colors";

  return (
    <div
      className="flex items-center gap-6 mx-auto"
      style={{ maxWidth: CAROUSEL_CARD_W * 3 + CAROUSEL_GAP * 2 + CAROUSEL_ARROW_INSET * 2 }}
    >
      <button onClick={() => go(-1)} className={arrowClass} aria-label="Previous">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div
        ref={viewportRef}
        style={{ flex: 1, minWidth: 0, overflowX: "clip", touchAction: "pan-y" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex py-4"
          style={{
            gap: CAROUSEL_GAP,
            transform: `translateX(${baseTranslate + offset}px)`,
            transition: animating ? "transform 450ms cubic-bezier(0.4,0,0.2,1)" : "none",
          }}
        >
          {[-2, -1, 0, 1, 2].map((d, slot) => {
            const idx = (current + d + count * 5) % count;
            const isCenter = slot === centerSlot;
            return (
              <div
                // Key by item index so React preserves the DOM element as it moves
                // between slots; fall back to slot-suffixed keys when items repeat.
                key={count >= 5 ? idx : `${idx}-${slot}`}
                className="flex-shrink-0"
                style={{ width: cardW }}
              >
                <div
                  style={{
                    transform: `scale(${isCenter ? 1 : 0.88})`,
                    opacity: isCenter ? 1 : 0.55,
                    transition:
                      "transform 450ms cubic-bezier(0.4,0,0.2,1), opacity 450ms cubic-bezier(0.4,0,0.2,1)",
                    pointerEvents: isCenter ? "auto" : "none",
                  }}
                >
                  {renderCard(idx, isCenter)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={() => go(1)} className={arrowClass} aria-label="Next">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

// Deterministic rotation per card based on index
const ROTATIONS = [-3, 2, -1.5, 3, -2, 1.5, -2.5, 3.5, -1, 2.5];

function PortraitStyleCard({
  style,
  index,
}: {
  style: PublicStyle;
  index: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const flipTimerRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations("styles");

  const outputUrl = style.example_output_image_url;
  const inputUrl = style.example_input_image_url;
  const rotation = ROTATIONS[index % ROTATIONS.length];

  const handleFlip = () => {
    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    if (!flipped) {
      setFlipped(true);
      flipTimerRef.current = setTimeout(() => setFlipped(false), 5000);
    } else {
      setFlipped(false);
    }
  };

  return (
    <div className="group flex flex-col">
      {/* 3D flip container - fixed height for alignment */}
      <div
        className="relative flex items-center justify-center px-6 cursor-pointer"
        style={{ height: 380, perspective: "1000px" }}
        onClick={() => inputUrl && outputUrl && handleFlip()}
      >
        <div
          className="relative transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotate(${rotation}deg) rotateY(${flipped ? 180 : 0}deg)`,
            maxWidth: "85%",
            maxHeight: "100%",
          }}
        >
          {/* Front - portrait output */}
          <div
            className="relative shadow-xl rounded-lg overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            {outputUrl && (
              <Image
                src={outputUrl}
                alt={style.name}
                width={400}
                height={500}
                className={`block max-h-[360px] w-auto h-auto transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
                sizes="(max-width: 640px) 70vw, (max-width: 1024px) 35vw, 280px"
                priority={index < 3}
                onLoad={() => setLoaded(true)}
              />
            )}
            {/* Loading placeholder */}
            {!loaded && (
              <div className="bg-bg-secondary rounded-lg animate-pulse" style={{ width: 280, height: 350 }} />
            )}
          </div>

          {/* Back - original input (fill to match front) */}
          {inputUrl && (
            <div
              className="absolute inset-0 shadow-xl rounded-lg overflow-hidden"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <Image
                src={inputUrl}
                alt={`Original for ${style.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 70vw, (max-width: 1024px) 35vw, 280px"
              />
            </div>
          )}
        </div>

        {/* Input thumbnail on front side */}
        {inputUrl && outputUrl && !flipped && (
          <div
            className="absolute bottom-12 right-10 w-16 h-16 rounded-lg overflow-hidden border-2 border-white shadow-lg cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 z-10"
            onClick={(e) => { e.stopPropagation(); handleFlip(); }}
          >
            <Image
              src={inputUrl}
              alt="See original"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        )}

        {/* Back side hint */}
        {inputUrl && outputUrl && flipped && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm text-xs text-white pointer-events-none z-10">
            {t("original")}
          </div>
        )}
      </div>

    </div>
  );
}

// Color palettes for poem cards — varied bg + text combinations.
// Watermark logo is tinted to `text` color via CSS mask-image, then faded by `watermarkOpacity`.
const POEM_PALETTES = [
  { bg: "#FBC02D", text: "#D62E2B", watermarkOpacity: 0.28 },
  { bg: "#1B2E4B", text: "#F5E6C8", watermarkOpacity: 0.18 },
  { bg: "#F4B5C5", text: "#4A1B2E", watermarkOpacity: 0.25 },
  { bg: "#2D5F4F", text: "#F5E6C8", watermarkOpacity: 0.2 },
  { bg: "#F2E4C7", text: "#8B3A1D", watermarkOpacity: 0.28 },
  { bg: "#D86A45", text: "#FFF3D6", watermarkOpacity: 0.22 },
  { bg: "#3A2E5C", text: "#F2C94C", watermarkOpacity: 0.2 },
  { bg: "#E8D5C4", text: "#264653", watermarkOpacity: 0.28 },
];

const POEM_PHOTO_ROTATIONS = [-2.5, 2, -1.5, 3, -2, 2.5, -3, 1.5];

function PoemStyleCard({
  style,
  index,
  watermarkLogoUrl,
}: {
  style: PublicStyle;
  index: number;
  watermarkLogoUrl?: string;
}) {
  const isRoast = style.tags.includes("roast");
  // Roast cards: uniform dark grey card with the brand ROAST BOOTH logo as watermark.
  const palette = isRoast
    ? { bg: "#292929", text: "#F5E6C8", watermarkOpacity: 1 }
    : POEM_PALETTES[index % POEM_PALETTES.length];
  const effectiveWatermarkUrl = isRoast ? "/images/roast-booth-logo.png" : watermarkLogoUrl;
  const rotation = POEM_PHOTO_ROTATIONS[index % POEM_PHOTO_ROTATIONS.length];
  const poemBody = style.example_poem_text?.replace(/^#\s+.+\n\n?/, "");

  return (
    <div className="group flex flex-col">
      {/* Fixed-height stage so all cards align (matches PortraitStyleCard) */}
      <div
        className="relative flex items-center justify-center px-4"
        style={{ height: 380 }}
      >
        <div
          className="relative w-full max-w-[88%] aspect-square rounded-2xl overflow-hidden shadow-xl"
          style={{
            backgroundColor: palette.bg,
            color: palette.text,
            transform: `rotate(${rotation}deg)`,
          }}
        >
          {/* Watermark logo — roast: full-color PNG flush in corner. Poem: mask-image tinted to palette.text. */}
          {effectiveWatermarkUrl && isRoast && (
            <div
              aria-hidden
              className="pointer-events-none absolute select-none"
              style={{ bottom: 0, right: 0, width: "45%" }}
            >
              {/* Logo is an SVG — the image optimizer rejects SVG unless dangerouslyAllowSVG is set */}
              <Image
                src={effectiveWatermarkUrl}
                alt=""
                width={500}
                height={500}
                className="w-full h-auto"
                unoptimized
              />
            </div>
          )}
          {effectiveWatermarkUrl && !isRoast && (
            <div
              aria-hidden
              className="pointer-events-none absolute select-none"
              style={{
                bottom: "-14%",
                right: "-10%",
                width: "55%",
                aspectRatio: "1 / 1",
                backgroundColor: palette.text,
                opacity: palette.watermarkOpacity,
                WebkitMaskImage: `url("${effectiveWatermarkUrl}")`,
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
                WebkitMaskPosition: "bottom right",
                maskImage: `url("${effectiveWatermarkUrl}")`,
                maskRepeat: "no-repeat",
                maskSize: "contain",
                maskPosition: "bottom right",
              }}
            />
          )}

          {/* Photo left + poem right */}
          <div className="relative z-10 flex h-full p-3 gap-3">
            {style.example_input_image_url && (
              <div className="relative flex-shrink-0 h-full" style={{ width: "42%" }}>
                <Image
                  src={style.example_input_image_url}
                  alt={`Example for ${style.name}`}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 640px) 40vw, 160px"
                />
              </div>
            )}

            {poemBody && (
              <div className="flex-1 min-w-0 flex items-start pt-1 pr-1">
                <blockquote
                  className="font-body text-[13px] leading-snug whitespace-pre-line"
                  style={{ color: palette.text }}
                >
                  {poemBody}
                </blockquote>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default function StylesGallery({ styles, bookingBaseUrl, watermarkLogoUrl }: StylesGalleryProps) {
  const t = useTranslations("styles");
  const [activeTab, setActiveTab] = useState<Tab>("image");

  const imageStyles = styles.filter((s: PublicStyle) => s.style_type === "image");
  const poemOnlyStyles = styles.filter((s: PublicStyle) => s.style_type === "poem" && !s.tags.includes("roast"));
  const roastStyles = styles.filter((s: PublicStyle) => s.style_type === "poem" && s.tags.includes("roast"));
  // Merged list: poems first, then roasts.
  const poemAndRoastStyles = [...poemOnlyStyles, ...roastStyles];

  // Carousel items: real styles plus the custom-style CTA cards at the end.
  const portraitItems: StyleCarouselItem[] = [
    ...imageStyles.map((s) => ({ kind: "style" as const, style: s })),
    { kind: "customPortrait" as const },
  ];
  const poemItems: StyleCarouselItem[] = [
    ...poemAndRoastStyles.map((s) => ({ kind: "style" as const, style: s })),
    { kind: "customPoem" as const },
    { kind: "customRoast" as const },
  ];

  const [portraitIndex, setPortraitIndex] = useState(0);
  const [poemIndex, setPoemIndex] = useState(0);

  const mailtoHref = (ns: "customCard" | "customCardPoem" | "customCardRoast") =>
    `mailto:contact@poembooth.com?subject=${encodeURIComponent(t(`${ns}.emailSubject`))}&body=${encodeURIComponent(t(`${ns}.emailBody`))}`;

  // Title + single CTA for whichever card sits in the center of the carousel.
  const itemMeta = (item: StyleCarouselItem) => {
    switch (item.kind) {
      case "style": {
        const isRoast = item.style.tags.includes("roast");
        const boothType =
          item.style.style_type === "image" ? "portrait" : isRoast ? "roast" : "poem";
        return {
          title: item.style.name,
          isRoast,
          href: `${bookingBaseUrl}?boothType=${boothType}&style=${item.style.id}`,
          cta: t("bookThisStyle"),
        };
      }
      case "customPortrait":
        return { title: t("customCard.title"), isRoast: false, href: mailtoHref("customCard"), cta: t("customCard.cta") };
      case "customPoem":
        return { title: t("customCardPoem.title"), isRoast: false, href: mailtoHref("customCardPoem"), cta: t("customCardPoem.cta") };
      case "customRoast":
        return { title: t("customCardRoast.title"), isRoast: false, href: mailtoHref("customCardRoast"), cta: t("customCardRoast.cta") };
    }
  };

  const carouselFooter = (item: StyleCarouselItem) => {
    const meta = itemMeta(item);
    return (
      <div className="mt-2 text-center">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <h3 className="text-lg font-display text-text-primary">{meta.title}</h3>
          {meta.isRoast && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
              Roast
            </span>
          )}
        </div>
        <div className="mt-3">
          <Button href={meta.href} variant="primary" size="sm">
            {meta.cta}
          </Button>
        </div>
      </div>
    );
  };

  const customPanel = (title: string, description: string) => (
    <div className="relative flex items-center justify-center px-4" style={{ height: 380 }}>
      <div className="w-full max-w-[88%] aspect-square rounded-2xl border border-border-light bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-amber-400/10 p-6 text-center flex flex-col justify-center">
        <p className="text-xl font-display text-text-primary">{title}</p>
        <p className="text-sm text-text-secondary mt-2">{description}</p>
      </div>
    </div>
  );

  // Preview images for the two visual tiles.
  const portraitPreviewUrl = imageStyles.find((s) => s.example_output_image_url)?.example_output_image_url;
  const poemPreviewUrl = poemAndRoastStyles.find((s) => s.example_input_image_url)?.example_input_image_url;

  return (
    <div>
      <SectionHeading
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Visual tile selector */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-3xl mx-auto mt-10 mb-10">
        <button
          type="button"
          onClick={() => setActiveTab("image")}
          className="group flex flex-col items-center text-left"
          aria-pressed={activeTab === "image"}
        >
          <div
            className={cn(
              "relative aspect-square w-full overflow-hidden rounded-2xl bg-bg-secondary transition-all duration-300",
              activeTab === "image"
                ? "shadow-xl"
                : "opacity-55 grayscale group-hover:opacity-85 group-hover:grayscale-0"
            )}
          >
            {portraitPreviewUrl && (
              <Image
                src={portraitPreviewUrl}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 380px"
              />
            )}
          </div>
          <p
            className={cn(
              "mt-3 text-base md:text-lg font-display transition-colors w-full text-center",
              activeTab === "image" ? "text-text-primary" : "text-text-secondary"
            )}
          >
            {t("tabs.portraitShort")}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("poem")}
          className="group flex flex-col items-center text-left"
          aria-pressed={activeTab === "poem"}
        >
          <div
            className={cn(
              "relative aspect-square w-full overflow-hidden rounded-2xl transition-all duration-300",
              activeTab === "poem"
                ? "shadow-xl"
                : "opacity-55 grayscale group-hover:opacity-85 group-hover:grayscale-0"
            )}
            style={{ backgroundColor: "#FBC02D" }}
          >
            {/* Mini poem-card preview: photo left, text-line skeleton right, PB watermark */}
            <div className="absolute inset-0 flex p-3 gap-3">
              {poemPreviewUrl && (
                <div className="relative flex-shrink-0 h-full" style={{ width: "42%" }}>
                  <Image
                    src={poemPreviewUrl}
                    alt=""
                    fill
                    className="object-cover rounded-md"
                    sizes="(max-width: 768px) 22vw, 160px"
                  />
                </div>
              )}
              <div className="flex-1 flex flex-col justify-center gap-2 pr-1">
                <div className="h-2 rounded w-full" style={{ backgroundColor: "#D62E2B", opacity: 0.85 }} />
                <div className="h-2 rounded w-5/6" style={{ backgroundColor: "#D62E2B", opacity: 0.85 }} />
                <div className="h-2 rounded w-3/4" style={{ backgroundColor: "#D62E2B", opacity: 0.85 }} />
                <div className="h-2 rounded w-2/3" style={{ backgroundColor: "#D62E2B", opacity: 0.85 }} />
              </div>
            </div>
            {watermarkLogoUrl && (
              <div
                aria-hidden
                className="pointer-events-none absolute select-none"
                style={{
                  bottom: "-14%",
                  right: "-10%",
                  width: "55%",
                  aspectRatio: "1 / 1",
                  backgroundColor: "#D62E2B",
                  opacity: 0.25,
                  WebkitMaskImage: `url("${watermarkLogoUrl}")`,
                  WebkitMaskRepeat: "no-repeat",
                  WebkitMaskSize: "contain",
                  WebkitMaskPosition: "bottom right",
                  maskImage: `url("${watermarkLogoUrl}")`,
                  maskRepeat: "no-repeat",
                  maskSize: "contain",
                  maskPosition: "bottom right",
                }}
              />
            )}
          </div>
          <p
            className={cn(
              "mt-3 text-base md:text-lg font-display transition-colors w-full text-center",
              activeTab === "poem" ? "text-text-primary" : "text-text-secondary"
            )}
          >
            {t("tabs.poemAndRoastShort")}
          </p>
        </button>
      </div>

      {/* Portrait Styles Carousel */}
      {activeTab === "image" && (
        <>
          <p className="text-center text-text-secondary mb-8 max-w-xl mx-auto">
            {t("portraitIntro")}
          </p>
          <CardCarousel
            count={portraitItems.length}
            current={portraitIndex}
            onNavigate={(dir) =>
              setPortraitIndex((i) => (i + dir + portraitItems.length) % portraitItems.length)
            }
            renderCard={(idx) => {
              const item = portraitItems[idx];
              return item.kind === "style" ? (
                <PortraitStyleCard style={item.style} index={idx} />
              ) : (
                <CustomStyleCard
                  label={t("customCard.title")}
                  description={t("customCard.description")}
                />
              );
            }}
          />
          {carouselFooter(portraitItems[portraitIndex])}
        </>
      )}

      {/* Poems & Roasts Carousel (combined) */}
      {activeTab === "poem" && (
        <>
          <p className="text-center text-text-secondary mb-8 max-w-xl mx-auto">
            {t("poemAndRoastIntro")}
          </p>
          <CardCarousel
            count={poemItems.length}
            current={poemIndex}
            onNavigate={(dir) =>
              setPoemIndex((i) => (i + dir + poemItems.length) % poemItems.length)
            }
            renderCard={(idx) => {
              const item = poemItems[idx];
              if (item.kind === "style") {
                return (
                  <PoemStyleCard style={item.style} index={idx} watermarkLogoUrl={watermarkLogoUrl} />
                );
              }
              if (item.kind === "customPoem") {
                return customPanel(t("customCardPoem.title"), t("customCardPoem.description"));
              }
              return customPanel(t("customCardRoast.title"), t("customCardRoast.description"));
            }}
          />
          {carouselFooter(poemItems[poemIndex])}
        </>
      )}
    </div>
  );
}
