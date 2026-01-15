import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { PortableText } from "@portabletext/react";
import { client } from "../../../../../sanity/lib/client";
import { pageDataQuery, userAgreementQuery } from "../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../sanity/lib/image";
import type { Locale } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string; region: string }>;
}

// Map region to agreement region (us stays us, all others become eu)
const getAgreementRegion = (region: string): "us" | "eu" => {
  return region === "us" ? "us" : "eu";
};

// Get content field key based on locale
const getContentField = (locale: string): string => {
  const validLocales = ["en", "nl", "de", "fr", "it"];
  return validLocales.includes(locale) ? `content_${locale}` : "content_en";
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "userAgreement" });

  return {
    title: t("pageTitle"),
    description: t("pageDescription"),
    robots: {
      index: true,
      follow: true,
    },
  };
}

// Custom components for Portable Text rendering
const portableTextComponents = {
  block: {
    h1: ({ children }: { children?: React.ReactNode }) => (
      <h1 className="text-3xl font-display font-bold text-text-primary mb-6 mt-8">
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 className="text-2xl font-display font-semibold text-text-primary mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="text-xl font-display font-semibold text-text-primary mb-3 mt-6">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: React.ReactNode }) => (
      <h4 className="text-lg font-display font-medium text-text-primary mb-2 mt-4">
        {children}
      </h4>
    ),
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-text-secondary leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }: { children?: React.ReactNode }) => (
      <blockquote className="border-l-4 border-accent pl-4 italic text-text-secondary my-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-text-secondary">
        {children}
      </ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-text-secondary">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <li className="leading-relaxed">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-text-primary">{children}</strong>
    ),
    em: ({ children }: { children?: React.ReactNode }) => (
      <em className="italic">{children}</em>
    ),
    link: ({
      value,
      children,
    }: {
      value?: { href?: string };
      children?: React.ReactNode;
    }) => (
      <a
        href={value?.href}
        className="text-accent hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};

export default async function UserAgreementPage({ params }: PageProps) {
  const { region, locale } = await params;
  const agreementRegion = getAgreementRegion(region);
  const contentField = getContentField(locale);

  // Fetch page layout data and user agreement in parallel
  const [pageData, agreementData] = await Promise.all([
    client.fetch(pageDataQuery, { region }),
    client.fetch(userAgreementQuery, { agreementRegion }),
  ]);

  // Get localized title
  type LocalizedField = { en?: string; nl?: string; de?: string; fr?: string; it?: string };
  const getLocalizedValue = (field: LocalizedField | undefined, loc: string): string => {
    if (!field) return "";
    return field[loc as keyof LocalizedField] || field.en || "";
  };

  const title = getLocalizedValue(agreementData?.title, locale) || "User Agreement";
  const content = agreementData?.[contentField] || agreementData?.content_en || [];
  const lastUpdated = agreementData?.lastUpdated;

  // Extract header logo from siteSettings
  const headerLogo = pageData?.siteSettings?.logo
    ? urlFor(pageData.siteSettings.logo).width(200).url()
    : undefined;

  // Extract footer data
  const footerData = pageData?.footer;

  // Format date based on locale
  const formatDate = (dateString: string, loc: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(loc === "en" ? "en-US" : loc, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <Header logo={headerLogo} />
      <main className="min-h-screen bg-bg-primary">
        <div className="py-16 md:py-24">
          <Container>
            <div className="max-w-3xl mx-auto">
              {/* Page Header */}
              <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
                  {title}
                </h1>
                {lastUpdated && (
                  <p className="text-sm text-text-tertiary">
                    Last updated: {formatDate(lastUpdated, locale)}
                  </p>
                )}
              </header>

              {/* Agreement Content */}
              <article className="prose prose-lg max-w-none">
                {content && content.length > 0 ? (
                  <PortableText value={content} components={portableTextComponents} />
                ) : (
                  <p className="text-text-secondary">
                    Content for this agreement is not yet available.
                  </p>
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
