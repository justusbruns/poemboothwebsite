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
        ? "AI-gegenereerde portretten en poëzie voor evenementen"
        : locale === "de"
          ? "KI-generierte Porträts und Poesie für Veranstaltungen"
          : locale === "fr"
            ? "Portraits et poésie générés par IA pour événements"
            : locale === "it"
              ? "Ritratti e poesie generati dall'IA per eventi"
              : "AI-powered portrait and poetry generation for events",
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
