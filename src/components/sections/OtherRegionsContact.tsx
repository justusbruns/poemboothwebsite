"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

interface OtherRegionsContactProps {
  contactEmail?: string;
}

export default function OtherRegionsContact({
  contactEmail: contactEmailProp,
}: OtherRegionsContactProps) {
  const t = useTranslations("otherRegions");
  const params = useParams();
  const region = params.region as string;
  const contactEmail = contactEmailProp || (region === "us" ? "jackie@poembooth.com" : "contact@poembooth.com");

  const mailtoSubject = encodeURIComponent(t("emailSubject"));
  const mailtoBody = encodeURIComponent(t("emailBody"));
  const mailtoLink = `mailto:${contactEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <section className="py-16 md:py-24 bg-bg-primary">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg-secondary mb-6">
            <svg
              className="w-8 h-8 text-text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-display text-text-primary mb-4">
            {t("title")}
          </h2>

          {/* Description */}
          <p className="text-lg text-text-secondary mb-8">
            {t("description")}
          </p>

          {/* CTA Button */}
          <Button href={mailtoLink} variant="outline" size="lg">
            {t("ctaButton")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
