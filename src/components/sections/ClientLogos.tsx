"use client";

import Image from "next/image";

interface ClientLogo {
  name: string;
  logoUrl?: string;
}

interface ClientLogosProps {
  logos?: ClientLogo[];
}

// Placeholder logos for development
const placeholderLogos = [
  { name: "Client 1" },
  { name: "Client 2" },
  { name: "Client 3" },
  { name: "Client 4" },
  { name: "Client 5" },
  { name: "Client 6" },
];

export default function ClientLogos({ logos = placeholderLogos }: ClientLogosProps) {
  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="py-6 bg-bg-secondary overflow-hidden">
      <div className="relative">
        {/* Ticker tape container */}
        <div className="flex w-max animate-ticker">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 flex items-center justify-center px-8 opacity-60 hover:opacity-100 transition-opacity"
              style={{ width: "220px" }}
            >
              {logo.logoUrl ? (
                <Image
                  src={logo.logoUrl}
                  alt={logo.name}
                  width={220}
                  height={80}
                  className="w-full h-auto object-contain grayscale hover:grayscale-0 transition-all"
                />
              ) : (
                <div className="h-12 w-full bg-border rounded flex items-center justify-center">
                  <span className="text-xs text-text-muted">{logo.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
