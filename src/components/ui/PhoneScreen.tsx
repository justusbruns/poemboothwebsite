"use client";

import Image from "next/image";

interface PhoneScreenProps {
  type: "portrait" | "poem";
  image: string;
  poemText?: string;
  shareText: string;
}

export default function PhoneScreen({
  type,
  image,
  poemText,
  shareText,
}: PhoneScreenProps) {
  if (type === "portrait") {
    // Portrait: white background, square image with rounded corners, button below (same layout as poem)
    return (
      <div className="w-full h-full bg-white rounded-[2rem] p-4 flex flex-col items-center justify-center gap-3">
        {/* Square portrait artwork with rounded corners */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden">
          <Image
            src={image}
            alt="Portrait artwork"
            fill
            className="object-cover"
          />
        </div>

        {/* Share button - gray pill (same position as poem) */}
        <div className="w-full">
          <div className="w-full py-2.5 bg-gray-200 rounded-full text-center">
            <span className="text-gray-600 text-sm font-medium">{shareText}</span>
          </div>
        </div>
      </div>
    );
  }

  // Poem edition - white bg with square blue gradient card inside
  return (
    <div className="w-full h-full bg-white rounded-[2rem] p-4 flex flex-col items-center justify-center gap-3">
      {/* Square blue gradient poem card */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 p-3">
        <div className="flex gap-2 h-full items-center">
          {/* Photo on left - takes ~half width, full height */}
          <div className="relative w-1/2 h-full rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={image}
              alt="Original photo"
              fill
              className="object-cover"
            />
          </div>
          {/* Poem text on right - vertically centered */}
          <div className="flex-1 flex flex-col justify-center text-white overflow-hidden">
            <p className="text-[0.56rem] leading-tight font-light opacity-95 whitespace-pre-wrap">
              {poemText || "Your poem will appear here..."}
            </p>
          </div>
        </div>

        {/* Logo at bottom right - 67px width */}
        <div className="absolute bottom-2 right-3">
          <Image
            src="/images/logo-poem.png"
            alt="Poem Booth"
            width={67}
            height={67}
            className="opacity-90 w-[67px] h-auto"
          />
        </div>
      </div>

      {/* Share button - gray pill */}
      <div className="w-full">
        <div className="w-full py-2.5 bg-gray-200 rounded-full text-center">
          <span className="text-gray-600 text-sm font-medium">{shareText}</span>
        </div>
      </div>
    </div>
  );
}
