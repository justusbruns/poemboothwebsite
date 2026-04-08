"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { trackLeadIntent } from "@/lib/tracking";

interface HubExtra {
  extra_id: string;
  rate: number;
  daily_rate: boolean;
  visible: boolean;
  booth_types: string[] | null;
  name: string;
  description: string | null;
  name_en?: string;
  name_nl?: string;
  name_de?: string;
  name_fr?: string;
  name_it?: string;
  description_en?: string;
  description_nl?: string;
  description_de?: string;
  description_fr?: string;
  description_it?: string;
}

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
  additionalLanguageRate: number;
  extras: HubExtra[];
}

interface BookingRatesProps {
  hubPricing?: HubPricing;
  bookingUrl?: string;
  portraitStyleImages?: string[];
}

type BoothType = "poem" | "portrait" | "roast";

function formatPrice(amount: number, symbol: string): string {
  if (amount === 0) return "—";
  return `${symbol}${amount.toLocaleString()}`;
}

function getLocalizedField(
  extra: HubExtra,
  field: "name" | "description",
  locale: string
): string {
  const localeKey = `${field}_${locale}` as keyof HubExtra;
  const enKey = `${field}_en` as keyof HubExtra;
  return (
    (extra[localeKey] as string) ||
    (extra[enKey] as string) ||
    (extra[field] as string) ||
    ""
  );
}

function PriceRow({
  title,
  description,
  price,
}: {
  title: string;
  description?: string;
  price: string;
}) {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-display text-text-primary">{title}</h3>
          {description && (
            <p className="text-sm text-text-secondary mt-1">{description}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg text-text-primary">{price}</p>
        </div>
      </div>
    </div>
  );
}

function VisualAddonCard({
  title,
  description,
  price,
  imageSrc,
  rotation,
}: {
  title: string;
  description?: string;
  price: string;
  imageSrc: string;
  rotation?: number;
}) {
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div
          className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-lg"
          style={{ transform: `rotate(${rotation || -2}deg)`, width: 220, height: 220 }}
        >
          <Image
            src={imageSrc}
            alt={title}
            fill
            className="object-cover"
            sizes="220px"
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl font-display text-text-primary">{title}</h3>
          {description && (
            <p className="text-sm text-text-secondary mt-2 leading-relaxed">{description}</p>
          )}
          <p className="text-lg font-display text-text-primary mt-3">{price}</p>
        </div>
      </div>
    </div>
  );
}

function StyleFan({ images }: { images: string[] }) {
  const angles = [-12, -6, 0, 6, 12];
  const shown = images.slice(0, 5);
  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
      {shown.map((url, i) => (
        <div
          key={i}
          className="absolute rounded-lg overflow-hidden shadow-md border-2 border-white"
          style={{
            width: 90,
            height: 120,
            transform: `rotate(${angles[i]}deg) translateY(${Math.abs(angles[i]) * 0.8}px)`,
            zIndex: i,
            left: `${50 + (i - Math.floor(shown.length / 2)) * 22}px`,
            top: 40,
          }}
        >
          <Image
            src={url}
            alt=""
            fill
            className="object-cover"
            sizes="90px"
            unoptimized
          />
        </div>
      ))}
    </div>
  );
}

