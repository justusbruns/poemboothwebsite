import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import StylesGallery from "@/components/sections/StylesGallery";
import { client } from "../../../../../sanity/lib/client";
import { pageDataQuery } from "../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../sanity/lib/image";
import { locales, regions } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string; region: string }>;
}

const regionToCountry: Record<string, string> = {
  nl: "NL",
  us: "US",
  de: "DE",
  fr: "FR",
  it: "IT",
  be: "BE",
  row: "001",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, region } = await params;
  const t = await getTranslations({ locale, namespace: "styles" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poembooth.com";

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    for (const reg of regions) {
      const country = regionToCountry[reg];
      const hreflangKey = reg === "row" ? loc : `${loc}-${country}`;
      languages[hreflangKey] = `${baseUrl}/${loc}/${reg}/styles`;
    }
  }
  languages["x-default"] = `${baseUrl}/en/nl/styles`;

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${baseUrl}/${locale}/${region}/styles`,
      languages,
    },
  };
}

async function fetchPublicStyles() {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://book.poembooth.com";
  const baseUrl = bookingUrl.replace(/\/+$/, "").split("/").slice(0, 3).join("/");

  try {
    const res = await fetch(`${baseUrl}/api/public/styles`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.styles || [];
  } catch {
    return [];
  }
}

export default async function StylesPage({ params }: PageProps) {
  const { region, locale } = await params;

  const [styles, pageData] = await Promise.all([
    fetchPublicStyles(),
    client.fetch(pageDataQuery, { region }),
  ]);

  const headerLogo = pageData?.siteSettings?.logo
    ? urlFor(pageData.siteSettings.logo).width(200).url()
    : undefined;
  const footerData = pageData?.footer;

  const t = await getTranslations({ locale, namespace: "styles" });

  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://book.poembooth.com";
  const bookingBase = bookingUrl.replace(/\/+$/, "").split("/").slice(0, 3).join("/");

  return (
    <>
      <Header logo={headerLogo} />
      <main className="min-h-screen bg-bg-primary">
        <div className="py-16 md:py-24">
          <Container>
            <div className="mt-12">
              <StylesGallery
                styles={styles}
                bookingBaseUrl={`${bookingBase}/${locale}/booking`}
              />
            </div>
          </Container>
        </div>
      </main>
      <Footer footerData={footerData} />
    </>
  );
}
