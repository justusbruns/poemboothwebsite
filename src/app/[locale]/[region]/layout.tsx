import { notFound } from "next/navigation";
import { regions, type Region } from "@/i18n/routing";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";

interface RegionLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; region: string }>;
}

export default async function RegionLayout({
  children,
  params,
}: RegionLayoutProps) {
  const { region, locale } = await params;

  // Validate region
  if (!regions.includes(region as Region)) {
    notFound();
  }

  return (
    <div data-region={region} className="min-h-screen">
      <AnalyticsProvider region={region} locale={locale}>
        {children}
      </AnalyticsProvider>
    </div>
  );
}

export function generateStaticParams() {
  return regions.map((region) => ({ region }));
}