export default function BookingRates({
  hubPricing,
  bookingUrl,
  portraitStyleImages,
}: BookingRatesProps) {
  const t = useTranslations("booking");
  const params = useParams();
  const region = params.region as string;
  const locale = params.locale as string;
  const isUS = region === "us";
  const [activeTab, setActiveTab] = useState<BoothType>("poem");

  const rawUrl =
    bookingUrl ||
    process.env.NEXT_PUBLIC_BOOKING_URL ||
    "https://book.poembooth.com";
  const baseUrl = rawUrl
    .replace(/\/+$/, "")
    .split("/")
    .slice(0, 3)
    .join("/");
  const bookingHref = `${baseUrl}/${locale}/booking`;

  const currencySymbol = hubPricing?.currencySymbol || (isUS ? "$" : "€");
  const hubName = hubPricing?.hubName || (isUS ? "New York" : "Amsterdam");
  const distanceUnit = hubPricing?.transport.unit || (isUS ? "mi" : "km");

  const transportRate =
    hubPricing?.transport.ratePerUnit || (isUS ? 1.5 : 1);
  const transportMin = hubPricing?.transport.minimumFee || (isUS ? 75 : 50);
  const day1Rate = hubPricing?.dayRates.day1 || (isUS ? 1200 : 950);
  const day2Rate = hubPricing?.dayRates.day2 || (isUS ? 1000 : 750);
  const day3Rate = hubPricing?.dayRates.day3Plus || (isUS ? 150 : 100);
  const outdoorFee =
    hubPricing?.outdoorInstallationFee || (isUS ? 300 : 100);
  const imageStyleRate =
    hubPricing?.imageStyleRate || (isUS ? 150 : 125);
  const languageRate =
    hubPricing?.additionalLanguageRate || (isUS ? 150 : 125);

  // Get extras from hub pricing
  const extras = hubPricing?.extras || [];

  // Helper to find an extra and check if it applies to a booth type
  function getExtra(extraId: string, boothType: BoothType): HubExtra | null {
    const extra = extras.find((e) => e.extra_id === extraId && e.visible);
    if (!extra) return null;
    if (
      extra.booth_types &&
      extra.booth_types.length > 0 &&
      !extra.booth_types.includes(boothType) &&
      !extra.booth_types.includes("all")
    ) {
      return null;
    }
    return extra;
  }

  // Roast fee from extras
  const roastExtra = extras.find((e) => e.extra_id === "roast_booth");
  const roastFee = roastExtra?.rate || (isUS ? 425 : 350);

  const tabs: {
    key: BoothType;
    label: string;
    description: string;
    startingFrom: number;
  }[] = [
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
      startingFrom: day1Rate + imageStyleRate,
    },
    {
      key: "roast",
      label: t("tabs.roast.label"),
      description: t("tabs.roast.description"),
      startingFrom: day1Rate + roastFee,
    },
  ];

  const activeTabData = tabs.find((tab) => tab.key === activeTab)!;

  // Build add-ons list per booth type
  const brandingExtra = getExtra("custom_branding", activeTab);
  const productPlacementExtra = getExtra("product_placement", activeTab);
  const themeExtra = getExtra("custom_theme", activeTab);
  const digitalExtra = getExtra("digital_package", activeTab);
  const printingExtra = getExtra("poetry_printing", activeTab);

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
                  {activeTab === "portrait" && (
                    <p className="text-sm text-text-secondary mt-1">
                      {t("portrait.rentalNote")}
                    </p>
                  )}
                  {activeTab === "roast" && (
                    <p className="text-sm text-text-secondary mt-1">
                      {t("roast.rentalNote")}
                    </p>
                  )}
                </div>
                <div className="text-right space-y-2">
                  <p className="text-lg text-text-primary">
                    {t("rental.day1Label")}{" "}
                    {formatPrice(
                      activeTab === "roast"
                        ? day1Rate + roastFee
                        : activeTab === "portrait"
                          ? day1Rate + imageStyleRate
                          : day1Rate,
                      currencySymbol
                    )}
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

            {/* Optional Add-ons Header */}
            <div className="px-6 py-4 bg-bg-secondary">
              <p className="text-sm font-display text-text-primary uppercase tracking-wide">
                {t("optionalAddons")}
              </p>
            </div>

            {/* === Visual add-ons (with images) === */}

            {/* Branding - for poem and roast */}
            {brandingExtra && (
              <VisualAddonCard
                title={getLocalizedField(brandingExtra, "name", locale)}
                description={getLocalizedField(brandingExtra, "description", locale)}
                price={`${formatPrice(brandingExtra.rate, currencySymbol)}`}
                imageSrc="/images/addons/branding-poem.png"
                rotation={-2}
              />
            )}

            {/* Product Placement - for portrait */}
            {productPlacementExtra && (
              <VisualAddonCard
                title={getLocalizedField(productPlacementExtra, "name", locale)}
                description={getLocalizedField(productPlacementExtra, "description", locale)}
                price={`${formatPrice(productPlacementExtra.rate, currencySymbol)}`}
                imageSrc="/images/addons/product-placement.png"
                rotation={2}
              />
            )}

            {/* Thematic Content - visual for portrait */}
            {themeExtra && activeTab === "portrait" && (
              <VisualAddonCard
                title={getLocalizedField(themeExtra, "name", locale)}
                description={t("thematic.portraitDescription")}
                price={`${formatPrice(themeExtra.rate, currencySymbol)}`}
                imageSrc="/images/addons/custom-style-portrait.png"
                rotation={-1}
              />
            )}

            {/* Extra Portrait Style - fan of cards */}
            {activeTab === "portrait" && portraitStyleImages && portraitStyleImages.length > 0 && (
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="flex-shrink-0">
                    <StyleFan images={portraitStyleImages} />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-display text-text-primary">{t("extraStyle.title")}</h3>
                    <p className="text-sm text-text-secondary mt-2 leading-relaxed">{t("extraStyle.description")}</p>
                    <p className="text-lg font-display text-text-primary mt-3">{formatPrice(imageStyleRate, currencySymbol)} / {t("extraStyle.perStyle")}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Printer */}
            {printingExtra && (
              <VisualAddonCard
                title={getLocalizedField(printingExtra, "name", locale)}
                description={getLocalizedField(printingExtra, "description", locale)}
                price={`${formatPrice(printingExtra.rate, currencySymbol)} / ${t("printer.perDay")}`}
                imageSrc="/images/addons/printing.png"
                rotation={-1.5}
              />
            )}

            {/* Outdoor Installation */}
            <VisualAddonCard
              title={t("outdoorInstallation.title")}
              description={t("outdoorInstallation.description")}
              price={`${formatPrice(outdoorFee, currencySymbol)}`}
              imageSrc="/images/addons/outdoor.jpg"
              rotation={1.5}
            />

            {/* === Text-only add-ons === */}

            {/* Thematic Content - text for poem/roast */}
            {themeExtra && activeTab !== "portrait" && (
              <PriceRow
                title={getLocalizedField(themeExtra, "name", locale)}
                description={
                  activeTab === "roast"
                    ? t("thematic.roastDescription")
                    : t("thematic.poemDescription")
                }
                price={`${formatPrice(themeExtra.rate, currencySymbol)}`}
              />
            )}

            {/* Extra Portrait Style fallback */}
            {activeTab === "portrait" && (!portraitStyleImages || portraitStyleImages.length === 0) && (
              <PriceRow
                title={t("extraStyle.title")}
                description={t("extraStyle.description")}
                price={`${formatPrice(imageStyleRate, currencySymbol)} / ${t("extraStyle.perStyle")}`}
              />
            )}

            {/* Additional Language - poem and roast only */}
            {activeTab !== "portrait" && (
              <PriceRow
                title={t("language.title")}
                description={t("language.description")}
                price={`${formatPrice(languageRate, currencySymbol)} / ${t("language.flatFee")}`}
              />
            )}

            {/* Digital Package */}
            {digitalExtra && (
              <PriceRow
                title={getLocalizedField(digitalExtra, "name", locale)}
                description={getLocalizedField(digitalExtra, "description", locale)}
                price={`${formatPrice(digitalExtra.rate, currencySymbol)}`}
              />
            )}

            {/* Transport Rate */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-display text-text-primary">
                    {t("transport.title")}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {t("transport.minimumNote", {
                      minimum: formatPrice(transportMin, currencySymbol),
                    })}
                  </p>
                  <p className="text-sm text-text-secondary mt-1">
                    {t("transport.multiDayNote")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg text-text-primary">
                    {formatPrice(transportRate, currencySymbol)}{" "}
                    {t("transport.perUnit", { unit: distanceUnit })}
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
              href={`${bookingHref}?boothType=${activeTab}`}
              variant="primary"
              size="lg"
              onClick={() => trackLeadIntent()}
            >
              {t("ctaButton")}
            </Button>
            <p className="mt-4 text-sm text-text-secondary">
              {t("orMailUs")}{" "}
              <a
                href="mailto:contact@poembooth.com"
                className="text-text-primary underline hover:no-underline"
              >
                contact@poembooth.com
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
