import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Hero,
  ClientLogos,
  HowItWorks,
  EditionShowcase,
  PhotoGallery,
  Newsletter,
  Practicalities,
  BookingRates,
  FAQ,
  LatestBlogPosts,
} from "@/components/sections";
import VouwBanner from "@/components/sections/VouwBanner";
import StylesGallery from "@/components/sections/StylesGallery";
import { getHubByRegion } from "@/lib/supabase/server";
import { REGION_CONFIGS, type Region } from "@/lib/supabase/types";
import { client } from "../../../../sanity/lib/client";
import { pageDataQuery } from "../../../../sanity/lib/queries";
import { urlFor } from "../../../../sanity/lib/image";
import { locales, regions, type Locale } from "@/i18n/routing";
import { OrganizationJsonLd, ServiceJsonLd, FAQPageJsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ locale: string; region: string }>;
}

// Map locale to OpenGraph locale format
const ogLocaleMap: Record<string, string> = {
  en: "en_US",
  nl: "nl_NL",
  de: "de_DE",
  fr: "fr_FR",
  it: "it_IT",
};

// Map region to country code for hreflang
const regionToCountry: Record<string, string> = {
  nl: "NL",
  us: "US",
  de: "DE",
  fr: "FR",
  it: "IT",
  be: "BE",
  row: "001", // UN M49 code for "World"
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, region } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const heroT = await getTranslations({ locale, namespace: "hero" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poembooth.com";
  const currentUrl = `${baseUrl}/${locale}/${region}`;

  // Build hreflang alternates for all locale/region combinations
  const languages: Record<string, string> = {};

  for (const loc of locales) {
    for (const reg of regions) {
      // Create hreflang key: language-country format
      const country = regionToCountry[reg];
      const hreflangKey = reg === "row" ? loc : `${loc}-${country}`;
      languages[hreflangKey] = `${baseUrl}/${loc}/${reg}`;
    }
  }

  // Set x-default to English Netherlands
  languages["x-default"] = `${baseUrl}/en/nl`;

  const title = t("title");
  const description = t("description");
  const ogTitle = t("ogTitle");

  return {
    title,
    description,

    // Keywords
    keywords: t("keywords"),

    // Canonical and alternate URLs
    alternates: {
      canonical: currentUrl,
      languages,
    },

    // OpenGraph
    openGraph: {
      title: ogTitle,
      description,
      url: currentUrl,
      siteName: "Poem Booth",
      type: "website",
      locale: ogLocaleMap[locale] || "en_US",
      alternateLocale: Object.values(ogLocaleMap).filter(
        (l) => l !== ogLocaleMap[locale]
      ),
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: heroT("headline"),
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [`${baseUrl}/images/og-image.jpg`],
    },
  };
}

// Helper to extract localized value from Sanity fields
type LocalizedField = { en?: string; nl?: string; de?: string; fr?: string; it?: string };
const getLocalizedValue = (field: LocalizedField | undefined, loc: string): string => {
  if (!field) return "";
  return field[loc as keyof LocalizedField] || field.en || "";
};

export default async function LandingPage({ params }: PageProps) {
  const { region, locale } = await params;

  // Fetch CMS data, hub pricing, and public styles in parallel
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://book.poembooth.com";
  const bookingBase = bookingUrl.replace(/\/+$/, "").split("/").slice(0, 3).join("/");

  async function fetchPublicStyles() {
    try {
      const res = await fetch(`${bookingBase}/api/public/styles`, {
        cache: "no-store",
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.styles || [];
    } catch {
      return [];
    }
  }

  const [pageData, hubData, publicStyles] = await Promise.all([
    client.fetch(pageDataQuery, { region }),
    getHubByRegion(region),
    fetchPublicStyles(),
  ]);

  const regionConfig = REGION_CONFIGS[region as Region] || REGION_CONFIGS.nl;

  // Format pricing data for BookingRates component
  const hubPricing = hubData
    ? {
        hubName: hubData.name,
        currency: hubData.currency || regionConfig.currency,
        currencySymbol: regionConfig.currencySymbol,
        dayRates: {
          day1: hubData.day_1_rate || 0,
          day2: hubData.day_2_rate || 0,
          day3Plus: hubData.day_3_plus_rate || 0,
        },
        transport: {
          minimumFee: hubData.minimum_transport_fee || 0,
          ratePerUnit: hubData.transport_rate_per_km || 0,
          unit: (hubData.distance_unit || regionConfig.distanceUnit) as "km" | "mi",
        },
        outdoorInstallationFee: hubData.outdoor_installation_fee || 0,
        imageStyleRate: hubData.image_style_rate || 0,
        baseStyleRate: hubData.additional_language_rate || 0,
      }
    : undefined;

  // Transform Sanity data for components
  const heroImage = pageData?.hero?.heroImage
    ? urlFor(pageData.hero.heroImage).url()
    : undefined;

  const clientLogos = pageData?.clientLogos?.map((l: { name: string; logo?: { asset?: { url?: string } } }) => ({
    name: l.name,
    logoUrl: l.logo?.asset?.url,
  }));

  // Transform howItWorks steps - extract locale-specific text
  const howItWorksSteps = pageData?.howItWorks?.map((step: { stepNumber: number; title?: LocalizedField; description?: LocalizedField; icon?: unknown }) => ({
    stepNumber: step.stepNumber,
    title: getLocalizedValue(step.title, locale),
    description: getLocalizedValue(step.description, locale),
    icon: step.icon,
  }));

  // Transform editions - extract locale-specific text
  const editions = pageData?.editions?.map((e: { title?: LocalizedField; subtitle?: LocalizedField; beforeLabel?: LocalizedField; afterLabel?: LocalizedField; slug?: { current?: string }; isNew?: boolean; duration?: number; outputType?: string; boothImage?: unknown; beforeImage?: unknown; afterImage?: unknown; afterImages?: unknown[]; poemStyles?: unknown[] }) => ({
    title: getLocalizedValue(e.title, locale),
    slug: e.slug?.current || "",
    isNew: e.isNew,
    subtitle: getLocalizedValue(e.subtitle, locale),
    duration: e.duration,
    outputType: e.outputType,
    boothImage: e.boothImage,
    beforeImage: e.beforeImage,
    afterImage: e.afterImage,
    afterImages: e.afterImages,
    poemStyles: e.poemStyles,
    beforeLabel: getLocalizedValue(e.beforeLabel, locale),
    afterLabel: getLocalizedValue(e.afterLabel, locale),
  }));

  const galleryImages = pageData?.gallery?.map((g: { image?: { asset?: { url?: string }; hotspot?: { x?: number; y?: number } }; caption?: LocalizedField; eventName?: string; featured?: boolean }) => {
    const hotspot = g.image?.hotspot;
    const objectPosition = hotspot
      ? `${Math.round((hotspot.x ?? 0.5) * 100)}% ${Math.round((hotspot.y ?? 0.5) * 100)}%`
      : undefined;
    return {
      imageUrl: g.image?.asset?.url,
      caption: getLocalizedValue(g.caption, locale),
      eventName: g.eventName,
      featured: g.featured,
      objectPosition,
    };
  });

  // Extract edition booth image URLs for ServiceJsonLd ImageObject schema
  const editionImages: Array<string | undefined> = (pageData?.editions ?? []).map(
    (e: { boothImage?: unknown }) =>
      e.boothImage ? urlFor(e.boothImage as Parameters<typeof urlFor>[0]).width(800).url() : undefined
  );

  // Extract header logo from siteSettings
  const headerLogo = pageData?.siteSettings?.logo
    ? urlFor(pageData.siteSettings.logo).width(200).url()
    : undefined;

  // Extract footer data
  const footerData = pageData?.footer;

  // Build FAQ items for JSON-LD from i18n
  const faqT = await getTranslations({ locale, namespace: "faq" });
  const faqTabs = ["general", "agencies", "private", "editions"] as const;
  const faqKeyCounts: Record<string, string[]> = {
    general: ["q1", "q2", "q3", "q4", "q5"],
    agencies: ["q1", "q2", "q3", "q4"],
    private: ["q1", "q2", "q3", "q4"],
    editions: ["q1", "q2", "q3", "q4"],
  };
  const faqItems = faqTabs.flatMap((tab) =>
    faqKeyCounts[tab].map((key) => ({
      question: faqT(`${tab}.${key}.q`),
      answer: faqT(`${tab}.${key}.a`),
    }))
  );

  return (
    <>
      <OrganizationJsonLd locale={locale} />
      <ServiceJsonLd locale={locale} region={region} editionImages={editionImages} />
      <FAQPageJsonLd items={faqItems} />
      <Header logo={headerLogo} />
      <main>
        <Hero heroImage={heroImage} bookingUrl={pageData?.siteSettings?.bookingUrl} />
        <ClientLogos logos={clientLogos} />
        <HowItWorks steps={howItWorksSteps} />
        <section id="styles" className="py-16 md:py-24 bg-bg-primary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <StylesGallery
              styles={publicStyles}
              bookingBaseUrl={`${bookingBase}/${locale}/booking`}
            />
          </div>
        </section>
        <EditionShowcase editions={editions} />
        <PhotoGallery images={galleryImages} />
        <Newsletter />
        <Practicalities />
        <BookingRates hubPricing={hubPricing} bookingUrl={pageData?.siteSettings?.bookingUrl} />
        <FAQ locale={locale} />
        <LatestBlogPosts posts={pageData?.latestBlogPosts ?? []} />
        <VouwBanner />
      </main>
      <Footer footerData={footerData} logo={headerLogo} />
    </>
  );
}
