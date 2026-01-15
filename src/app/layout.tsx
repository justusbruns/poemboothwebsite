import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Poem Booth | From Moment to Masterpiece",
    template: "%s | Poem Booth",
  },
  description:
    "Transform any event into an unforgettable experience with AI-generated portraits and poetry.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://poembooth.com"
  ),
  icons: {
    icon: [
      { url: "/images/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Poem Booth | From Moment to Masterpiece",
    description:
      "Transform any event into an unforgettable experience with AI-generated portraits and poetry.",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Poem Booth - From Moment to Masterpiece",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
