import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { client } from "../../../../../sanity/lib/client";
import { blogPostsQuery, pageDataQuery } from "../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../sanity/lib/image";
import { locales, regions } from "@/i18n/routing";

interface PageProps {
  params: Promise<{ locale: string; region: string }>;
}

type LocalizedField = { en?: string; nl?: string; de?: string; fr?: string; it?: string };
const getLocalizedValue = (field: LocalizedField | undefined, loc: string): string => {
  if (!field) return "";
  return field[loc as keyof LocalizedField] || field.en || "";
};

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
  const t = await getTranslations({ locale, namespace: "blog" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poembooth.com";

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    for (const reg of regions) {
      const country = regionToCountry[reg];
      const hreflangKey = reg === "row" ? loc : `${loc}-${country}`;
      languages[hreflangKey] = `${baseUrl}/${loc}/${reg}/blog`;
    }
  }
  languages["x-default"] = `${baseUrl}/en/nl/blog`;

  return {
    title: t("metaTitle"),
    description: t("description"),
    alternates: {
      canonical: `${baseUrl}/${locale}/${region}/blog`,
      languages,
    },
  };
}

export default async function BlogPage({ params }: PageProps) {
  const { region, locale } = await params;

  const [posts, pageData] = await Promise.all([
    client.fetch(blogPostsQuery, { region }),
    client.fetch(pageDataQuery, { region }),
  ]);

  const headerLogo = pageData?.siteSettings?.logo
    ? urlFor(pageData.siteSettings.logo).width(200).url()
    : undefined;
  const footerData = pageData?.footer;

  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <>
      <Header logo={headerLogo} />
      <main className="min-h-screen bg-bg-primary">
        <div className="py-16 md:py-24">
          <Container>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
                {t("title")}
              </h1>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                {t("description")}
              </p>
            </div>

            {posts && posts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map(
                  (post: {
                    _id: string;
                    title?: LocalizedField;
                    slug?: { current?: string };
                    excerpt?: LocalizedField;
                    coverImage?: { asset?: { url?: string } };
                    author?: string;
                    publishedAt?: string;
                  }) => {
                    const title = getLocalizedValue(post.title, locale);
                    const excerpt = getLocalizedValue(post.excerpt, locale);
                    const slug = post.slug?.current;
                    const coverUrl = post.coverImage?.asset?.url;

                    return (
                      <Link
                        key={post._id}
                        href={`/${locale}/${region}/blog/${slug}`}
                        className="group block bg-bg-secondary rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {coverUrl && (
                          <div className="aspect-[16/9] relative overflow-hidden">
                            <Image
                              src={coverUrl}
                              alt={title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h2 className="text-xl font-display font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                            {title}
                          </h2>
                          {excerpt && (
                            <p className="text-text-secondary text-sm line-clamp-3 mb-4">
                              {excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs text-text-tertiary">
                            {post.publishedAt && (
                              <time dateTime={post.publishedAt}>
                                {new Date(post.publishedAt).toLocaleDateString(
                                  locale === "en" ? "en-US" : locale,
                                  { year: "numeric", month: "long", day: "numeric" }
                                )}
                              </time>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  }
                )}
              </div>
            ) : (
              <p className="text-center text-text-secondary">{t("noPosts")}</p>
            )}
          </Container>
        </div>
      </main>
      <Footer footerData={footerData} logo={headerLogo} />
    </>
  );
}
