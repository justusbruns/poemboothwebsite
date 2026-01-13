"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./types";

function getSupabaseConfig() {
  // Client-side always uses the same env as configured
  // The actual URL is determined by the build-time env
  const env = process.env.NEXT_PUBLIC_SUPABASE_ENV || "production";

  if (env === "staging") {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING!,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING!,
    };
  }

  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL_PROD!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD!,
  };
}

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  if (!client) {
    const config = getSupabaseConfig();
    client = createBrowserClient<Database>(config.url, config.anonKey);
  }
  return client;
}
