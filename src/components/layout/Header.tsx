"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import LanguageSwitcher from "./LanguageSwitcher";
import RegionSwitcher from "./RegionSwitcher";

interface HeaderProps {
  logo?: string;
}

export default function Header({ logo }: HeaderProps) {
  const params = useParams();
  const locale = params.locale as string;
  const region = params.region as string;
  const t = useTranslations("nav");

  const home = `/${locale}/${region}`;
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL || "https://book.poembooth.com";
  const bookingBase = bookingUrl.replace(/\/+$/, "").split("/").slice(0, 3).join("/");
  const bookingHref = `${bookingBase}/${locale}/booking`;

  const navLinks = [
    { label: t("styles"), href: `${home}#styles` },
    { label: t("howItWorks"), href: `${home}#how-it-works` },
    { label: t("rates"), href: `${home}#rates` },
    { label: t("faq"), href: `${home}#faq` },
    { label: "Blog", href: `${home}/blog` },
  ];

  // Mobile bottom nav - simplified
  const mobileNavLinks = [
    { label: t("styles"), href: `${home}#styles`, icon: "styles" },
    { label: t("rates"), href: `${home}#rates`, icon: "rates" },
    { label: t("bookNow"), href: bookingHref, icon: "book" },
    { label: t("faq"), href: `${home}#faq`, icon: "faq" },
    { label: "Blog", href: `${home}/blog`, icon: "blog" },
  ];

  return (
    <>
      {/* Mobile: static header (not sticky, bottom nav handles navigation) */}
      <header className="md:hidden bg-bg-secondary py-6">
        <Container>
          <div className="flex items-center justify-between">
            <Link href={`/${locale}/${region}`} className="flex items-center">
              {logo ? (
                <Image src={logo} alt="Poem Booth" width={70} height={28} className="object-contain" />
              ) : (
                <span className="text-2xl font-display text-text-primary">Poem Booth</span>
              )}
            </Link>
            <div className="flex items-center gap-3">
              <RegionSwitcher />
              <LanguageSwitcher />
            </div>
          </div>
        </Container>
      </header>

      {/* Desktop: sticky header */}
      <header className="hidden md:block sticky top-0 z-50 pt-4 pb-10 pointer-events-none header-fade">
        <div className="pointer-events-auto relative z-10">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href={`/${locale}/${region}`} className="flex items-center">
                {logo ? (
                  <Image src={logo} alt="Poem Booth" width={70} height={28} className="object-contain" />
                ) : (
                  <span className="text-2xl font-display text-text-primary">Poem Booth</span>
                )}
              </Link>
            </div>

            <nav className="flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <RegionSwitcher />
              <LanguageSwitcher />
              <a
                href="https://instagram.com/poembooth.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <Button href={bookingHref} variant="primary" size="sm">
                {t("bookNow")}
              </Button>
            </div>
          </div>
        </Container>
        </div>
      </header>

      {/* Mobile bottom navigation bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-primary/95 backdrop-blur-sm border-t border-border-light safe-bottom">
        <div className="grid grid-cols-5 items-stretch px-2 py-2">
          {mobileNavLinks.map((link) => {
            const isBook = link.icon === "book";
            return isBook ? (
              <Link
                key={link.icon}
                href={link.href}
                className="flex flex-col items-center justify-center px-3 py-1.5 -mt-4 bg-text-primary text-bg-primary rounded-full shadow-lg mx-auto min-w-[64px]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] font-medium mt-0.5 text-center leading-tight">{link.label}</span>
              </Link>
            ) : (
              <Link
                key={link.icon}
                href={link.href}
                className="flex flex-col items-center justify-center py-1.5 text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.icon === "styles" && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                  </svg>
                )}
                {link.icon === "rates" && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {link.icon === "faq" && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                )}
                {link.icon === "blog" && (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                )}
                <span className="text-[10px] font-medium mt-0.5 text-center leading-tight">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

    </>
  );
}
