"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Image from "next/image";

interface HeroProps {
  heroImage?: string;
}

export default function Hero({ heroImage }: HeroProps) {
  const t = useTranslations("hero");
  const params = useParams();
  const region = params.region as string;
  const locale = params.locale as string;

  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://book.poembooth.com";
  const contactEmail = "contact@poembooth.com";

  return (
    <section className="pb-6 md:pb-8 bg-bg-secondary">
      <Container>
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-text-primary mb-4 leading-tight">
              {t("headline")}
            </h1>
            <p className="text-base md:text-lg text-text-secondary mb-6 max-w-xl">
              {t("subheadline")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                href={`${bookingUrl}?region=${region}&locale=${locale}`}
                variant="primary"
                size="lg"
              >
                {t("ctaButton")}
              </Button>
              <p className="text-text-muted text-sm self-center">
                {t("ctaEmail")}{" "}
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-text-primary hover:underline"
                >
                  {contactEmail}
                </a>
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 md:order-2 relative flex items-center justify-center">
            <div className="relative w-full h-[40vh] md:h-[55vh] rounded-2xl overflow-hidden">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt="Poem Booth - Transform your moment into art"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-text-muted">
                    <svg
                      className="w-24 h-24 mx-auto mb-4 opacity-50"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-sm">Hero Image</p>
                  </div>
                </div>
              )}
            </div>
            {/* Decorative frame effect */}
            <div className="absolute -inset-4 border-2 border-border rounded-3xl -z-10 opacity-50" />
          </div>
        </div>
      </Container>
    </section>
  );
}
