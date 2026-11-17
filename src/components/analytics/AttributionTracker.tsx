"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import {
  attributionProps,
  captureAttribution,
  decorateBookingUrl,
  decorateLinksIn,
  getAttribution,
} from "@/lib/attribution";

interface AttributionTrackerProps {
  /** Whether attribution may be persisted (cookie/localStorage) */
  persistAllowed: boolean;
}

/**
 * Captures UTM/click-id attribution on landing and route changes, decorates
 * every link to the booking site (also ones rendered later), and passes the
 * attribution to PostHog when it is loaded.
 */
export function AttributionTracker({ persistAllowed }: AttributionTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString();

  // Capture + decorate on each navigation (and when consent changes)
  useEffect(() => {
    const attr = captureAttribution(persistAllowed);
    decorateLinksIn(document, attr);

    if (posthog.__loaded) {
      const props = attributionProps(attr);
      if (Object.keys(props).length) {
        posthog.register(props); // event properties on every subsequent event
        if (persistAllowed) {
          const first = Object.fromEntries(
            Object.entries(props).filter(([k]) => k.startsWith("first_"))
          );
          const last = Object.fromEntries(
            Object.entries(props).filter(([k]) => k.startsWith("last_"))
          );
          posthog.setPersonProperties(last, first); // set last, set_once first
        }
      }
    }
  }, [pathname, search, persistAllowed]);

  // Dynamically rendered links: observe DOM + safety net on click
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      const attr = getAttribution();
      if (!attr.last) return;
      for (const m of mutations) {
        if (m.type === "attributes" && m.target instanceof HTMLAnchorElement) {
          const href = m.target.getAttribute("href");
          if (href && /^https?:/i.test(href)) {
            const next = decorateBookingUrl(href, attr);
            if (next !== href) m.target.setAttribute("href", next);
          }
        }
        m.addedNodes.forEach((node) => {
          if (node instanceof HTMLAnchorElement && node.parentNode) {
            decorateLinksIn(node.parentNode, attr);
          } else if (node instanceof Element) {
            decorateLinksIn(node, attr);
          }
        });
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href"],
    });

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || !/^https?:/i.test(href)) return;
      const next = decorateBookingUrl(href);
      if (next !== href) a.setAttribute("href", next);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}
