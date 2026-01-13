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

  // Handle slideshow rotation - simple index change, CSS handles the fade
  useEffect(() => {
    if (!slideshow || images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, fadeDuration);

    return () => clearInterval(interval);
  }, [slideshow, images.length, fadeDuration]);

  const currentImage = images[currentIndex];

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
            top: "5.5%",
            left: "13%",
            width: "74%",
            height: "70%",
            borderRadius: "35% 35% 35% 35% / 18% 18% 22% 22%",
          }}
        >
          {/* Render all images stacked, only current is visible */}
          {images.map((image, index) => (
            <Image
              key={image}
              src={image}
              alt={alt}
              fill
              className={`object-cover transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}

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
