// Kiosk terms are stored per-hub in the poemboothbooking Supabase (hubs.kiosk_terms)
// and exposed via a public, CORS-enabled endpoint backed by the get_hub_terms RPC.
// We resolve a hub id from the website region, then read its localized terms text.

const BOOKING_URL =
  process.env.NEXT_PUBLIC_BOOKING_URL?.replace(/\/$/, "") || "https://book.poembooth.com";

// Main hubs. Override per environment via env vars if needed.
const AMSTERDAM_HUB_ID =
  process.env.NEXT_PUBLIC_TERMS_HUB_ID || "5f250dd6-440c-40d2-b6a2-db4f30b28e19";
const NEW_YORK_HUB_ID =
  process.env.NEXT_PUBLIC_TERMS_HUB_ID_US || "2b6cff2a-7932-477d-88b2-5a2f7400b8da";

// Map URL region codes to the hub whose terms apply. US uses the New York hub;
// all EU/other regions use the Amsterdam (main) hub.
function getTermsHubId(region: string): string {
  return region.toLowerCase() === "us" ? NEW_YORK_HUB_ID : AMSTERDAM_HUB_ID;
}

type TermsContent = Partial<Record<"nl" | "en" | "de" | "fr" | "es" | "it", string>>;

interface TermsResponse {
  enabled?: boolean;
  content?: TermsContent;
}

export interface KioskTerms {
  enabled: boolean;
  // Resolved text for the requested locale (with English fallback), or null when
  // terms are disabled / not yet authored.
  text: string | null;
}

/**
 * Fetch the public kiosk terms for a region and resolve the best text for a locale.
 * Falls back to English, then any available language. Never throws.
 */
export async function getKioskTerms(region: string, locale: string): Promise<KioskTerms> {
  const hubId = getTermsHubId(region);
  try {
    const res = await fetch(`${BOOKING_URL}/api/public/hubs/${hubId}/terms`, {
      // Cache for 5 minutes; terms change rarely.
      next: { revalidate: 300 },
    });
    if (!res.ok) return { enabled: false, text: null };

    const data = (await res.json()) as TermsResponse;
    const content = data.content || {};

    if (!data.enabled) return { enabled: false, text: null };

    const text =
      content[locale as keyof TermsContent] ||
      content.en ||
      Object.values(content).find((v) => typeof v === "string" && v.trim().length > 0) ||
      null;

    return { enabled: true, text: text ?? null };
  } catch {
    return { enabled: false, text: null };
  }
}
