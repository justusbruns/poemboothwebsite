"use client";

import { useState } from "react";
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

type Tab = "image" | "poem";

function PortraitStyleCard({
  style,
  bookingBaseUrl,
  bookLabel,
}: {
  style: PublicStyle;
  bookingBaseUrl: string;
  bookLabel: string;
}) {
  const [showOriginal, setShowOriginal] = useState(false);

  const outputUrl = style.example_output_image_url;
  const inputUrl = style.example_input_image_url;
  const activeUrl = showOriginal && inputUrl ? inputUrl : outputUrl;

  return (
    <div className="group rounded-2xl overflow-hidden bg-bg-secondary border border-border-light flex flex-col">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden">
        {activeUrl && (
          <Image
            src={activeUrl}
            alt={style.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
        )}

        {/* Before/After toggle */}
        {inputUrl && outputUrl && (
          <div className="absolute bottom-3 left-3 flex rounded-lg overflow-hidden bg-black/60 backdrop-blur-sm text-xs">
            <button
              onClick={() => setShowOriginal(false)}
              className={`px-3 py-1.5 transition-colors ${
                !showOriginal ? "bg-white text-black" : "text-white/80 hover:text-white"
              }`}
            >
              After
            </button>
            <button
              onClick={() => setShowOriginal(true)}
              className={`px-3 py-1.5 transition-colors ${
                showOriginal ? "bg-white text-black" : "text-white/80 hover:text-white"
              }`}
            >
              Before
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-display text-text-primary">{style.name}</h3>
        <div className="flex flex-wrap gap-1.5 mt-2 min-h-[24px]">
          {style.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-bg-primary text-text-secondary border border-border-light"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-4">
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
  const poemStyles = styles.filter((s: PublicStyle) => s.style_type === "poem");

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "image", label: t("tabs.portrait"), count: imageStyles.length },
    { key: "poem", label: t("tabs.poem"), count: poemStyles.length },
  ];

  return (
    <div>
      <SectionHeading
        title={t("title")}
        subtitle={t("subtitle")}
      />

      {/* Tabs */}
      <div className="flex rounded-xl bg-bg-secondary border border-border-light p-1 mt-10 mb-10 max-w-md mx-auto">
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
            {imageStyles.map((style: PublicStyle) => (
              <PortraitStyleCard
                key={style.id}
                style={style}
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
    </div>
  );
}
