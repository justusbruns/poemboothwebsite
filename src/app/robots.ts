import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poembooth.com";

  const defaultDisallow = ["/studio", "/studio/", "/api/"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: defaultDisallow,
      },
      // Explicitly allow AI crawlers for GEO (Generative Engine Optimization)
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: defaultDisallow,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: defaultDisallow,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: defaultDisallow,
      },
      {
        userAgent: "GoogleOther",
        allow: "/",
        disallow: defaultDisallow,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
