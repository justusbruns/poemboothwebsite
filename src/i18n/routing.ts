import { defineRouting } from "next-intl/routing";

export const locales = ["en", "nl", "de", "fr", "it"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Region configuration
export const regions = ["nl", "us", "row"] as const;
export type Region = (typeof regions)[number];

export const defaultRegion: Region = "nl";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});

// Country to locale mapping
export const countryToLocale: Record<string, Locale> = {
  US: "en",
  GB: "en",
  AU: "en",
  CA: "en",
  IE: "en",
  NL: "nl",
  BE: "nl", // Belgium - could also be French
  DE: "de",
  AT: "de",
  CH: "de",
  FR: "fr",
  IT: "it",
};

// Country to region mapping
export const countryToRegion: Record<string, Region> = {
  US: "us",
  NL: "nl",
  // All other countries default to Rest of World
};

// EU country codes (for reference)
export const euCountries = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE", "GB", "NO", "CH",
];

export function getLocaleFromCountry(country: string): Locale {
  return countryToLocale[country] || defaultLocale;
}

export function getRegionFromCountry(country: string): Region {
  if (country === "US") return "us";
  if (country === "NL") return "nl";
  return "row";
}
