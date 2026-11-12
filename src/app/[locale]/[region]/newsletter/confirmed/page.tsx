import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LetterCard from "@/components/ui/LetterCard";
import { client } from "../../../../../../sanity/lib/client";
import { pageDataQuery } from "../../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../../sanity/lib/image";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ locale: string; region: string }>;
  searchParams: Promise<{ status?: string }>;
}

const STATUSES = ["ok", "expired", "invalid", "error"] as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newsletterConfirmed" });
  return { title: t("metaTitle"), robots: { index: false, follow: false } };
}

export default async function NewsletterConfirmedPage({ params, searchParams }: PageProps) {
  const [{ locale, region }, sp] = await Promise.all([params, searchParams]);
  const status = (STATUSES as readonly string[]).includes(sp?.status ?? "") ? (sp.status as (typeof STATUSES)[number]) : "ok";
  const [t, pageData] = await Promise.all([
    getTranslations({ locale, namespace: "newsletterConfirmed" }),
    client.fetch(pageDataQuery, { region }).catch(() => null),
  ]);
  const logo = pageData?.siteSettings?.logo ? urlFor(pageData.siteSettings.logo).width(200).url() : undefined;
  const home = `/${locale}/${region}`;
  const buttons = status === "ok"
    ? [{ href: home, label: t("home") }, { href: `${home}/styles`, label: t("styles") }]
    : [{ href: home, label: t("home") }];

  return (
    <>
      <Header logo={logo} />
      <main className="min-h-screen bg-bg-secondary">
        <LetterCard title={t(`${status}.title`)} buttons={buttons} note={status === "ok" ? t("note") : null}>
          <p style={{ margin: 0 }}>{t(`${status}.body`)}</p>
        </LetterCard>
      </main>
      <Footer footerData={pageData?.footer} logo={logo} />
    </>
  );
}
