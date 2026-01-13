"use client";

import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Image from "next/image";
import { urlFor } from "../../../sanity/lib/image";

interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

interface Edition {
  title: string;
  slug: string;
  isNew?: boolean;
  subtitle: string;
  duration: number;
  outputType: "portrait" | "poem";
  boothImage?: SanityImage | string;
  beforeImage?: SanityImage | string;
  afterImage?: SanityImage | string;
  beforeLabel: string;
  afterLabel: string;
}

interface EditionShowcaseProps {
  editions?: Edition[];
}

function getImageUrl(image: SanityImage | string | undefined): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  return urlFor(image).width(800).height(1000).url();
}

export default function EditionShowcase({ editions }: EditionShowcaseProps) {
  const t = useTranslations("editions");

  // Default editions from translations
  const defaultEditions: Edition[] = [
    {
      title: t("portrait.title"),
      slug: "portrait",
      isNew: true,
      subtitle: t("portrait.subtitle"),
      duration: 30,
      outputType: "portrait",
      beforeLabel: t("portrait.beforeLabel"),
      afterLabel: t("portrait.afterLabel"),
    },
    {
      title: t("original.title"),
      slug: "original",
      isNew: false,
      subtitle: t("original.subtitle"),
      duration: 10,
      outputType: "poem",
      beforeLabel: t("original.beforeLabel"),
      afterLabel: t("original.afterLabel"),
    },
  ];

  const displayEditions = editions || defaultEditions;

  return (
    <section className="py-16 md:py-24 bg-bg-secondary">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-12 space-y-16 md:space-y-24">
          {displayEditions.map((edition) => {
            const beforeUrl = getImageUrl(edition.beforeImage);
            const afterUrl = getImageUrl(edition.afterImage);
            const boothUrl = getImageUrl(edition.boothImage);

            return (
              <div
                key={edition.slug}
                className="bg-bg-primary rounded-3xl overflow-hidden shadow-lg border border-border-light"
              >
                {/* Edition Header */}
                <div className="p-8 md:p-12 text-center border-b border-border-light">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    {edition.isNew && (
                      <span className="px-3 py-1 bg-text-primary text-bg-primary text-sm font-medium rounded-full">
                        {t("newBadge")}
                      </span>
                    )}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-display text-text-primary mb-4">
                    {edition.title}
                  </h3>
                  <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                    {edition.subtitle}
                  </p>
                  <p className="text-sm text-text-muted mt-3">
                    {t("duration", { seconds: edition.duration })}
                  </p>
                </div>

                {/* Booth Showcase */}
                <div className="p-8 md:p-12 bg-gradient-to-b from-bg-secondary/50 to-bg-primary">
                  {/* Main booth image with screens */}
                  {boothUrl ? (
                    <div className="relative max-w-4xl mx-auto">
                      <Image
                        src={boothUrl}
                        alt={`${edition.title} Booth`}
                        width={1200}
                        height={800}
                        className="w-full h-auto rounded-2xl"
                      />
                    </div>
                  ) : (
                    /* Fallback: simulated booth display with before/after screens */
                    <div className="max-w-4xl mx-auto">
                      {/* Booth frame simulation */}
                      <div className="relative bg-text-primary rounded-3xl p-6 md:p-10 shadow-2xl">
                        {/* Top bar (simulating booth header) */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-text-primary px-6 py-2 rounded-full">
                          <span className="text-white text-sm font-medium tracking-wider">POEM BOOTH</span>
                        </div>

                        {/* Screens container */}
                        <div className="grid grid-cols-2 gap-4 md:gap-8">
                          {/* Input screen (before) */}
                          <div className="space-y-4">
                            <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-bg-primary shadow-inner">
                              {beforeUrl ? (
                                <Image
                                  src={beforeUrl}
                                  alt={edition.beforeLabel}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-bg-secondary flex items-center justify-center mb-4">
                                    <svg
                                      className="w-8 h-8 md:w-10 md:h-10 text-text-muted"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                      />
                                    </svg>
                                  </div>
                                  <span className="text-text-muted text-sm">Your photo here</span>
                                </div>
                              )}
                            </div>
                            <p className="text-white text-sm md:text-base text-center font-medium">
                              {edition.beforeLabel}
                            </p>
                          </div>

                          {/* Output screen (after) */}
                          <div className="space-y-4">
                            <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-bg-primary shadow-inner">
                              {afterUrl ? (
                                <Image
                                  src={afterUrl}
                                  alt={edition.afterLabel}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-bg-secondary flex items-center justify-center mb-4">
                                    {edition.outputType === "portrait" ? (
                                      <svg
                                        className="w-8 h-8 md:w-10 md:h-10 text-text-muted"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={1.5}
                                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                      </svg>
                                    ) : (
                                      <svg
                                        className="w-8 h-8 md:w-10 md:h-10 text-text-muted"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={1.5}
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                      </svg>
                                    )}
                                  </div>
                                  <span className="text-text-muted text-sm">
                                    {edition.outputType === "portrait" ? "Your portrait here" : "Your poem here"}
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-white text-sm md:text-base text-center font-medium">
                              {edition.afterLabel}
                            </p>
                          </div>
                        </div>

                        {/* Arrow between screens */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 md:w-8 md:h-8 text-text-primary"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
