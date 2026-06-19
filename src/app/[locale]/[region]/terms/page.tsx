import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { client } from "../../../../../sanity/lib/client";
import { pageDataQuery } from "../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../sanity/lib/image";
import { getKioskTerms } from "@/lib/terms";

interface PageProps {
  params: Promise<{ locale: string; region: string }>;
}

// Re-fetch terms periodically; they change rarely.
export const revalidate = 300;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    robots: { index: true, follow: true },
  };
}

export default async function TermsPage({ params }: PageProps) {
  const { region, locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });

  const [pageData, terms] = await Promise.all([
    client.fetch(pageDataQuery, { region }),
    getKioskTerms(region, locale),
  ]);

  const headerLogo = pageData?.siteSettings?.logo
    ? urlFor(pageData.siteSettings.logo).width(200).url()
    : undefined;
  const footerData = pageData?.footer;

  // Kiosk terms are plain text; preserve author line breaks and split into
  // paragraphs on blank lines. Rendered as text (never HTML) for safety.
  const paragraphs = (terms.text || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <>
      <Header logo={headerLogo} />
      <main className="min-h-screen bg-bg-primary">
        <div className="py-16 md:py-24">
          <Container>
            <div className="max-w-3xl mx-auto">
              <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
                  {t("pageTitle")}
                </h1>
              </header>

              <article className="prose prose-lg max-w-none">
                {terms.enabled && paragraphs.length > 0 ? (
                  paragraphs.map((para, i) => (
                    <p
                      key={i}
                      className="text-text-secondary leading-relaxed mb-4 whitespace-pre-wrap"
                    >
                      {para}
                    </p>
                  ))
                ) : (
                  <p className="text-text-secondary">{t("notAvailable")}</p>
                )}
              </article>
            </div>
          </Container>
        </div>
      </main>
      <Footer footerData={footerData} logo={headerLogo} />
    </>
  );
}
