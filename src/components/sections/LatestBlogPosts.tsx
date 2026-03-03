"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

type LocalizedField = { en?: string; nl?: string; de?: string; fr?: string; it?: string };
const getLocalizedValue = (field: LocalizedField | undefined, loc: string): string => {
  if (!field) return "";
  return field[loc as keyof LocalizedField] || field.en || "";
};

interface BlogPost {
  _id: string;
  title?: LocalizedField;
  slug?: { current?: string };
  excerpt?: LocalizedField;
  coverImage?: { asset?: { url?: string } };
  publishedAt?: string;
}

interface LatestBlogPostsProps {
  posts: BlogPost[];
}

export default function LatestBlogPosts({ posts }: LatestBlogPostsProps) {
  const t = useTranslations("blog");
  const params = useParams();
  const locale = params.locale as string;
  const region = params.region as string;

  if (!posts || posts.length === 0) return null;

  return (
    <section className="section-padding bg-bg-secondary">
      <Container>
        <SectionHeading
          title={t("fromTheBlog")}
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => {
            const title = getLocalizedValue(post.title, locale);
            const excerpt = getLocalizedValue(post.excerpt, locale);
            const slug = post.slug?.current;
            const coverUrl = post.coverImage?.asset?.url;

            if (!slug) return null;

            return (
              <Link
                key={post._id}
                href={`/${locale}/${region}/blog/${slug}`}
                className="group block bg-bg-primary rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
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
                  <h3 className="text-lg font-display font-semibold text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {title}
                  </h3>
                  {excerpt && (
                    <p className="text-text-secondary text-sm line-clamp-3 mb-4">
                      {excerpt}
                    </p>
                  )}
                  {post.publishedAt && (
                    <time
                      dateTime={post.publishedAt}
                      className="text-xs text-text-tertiary"
                    >
                      {new Date(post.publishedAt).toLocaleDateString(
                        locale === "en" ? "en-US" : locale,
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </time>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}/${region}/blog`}
            className="inline-flex items-center gap-2 px-8 py-3 bg-text-primary text-bg-primary font-medium rounded-full hover:opacity-80 transition-opacity"
          >
            {t("readAll")}
          </Link>
        </div>
      </Container>
    </section>
  );
}
