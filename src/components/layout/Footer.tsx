"use client";

import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import Image from "next/image";
import Link from "next/link";

interface FooterData {
  contactEmail?: string;
  instagramHandle?: string;
  instagramUrl?: string;
  adminCompany?: string;
  adminStreet?: string;
  adminCity?: string;
  adminCountry?: string;
  studioStreet?: string;
  studioCity?: string;
  studioCountry?: string;
  vatNumber?: string;
  chamberNumber?: string;
}

interface FooterProps {
  footerData?: FooterData;
  logo?: string;
}

export default function Footer({ footerData, logo }: FooterProps) {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  // Use Sanity data with translation fallbacks
  const contactEmail = footerData?.contactEmail || "contact@poembooth.com";
  const instagramHandle = footerData?.instagramHandle || "@poembooth.ai";
  const instagramUrl = footerData?.instagramUrl || "https://instagram.com/poembooth.ai";
  const adminCompany = footerData?.adminCompany || t("adminCompany");
  const adminStreet = footerData?.adminStreet || t("adminStreet");
  const adminCity = footerData?.adminCity || t("adminCity");
  const adminCountry = footerData?.adminCountry || t("adminCountry");
  const studioStreet = footerData?.studioStreet || t("studioStreet");
  const studioCity = footerData?.studioCity || t("studioCity");
  const studioCountry = footerData?.studioCountry || t("studioCountry");
  const vatNumber = footerData?.vatNumber || "NL861856703B01";
  const chamberNumber = footerData?.chamberNumber || "80932932";

  return (
    <footer className="bg-text-primary text-white">
      {/* Main Footer Content */}
      <div className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1: Logo & Description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                {logo && (
                  <Image
                    src={logo}
                    alt="Poem Booth"
                    width={40}
                    height={40}
                    className="invert"
                  />
                )}
                <span className="text-xl font-semibold">Poem Booth</span>
              </div>
              <p className="text-sm text-white/70">
                {t("tagline")}
              </p>
              <p className="text-sm text-white/60 leading-relaxed">
                {t("vouwDescription")}
              </p>
            </div>

            {/* Column 2: Addresses */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                {t("addresses")}
              </h3>

              {/* Admin Address */}
              <div className="space-y-1">
                <p className="text-sm text-white/70">{t("adminAddress")}</p>
                <p className="text-sm text-white/90">{adminCompany}</p>
                <p className="text-sm text-white/90">{adminStreet}</p>
                <p className="text-sm text-white/90">{adminCity}</p>
                <p className="text-sm text-white/90">{adminCountry}</p>
              </div>

              {/* Studio Address */}
              <div className="space-y-1 pt-2">
                <p className="text-sm text-white/70">{t("studioAddress")}</p>
                <p className="text-sm text-white/90">{studioStreet}</p>
                <p className="text-sm text-white/90">{studioCity}</p>
                <p className="text-sm text-white/90">{studioCountry}</p>
              </div>
            </div>

            {/* Column 3: Contact */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                {t("contact")}
              </h3>

              <div className="space-y-3">
                {/* Email */}
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {contactEmail}
                </a>

                {/* Instagram */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  {instagramHandle}
                </a>
              </div>
            </div>

            {/* Column 4: Legal Info & Distributor */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                {t("legalInfo")}
              </h3>

              <div className="space-y-2">
                <p className="text-sm text-white/70">{t("vatLabel")}: {vatNumber}</p>
                <p className="text-sm text-white/70">{t("chamberLabel")}: {chamberNumber}</p>

                <div className="pt-2 space-y-1">
                  <Link
                    href="/terms"
                    className="block text-sm text-white/90 hover:text-white transition-colors"
                  >
                    {t("termsLink")}
                  </Link>
                  <Link
                    href="/user-agreement"
                    className="block text-sm text-white/90 hover:text-white transition-colors"
                  >
                    {t("userAgreement")}
                  </Link>
                </div>
              </div>

              {/* Distributor CTA Box */}
              <div className="mt-6 p-4 bg-white/10 rounded-lg">
                <p className="text-sm text-white/90 mb-3">
                  {t("distributorTitle")}
                </p>
                <a
                  href={`mailto:${contactEmail}?subject=Poem%20Booth%20Distribution%20Inquiry`}
                  className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t("distributorCta")}
                </a>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="py-6 border-t border-white/10">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-white/60">
              {t("copyright", { year: currentYear })}
            </p>
            <p className="text-sm text-white/60">
              {t("trademark")}
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
