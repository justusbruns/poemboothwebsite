import { notFound } from "next/navigation";
import { regions, type Region } from "@/i18n/routing";

interface RegionLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string; region: string }>;
}

export default async function RegionLayout({
  children,
  params,
}: RegionLayoutProps) {
  const { region } = await params;

  // Validate region
  if (!regions.includes(region as Region)) {
    notFound();
  }

  return (
    <div data-region={region} className="min-h-screen">
      {children}
    </div>
  );
}

export function generateStaticParams() {
  return regions.map((region) => ({ region }));
}
