import { MetadataRoute } from "next";
import { locales, regions } from "@/i18n/routing";
import { client } from "../../sanity/lib/client";
import { blogPostSlugsQuery } from "../../sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poembooth.com";

  // Generate all locale/region combinations (5 locales x 7 regions = 35 URLs)
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

  // Blog listing pages
  for (const locale of locales) {
    for (const region of regions) {
      pages.push({
        url: `${baseUrl}/${locale}/${region}/blog`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }

  // Blog post pages
  try {
    const slugs = (await client.fetch(blogPostSlugsQuery)) as {
      slug: string;
    }[];
    for (const { slug } of slugs) {
      if (!slug) continue;
      for (const locale of locales) {
        for (const region of regions) {
          pages.push({
            url: `${baseUrl}/${locale}/${region}/blog/${slug}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
      }
    }
  } catch {
    // If Sanity fetch fails, skip blog post URLs
  }

  return pages;
}
