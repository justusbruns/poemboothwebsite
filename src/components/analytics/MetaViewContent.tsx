"use client";

import { useEffect } from "react";
import { trackMeta } from "@/lib/meta";

interface MetaViewContentProps {
  contentName: string;
  contentCategory?: string;
  contentIds?: string[];
}

/** Fires a Meta ViewContent event once when a style/product page mounts. */
export function MetaViewContent({ contentName, contentCategory, contentIds }: MetaViewContentProps) {
  const ids = contentIds?.join(",");
  useEffect(() => {
    // Pixel may still be initialising (it mounts in the same commit); defer
    // slightly so the fbq stub exists. trackMeta is a no-op without consent.
    const t = window.setTimeout(() => {
      trackMeta("ViewContent", {
        content_name: contentName,
        ...(contentCategory ? { content_category: contentCategory } : {}),
        ...(ids ? { content_ids: ids.split(","), content_type: "product" } : {}),
      });
    }, 50);
    return () => window.clearTimeout(t);
  }, [contentName, contentCategory, ids]);
  return null;
}
