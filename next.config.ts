import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Image optimization for Sanity and Supabase
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // Experimental features
  experimental: {
    // Enable React Compiler for optimal performance (if available)
    // reactCompiler: true,
  },

  // Turbopack configuration (required for Next.js 16)
  turbopack: {},

  // Ensure server-side packages are bundled correctly
  serverExternalPackages: ["sanity", "@sanity/vision"],
};

export default withNextIntl(nextConfig);
