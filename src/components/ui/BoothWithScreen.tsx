"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface BoothWithScreenProps {
  images: string[];
  slideshow?: boolean;
  fadeDuration?: number;
  label?: string;
  alt?: string;
}

export default function BoothWithScreen({
  images,
  slideshow = false,
  fadeDuration = 3500,
  label,
  alt = "Booth screen",
}: BoothWithScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle slideshow rotation
  useEffect(() => {
    if (!slideshow || images.length <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 500); // Half of transition duration
    }, fadeDuration);

    return () => clearInterval(interval);
  }, [slideshow, images.length, fadeDuration]);

  const currentImage = images[currentIndex];
  const nextIndex = (currentIndex + 1) % images.length;
  const nextImage = images.length > 1 ? images[nextIndex] : null;

  return (
    <div className="flex flex-col items-center">
      {/* Booth container */}
      <div className="relative w-full max-w-[280px] md:max-w-[320px]">
        {/* Booth frame */}
        <Image
          src="/images/booth-frame.png"
          alt="Poem Booth"
          width={400}
          height={600}
          className="w-full h-auto relative z-10 pointer-events-none"
          priority
        />

        {/* Screen area overlay - positioned inside the booth frame */}
        <div
          className="absolute overflow-hidden"
          style={{
            top: "7%",
            left: "14%",
            width: "72%",
            height: "58%",
            borderRadius: "42% 42% 42% 42% / 28% 28% 28% 28%",
          }}
        >
          {/* Current image */}
          {currentImage && (
            <Image
              src={currentImage}
              alt={alt}
              fill
              className={`object-cover transition-opacity duration-1000 ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            />
          )}

          {/* Next image (for crossfade effect) */}
          {slideshow && nextImage && (
            <Image
              src={nextImage}
              alt={alt}
              fill
              className={`object-cover transition-opacity duration-1000 ${
                isTransitioning ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Placeholder when no images */}
          {images.length === 0 && (
            <div className="absolute inset-0 bg-bg-secondary flex items-center justify-center">
              <span className="text-text-muted text-sm">No image</span>
            </div>
          )}
        </div>
      </div>

      {/* Label below booth */}
      {label && (
        <p className="mt-4 text-text-primary text-base md:text-lg text-center font-medium">
          {label}
        </p>
      )}
    </div>
  );
}
