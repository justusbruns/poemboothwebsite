"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

interface HubPricing {
  hubName: string;
  currency: string;
  currencySymbol: string;
  dayRates: {
    day1: number;
    day2: number;
    day3Plus: number;
  };
  transport: {
    minimumFee: number;
    ratePerUnit: number;
    unit: "km" | "mi";
  };
}

interface BookingRatesProps {
  hubPricing?: HubPricing;
  bookingUrl?: string;
}

function formatPrice(amount: number, symbol: string): string {
  if (amount === 0) return "—";
  return `${symbol}${amount.toLocaleString()}`;
}

export default function BookingRates({ hubPricing, bookingUrl }: BookingRatesProps) {
  const t = useTranslations("booking");
  const params = useParams();
  const region = params.region as string;
  const locale = params.locale as string;
  const isUS = region === "us";

  const baseUrl = bookingUrl || process.env.NEXT_PUBLIC_BOOKING_URL || "https://book.poembooth.com";
  const bookingHref = `${baseUrl}/${locale}/booking`;

  // Get currency symbol and default hub name based on region
  const currencySymbol = hubPricing?.currencySymbol || (isUS ? "$" : "€");
  const hubName = hubPricing?.hubName || (isUS ? "New York" : "Amsterdam");
  const distanceUnit = hubPricing?.transport.unit || (isUS ? "mi" : "km");

  // Get rates from Supabase or fallbacks
  const transportRate = hubPricing?.transport.ratePerUnit || (isUS ? 1.5 : 1);
  const day1Rate = hubPricing?.dayRates.day1 || (isUS ? 1200 : 950);
  const day2Rate = hubPricing?.dayRates.day2 || (isUS ? 1000 : 750);
  const day3Rate = hubPricing?.dayRates.day3Plus || (isUS ? 150 : 100);

  // Static rates (not in Supabase)
  const printerRate = isUS ? 600 : 500;
  const brandingFee = isUS ? 900 : 750;
  const customizationFee = isUS ? 900 : 750;

  return (
    <section className="py-16 md:py-24 bg-bg-secondary">
      <Container>
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle", { hub: hubName })}
        />

        <div className="mt-12 max-w-3xl mx-auto">
          {/* Pricing Table */}
          <div className="bg-bg-primary rounded-2xl border border-border-light overflow-hidden divide-y divide-border-light">

            {/* Transport Rate */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-display text-text-primary">
                    {t("transport.title")}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-lg text-text-primary">
                    {formatPrice(transportRate, currencySymbol)} per driven {distanceUnit}
                  </p>
                  <p className="text-sm text-text-muted mt-1">
                    {t("transport.note")}
                  </p>
                </div>
              </div>
            </div>

            {/* Base Rental Fee - Shows all 3 tiers */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-display text-text-primary">
                    {t("rental.title")}
                  </h3>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-lg text-text-primary">
                    {t("rental.day1Label")} {formatPrice(day1Rate, currencySymbol)}
                  </p>
                  <p className="text-lg text-text-primary">
                    {t("rental.day2Label")} {formatPrice(day2Rate, currencySymbol)}
                  </p>
                  <p className="text-lg text-text-primary">
                    {t("rental.day3Label")} {formatPrice(day3Rate, currencySymbol)}
                  </p>
                </div>
              </div>
            </div>

            {/* Printer */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-display text-text-primary">
                    {t("printer.title")}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-lg text-text-primary">
                    {formatPrice(printerRate, currencySymbol)} {t("printer.perDay")}
                  </p>
                </div>
              </div>
            </div>

            {/* Branding */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-display text-text-primary">
                    {t("branding.title")}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {t("branding.description")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-text-primary">
                    {formatPrice(brandingFee, currencySymbol)} {t("branding.flatFee")}
                  </p>
                </div>
              </div>
            </div>

            {/* Customization */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-display text-text-primary">
                    {t("customization.title")}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {t("customization.description")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-text-primary">
                    {formatPrice(customizationFee, currencySymbol)} {t("customization.flatFee")}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Footnote */}
          <p className="text-sm text-text-muted text-center mt-6">
            {t("footnote")}
          </p>

          {/* CTA Button */}
          <div className="mt-8 text-center">
            <Button
              href={bookingHref}
              variant="primary"
              size="lg"
            >
              {t("ctaButton")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
