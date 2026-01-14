import { MetadataRoute } from "next";
import { locales, regions } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poembooth.com";

  // Generate all locale/region combinations (5 locales × 7 regions = 35 URLs)
  const pages: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const region of regions) {
      // Set higher priority for default locale/region and matching locale/region combos
      const isDefault = locale === "en" && region === "nl";
      const isNativeMatch =
        (locale === "nl" && region === "nl") ||
        (locale === "de" && region === "de") ||
        (locale === "fr" && region === "fr") ||
        (locale === "it" && region === "it");

      pages.push({
        url: `${baseUrl}/${locale}/${region}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: isDefault ? 1.0 : isNativeMatch ? 0.9 : 0.8,
      });
    }
  }

  return pages;
}
