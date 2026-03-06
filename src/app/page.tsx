import { redirect } from "next/navigation";
import { defaultLocale, defaultRegion } from "@/i18n/routing";

interface RootPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Root page redirects to default locale and region, forwarding UTM/query params
export default async function RootPage({ searchParams }: RootPageProps) {
  const params = await searchParams;
  const qs = new URLSearchParams(
    Object.entries(params).flatMap(([k, v]) =>
      Array.isArray(v) ? v.map((val) => [k, val]) : typeof v === "string" ? [[k, v]] : []
    )
  ).toString();
  redirect(`/${defaultLocale}/${defaultRegion}${qs ? `?${qs}` : ""}`);
}
