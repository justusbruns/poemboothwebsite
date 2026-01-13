"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { locales, type Locale } from "@/i18n/routing";

const languageLabels: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
  de: "Deutsch",
  fr: "Français",
  it: "Italiano",
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = params.locale as Locale;
  const currentRegion = params.region as string;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    // Replace the locale in the current path
    const newPath = pathname.replace(`/${currentLocale}/`, `/${newLocale}/`);
    // Use full page navigation to ensure middleware runs and cookies are set
    window.location.href = newPath;
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-bg-secondary"
      >
        <span>{languageLabels[currentLocale]}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-bg-primary border border-border rounded-lg shadow-lg py-1 z-50">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-bg-secondary transition-colors ${
                locale === currentLocale
                  ? "text-text-primary font-medium"
                  : "text-text-secondary"
              }`}
            >
              {languageLabels[locale]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
