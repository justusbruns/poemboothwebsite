"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// Localized text type matching Sanity schema
type LocalizedText = {
  en?: string;
  nl?: string;
  de?: string;
  fr?: string;
  it?: string;
};

// Helper to extract localized value
const getLocalizedValue = (field: LocalizedText | string | undefined, locale: string): string => {
  if (!field) return "";
  if (typeof field === "string") return field; // Backwards compatibility
  return field[locale as keyof LocalizedText] || field.en || "";
};

interface PoemExample {
  backgroundImage?: {
    asset?: {
      url: string;
      metadata?: {
        lqip?: string;
      };
    };
  };
  poemText: LocalizedText | string;
  attribution?: string;
}

interface PoemStyle {
  _id: string;
  styleName: string;
  styleDescription?: string;
  poems: PoemExample[];
}

interface PoemBoothScreenProps {
  styles: PoemStyle[];
  locale: string;
  label?: string;
  fallbackImage?: string;
}

export default function PoemBoothScreen({
  styles,
  locale,
  label,
  fallbackImage,
}: PoemBoothScreenProps) {
  const [activeStyleIndex, setActiveStyleIndex] = useState(0);
  const [activePoemIndex, setActivePoemIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeStyle = styles[activeStyleIndex];
  const activePoem = activeStyle?.poems?.[activePoemIndex];
  const poemText = getLocalizedValue(activePoem?.poemText, locale);
  const backgroundUrl =
    activePoem?.backgroundImage?.asset?.url || fallbackImage || "";

  // Intersection Observer to trigger typewriter on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStartedTyping) {
          setHasStartedTyping(true);
          setIsTyping(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasStartedTyping]);

  // Typewriter effect
  useEffect(() => {
    if (!isTyping || !poemText) return;

    setDisplayedText("");
    let index = 0;

    const interval = setInterval(() => {
      if (index <= poemText.length) {
        setDisplayedText(poemText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 40); // 40ms per character for smooth typing

    return () => clearInterval(interval);
  }, [isTyping, poemText]);

  // Handle style tab click - restart typewriter
  const handleStyleClick = (index: number) => {
    if (index === activeStyleIndex) return;
    setActiveStyleIndex(index);
    setActivePoemIndex(0);
    setDisplayedText("");
    setIsTyping(true);
  };

  // Handle clicking on poem area to cycle poems within style
  const handlePoemCycle = () => {
    if (!activeStyle?.poems?.length) return;
    const nextIndex = (activePoemIndex + 1) % activeStyle.poems.length;
    setActivePoemIndex(nextIndex);
    setDisplayedText("");
    setIsTyping(true);
  };

  return (
    <div className="flex flex-col items-center" ref={containerRef}>
      {/* Style tabs */}
      {styles.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {styles.map((style, index) => (
            <button
              key={style._id}
              onClick={() => handleStyleClick(index)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                index === activeStyleIndex
                  ? "bg-accent-primary text-white"
                  : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary"
              }`}
            >
              {style.styleName}
            </button>
          ))}
        </div>
      )}

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
          className="absolute overflow-hidden cursor-pointer"
          style={{
            top: "5.5%",
            left: "13%",
            width: "74%",
            height: "70%",
            borderRadius: "35% 35% 35% 35% / 18% 18% 22% 22%",
          }}
          onClick={handlePoemCycle}
          title={
            activeStyle?.poems?.length > 1
              ? "Click to see another poem"
              : undefined
          }
        >
          {/* Blurred background image */}
          {backgroundUrl && (
            <Image
              src={backgroundUrl}
              alt="Poem background"
              fill
              className="object-cover blur-sm scale-105"
            />
          )}

          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/30" />

          {/* Poem text overlay - extra bottom padding to avoid booth pole */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-4 pb-16 md:px-6 md:pt-6 md:pb-20">
            <div className="text-white text-center">
              {/* Poem text with typewriter effect */}
              <p className="text-xs md:text-sm leading-relaxed whitespace-pre-line font-serif">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-4 bg-white ml-0.5 animate-pulse" />
                )}
              </p>

              {/* Attribution */}
              {!isTyping && displayedText && activePoem?.attribution && (
                <p className="mt-3 text-[10px] md:text-xs text-white/80 italic">
                  {activePoem.attribution}
                </p>
              )}
            </div>
          </div>

          {/* Placeholder when no content */}
          {!backgroundUrl && !poemText && (
            <div className="absolute inset-0 bg-bg-secondary flex items-center justify-center">
              <span className="text-text-muted text-sm">No poem</span>
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

      {/* Poem count indicator */}
      {activeStyle?.poems?.length > 1 && (
        <p className="mt-2 text-text-muted text-xs">
          Poem {activePoemIndex + 1} of {activeStyle.poems.length} (click to
          cycle)
        </p>
      )}
    </div>
  );
}
