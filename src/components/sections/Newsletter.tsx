"use client";

import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import NewsletterForm from "@/components/ui/NewsletterForm";

export default function Newsletter() {
  const t = useTranslations("newsletter");

  return (
    <section className="py-16 md:py-24 bg-bg-primary">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <SectionHeading
            title={t("title")}
            subtitle={t("subtitle")}
          />
          <div className="mt-8">
            <NewsletterForm variant="light" namespace="newsletter" />
          </div>
        </div>
      </Container>
    </section>
  );
}
