"use client";

import { useState } from "react";
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
  const [channableExpanded, setChannableExpanded] = useState(false);

  return (
    <section className="py-16 md:py-24 bg-bg-primary">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        {/* Mobile/tablet: horizontal swipe strip with scroll-snap.
            Desktop (lg+): four equal cards side by side, bylines pinned bottom. */}
        <div
          className="mt-12 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 lg:pb-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:items-start"
          style={{ scrollbarWidth: "none" }}
        >
          {/* Weingarten — with engagement stat */}
          <blockquote className="min-w-[85%] sm:min-w-[55%] lg:min-w-0 snap-center bg-bg-secondary rounded-xl p-7 border border-border-light flex flex-col">
            <QuoteMark />
            <p className="mt-4 text-base font-display text-text-primary leading-relaxed flex-1">
              {t("featured.text")}
            </p>
            <p className="mt-6 text-3xl font-display text-text-primary">
              {isUS ? t("featured.statValueUS") : t("featured.statValueEU")}
            </p>
            <p className="text-xs text-text-secondary">{t("featured.statLabel")}</p>
            <Byline
              author={t("featured.author")}
              org={t("featured.org")}
              avatarSrc="/images/testimonials/ady-avivi.jpg"
            />
          </blockquote>

          {/* AI for Good */}
          <blockquote className="min-w-[85%] sm:min-w-[55%] lg:min-w-0 snap-center bg-bg-secondary rounded-xl p-7 border border-border-light flex flex-col">
            <QuoteMark />
            <p className="mt-4 text-base font-display text-text-primary leading-relaxed flex-1">
              {t("summit.text")}
            </p>
            <Byline
              org={t("summit.org")}
              avatarSrc="/images/testimonials/ai-for-good.jpg"
            />
          </blockquote>

          {/* Channable */}
          <blockquote className="min-w-[85%] sm:min-w-[55%] lg:min-w-0 snap-center bg-bg-secondary rounded-xl p-7 border border-border-light flex flex-col">
            <QuoteMark />
            <div className="mt-4 flex-1 space-y-3">
              <p
                className={
                  "text-base font-display text-text-primary leading-relaxed" +
                  (channableExpanded ? "" : " line-clamp-[8]")
                }
              >
                {t("channable.text1")}
              </p>
              {channableExpanded && (
                <p className="text-base font-display text-text-primary leading-relaxed">
                  {t("channable.text2")}
                </p>
              )}
              <button
                onClick={() => setChannableExpanded((e) => !e)}
                className="text-sm text-text-secondary underline hover:no-underline"
              >
                {channableExpanded ? t("readLess") : t("readMore")}
              </button>
            </div>
            <Byline
              author={t("channable.author")}
              org={t("channable.org")}
              avatarSrc="/images/testimonials/johanna-feimanis.webp"
            />
          </blockquote>

          {/* Fontys */}
          <blockquote className="min-w-[85%] sm:min-w-[55%] lg:min-w-0 snap-center bg-bg-secondary rounded-xl p-7 border border-border-light flex flex-col">
            <QuoteMark />
            <p className="mt-4 text-base font-display text-text-primary leading-relaxed flex-1">
              {t("fontys.text")}
            </p>
            <Byline
              author={t("fontys.author")}
              org={t("fontys.org")}
              avatarSrc="/images/testimonials/latoya-dankers.jpg"
            />
          </blockquote>
        </div>
      </Container>
    </section>
  );
}
