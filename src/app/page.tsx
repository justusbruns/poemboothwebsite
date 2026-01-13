import { redirect } from "next/navigation";
import { defaultLocale, defaultRegion } from "@/i18n/routing";

// Root page redirects to default locale and region
export default function RootPage() {
  redirect(`/${defaultLocale}/${defaultRegion}`);
}
