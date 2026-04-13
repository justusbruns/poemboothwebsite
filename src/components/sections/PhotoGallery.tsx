"use client";

import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Image from "next/image";

interface GalleryImage {
  imageUrl?: string;
  caption?: string;
  eventName?: string;
  contextText?: string;
  objectPosition?: string;
}

interface PhotoGalleryProps {
  images?: GalleryImage[];
}

const placeholderImages: GalleryImage[] = [
  { eventName: "Sydney Festival, Australia", contextText: "The booth drew long queues as visitors waited for their portrait and poem." },
  { eventName: "Lowlands Festival, Netherlands", contextText: "Guests could walk up, pose, and leave with a personal poem in minutes." },
  { eventName: "Library Friesland, Netherlands", contextText: "A quiet cultural setting where the booth became both installation and interaction." },
  { eventName: "Corporate event, Geneva", contextText: "A conversation piece that drew people in throughout the evening." },
  { eventName: "Wedding, Netherlands", contextText: "Personal poems became keepsakes guests took home." },
  { eventName: "Museo Nazionale, Turin", contextText: "An unexpected pairing of classical art and generative poetry." },
];

const ROTATIONS = [-2.5, 1.8, -1.2, 2.8, -2, 1.5];
const CARD_W_MAX = 380;
const GAP = 28;
// Arrow w-10 (40px) + gap-6 (24px)
const ARROW_INSET = 40 + 24;

export default function PhotoGallery({ images = placeholderImages }: PhotoGalleryProps) {
  const t = useTranslations("gallery");
  const effectiveImages = images.length > 0 ? images : placeholderImages;
  const total = effectiveImages.length;
  const [current, setCurrent] = useState(0);
  const [offset, setOffset] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [animDir, setAnimDir] = useState<0 | 1 | -1>(0);

  // Measure the actual viewport width so we can center correctly at any screen size
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(CARD_W_MAX * 3 + GAP * 2);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () => setViewportW(el.offsetWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Responsive card width: full size on wide screens, fits the viewport on narrow screens
  const cardW = Math.min(CARD_W_MAX, Math.floor(viewportW * 0.88));
  const step = cardW + GAP;
  // Translate so the center of slot 2 (index 2 of 0..4) lands exactly at viewport center
  const baseTranslate = viewportW / 2 - 2 * step - cardW / 2;

  const go = (dir: 1 | -1) => {
    if (animating) return;
    setAnimDir(dir);
    setAnimating(true);
    setOffset(-dir * step);
    setTimeout(() => {
      setCurrent((c) => (c + dir + total) % total);
      setAnimDir(0);
      setOffset(0);
      setAnimating(false);
    }, 450);
  };

  // Render 5 slots: -2, -1, 0, +1, +2 relative to current
  const slots = [-2, -1, 0, 1, 2].map((d) => ({
    image: effectiveImages[(current + d + total) % total],
    rotation: ROTATIONS[(current + d + total) % total],
  }));

  // During animation: incoming slot (2 + animDir) is the new center — scale starts immediately
  const centerSlot = animating ? 2 + animDir : 2;

  const activeImage = effectiveImages[current];

  return (
    <section id="gallery" className="py-16 md:py-24 bg-bg-primary">
      {/* Heading stays in Container */}
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />
      </Container>

      {/* Carousel breaks out of Container — never clipped by its max-width */}
      <div className="mt-10 px-4 sm:px-6">

        {/* Flex row: arrow | viewport | arrow */}
        <div
          className="flex items-center gap-6 mx-auto"
          style={{ maxWidth: CARD_W_MAX * 3 + GAP * 2 + ARROW_INSET * 2 }}
        >
          {/* Arrow left */}
          <button
            onClick={() => go(-1)}
            className="flex-shrink-0 w-10 h-10 rounded-full border border-text-primary/20 flex items-center justify-center text-text-primary hover:border-text-primary/60 transition-colors"
            aria-label="Previous"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Viewport — clips overflow, measures own width */}
          <div ref={viewportRef} style={{ flex: 1, minWidth: 0, overflowX: "clip" }}>
            <div
              className="flex py-8"
              style={{
                gap: GAP,
                transform: `translateX(${baseTranslate + offset}px)`,
                transition: animating ? "transform 450ms cubic-bezier(0.4,0,0.2,1)" : "none",
              }}
            >
              {slots.map(({ image, rotation }, slot) => {
                const isCenter = slot === centerSlot;
                // Key by image index so React preserves the DOM element as it
                // moves between slots — prevents a spurious scale transition at
                // the end of each navigation step.
                const imageIndex = (current + slot - 2 + total) % total;
                return (
                  <div key={imageIndex} className="flex-shrink-0" style={{ width: cardW }}>
                    {/* Rotation wrapper — no transition, tilt is static per image */}
                    <div style={{ transform: `rotate(${rotation}deg)` }}>
                      <div
                        className="relative rounded-xl overflow-hidden shadow-xl"
                        style={{
                          transform: `scale(${isCenter ? 1 : 0.88})`,
                          opacity: isCenter ? 1 : 0.62,
                          transition: "transform 450ms cubic-bezier(0.4,0,0.2,1), opacity 450ms cubic-bezier(0.4,0,0.2,1)",
                        }}
                      >
                        <div className="relative bg-bg-secondary" style={{ aspectRatio: "3/3.4" }}>
                          {image.imageUrl ? (
                            <Image
                              src={image.imageUrl}
                              alt={image.eventName || "Gallery image"}
                              fill
                              className="object-cover"
                              style={image.objectPosition ? { objectPosition: image.objectPosition } : undefined}
                              sizes={`${cardW}px`}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-secondary to-bg-accent">
                              <svg className="w-10 h-10 text-text-muted opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arrow right */}
          <button
            onClick={() => go(1)}
            className="flex-shrink-0 w-10 h-10 rounded-full border border-text-primary/20 flex items-center justify-center text-text-primary hover:border-text-primary/60 transition-colors"
            aria-label="Next"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Text — same max-width, inset by ARROW_INSET to center under the viewport */}
        <div
          className="mt-6 mx-auto text-center min-h-[56px]"
          style={{
            maxWidth: CARD_W_MAX * 3 + GAP * 2 + ARROW_INSET * 2,
            paddingLeft: ARROW_INSET,
            paddingRight: ARROW_INSET,
          }}
        >
          <p className="text-base font-display text-text-primary">{activeImage?.eventName ?? ""}</p>
          <p className="mt-1 text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
            {activeImage?.contextText || activeImage?.caption || ""}
          </p>
        </div>

      </div>
    </section>
  );
}
