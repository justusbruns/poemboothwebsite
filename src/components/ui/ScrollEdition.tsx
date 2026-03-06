"use client";

import { useRef, useState, useEffect } from "react";
import { motion, animate, useMotionValue, useTransform, MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import PhoneScreen from "./PhoneScreen";
import PrintCard from "./PrintCard";

// TypewriterText component - reveals text character by character based on scroll progress
function TypewriterText({ text, progress }: { text: string; progress: MotionValue<number> }) {
  const visibleChars = useTransform(progress, [0, 1], [0, text.length]);
  const displayText = useTransform(visibleChars, (chars) => text.slice(0, Math.floor(chars)));

  return (
    <motion.p
      className="text-white text-left font-serif italic text-[14.2px] md:text-[14.6px] leading-snug whitespace-pre-wrap drop-shadow-lg"
      style={{ textShadow: "0 2px 8px rgba(0,0,0,0.8)" }}
    >
      {displayText}
    </motion.p>
  );
}

function PlayIcon() {
  return (
    <svg
      width="11" height="11"
      viewBox="0 0 11 11"
      fill="currentColor"
      className="inline-block mr-1.5 -mt-0.5"
    >
      <polygon points="1,0.5 10.5,5.5 1,10.5" />
    </svg>
  );
}

function RestartIcon() {
  return (
    <svg
      width="14" height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block mr-1.5 -mt-0.5"
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

interface ScrollEditionProps {
  title: string;
  titlePrefix?: string;
  titleSuffix?: string;
  subtitle: string;
  isNew?: boolean;
  newBadgeText?: string;
  beforeImage: string;
  afterImages: string[]; // Array for slideshow effect
  beforeLabel: string;
  afterLabel: string;
  outputType: "portrait" | "poem" | "roast";
  poemText?: string;
  shareText: string;
  generateButtonText?: string;
}

// idle     → waiting for user to click Generate
// generating → animation playing (slideshow / typewriter)
// actioning  → action animation playing (hand+printer entering)
// done     → hand/printer visible and stationary, Start Again shown
type Stage = "idle" | "generating" | "actioning" | "done";

export default function ScrollEdition({
  title,
  titlePrefix,
  titleSuffix,
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
  generateButtonText,
}: ScrollEditionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [stage, setStage] = useState<Stage>("idle");
  // Shown after generate animation completes (portrait & poem only)
  const [showActionButton, setShowActionButton] = useState(false);
  const animationControlsRef = useRef<ReturnType<typeof animate> | undefined>(undefined);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Time-based animation progress (0→1)
  const animationProgress = useMotionValue(0);

  // Reset when section leaves viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          animationControlsRef.current?.stop();
          animationProgress.set(0);
          setStage("idle");
          setShowActionButton(false);
        }
      },
      { threshold: 0.3 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => { observer.disconnect(); animationControlsRef.current?.stop(); };
  }, [animationProgress]);

  const handleGenerate = () => {
    setStage("generating");
    if (outputType === "portrait") {
      // Play all 3 portraits (0 → 0.68), then show "Print your portrait" button
      animationControlsRef.current = animate(animationProgress, 0.68, {
        duration: 6.8,
        ease: "linear",
        onComplete: () => setShowActionButton(true),
      });
    } else if (outputType === "poem") {
      // Play typewriter (completes at 0.48), stop at 0.55 then show "Share your poem" button
      animationControlsRef.current = animate(animationProgress, 0.55, {
        duration: 5.5,
        ease: "linear",
        onComplete: () => setShowActionButton(true),
      });
    } else {
      // Roast: play once until typewriter completes, then show Start Again
      animationControlsRef.current = animate(animationProgress, 0.55, {
        duration: 5.5,
        ease: "linear",
        onComplete: () => setStage("done"),
      });
    }
  };

  // Portrait: hand+printer slide in (0.68→0.80) and stay
  // Poem:     hand+phone  slide in (0.55→0.80) and stay
  // At 0.80: handPrintX = -34%, handPhoneX = 22%, printer = 80px — all at resting position
  const handleAction = () => {
    setStage("actioning");
    const duration = outputType === "portrait" ? 1.5 : 2.5;
    animationControlsRef.current = animate(animationProgress, 0.80, {
      duration,
      ease: "easeOut",
      onComplete: () => setStage("done"),
    });
  };

  const handleStartAgain = () => {
    animationControlsRef.current?.stop();
    animationProgress.set(0);
    setStage("idle");
    setShowActionButton(false);
  };

  // Animation phases (snappier — content appears at ~1s after click):
  // 0-2%:   Original photo visible
  // 2-12%:  White flash (hides transition)
  // 12%+:   Content visible (portrait slideshow / poem typewriter)
  // 65-95%: Hand/phone slides in and out (poem)
  // 70-80%: Hand/print + printer slides in (portrait — stops at 80%)

  const whiteFlashOpacity = useTransform(
    animationProgress,
    [0.02, 0.06, 0.10, 0.12],
    [0, 1, 1, 0]
  );
  const afterOpacity = useTransform(animationProgress, [0.06, 0.12], [0, 1]);
  const slideshowProgress = useTransform(animationProgress, [0.28, 0.70], [0, 1]);
  const poemBackgroundBlur = useTransform(animationProgress, [0.06, 0.12], [0, 12]);
  const typewriterProgress = useTransform(animationProgress, [0.12, 0.48], [0, 1]);

  const handPhoneX = useTransform(
    animationProgress,
    [0.65, 0.70, 0.90, 0.95],
    ["100%", "22%", "22%", "100%"]
  );
  const handPrintX = useTransform(
    animationProgress,
    [0.70, 0.75, 0.95, 1.0],
    ["-140%", "-34%", "-34%", "-140%"]
  );
  const printerX = useTransform(
    animationProgress,
    [0.70, 0.75],
    ["600px", isMobile ? "0px" : "80px"]
  );
  const printerOpacity = useTransform(
    animationProgress,
    [0.69, 0.70],
    [0, 1]
  );

  const beforeLabelOpacity = useTransform(animationProgress, [0.06, 0.16], [1, 0]);
  const afterLabelOpacity = useTransform(
    animationProgress,
    outputType === "portrait" ? [0.10, 0.18, 0.68, 0.72] : [0.10, 0.18],
    outputType === "portrait" ? [0, 1, 1, 0] : [0, 1]
  );
  const printLabelOpacity = useTransform(animationProgress, [0.70, 0.75, 0.95, 1.0], [0, 1, 1, 0]);

  // Sort afterImages for consistent order between server/client (prevents hydration mismatch)
  const sortedAfterImages = [...afterImages].sort();

  // Get the last after image (shown in hands after slideshow)
  const lastAfterImage = sortedAfterImages[sortedAfterImages.length - 1] || sortedAfterImages[0] || beforeImage;

  // Button label for the action button (after generate completes)
  const t = useTranslations("editions");
  const actionButtonLabel = outputType === "portrait" ? t("printPortrait") : t("sharePoem");

  return (
    <div ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-16">
      {/* Badge and Title */}
      <div className="text-center mb-8 md:mb-12">
        {isNew && newBadgeText && (
          <div className="mb-4">
            <span className="inline-block px-4 py-1.5 bg-text-primary text-bg-primary text-sm font-medium rounded-full">
              {newBadgeText}
            </span>
          </div>
        )}
        {outputType === "roast" ? (
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-text-primary mb-4 flex items-center justify-center">
            {titlePrefix && <span>{titlePrefix}</span>}
            <Image
              src="/images/roast-logo.png"
              alt="ROAST"
              width={200}
              height={60}
              className="h-[1.4em] w-auto inline-block -mx-1"
            />
            {titleSuffix && <span>{titleSuffix}</span>}
          </h2>
        ) : (
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-text-primary mb-4">
            {title}
          </h2>
        )}
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto px-4">
          {subtitle}
        </p>
      </div>

      {/* Main content area */}
      <div className="relative flex items-center justify-center w-full max-w-6xl px-4">
        {/* Booth with screen */}
        <motion.div
          className="relative z-10"
          style={{
            height: "min(73.3vh, 600px)",
            width: "auto",
          }}
        >
          {/* Booth frame - SVG for sharp scaling */}
          <Image
            src="/images/booth-frame.svg"
            alt="Poem Booth"
            width={400}
            height={600}
            className="h-full w-auto relative z-10 pointer-events-none"
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

            {/* White flash overlay - creates clean transition */}
            <motion.div
              className="absolute inset-0 bg-white"
              style={{ opacity: whiteFlashOpacity }}
            />

            {/* Content after flash - different for poem/roast vs portrait */}
            {(outputType === "poem" || outputType === "roast") ? (
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
                  className="absolute inset-0 flex items-start justify-start px-6 pb-4 pt-[4.6em] md:pt-[4.6em]"
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
                            ? sortedAfterImages.length === 3
                              // 3-image case: image 0 & 2 hold 0.8s, image 1 holds 1.8s (+1s)
                              ? index === 0
                                ? [0, 0.190, 0.254]
                                : index === 1
                                  ? [0.190, 0.254, 0.683, 0.747]
                                  : [0.683, 0.747, 0.937, 1.0]
                              : index === 0
                                ? [0, 0.75 / sortedAfterImages.length, 1 / sortedAfterImages.length]
                                : [
                                    Math.max(0, (index - 0.25) / sortedAfterImages.length),
                                    index / sortedAfterImages.length,
                                    (index + 0.75) / sortedAfterImages.length,
                                    Math.min(1, (index + 1) / sortedAfterImages.length),
                                  ]
                            : [0, 0, 1, 1],
                          sortedAfterImages.length > 1
                            ? index === 0
                              ? [1, 1, 0]
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

            {/* Generate button — idle state, centered (60px above the action buttons) */}
            {stage === "idle" && (
              <button
                onClick={handleGenerate}
                className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer group"
              >
                <motion.span
                  className="translate-y-[10px] px-5 py-2.5 bg-white/90 text-gray-900 rounded-full text-sm font-semibold shadow-lg group-hover:bg-white transition-colors"
                  animate={{ scale: [1, 1.1, 1, 1.06, 1] }}
                  transition={{
                    duration: 0.7,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <PlayIcon />
                  {generateButtonText ?? (
                    outputType === "poem" ? t("generatePoem") :
                    outputType === "roast" ? t("generateRoast") :
                    t("generatePortrait")
                  )}
                </motion.span>
              </button>
            )}

            {/* Action button (Print / Share) — appears after generate animation completes */}
            {(outputType === "portrait" || outputType === "poem") && stage === "generating" && showActionButton && (
              <button
                onClick={handleAction}
                className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer group"
              >
                <span className={`translate-y-[90px] px-5 py-2.5 ${outputType === "poem" ? "bg-white/75" : "bg-white/90"} text-gray-900 rounded-full text-sm font-semibold shadow-lg group-hover:bg-white transition-colors`}>
                  {actionButtonLabel}
                </span>
              </button>
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
            {outputType === "portrait" && (
              <motion.p
                className="absolute inset-0 text-text-primary text-base md:text-lg font-medium"
                style={{ opacity: printLabelOpacity }}
              >
                Print your portrait
              </motion.p>
            )}
          </div>

        </motion.div>

        {/* Printer - portrait only */}
        {outputType === "portrait" && (
          <motion.div
            className="absolute bottom-0"
            style={{
              x: printerX,
              opacity: printerOpacity,
              height: "min(30vh, 248px)",
              left: "calc(50% + 125px)",
              originY: 1,
            }}
          >
            <Image
              src="/images/printer.png"
              alt="Printer"
              width={150}
              height={400}
              className="h-full w-auto"
            />
          </motion.div>
        )}

        {/* Start again button — lives outside the booth motion.div so z-[60] beats hand z-50 */}
        {stage === "done" && (
          <button
            onClick={handleStartAgain}
            className="absolute inset-0 z-[60] flex items-center justify-center cursor-pointer group"
          >
            <span className={`${outputType === "poem" ? "-translate-y-[110px] md:translate-y-[10px]" : outputType === "roast" ? "translate-y-[40px]" : "translate-y-[90px] md:-translate-y-[60px]"} px-5 py-2.5 bg-white/90 text-gray-900 rounded-full text-sm font-semibold shadow-lg group-hover:bg-white transition-colors`}>
              <RestartIcon />
              {t("startAgain")}
            </span>
          </button>
        )}
      </div>

      {/* Hand with phone - poem edition only (not roast) */}
      {outputType === "poem" && (
        <motion.div
          className="absolute bottom-0 right-0 z-50 pointer-events-none origin-bottom-right scale-75 md:scale-100"
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
          className="absolute bottom-0 left-0 z-50 pointer-events-none origin-bottom-left scale-75 md:scale-100"
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
