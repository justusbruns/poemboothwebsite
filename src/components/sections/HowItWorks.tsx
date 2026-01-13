"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { urlFor } from "../../../sanity/lib/image";

interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

interface Step {
  stepNumber: number;
  title: string;
  description: string;
  icon?: SanityImage;
}

interface HowItWorksProps {
  steps?: Step[];
}

// Fallback icons when no CMS image is provided
const FallbackIcons = [
  // Camera icon for "Press & Pose"
  <svg key="1" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>,
  // Sparkles icon for "Get your Art"
  <svg key="2" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>,
  // Share icon for "Share"
  <svg key="3" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>,
];

export default function HowItWorks({ steps }: HowItWorksProps) {
  const t = useTranslations("howItWorks");

  // Use translation keys as default if no steps provided from Sanity
  const defaultSteps: Step[] = [
    {
      stepNumber: 1,
      title: t("step1.title"),
      description: t("step1.description"),
    },
    {
      stepNumber: 2,
      title: t("step2.title"),
      description: t("step2.description"),
    },
    {
      stepNumber: 3,
      title: t("step3.title"),
      description: t("step3.description"),
    },
  ];

  const displaySteps = steps || defaultSteps;

  return (
    <section className="py-16 md:py-24 bg-bg-primary">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-12 grid md:grid-cols-3 gap-8 md:gap-12">
          {displaySteps.map((step, index) => (
            <div key={step.stepNumber} className="text-center">
              {/* Step number badge */}
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-text-primary text-bg-primary text-sm font-medium mb-6">
                {step.stepNumber}
              </div>

              {/* Image or fallback icon */}
              <div className="flex justify-center mb-6">
                {step.icon ? (
                  <div className="relative w-[204px]">
                    <Image
                      src={urlFor(step.icon).width(408).url()}
                      alt={step.title}
                      width={204}
                      height={204}
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-[204px] h-[204px] text-text-primary">
                    {FallbackIcons[index]}
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="text-xl font-display text-text-primary mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-text-secondary">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
