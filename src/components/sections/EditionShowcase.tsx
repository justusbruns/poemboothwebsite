"use client";

import { useTranslations, useLocale } from "next-intl";
import Container from "@/components/ui/Container";
import BoothWithScreen from "@/components/ui/BoothWithScreen";
import PoemBoothScreen from "@/components/ui/PoemBoothScreen";
import { urlFor } from "../../../sanity/lib/image";

interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

type LocalizedText = {
  en?: string;
  nl?: string;
  de?: string;
  fr?: string;
  it?: string;
};

interface PoemExample {
  backgroundImage?: {
    asset?: {
      url: string;
      metadata?: {
        lqip?: string;
      };
    };
  };
  poemText: LocalizedText | string;
  attribution?: string;
}

interface PoemStyle {
  _id: string;
  styleName: string;
  styleDescription?: string;
  order?: number;
  poems: PoemExample[];
}

interface Edition {
  title: string;
  slug: string;
  isNew?: boolean;
  subtitle: string;
  duration: number;
  outputType: "portrait" | "poem";
  beforeImage?: SanityImage | string;
  afterImage?: SanityImage | string;
  afterImages?: (SanityImage | string)[];
  poemStyles?: PoemStyle[];
  beforeLabel: string;
  afterLabel: string;
}

interface EditionShowcaseProps {
  editions?: Edition[];
}

function getImageUrl(image: SanityImage | string | undefined): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  return urlFor(image).width(800).height(1000).url();
}

function getImageUrls(images: (SanityImage | string)[] | undefined): string[] {
  if (!images || images.length === 0) return [];
  return images
    .map((img) => getImageUrl(img))
    .filter((url): url is string => url !== undefined);
}

export default function EditionShowcase({ editions }: EditionShowcaseProps) {
  const t = useTranslations("editions");
  const locale = useLocale();

  // Default editions from translations
  const defaultEditions: Edition[] = [
    {
      title: t("portrait.title"),
      slug: "portrait",
      isNew: true,
      subtitle: t("portrait.subtitle"),
      duration: 30,
      outputType: "portrait",
      beforeLabel: t("portrait.beforeLabel"),
      afterLabel: t("portrait.afterLabel"),
    },
    {
      title: t("original.title"),
      slug: "original",
      isNew: false,
      subtitle: t("original.subtitle"),
      duration: 10,
      outputType: "poem",
      beforeLabel: t("original.beforeLabel"),
      afterLabel: t("original.afterLabel"),
    },
  ];

  const displayEditions = editions || defaultEditions;

  return (
    <section className="py-16 md:py-24 bg-bg-accent">
      <Container>
        <div className="space-y-24 md:space-y-32">
          {displayEditions.map((edition) => {
            const beforeUrl = getImageUrl(edition.beforeImage);
            // Use afterImages array if available, fallback to single afterImage
            const afterUrls =
              edition.afterImages && edition.afterImages.length > 0
                ? getImageUrls(edition.afterImages)
                : edition.afterImage
                  ? [getImageUrl(edition.afterImage)].filter(
                      (url): url is string => url !== undefined
                    )
                  : [];

            return (
              <div key={edition.slug} className="text-center">
                {/* New Badge */}
                {edition.isNew && (
                  <div className="mb-4">
                    <span className="inline-block px-4 py-1.5 bg-text-primary text-bg-primary text-sm font-medium rounded-full">
                      {t("newBadge")}
                    </span>
                  </div>
                )}

                {/* Edition Title */}
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-text-primary mb-4">
                  {edition.title}
                </h2>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 md:mb-16">
                  {edition.subtitle}
                </p>

                {/* Two Booths with Arrow */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12">
                  {/* Before Booth */}
                  <BoothWithScreen
                    images={beforeUrl ? [beforeUrl] : []}
                    slideshow={false}
                    label={edition.beforeLabel}
                    alt={`${edition.title} - ${edition.beforeLabel}`}
                  />

                  {/* Arrow */}
                  <div className="flex-shrink-0 text-text-muted">
                    {/* Horizontal arrow on desktop */}
                    <svg
                      className="hidden md:block w-12 h-12 lg:w-16 lg:h-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                    {/* Vertical arrow on mobile */}
                    <svg
                      className="md:hidden w-10 h-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 13l-5 5m0 0l-5-5m5 5V6"
                      />
                    </svg>
                  </div>

                  {/* After Booth - Portrait slideshow or Poem display */}
                  {edition.outputType === "poem" &&
                  edition.poemStyles &&
                  edition.poemStyles.length > 0 ? (
                    <PoemBoothScreen
                      styles={edition.poemStyles}
                      locale={locale}
                      label={edition.afterLabel}
                      fallbackImage={beforeUrl}
                    />
                  ) : (
                    <BoothWithScreen
                      images={afterUrls}
                      slideshow={afterUrls.length > 1}
                      fadeDuration={3500}
                      label={edition.afterLabel}
                      alt={`${edition.title} - ${edition.afterLabel}`}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
