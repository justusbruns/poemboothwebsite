interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface OrganizationJsonLdProps {
  locale: string;
}

export function OrganizationJsonLd({ locale }: OrganizationJsonLdProps) {
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Poem Booth",
    alternateName: "VOUW B.V.",
    url: "https://poembooth.com",
    logo: "https://poembooth.com/images/logo.png",
    description:
      locale === "nl"
        ? "De Poem Booth is een AI photobooth die persoonlijke gedichten en portretten maakt op events"
        : locale === "de"
          ? "Die Poem Booth ist eine KI-Photobooth, die personalisierte Gedichte und Porträts auf Events erstellt"
          : locale === "fr"
            ? "Le Poem Booth est un photobooth IA qui crée des poèmes et portraits personnalisés lors d'événements"
            : locale === "it"
              ? "Il Poem Booth è un photobooth AI che crea poesie e ritratti personalizzati agli eventi"
              : "The Poem Booth is an AI photo booth creating personalized poetry and portraits at events",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Generaal Vetterstraat 57",
      addressLocality: "Amsterdam",
      postalCode: "1059 BT",
      addressCountry: "NL",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@poembooth.com",
      contactType: "customer service",
      availableLanguage: ["English", "Dutch", "German", "French", "Italian"],
    },
  };

  return <JsonLd data={organizationData} />;
}

export function WebsiteJsonLd() {
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Poem Booth",
    url: "https://poembooth.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://poembooth.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={websiteData} />;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQPageJsonLdProps {
  items: FAQItem[];
}

export function FAQPageJsonLd({ items }: FAQPageJsonLdProps) {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <JsonLd data={faqData} />;
}
