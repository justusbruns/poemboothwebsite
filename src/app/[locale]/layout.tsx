import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { locales, type Locale } from "@/i18n/routing";

// Body font - Inter from Google Fonts
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Get messages for the current locale - explicitly pass locale
  // to ensure correct messages are loaded with [locale]/[region] routing
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={inter.variable}>
      <body className="antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
