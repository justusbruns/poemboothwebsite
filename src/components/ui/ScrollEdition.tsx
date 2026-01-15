"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import Image from "next/image";
import PhoneScreen from "./PhoneScreen";
import PrintCard from "./PrintCard";

// TypewriterText component - reveals text character by character based on scroll progress
function TypewriterText({ text, progress }: { text: string; progress: MotionValue<number> }) {
  const visibleChars = useTransform(progress, [0, 1], [0, text.length]);
  const displayText = useTransform(visibleChars, (chars) => text.slice(0, Math.floor(chars)));

  return (
    <motion.p
      className="text-white text-center font-serif italic text-[10px] md:text-xs leading-snug whitespace-pre-wrap drop-shadow-lg"
      style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
    >
      {displayText}
    </motion.p>
  );
}

interface ScrollEditionProps {
  title: string;
  subtitle: string;
  isNew?: boolean;
  newBadgeText?: string;
  beforeImage: string;
  afterImages: string[]; // Array for slideshow effect
  beforeLabel: string;
  afterLabel: string;
  outputType: "portrait" | "poem";
  poemText?: string;
  shareText: string;
}

export default function ScrollEdition({
  title,
  subtitle,
  isNew,
  newBadgeText,
  beforeImage,
  afterImages,
  beforeLabel,
  afterLabel,
  outputType,
  poemText,
  shareText,
}: ScrollEditionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // REVISED Animation phases:
  // 0-15%:   Booth visible with original photo
  // 15-35%:  Photo crossfades to artwork/poem (with slideshow for portrait)
  // 35-55%:  Hold on final artwork
  // 55-70%:  Hand-phone slides in from RIGHT, holds, exits
  // 70-85%:  Hand-print slides in from LEFT, holds, exits
  // 85-100%: Clean transition to next section

  // White flash: fades in, HOLDS while illustrations fade in behind, then fades out
  const whiteFlashOpacity = useTransform(
    scrollYProgress,
    [0.12, 0.15, 0.20, 0.22],
    [0, 1, 1, 0]
  );

  // Illustrations fade in BEHIND the white flash (white hides the transition)
  const afterOpacity = useTransform(scrollYProgress, [0.15, 0.20], [0, 1]);

  // Portrait slideshow: starts AFTER first image has been visible, then cycles through
  const slideshowProgress = useTransform(scrollYProgress, [0.28, 0.45], [0, 1]);

  // Poem edition: blur the beforeImage and show typewriter text
  const poemBackgroundBlur = useTransform(scrollYProgress, [0.15, 0.20], [0, 12]);
  const typewriterProgress = useTransform(scrollYProgress, [0.20, 0.50], [0, 1]);

  // Hand phone: enters from RIGHT at 55%, stops 22% from edge (~111px), exits to RIGHT at 70%
  const handPhoneX = useTransform(
    scrollYProgress,
    [0.55, 0.60, 0.65, 0.70],
    ["100%", "22%", "22%", "100%"]  // Stops ~111px before full position (22% of 500px)
  );

  // Hand print: enters from LEFT at 70%, stops 34% from edge (~171px), exits to LEFT at 85%
  const handPrintX = useTransform(
    scrollYProgress,
    [0.70, 0.75, 0.80, 0.85],
    ["-140%", "-34%", "-34%", "-140%"]  // Starts 200px more off-screen (-140% = -700px for 500px width)
  );

  // Printer: slides in from right at 70%, stays in position (doesn't exit)
  const printerX = useTransform(
    scrollYProgress,
    [0.70, 0.75],
    ["1000px", "0px"]  // Start 1000px off-screen
  );

  // Booth shifts left when printer appears to make room
  const boothX = useTransform(
    scrollYProgress,
    [0.70, 0.75],
    ["0px", "-50px"]  // Shift left to make room for printer
  );

  // Labels: show "before" label initially, crossfade to "after" at 15-25%
  const beforeLabelOpacity = useTransform(scrollYProgress, [0.15, 0.25], [1, 0]);
  const afterLabelOpacity = useTransform(scrollYProgress, [0.20, 0.30], [0, 1]);

  // Sort afterImages for consistent order between server/client (prevents hydration mismatch)
  const sortedAfterImages = [...afterImages].sort();

  // Get the last after image (shown in hands after slideshow)
  const lastAfterImage = sortedAfterImages[sortedAfterImages.length - 1] || sortedAfterImages[0] || beforeImage;

  return (
    <div ref={containerRef} className="relative h-[350vh]">
      {/* Sticky container that stays in view during scroll */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Badge and Title */}
        <div className="text-center mb-8 md:mb-12">
          {isNew && newBadgeText && (
            <div className="mb-4">
              <span className="inline-block px-4 py-1.5 bg-text-primary text-bg-primary text-sm font-medium rounded-full">
                {newBadgeText}
              </span>
            </div>
          )}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-text-primary mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto px-4">
            {subtitle}
          </p>
        </div>

        {/* Main content area */}
        <div className="relative flex items-center justify-center w-full max-w-6xl px-4">
          {/* Booth with screen - shifts left when printer appears (portrait only) */}
          <motion.div
            className="relative w-full max-w-[210px] md:max-w-[320px] z-10"
            style={{ x: outputType === "portrait" ? boothX : 0 }}
          >
            {/* Booth frame */}
            <Image
              src="/images/booth-frame.png"
              alt="Poem Booth"
              width={400}
              height={600}
              className="w-full h-auto relative z-10 pointer-events-none"
              priority
            />

            {/* Screen area */}
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
              {/* Before image (original photo) */}
              {beforeImage && (
                <Image
                  src={beforeImage}
                  alt="Original photo"
                  fill
                  className="object-cover"
                />
              )}

              {/* White flash overlay - creates clean transition to portraits */}
              <motion.div
                className="absolute inset-0 bg-white"
                style={{ opacity: whiteFlashOpacity }}
              />

              {/* Content after flash - different for poem vs portrait */}
              {outputType === "poem" ? (
                <>
                  {/* Poem: Blurred background photo */}
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      filter: useTransform(poemBackgroundBlur, (v) => `blur(${v}px)`),
                      opacity: afterOpacity,
                    }}
                  >
                    <Image
                      src={beforeImage}
                      alt="Blurred photo"
                      fill
                      className="object-cover"
                    />
                  </motion.div>

                  {/* Poem: Typewriter text overlay */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center p-4"
                    style={{ opacity: afterOpacity }}
                  >
                    <TypewriterText
                      text={poemText || ""}
                      progress={typewriterProgress}
                    />
                  </motion.div>
                </>
              ) : (
                /* Portrait: slideshow effect */
                sortedAfterImages.length > 0 && (
                  <motion.div className="absolute inset-0" style={{ opacity: afterOpacity }}>
                    {sortedAfterImages.map((img, index) => (
                      <motion.div
                        key={img}
                        className="absolute inset-0"
                        style={{
                          opacity: useTransform(
                            slideshowProgress,
                            sortedAfterImages.length > 1
                              ? index === 0
                                // First image: starts at 1, fades out when next image comes in
                                ? [0, 0.5 / sortedAfterImages.length, 1 / sortedAfterImages.length]
                                // Other images: fade in, hold, fade out
                                : [
                                    Math.max(0, (index - 0.5) / sortedAfterImages.length),
                                    index / sortedAfterImages.length,
                                    (index + 0.5) / sortedAfterImages.length,
                                    Math.min(1, (index + 1) / sortedAfterImages.length),
                                  ]
                              : [0, 0, 1, 1],
                            sortedAfterImages.length > 1
                              ? index === 0
                                // First image: full opacity immediately, then fade out
                                ? [1, 1, 0]
                                // Other images: fade in to 1, hold, fade out (last image stays)
                                : [0, 1, 1, index === sortedAfterImages.length - 1 ? 1 : 0]
                              : [1, 1, 1, 1]
                          ),
                        }}
                      >
                        <Image
                          src={img}
                          alt={`Generated artwork ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )
              )}
            </div>

            {/* Labels below booth */}
            <div className="absolute -bottom-10 left-0 right-0 text-center h-8">
              <motion.p
                className="absolute inset-0 text-text-primary text-base md:text-lg font-medium"
                style={{ opacity: beforeLabelOpacity }}
              >
                {beforeLabel}
              </motion.p>
              <motion.p
                className="absolute inset-0 text-text-primary text-base md:text-lg font-medium"
                style={{ opacity: afterLabelOpacity }}
              >
                {afterLabel}
              </motion.p>
            </div>

          </motion.div>

          {/* Printer - slides in from right at 70%, positioned absolutely (portrait only) */}
          {outputType === "portrait" && (
            <motion.div
              className="absolute left-1/2 bottom-0 z-5 ml-[63px] md:ml-[118px]"
              style={{ x: printerX }}
            >
              <Image
                src="/images/printer.png"
                alt="Printer"
                width={150}
                height={400}
                className="w-auto h-[285px] md:h-[380px]"
              />
            </motion.div>
          )}
        </div>

      </div>

      {/* Hand with phone - poem edition only */}
      {outputType === "poem" && (
        <motion.div
          className="fixed bottom-0 right-0 z-50 pointer-events-none origin-bottom-right scale-75 md:scale-100"
          style={{ x: handPhoneX }}
        >
          <div className="relative w-[500px]">
            {/* Phone screen content overlay - positioned BEHIND hand image */}
            <div
              className="absolute z-0"
              style={{
                top: "1%",
                left: "13%",
                width: "53%",
                height: "78%",
              }}
            >
              <PhoneScreen
                type={outputType}
                image={beforeImage}
                poemText={poemText}
                shareText={shareText}
              />
            </div>
            {/* Hand image - ON TOP of phone content */}
            <Image
              src="/images/hand-phone.png"
              alt="Hand holding phone"
              width={1002}
              height={1446}
              className="w-full h-auto relative z-10"
            />
          </div>
        </motion.div>
      )}

      {/* Hand with print - portrait edition only */}
      {outputType === "portrait" && (
        <motion.div
          className="fixed bottom-0 left-0 z-50 pointer-events-none origin-bottom-left scale-75 md:scale-100"
          style={{ x: handPrintX }}
        >
          <div className="relative w-[500px]">
            {/* Print card content overlay - positioned BEHIND hand image */}
            <div
              className="absolute z-0"
              style={{
                top: "-82.3%",
                left: "40.19%",
                width: "64%",
                height: "120%",
              }}
            >
              <PrintCard
                type={outputType}
                image={lastAfterImage}
                poemText={poemText}
              />
            </div>
            {/* Hand image - ON TOP of print card */}
            <Image
              src="/images/hand-print.png"
              alt="Hand holding print"
              width={874}
              height={696}
              className="w-full h-auto relative z-10"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
