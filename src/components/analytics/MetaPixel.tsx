"use client";

import { useEffect } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { META_PIXEL_ID, trackMeta } from "@/lib/meta";

type FbqStub = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[];
  push: unknown;
  loaded: boolean;
  version: string;
};

let initialized = false;

/** Standard fbq queue stub (same as Meta's snippet); calls queue until fbevents.js loads. */
function ensureFbq() {
  const w = window as unknown as { fbq?: FbqStub; _fbq?: FbqStub };
  if (!w.fbq) {
    const n = function (...args: unknown[]) {
      if (n.callMethod) n.callMethod(...args);
      else n.queue.push(args);
    } as FbqStub;
    n.queue = [];
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    w.fbq = n;
    if (!w._fbq) w._fbq = n;
  }
  if (!initialized) {
    w.fbq!("init", META_PIXEL_ID);
    initialized = true;
  }
}

/**
 * Loads the Meta Pixel. Only rendered after consent (or in regions without a
 * consent requirement) and only when NEXT_PUBLIC_META_PIXEL_ID is set.
 * Fires PageView (with event_id) on initial load and on every route change.
 */
export function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString();

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    ensureFbq();
    trackMeta("PageView");
  }, [pathname, search]);

  if (!META_PIXEL_ID) return null;

  return (
    <Script
      id="meta-pixel"
      src="https://connect.facebook.net/en_US/fbevents.js"
      strategy="afterInteractive"
    />
  );
}
