"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

function QuoteMark() {
  return (
    <svg
      className="w-8 h-8 text-text-muted/40"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.6 4C6 6.2 3.8 9.6 3.8 13.9c0 3.4 2 5.6 4.7 5.6 2.3 0 4-1.7 4-4 0-2.2-1.5-3.8-3.6-3.8-.4 0-.9.1-1 .1.3-2.3 2.4-5 4.5-6.3L9.6 4zm10.4 0c-3.6 2.2-5.8 5.6-5.8 9.9 0 3.4 2 5.6 4.7 5.6 2.3 0 4-1.7 4-4 0-2.2-1.6-3.8-3.7-3.8-.4 0-.8.1-1 .1.4-2.3 2.5-5 4.6-6.3L20 4z" />
    </svg>
  );
}

interface Attribution {
  author?: string;
  org: string;
  avatarSrc?: string;
}

function Byline({ author, org, avatarSrc }: Attribution) {
  return (
    <footer className="mt-6 flex items-center gap-3">
      {avatarSrc && (
        <Image
          src={avatarSrc}
          alt={author || org}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
        />
      )}
      <div>
        {author && (
          <p className="font-display text-text-primary">{author}</p>
        )}
        <p className="text-sm text-text-secondary">{org}</p>
      </div>
    </footer>
  );
}

export default function Testimonials() {
  const t = useTranslations("testimonials");
  const params = useParams();
  const isUS = params.region === "us";

  return (
    <section className="py-16 md:py-24 bg-bg-primary">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {/* Featured quote with engagement stat */}
          <blockquote className="lg:col-span-2 bg-bg-secondary rounded-xl p-8 md:p-10 border border-border-light flex flex-col">
            <QuoteMark />
            <p className="mt-4 text-xl md:text-2xl font-display text-text-primary leading-relaxed flex-1">
              {t("featured.text")}
            </p>
            <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="md:order-2 md:text-right">
                <p className="text-4xl md:text-5xl font-display text-text-primary">
                  {isUS ? t("featured.statValueUS") : t("featured.statValueEU")}
                </p>
                <p className="text-sm text-text-secondary">
                  {t("featured.statLabel")}
                </p>
              </div>
              <div className="md:order-1">
                <Byline
                  author={t("featured.author")}
                  org={t("featured.org")}
                  avatarSrc="/images/testimonials/ady-avivi.jpg"
                />
              </div>
            </div>
          </blockquote>

          {/* Two shorter quotes */}
          <div className="grid gap-6 content-start">
            <blockquote className="bg-bg-secondary rounded-xl p-8 border border-border-light">
              <QuoteMark />
              <p className="mt-4 text-lg font-display text-text-primary leading-relaxed">
                {t("summit.text")}
              </p>
              <Byline org={t("summit.org")} />
            </blockquote>

            <blockquote className="bg-bg-secondary rounded-xl p-8 border border-border-light">
              <QuoteMark />
              <p className="mt-4 text-lg font-display text-text-primary leading-relaxed">
                {t("fontys.text")}
              </p>
              <Byline
                author={t("fontys.author")}
                org={t("fontys.org")}
                avatarSrc="/images/testimonials/latoya-dankers.jpg"
              />
            </blockquote>
          </div>
        </div>
      </Container>
    </section>
  );
}
