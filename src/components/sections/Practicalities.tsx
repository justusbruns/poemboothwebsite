"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

interface Practicality {
  title: string;
  icon?: string;
  valueUS: string;
  valueEU: string;
  bullets?: string[];
}

interface PracticalitiesProps {
  items?: Practicality[];
}

const practicalityIcons = {
  footprint: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  ),
  setup: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  requirements: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  outdoor: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
      />
    </svg>
  ),
  speed: (
    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
};

export default function Practicalities({ items }: PracticalitiesProps) {
  const t = useTranslations("practicalities");
  const params = useParams();
  const region = params.region as string;
  const isUS = region === "us";

  const voltage = isUS ? "110V" : "230V";

  // Default items from translations
  const defaultItems: Practicality[] = [
    {
      title: t("footprint.title"),
      valueUS: t("footprint.valueUS"),
      valueEU: t("footprint.valueEU"),
    },
    {
      title: t("setup.title"),
      valueUS: t("setup.valueUS"),
      valueEU: t("setup.valueEU"),
      bullets: [
        t("setup.bullet1"),
      ],
    },
    {
      title: t("requirements.title"),
      valueUS: t("requirements.valueUS"),
      valueEU: t("requirements.valueEU"),
      bullets: [
        t("requirements.bullet1", { voltage }),
        t("requirements.bullet2"),
      ],
    },
    {
      title: t("outdoor.title"),
      valueUS: t("outdoor.valueUS"),
      valueEU: t("outdoor.valueEU"),
      bullets: [t("outdoor.bullet1")],
    },
    {
      title: t("speed.title"),
      valueUS: t("speed.valueUS"),
      valueEU: t("speed.valueEU"),
      bullets: [
        t("speed.bullet1"),
        t("speed.bullet2"),
      ],
    },
  ];

  const displayItems = items || defaultItems;

  const getIcon = (index: number) => {
    const iconKeys = ["footprint", "setup", "requirements", "outdoor", "speed"];
    return practicalityIcons[iconKeys[index] as keyof typeof practicalityIcons];
  };

  return (
    <section className="py-16 md:py-24 bg-bg-accent">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {displayItems.map((item, index) => (
            <div
              key={index}
              className="bg-bg-primary rounded-xl p-6 border border-border-light"
            >
              {/* Icon */}
              <div className="text-text-primary mb-4">
                {getIcon(index)}
              </div>

              {/* Title */}
              <h3 className="text-lg font-display text-text-primary mb-2">
                {item.title}
              </h3>

              {/* Value (regional) */}
              <p className="text-2xl font-display text-text-primary mb-2">
                {isUS ? item.valueUS : item.valueEU}
              </p>

              {/* Bullets */}
              {item.bullets && item.bullets.length > 0 && (
                <ul className="text-sm text-text-secondary space-y-1">
                  {item.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start gap-2">
                      <span className="text-text-muted">•</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
