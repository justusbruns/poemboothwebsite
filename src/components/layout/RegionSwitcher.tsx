"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { regions, type Region, type Locale } from "@/i18n/routing";

const regionDefaultLocale: Record<Region, Locale> = {
  nl: "nl",
  us: "en",
  de: "de",
  fr: "fr",
  it: "it",
  be: "nl",
  row: "en",
};

const regionLabels: Record<Region, string> = {
  nl: "Netherlands",
  us: "United States",
  de: "Germany",
  fr: "France",
  it: "Italy",
  be: "Belgium",
  row: "Rest of World",
};

const regionFlags: Record<Region, string> = {
  nl: "🇳🇱",
  us: "🇺🇸",
  de: "🇩🇪",
  fr: "🇫🇷",
  it: "🇮🇹",
  be: "🇧🇪",
  row: "🌍",
};

export default function RegionSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations("header.region");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = params.locale as string;
  const currentRegion = params.region as Region;

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

  const handleRegionChange = (newRegion: Region) => {
    const pathParts = pathname.split("/");
    // Switch locale to the region's default language
    pathParts[1] = regionDefaultLocale[newRegion];
    pathParts[2] = newRegion;
    const newPath = pathParts.join("/");
    window.location.href = newPath;
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-lg hover:bg-bg-secondary"
      >
        <span>{regionFlags[currentRegion]}</span>
        <span className="hidden sm:inline">{regionLabels[currentRegion]}</span>
        <svg
          className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
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
        <div className="absolute right-0 mt-2 w-48 bg-bg-primary border border-border rounded-lg shadow-lg py-1 z-50">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => handleRegionChange(region)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-bg-secondary transition-colors flex items-center gap-2 ${
                region === currentRegion
                  ? "text-text-primary font-medium"
                  : "text-text-secondary"
              }`}
            >
              <span>{regionFlags[region]}</span>
              <span>{regionLabels[region]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
