import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function getSupabaseConfig() {
  const env = process.env.SUPABASE_ENV || "production";

  if (env === "staging") {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING;

    if (!url || !anonKey) {
      throw new Error("Missing Supabase staging environment variables");
    }

    return { url, anonKey };
  }

  // Production
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL_PROD;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase production environment variables");
  }

  return { url, anonKey };
}

export function createServerClient() {
  const config = getSupabaseConfig();
  return createClient<Database>(config.url, config.anonKey);
}

export async function getHubByRegion(regionCode: string): Promise<{
  id: string;
  name: string;
  region_code: string;
  currency: string | null;
  day_1_rate: number | null;
  day_2_rate: number | null;
  day_3_plus_rate: number | null;
  transport_rate_per_km: number | null;
  minimum_transport_fee: number | null;
  distance_unit: string | null;
} | null> {
  const supabase = createServerClient();

  // Map URL region codes to database region codes
  const regionMap: Record<string, string> = {
    nl: "nl", // Amsterdam hub
    us: "us", // New York hub
    row: "nl", // Rest of World uses Amsterdam hub pricing
  };
  const dbRegionCode = regionMap[regionCode.toLowerCase()] || regionCode.toLowerCase();

  const { data, error } = await supabase
    .from("hubs")
    .select(
      `
      id,
      name,
      region_code,
      currency,
      day_1_rate,
      day_2_rate,
      day_3_plus_rate,
      transport_rate_per_km,
      minimum_transport_fee,
      distance_unit
    `
    )
    .eq("region_code", dbRegionCode)
    .eq("is_active", true)
    .single();

  if (error) {
    // PGRST116 means no rows found - this is expected when hub data isn't set up yet
    if (error.code !== "PGRST116") {
      console.error("Error fetching hub:", error);
    }
    return null;
  }

  return data;
}
