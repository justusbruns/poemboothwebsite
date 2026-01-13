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
  openGraph: {
    title: "Poem Booth | From Moment to Masterpiece",
    description:
      "Transform any event into an unforgettable experience with AI-generated portraits and poetry.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
