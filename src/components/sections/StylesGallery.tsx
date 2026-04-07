"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";

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
}

type Tab = "image" | "poem" | "roast";

// Deterministic rotation per card based on index
const ROTATIONS = [-3, 2, -1.5, 3, -2, 1.5, -2.5, 3.5, -1, 2.5];

function PortraitStyleCard({
  style,
  bookingBaseUrl,
  bookLabel,
  index,
}: {
  style: PublicStyle;
  bookingBaseUrl: string;
  bookLabel: string;
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
                unoptimized
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
                unoptimized
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
              unoptimized
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

      {/* Preload input image */}
      {inputUrl && (
        <link rel="preload" as="image" href={inputUrl} />
      )}

      {/* Info */}
      <div className="px-5 pb-5 flex flex-col flex-1 text-center">
        <h3 className="text-lg font-display text-text-primary">{style.name}</h3>
        <div className="mt-3">
          <Button
            href={`${bookingBaseUrl}?boothType=portrait&style=${style.id}`}
            variant="primary"
            size="sm"
          >
            {bookLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

function PoemStyleCard({
  style,
  bookingBaseUrl,
  bookLabel,
}: {
  style: PublicStyle;
  bookingBaseUrl: string;
  bookLabel: string;
}) {
  const isRoast = style.tags.includes("roast");

  return (
    <div className="rounded-2xl overflow-hidden bg-bg-secondary border border-border-light">
      <div className="flex flex-col md:flex-row">
        {/* Input photo */}
        {style.example_input_image_url && (
          <div className="relative w-full md:w-64 aspect-square md:aspect-auto flex-shrink-0">
            <Image
              src={style.example_input_image_url}
              alt={`Example for ${style.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 256px"
              unoptimized
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-display text-text-primary">{style.name}</h3>
              {isRoast && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                  Roast
                </span>
              )}
            </div>

            {style.example_poem_text && (
              <blockquote className="mt-4 text-text-secondary font-body text-sm leading-relaxed italic border-l-2 border-border-light pl-4 whitespace-pre-line">
                {style.example_poem_text.replace(/^#\s+.+\n\n?/, "")}
              </blockquote>
            )}

            {/* Poem title if exists */}
            {style.example_poem_text?.startsWith("# ") && (
              <p className="mt-2 text-xs text-text-muted">
                {style.example_poem_text.split("\n")[0].replace("# ", "")}
              </p>
            )}
          </div>

          <div className="mt-5">
            <Button
              href={`${bookingBaseUrl}?boothType=${isRoast ? "roast" : "poem"}&style=${style.id}`}
              variant="primary"
              size="sm"
            >
              {bookLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StylesGallery({ styles, bookingBaseUrl }: StylesGalleryProps) {
  const t = useTranslations("styles");
  const [activeTab, setActiveTab] = useState<Tab>("image");

  const imageStyles = styles.filter((s: PublicStyle) => s.style_type === "image");
  const poemStyles = styles.filter((s: PublicStyle) => s.style_type === "poem" && !s.tags.includes("roast"));
  const roastStyles = styles.filter((s: PublicStyle) => s.style_type === "poem" && s.tags.includes("roast"));

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "image", label: t("tabs.portrait"), count: imageStyles.length },
    { key: "poem", label: t("tabs.poem"), count: poemStyles.length },
    { key: "roast", label: t("tabs.roast"), count: roastStyles.length },
  ];

  return (
    <div>
      <SectionHeading
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Tabs */}
      <div className="flex rounded-xl bg-bg-secondary border border-border-light p-1 mt-10 mb-10 max-w-lg mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-3 px-4 rounded-lg text-sm md:text-base font-display transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-text-primary text-bg-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
            <span className="ml-1.5 text-xs opacity-60">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Portrait Styles Grid */}
      {activeTab === "image" && (
        <>
          <p className="text-center text-text-secondary mb-8 max-w-xl mx-auto">
            {t("portraitIntro")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {imageStyles.map((style: PublicStyle, i: number) => (
              <PortraitStyleCard
                key={style.id}
                style={style}
                index={i}
                bookingBaseUrl={bookingBaseUrl}
                bookLabel={t("bookThisStyle")}
              />
            ))}
          </div>
        </>
      )}

      {/* Poem Styles */}
      {activeTab === "poem" && (
        <>
          <p className="text-center text-text-secondary mb-8 max-w-xl mx-auto">
            {t("poemIntro")}
          </p>
          <div className="grid grid-cols-1 gap-6">
            {poemStyles.map((style: PublicStyle) => (
              <PoemStyleCard
                key={style.id}
                style={style}
                bookingBaseUrl={bookingBaseUrl}
                bookLabel={t("bookThisStyle")}
              />
            ))}
          </div>
        </>
      )}

      {/* Roast Styles */}
      {activeTab === "roast" && (
        <>
          <p className="text-center text-text-secondary mb-8 max-w-xl mx-auto">
            {t("roastIntro")}
          </p>
          <div className="grid grid-cols-1 gap-6">
            {roastStyles.map((style: PublicStyle) => (
              <PoemStyleCard
                key={style.id}
                style={style}
                bookingBaseUrl={bookingBaseUrl}
                bookLabel={t("bookThisStyle")}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
