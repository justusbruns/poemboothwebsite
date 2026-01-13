export { cn } from "./cn";

export function formatCurrency(
  amount: number,
  currency: string,
  locale: string
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getLocalizedValue<T extends Record<string, string>>(
  obj: T | undefined | null,
  locale: string
): string {
  if (!obj) return "";
  // Try the exact locale first, then English as fallback
  return obj[locale] || obj.en || Object.values(obj)[0] || "";
}
