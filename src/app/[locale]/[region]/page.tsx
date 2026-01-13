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
  Practicalities,
  BookingRates,
  OtherRegionsContact,
} from "@/components/sections";
import { getHubByRegion } from "@/lib/supabase/server";
import { REGION_CONFIGS, type Region } from "@/lib/supabase/types";
import { client } from "../../../../sanity/lib/client";
import { pageDataQuery } from "../../../../sanity/lib/queries";
import { urlFor } from "../../../../sanity/lib/image";

interface PageProps {
  params: Promise<{ locale: string; region: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hero" });

  return {
    title: `Poem Booth | ${t("headline")}`,
    description: t("subheadline"),
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

  // Fetch CMS data from Sanity and hub pricing from Supabase in parallel
  const [pageData, hubData] = await Promise.all([
    client.fetch(pageDataQuery, { region }),
    getHubByRegion(region),
  ]);

  const regionConfig = REGION_CONFIGS[region as Region] || REGION_CONFIGS.eu;

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

  const galleryImages = pageData?.gallery?.map((g: { image?: { asset?: { url?: string } }; caption?: LocalizedField; eventName?: string; featured?: boolean }) => ({
    imageUrl: g.image?.asset?.url,
    caption: getLocalizedValue(g.caption, locale),
    eventName: g.eventName,
    featured: g.featured,
  }));

  // Extract header logo from siteSettings
  const headerLogo = pageData?.siteSettings?.logo
    ? urlFor(pageData.siteSettings.logo).width(200).url()
    : undefined;

  // Extract footer data
  const footerData = pageData?.footer;

  return (
    <>
      <Header logo={headerLogo} />
      <main>
        <Hero heroImage={heroImage} />
        <ClientLogos logos={clientLogos} />
        <HowItWorks steps={howItWorksSteps} />
        <EditionShowcase editions={editions} />
        <PhotoGallery images={galleryImages} />
        <Practicalities />
        <BookingRates hubPricing={hubPricing} />
        <OtherRegionsContact />
      </main>
      <Footer footerData={footerData} logo={headerLogo} />
    </>
  );
}
