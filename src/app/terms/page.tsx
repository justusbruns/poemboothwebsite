import { redirect } from "next/navigation";
import { headers } from "next/headers";
import {
  countryToLocale,
  countryToRegion,
  defaultLocale,
  defaultRegion,
  locales,
  type Locale,
  type Region,
} from "@/i18n/routing";

// Stable public URL: poembooth.com/terms — detects the visitor's country/language
// and redirects to the localized terms page at /{locale}/{region}/terms.
export const dynamic = "force-dynamic";

// Parse the first usable language tag from an Accept-Language header.
function localeFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const tags = header
    .split(",")
    .map((part) => part.split(";")[0].trim().slice(0, 2).toLowerCase());
  for (const tag of tags) {
    if (locales.includes(tag as Locale)) return tag as Locale;
  }
  return null;
}

export default async function TermsRedirectPage() {
  const headerList = await headers();

  // Vercel injects the visitor's country as an uppercase ISO code.
  const country = (headerList.get("x-vercel-ip-country") || "").toUpperCase();

  let locale: Locale = defaultLocale;
  let region: Region = defaultRegion;

  if (country && countryToLocale[country]) {
    locale = countryToLocale[country];
    region = countryToRegion[country] || defaultRegion;
  } else {
    // No geo signal — fall back to the browser's preferred language.
    const fromLang = localeFromAcceptLanguage(headerList.get("accept-language"));
    if (fromLang) locale = fromLang;
  }

  redirect(`/${locale}/${region}/terms`);
}
