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
    areaServed: [
      { "@type": "Country", name: "Netherlands" },
      { "@type": "Country", name: "Belgium" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "Italy" },
      { "@type": "Country", name: "United States" },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@poembooth.com",
      contactType: "customer service",
      availableLanguage: ["English", "Dutch", "German", "French", "Italian"],
    },
  };

  return <JsonLd data={organizationData} />;
}

interface ServiceJsonLdProps {
  locale: string;
  region: string;
  editionImages?: Array<string | undefined>;
}

export function ServiceJsonLd({ locale, region, editionImages }: ServiceJsonLdProps) {
  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Poem Booth — AI Photo Booth",
    alternateName:
      locale === "nl"
        ? "AI Photobooth verhuur"
        : locale === "de"
          ? "KI-Photobooth-Verleih"
          : locale === "fr"
            ? "Location photobooth IA"
            : locale === "it"
              ? "Noleggio photobooth AI"
              : "AI Photo Booth Hire",
    provider: {
      "@type": "Organization",
      name: "Poem Booth",
      url: "https://poembooth.com",
    },
    description:
      locale === "nl"
        ? "AI photobooth verhuur voor events, bruiloften en bedrijfsfeesten. Gasten ontvangen binnen 10–30 seconden een persoonlijk gedicht, AI-portret of comedy roast op basis van hun foto."
        : locale === "de"
          ? "KI-Photobooth-Verleih für Events, Hochzeiten und Firmenfeiern. Gäste erhalten innerhalb von 10–30 Sekunden ein persönliches Gedicht, KI-Portrait oder Comedy-Roast basierend auf ihrem Foto."
          : locale === "fr"
            ? "Location de photobooth IA pour événements, mariages et fêtes d'entreprise. Les invités reçoivent un poème personnalisé, un portrait IA ou un roast en 10–30 secondes à partir de leur photo."
            : locale === "it"
              ? "Noleggio photobooth AI per eventi, matrimoni e feste aziendali. Gli ospiti ricevono una poesia personalizzata, un ritratto AI o un roast in 10–30 secondi dalla loro foto."
              : "AI photo booth hire for events, weddings and corporate parties. Guests receive a personal poem, AI portrait or comedy roast within 10–30 seconds from their photo.",
    serviceType:
      locale === "nl"
        ? "AI Photobooth verhuur"
        : locale === "de"
          ? "KI-Photobooth-Verleih"
          : "AI Photo Booth Hire",
    areaServed: [
      { "@type": "Country", name: "Netherlands" },
      { "@type": "Country", name: "Belgium" },
      { "@type": "Country", name: "Germany" },
      { "@type": "Country", name: "France" },
      { "@type": "Country", name: "Italy" },
      { "@type": "Country", name: "United States" },
    ],
    offers: {
      "@type": "Offer",
      priceCurrency: region === "us" ? "USD" : "EUR",
      description:
        locale === "nl"
          ? "Prijs afhankelijk van locatie en aantal dagen. Neem contact op voor een offerte."
          : locale === "de"
            ? "Preis abhängig von Standort und Anzahl der Tage. Kontaktieren Sie uns für ein Angebot."
            : locale === "fr"
              ? "Prix selon localisation et nombre de jours. Contactez-nous pour un devis."
              : locale === "it"
                ? "Prezzo in base alla posizione e al numero di giorni. Contattateci per un preventivo."
                : "Price depends on location and number of days. Contact us for a quote.",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name:
        locale === "nl"
          ? "Edities"
          : locale === "de"
            ? "Editionen"
            : locale === "fr"
              ? "Éditions"
              : locale === "it"
                ? "Edizioni"
                : "Editions",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name:
              locale === "nl"
                ? "Poem Booth Originele Editie"
                : locale === "de"
                  ? "Poem Booth Original Edition"
                  : locale === "fr"
                    ? "Poem Booth Édition Originale"
                    : locale === "it"
                      ? "Poem Booth Edizione Originale"
                      : "Poem Booth Original Edition",
            description:
              locale === "nl"
                ? "AI-gegenereerd persoonlijk gedicht binnen 10 seconden op basis van een foto, gebaseerd op echte dichters."
                : locale === "de"
                  ? "KI-generiertes persönliches Gedicht innerhalb von 10 Sekunden basierend auf einem Foto, inspiriert von echten Dichtern."
                  : "AI-generated personal poem within 10 seconds based on a photo, inspired by real poets.",
            ...(editionImages?.[0]
              ? { image: { "@type": "ImageObject", url: editionImages[0] } }
              : {}),
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name:
              locale === "nl"
                ? "Poem Booth Portret Editie"
                : locale === "de"
                  ? "Poem Booth Porträt Edition"
                  : locale === "fr"
                    ? "Poem Booth Édition Portrait"
                    : locale === "it"
                      ? "Poem Booth Edizione Ritratto"
                      : "Poem Booth Portrait Edition",
            description:
              locale === "nl"
                ? "AI-gegenereerd kunstportret binnen 30 seconden op basis van een foto."
                : locale === "de"
                  ? "KI-generiertes Kunstporträt innerhalb von 30 Sekunden basierend auf einem Foto."
                  : "AI-generated art portrait within 30 seconds based on a photo.",
            ...(editionImages?.[1]
              ? { image: { "@type": "ImageObject", url: editionImages[1] } }
              : {}),
          },
        },
      ],
    },
  };

  return <JsonLd data={serviceData} />;
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

interface BreadcrumbItem {
  name: string;
  item: string;
}

interface BreadcrumbListJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbListJsonLd({ items }: BreadcrumbListJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };

  return <JsonLd data={data} />;
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
