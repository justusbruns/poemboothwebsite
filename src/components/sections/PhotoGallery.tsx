"use client";

import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Image from "next/image";

interface GalleryImage {
  imageUrl?: string;
  caption?: string;
  eventName?: string;
  featured?: boolean;
  objectPosition?: string;
}

interface PhotoGalleryProps {
  images?: GalleryImage[];
}

// Placeholder images for development
const placeholderImages: GalleryImage[] = [
  { caption: "Corporate Event", featured: true },
  { caption: "Wedding Reception" },
  { caption: "Product Launch" },
  { caption: "Gala Dinner" },
  { caption: "Birthday Party", featured: true },
  { caption: "Art Exhibition" },
];

export default function PhotoGallery({ images = placeholderImages }: PhotoGalleryProps) {
  const t = useTranslations("gallery");

  return (
    <section className="py-16 md:py-24 bg-bg-primary">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative overflow-hidden rounded-xl ${
                image.featured ? "row-span-2 col-span-1" : ""
              }`}
            >
              <div
                className={`${
                  image.featured ? "aspect-[3/4]" : "aspect-square"
                } relative bg-bg-secondary`}
              >
                {image.imageUrl ? (
                  <Image
                    src={image.imageUrl}
                    alt={image.caption || "Gallery image"}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-secondary to-bg-accent">
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 mx-auto text-text-muted opacity-30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {image.caption && (
                        <p className="mt-2 text-xs text-text-muted">{image.caption}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {/* Caption overlay */}
              {image.imageUrl && image.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <p className="text-white text-sm">{image.caption}</p>
                  {image.eventName && (
                    <p className="text-white/70 text-xs">{image.eventName}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
