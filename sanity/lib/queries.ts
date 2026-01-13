import { groq } from "next-sanity";

// Site Settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    logo {
      asset-> {
        _id,
        url
      }
    },
    contactEmail,
    bookingUrl
  }
`;

// Hero Section
export const heroQuery = groq`
  *[_type == "hero"][0] {
    headline,
    subheadline,
    ctaButtonText,
    ctaEmailText,
    heroImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      hotspot
    }
  }
`;

// Client Logos
export const clientLogosQuery = groq`
  *[_type == "clientLogo" && ($region in regionVisibility || "all" in regionVisibility)] | order(order asc) {
    _id,
    name,
    logo {
      asset-> {
        _id,
        url
      }
    }
  }
`;

// How It Works Steps
export const howItWorksStepsQuery = groq`
  *[_type == "howItWorksStep"] | order(stepNumber asc) {
    _id,
    stepNumber,
    title,
    description,
    icon {
      asset-> {
        _id,
        url
      }
    }
  }
`;

// Editions
export const editionsQuery = groq`
  *[_type == "edition" && ($region in regionVisibility || "all" in regionVisibility)] | order(order asc) {
    _id,
    title,
    slug,
    isNew,
    subtitle,
    duration,
    outputType,
    boothImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      hotspot
    },
    beforeImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      hotspot
    },
    afterImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      hotspot
    },
    beforeLabel,
    afterLabel
  }
`;

// Gallery Images
export const galleryImagesQuery = groq`
  *[_type == "galleryImage" && ($region in regionVisibility || "all" in regionVisibility)] | order(_createdAt desc)[0...20] {
    _id,
    image {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      hotspot
    },
    caption,
    eventName,
    editionType,
    featured
  }
`;

// Practicalities
export const practicalitiesQuery = groq`
  *[_type == "practicality"] | order(order asc) {
    _id,
    title,
    icon {
      asset-> {
        _id,
        url
      }
    },
    iconSvg,
    valueUS,
    valueEU,
    bullets
  }
`;

// Pricing Items
export const pricingItemsQuery = groq`
  *[_type == "pricingItem"] | order(order asc) {
    _id,
    title,
    descriptionUS,
    descriptionEU,
    priceUS,
    priceEU,
    note
  }
`;

// Booking Section
export const bookingSectionQuery = groq`
  *[_type == "bookingSection"][0] {
    title,
    ctaButtonText,
    footnote
  }
`;

// All page data in one query
export const pageDataQuery = groq`
{
  "siteSettings": *[_type == "siteSettings"][0] {
    logo {
      asset-> {
        _id,
        url
      }
    },
    contactEmail,
    bookingUrl
  },
  "hero": *[_type == "hero"][0] {
    headline,
    subheadline,
    ctaButtonText,
    ctaEmailText,
    heroImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      hotspot
    }
  },
  "clientLogos": *[_type == "clientLogo" && ($region in regionVisibility || "all" in regionVisibility)] | order(order asc) {
    _id,
    name,
    logo {
      asset-> {
        _id,
        url
      }
    }
  },
  "howItWorks": *[_type == "howItWorksStep"] | order(stepNumber asc) {
    _id,
    stepNumber,
    title,
    description,
    icon {
      asset-> {
        _id,
        url
      }
    }
  },
  "editions": *[_type == "edition" && ($region in regionVisibility || "all" in regionVisibility)] | order(order asc) {
    _id,
    title,
    slug,
    isNew,
    subtitle,
    duration,
    outputType,
    boothImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      hotspot
    },
    beforeImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      hotspot
    },
    afterImage {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      hotspot
    },
    beforeLabel,
    afterLabel
  },
  "gallery": *[_type == "galleryImage" && ($region in regionVisibility || "all" in regionVisibility)] | order(_createdAt desc)[0...20] {
    _id,
    image {
      asset-> {
        _id,
        url,
        metadata {
          lqip,
          dimensions
        }
      },
      hotspot
    },
    caption,
    eventName,
    editionType,
    featured
  },
  "practicalities": *[_type == "practicality"] | order(order asc) {
    _id,
    title,
    icon {
      asset-> {
        _id,
        url
      }
    },
    iconSvg,
    valueUS,
    valueEU,
    bullets
  },
  "pricingItems": *[_type == "pricingItem"] | order(order asc) {
    _id,
    title,
    descriptionUS,
    descriptionEU,
    priceUS,
    priceEU,
    note
  },
  "bookingSection": *[_type == "bookingSection"][0] {
    title,
    ctaButtonText,
    footnote
  },
  "footer": *[_type == "footer"][0] {
    contactEmail,
    instagramHandle,
    instagramUrl,
    adminCompany,
    adminStreet,
    adminCity,
    adminCountry,
    studioStreet,
    studioCity,
    studioCountry,
    vatNumber,
    chamberNumber
  }
}
`;
