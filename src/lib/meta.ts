// Meta Pixel helpers. All calls are no-ops until the pixel has been loaded
// (which only happens after consent, see AnalyticsProvider).

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

export function newEventId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback for older browsers: RFC4122-ish v4
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const STANDARD_EVENTS = new Set([
  "PageView", "ViewContent", "Lead", "Contact", "InitiateCheckout",
  "CompleteRegistration", "Schedule", "Search", "Subscribe", "Purchase",
]);

/**
 * Send a Meta Pixel event with a deduplication event_id (eventID), so the
 * same id can later be reused by a server-side Conversions API call.
 * Returns the event id used.
 */
export function trackMeta(
  event: string,
  params: Record<string, unknown> = {},
  eventId: string = newEventId()
): string {
  if (typeof window === "undefined" || !window.fbq) return eventId;
  const method = STANDARD_EVENTS.has(event) ? "track" : "trackCustom";
  window.fbq(method, event, params, { eventID: eventId });
  return eventId;
}
