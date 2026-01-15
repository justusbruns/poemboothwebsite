"use client";

import Image from "next/image";

interface PrintCardProps {
  type: "portrait" | "poem";
  image: string;
  poemText?: string;
}

export default function PrintCard({
  type,
  image,
  poemText,
}: PrintCardProps) {
  if (type === "portrait") {
    // Portrait: Square artwork image (height leading), with bent paper mask
    return (
      <div
        className="relative h-full aspect-square"
        style={{
          maskImage: "url(/images/mask.svg)",
          WebkitMaskImage: "url(/images/mask.svg)",
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      >
        <Image
          src={image}
          alt="Portrait artwork"
          fill
          className="object-cover"
        />
        {/* Glare overlay - masked with image */}
        <Image
          src="/images/glare.png"
          alt=""
          fill
          className="object-cover pointer-events-none"
        />
      </div>
    );
  }

  // Poem edition - square blue gradient card (height leading), NO rounded corners
  return (
    <div className="relative h-full aspect-square bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 p-4">
      <div className="flex gap-3 h-full items-center">
        {/* Photo on left - takes ~half width, with rounded corners */}
        <div className="relative w-1/2 h-full rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={image}
            alt="Original photo"
            fill
            className="object-cover"
          />
        </div>
        {/* Poem text on right - vertically centered, not italic */}
        <div className="flex-1 flex flex-col justify-center text-white overflow-hidden">
          <p className="text-sm leading-snug font-light whitespace-pre-wrap">
            {poemText || "Your poem will appear here..."}
          </p>
        </div>
      </div>
      {/* Logo at bottom right - just logo, no text */}
      <div className="absolute bottom-3 right-4">
        <Image
          src="/images/logo-poem.png"
          alt="Poem Booth"
          width={100}
          height={100}
          className="opacity-90 w-[100px] h-auto"
        />
      </div>
    </div>
  );
}
