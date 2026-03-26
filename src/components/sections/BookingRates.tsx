"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { trackLeadIntent } from "@/lib/tracking";

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
  outdoorInstallationFee: number;
  imageStyleRate: number;
  baseStyleRate: number;
}

interface BookingRatesProps {
  hubPricing?: HubPricing;
  bookingUrl?: string;
}

type BoothType = "poem" | "portrait" | "roast";

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
  const [activeTab, setActiveTab] = useState<BoothType>("poem");

  const rawUrl = bookingUrl || process.env.NEXT_PUBLIC_BOOKING_URL || "https://book.poembooth.com";
  const baseUrl = rawUrl.replace(/\/+$/, "").split("/").slice(0, 3).join("/");
  const bookingHref = `${baseUrl}/${locale}/booking`;

  const currencySymbol = hubPricing?.currencySymbol || (isUS ? "$" : "€");
  const hubName = hubPricing?.hubName || (isUS ? "New York" : "Amsterdam");
  const distanceUnit = hubPricing?.transport.unit || (isUS ? "mi" : "km");

  const transportRate = hubPricing?.transport.ratePerUnit || (isUS ? 1.5 : 1);
  const day1Rate = hubPricing?.dayRates.day1 || (isUS ? 1200 : 950);
  const day2Rate = hubPricing?.dayRates.day2 || (isUS ? 1000 : 750);
  const day3Rate = hubPricing?.dayRates.day3Plus || (isUS ? 150 : 100);

  const outdoorInstallationFee = hubPricing?.outdoorInstallationFee || (isUS ? 300 : 250);
  const imageStyleRate = hubPricing?.imageStyleRate || (isUS ? 900 : 750);

  const printerRate = isUS ? 600 : 500;
  const brandingFee = isUS ? 900 : 750;
  const customizationFee = isUS ? 900 : 750;
  const roastBoothFee = isUS ? 425 : 350;
  const baseStyleRate = hubPricing?.baseStyleRate || (isUS ? 150 : 125);
  const languageFee = hubPricing?.baseStyleRate || (isUS ? 150 : 125);

  const tabs: { key: BoothType; label: string; description: string; startingFrom: number }[] = [
    {
      key: "poem",
      label: t("tabs.poem.label"),
      description: t("tabs.poem.description"),
      startingFrom: day1Rate,
    },
    {
      key: "portrait",
      label: t("tabs.portrait.label"),
      description: t("tabs.portrait.description"),
      startingFrom: day1Rate + baseStyleRate,
    },
    {
      key: "roast",
      label: t("tabs.roast.label"),
      description: t("tabs.roast.description"),
      startingFrom: day1Rate + roastBoothFee,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.key === activeTab)!;

  return (
    <section id="rates" className="py-16 md:py-24 bg-bg-secondary">
      <Container>
        <SectionHeading
          title={t("title")}
          subtitle={t("subtitle", { hub: hubName })}
        />

        <div className="mt-12 max-w-3xl mx-auto">
          {/* Booth Type Tabs */}
          <div className="flex rounded-xl bg-bg-primary border border-border-light p-1 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-3 px-4 rounded-lg text-sm md:text-base font-display transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-text-primary text-bg-primary shadow-sm"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Starting From Price */}
          <div className="text-center mb-8">
            <p className="text-sm text-text-secondary uppercase tracking-wide">
              {t("startingFrom")}
            </p>
            <p className="text-4xl md:text-5xl font-display text-text-primary mt-1">
              {formatPrice(activeTabData.startingFrom, currencySymbol)}
            </p>
            <p className="text-text-secondary mt-2 max-w-md mx-auto">
              {activeTabData.description}
            </p>
          </div>

          {/* Pricing Table */}
          <div className="bg-bg-primary rounded-2xl border border-border-light overflow-hidden divide-y divide-border-light">

            {/* Base Rental Fee */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-display text-text-primary">
                    {t("rental.title")}
                  </h3>
                </div>
                <div className="text-right space-y-2">
                  {activeTab === "roast" ? (
                    <>
                      <p className="text-lg text-text-primary">
                        {t("rental.day1Label")} {formatPrice(day1Rate + roastBoothFee, currencySymbol)}
                      </p>
                      <p className="text-lg text-text-primary">
                        {t("rental.day2Label")} {formatPrice(day2Rate, currencySymbol)}
                      </p>
                      <p className="text-lg text-text-primary">
                        {t("rental.day3Label")} {formatPrice(day3Rate, currencySymbol)}
                      </p>
                    </>
                  ) : activeTab === "portrait" ? (
                    <>
                      <p className="text-lg text-text-primary">
                        {t("rental.day1Label")} {formatPrice(day1Rate + baseStyleRate, currencySymbol)}
                      </p>
                      <p className="text-lg text-text-primary">
                        {t("rental.day2Label")} {formatPrice(day2Rate, currencySymbol)}
                      </p>
                      <p className="text-lg text-text-primary">
                        {t("rental.day3Label")} {formatPrice(day3Rate, currencySymbol)}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg text-text-primary">
                        {t("rental.day1Label")} {formatPrice(day1Rate, currencySymbol)}
                      </p>
                      <p className="text-lg text-text-primary">
                        {t("rental.day2Label")} {formatPrice(day2Rate, currencySymbol)}
                      </p>
                      <p className="text-lg text-text-primary">
                        {t("rental.day3Label")} {formatPrice(day3Rate, currencySymbol)}
                      </p>
                    </>
                  )}
                </div>
              </div>
              {activeTab === "roast" && (
                <p className="text-sm text-text-secondary mt-2">
                  {t("roastBooth.rentalNote")}
                </p>
              )}
              {activeTab === "portrait" && (
                <p className="text-sm text-text-secondary mt-2">
                  {t("portraitStyle.rentalNote")}
                </p>
              )}
            </div>

            {/* Optional Add-ons Header */}
            <div className="px-6 py-3 bg-bg-secondary">
              <p className="text-xs font-display text-text-secondary uppercase tracking-wide">
                {t("optionalAddons")}
              </p>
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

            {/* Extra Base Portrait Style - only for portrait tab */}
            {activeTab === "portrait" && (
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-display text-text-primary">
                      {t("portraitStyle.extraBaseTitle")}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">
                      {t("portraitStyle.extraBaseDescription")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-text-primary">
                      {formatPrice(baseStyleRate, currencySymbol)} {t("portraitStyle.perStyle")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Portrait Style - only for portrait tab */}
            {activeTab === "portrait" && (
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-display text-text-primary">
                      {t("portraitStyle.customTitle")}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">
                      {t("portraitStyle.customDescription")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-text-primary">
                      {formatPrice(imageStyleRate, currencySymbol)} {t("portraitStyle.flatFee")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Language - only for poem and roast */}
            {activeTab !== "portrait" && (
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-display text-text-primary">
                      {t("language.title")}
                    </h3>
                    <p className="text-sm text-text-secondary mt-1">
                      {t("language.description")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-text-primary">
                      {formatPrice(languageFee, currencySymbol)} {t("language.flatFee")}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Outdoor Installation */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-display text-text-primary">
                    {t("outdoorInstallation.title")}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {t("outdoorInstallation.description")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-text-primary">
                    {formatPrice(outdoorInstallationFee, currencySymbol)} {t("outdoorInstallation.flatFee")}
                  </p>
                </div>
              </div>
            </div>

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
                    {formatPrice(transportRate, currencySymbol)} {t("transport.perUnit", { unit: distanceUnit })}
                  </p>
                  <p className="text-sm text-text-muted mt-1">
                    {t("transport.note")}
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
              onClick={() => trackLeadIntent()}
            >
              {t("ctaButton")}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
