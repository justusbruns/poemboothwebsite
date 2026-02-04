"use client";

import { useTranslations, useLocale } from "next-intl";
import ScrollEdition from "@/components/ui/ScrollEdition";
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
  titlePrefix?: string;
  titleSuffix?: string;
  slug: string;
  isNew?: boolean;
  subtitle: string;
  duration: number;
  outputType: "portrait" | "poem" | "roast";
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

function getLocalizedText(text: LocalizedText | string | undefined, locale: string): string {
  if (!text) return "";
  if (typeof text === "string") return text;
  return text[locale as keyof LocalizedText] || text.en || "";
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
    {
      title: "", // Will use custom title rendering
      titlePrefix: t("roast.titlePrefix"),
      titleSuffix: t("roast.titleSuffix"),
      slug: "roast",
      isNew: false,
      subtitle: t("roast.subtitle"),
      duration: 15,
      outputType: "roast",
      beforeLabel: t("roast.beforeLabel"),
      afterLabel: t("roast.afterLabel"),
    },
  ];

  const displayEditions = editions || defaultEditions;

  // Apply roast-specific title handling (titlePrefix/titleSuffix from translations)
  // since Sanity schema doesn't have these fields
  const processedEditions = displayEditions.map((edition) => {
    if (edition.outputType === "roast" && !edition.titlePrefix) {
      return {
        ...edition,
        titlePrefix: t("roast.titlePrefix"),
        titleSuffix: t("roast.titleSuffix"),
      };
    }
    return edition;
  });

  return (
    <section className="bg-bg-accent">
      {processedEditions.map((edition) => {
        const beforeUrl = getImageUrl(edition.beforeImage);

        // Collect all after images as an array
        let afterUrls: string[] = [];
        let poemText: string | undefined;

        if (edition.outputType === "poem" && edition.poemStyles && edition.poemStyles.length > 0) {
          // For poem editions, get the first poem's background image and text
          const firstStyle = edition.poemStyles[0];
          if (firstStyle.poems && firstStyle.poems.length > 0) {
            const firstPoem = firstStyle.poems[0];
            if (firstPoem.backgroundImage?.asset?.url) {
              afterUrls = [firstPoem.backgroundImage.asset.url];
            }
            poemText = getLocalizedText(firstPoem.poemText, locale);
          }
        } else if (edition.outputType === "roast") {
          // For roast editions, use the sample text from translations
          poemText = t("roast.sampleText");
        }

        if (edition.afterImages && edition.afterImages.length > 0) {
          // For portrait editions, get all after images for slideshow
          afterUrls = getImageUrls(edition.afterImages);
        } else if (edition.afterImage) {
          const url = getImageUrl(edition.afterImage);
          if (url) afterUrls = [url];
        }

        // Fallback images for demonstration
        const fallbackBefore = "/images/before-placeholder.jpg";
        const fallbackAfter = "/images/after-placeholder.jpg";

        // Get the appropriate share text based on edition type
        const shareText = edition.outputType === "portrait"
          ? t("shareArt")
          : edition.outputType === "roast"
            ? t("shareRoast")
            : t("sharePoem");

        return (
          <ScrollEdition
            key={edition.slug}
            title={edition.title}
            titlePrefix={edition.titlePrefix}
            titleSuffix={edition.titleSuffix}
            subtitle={edition.subtitle}
            isNew={edition.isNew}
            newBadgeText={t("newBadge")}
            beforeImage={beforeUrl || fallbackBefore}
            afterImages={afterUrls.length > 0 ? afterUrls : [fallbackAfter]}
            beforeLabel={edition.beforeLabel}
            afterLabel={edition.afterLabel}
            outputType={edition.outputType}
            poemText={poemText}
            shareText={shareText}
          />
        );
      })}
    </section>
  );
}
