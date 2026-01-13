"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { regions, type Region } from "@/i18n/routing";

const regionLabels: Record<Region, string> = {
  us: "United States",
  eu: "Europe",
};

const regionFlags: Record<Region, string> = {
  us: "🇺🇸",
  eu: "🇪🇺",
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
    // Replace the region in the current path
    const pathParts = pathname.split("/");
    // Path is like /locale/region/...
    pathParts[2] = newRegion;
    const newPath = pathParts.join("/");
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
        <span>{regionFlags[currentRegion]}</span>
        <span>{regionLabels[currentRegion]}</span>
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
