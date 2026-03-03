import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { PortableText } from "@portabletext/react";
import { client } from "../../../../../../sanity/lib/client";
import {
  blogPostBySlugQuery,
  blogPostSlugsQuery,
  pageDataQuery,
} from "../../../../../../sanity/lib/queries";
import { urlFor } from "../../../../../../sanity/lib/image";
import { locales, regions } from "@/i18n/routing";
import { JsonLd, BreadcrumbListJsonLd } from "@/components/seo/JsonLd";

interface PageProps {
  params: Promise<{ locale: string; region: string; slug: string }>;
}

type LocalizedField = {
  en?: string;
  nl?: string;
  de?: string;
  fr?: string;
  it?: string;
};
const getLocalizedValue = (
  field: LocalizedField | undefined,
  loc: string
): string => {
  if (!field) return "";
  return (field[loc as keyof LocalizedField] || field.en || "");
};

const getBodyField = (locale: string): string => {
  const validLocales = ["en", "nl", "de", "fr", "it"];
  return validLocales.includes(locale) ? `body_${locale}` : "body_en";
};

export async function generateStaticParams() {
  const slugs = await client.fetch(blogPostSlugsQuery);
  const params: { locale: string; region: string; slug: string }[] = [];

  for (const { slug } of slugs as { slug: string }[]) {
    if (!slug) continue;
    for (const locale of locales) {
      for (const region of regions) {
        params.push({ locale, region, slug });
      }
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug, region } = await params;
  const post = await client.fetch(blogPostBySlugQuery, { slug });

  if (!post) {
    const t = await getTranslations({ locale, namespace: "blog" });
    return { title: t("title") };
  }

  const title =
    getLocalizedValue(post.seoTitle, locale) ||
    getLocalizedValue(post.title, locale);
  const description =
    getLocalizedValue(post.seoDescription, locale) ||
    getLocalizedValue(post.excerpt, locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poembooth.com";
  const coverUrl = post.coverImage?.asset?.url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/${region}/blog/${slug}`,
      type: "article",
      publishedTime: post.publishedAt,
      images: coverUrl ? [{ url: coverUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverUrl ? [coverUrl] : [],
    },
  };
}

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
  types: {
    image: ({
      value,
    }: {
      value?: { asset?: { url?: string }; alt?: string };
    }) => {
      if (!value?.asset?.url) return null;
      return (
        <div className="my-8">
          <Image
            src={value.asset.url}
            alt={value.alt || ""}
            width={800}
            height={450}
            className="rounded-lg w-full"
          />
        </div>
      );
    },
    youtube: ({ value }: { value?: { url?: string } }) => {
      if (!value?.url) return null;
      const id = value.url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/
      )?.[1];
      if (!id) return null;
      return (
        <div className="my-8 relative aspect-video rounded-lg overflow-hidden">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title="YouTube video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>
      );
    },
  },
};

export default async function BlogPostPage({ params }: PageProps) {
  const { region, locale, slug } = await params;

  const [post, pageData] = await Promise.all([
    client.fetch(blogPostBySlugQuery, { slug }),
    client.fetch(pageDataQuery, { region }),
  ]);

  const headerLogo = pageData?.siteSettings?.logo
    ? urlFor(pageData.siteSettings.logo).width(200).url()
    : undefined;
  const footerData = pageData?.footer;
  const t = await getTranslations({ locale, namespace: "blog" });

  if (!post) {
    return (
      <>
        <Header logo={headerLogo} />
        <main className="min-h-screen bg-bg-primary">
          <div className="py-16 md:py-24">
            <Container>
              <p className="text-center text-text-secondary">
                {t("noPosts")}
              </p>
            </Container>
          </div>
        </main>
        <Footer footerData={footerData} logo={headerLogo} />
      </>
    );
  }

  const title = getLocalizedValue(post.title, locale);
  const bodyField = getBodyField(locale);
  const body = post[bodyField] || post.body_en || [];
  const coverUrl = post.coverImage?.asset?.url;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://poembooth.com";

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description:
      getLocalizedValue(post.excerpt, locale) || "",
    image: coverUrl || "",
    datePublished: post.publishedAt,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: "Poem Booth" },
    publisher: {
      "@type": "Organization",
      name: "Poem Booth",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/images/logo.png`,
      },
    },
    url: `${baseUrl}/${locale}/${region}/blog/${slug}`,
  };

  const breadcrumbs = [
    { name: "Poem Booth", item: `${baseUrl}/${locale}/${region}` },
    { name: t("title"), item: `${baseUrl}/${locale}/${region}/blog` },
    { name: title, item: `${baseUrl}/${locale}/${region}/blog/${slug}` },
  ];

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <BreadcrumbListJsonLd items={breadcrumbs} />
      <Header logo={headerLogo} />
      <main className="min-h-screen bg-bg-primary">
        <article className="py-16 md:py-24">
          <Container>
            <div className="max-w-3xl mx-auto">
              <Link
                href={`/${locale}/${region}/blog`}
                className="text-accent hover:underline text-sm mb-8 inline-block"
              >
                &larr; {t("backToBlog")}
              </Link>

              <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
                  {title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-text-tertiary">
                  {post.publishedAt && (
                    <time dateTime={post.publishedAt}>
                      {t("publishedOn")}{" "}
                      {new Date(post.publishedAt).toLocaleDateString(
                        locale === "en" ? "en-US" : locale,
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </time>
                  )}
                </div>
              </header>

              {coverUrl && (
                <div className="mb-12 aspect-[16/9] relative overflow-hidden rounded-lg">
                  <Image
                    src={coverUrl}
                    alt={title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                {body && body.length > 0 ? (
                  <PortableText
                    value={body}
                    components={portableTextComponents}
                  />
                ) : (
                  <p className="text-text-secondary">
                    {t("noPosts")}
                  </p>
                )}
              </div>
            </div>
          </Container>
        </article>
      </main>
      <Footer footerData={footerData} logo={headerLogo} />
    </>
  );
}
