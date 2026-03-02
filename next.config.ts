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

  // Turbopack — alias hls.js to its CJS dist because the .mjs file is absent
  // from the published package (exports map references a non-existent hls.mjs)
  turbopack: {
    resolveAlias: {
      "hls.js": "hls.js/dist/hls.js",
    },
  },

  // Webpack alias for the same reason (used with --webpack flag or older Next)
  webpack: (config) => {
    config.resolve.alias["hls.js"] = require.resolve("hls.js/dist/hls.js");
    return config;
  },

  // Ensure server-side packages are bundled correctly
  serverExternalPackages: ["sanity", "@sanity/vision"],
};

export default withNextIntl(nextConfig);
