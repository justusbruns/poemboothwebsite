This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Tracking

Analytics live in `src/components/analytics/` and are gated by the existing consent banner (`src/components/consent/CookieConsent.tsx`, stored via `src/lib/consent.ts` in `pb_analytics_consent`). EU regions (`nl, de, fr, it, be, row`) load GA4 and the Meta Pixel only after "accept"; `us` loads them directly. PostHog always runs, cookieless until consent.

### Meta Pixel

- Env var: `NEXT_PUBLIC_META_PIXEL_ID` (set in Vercel for Production + Preview). Without it the pixel is not loaded at all.
- Events (each with a uuid `eventID` for deduplication with a future Conversions API):
  - `PageView` on initial load and every route change
  - `ViewContent` on `/[locale]/[region]/styles` (content_ids = style slugs/ids)
  - `Lead` on booking CTA clicks (`trackLeadIntent` in `src/lib/tracking.ts`)
- Helper: `trackMeta(event, params, eventId?)` in `src/lib/meta.ts` (returns the event id; no-op without consent/pixel).

### Attribution (UTM)

- On every landing/navigation, `utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, gclid`, the external `document.referrer` and the landing path are captured (`src/lib/attribution.ts`).
- First touch is kept forever, last touch is replaced by each new tagged visit or external referral.
- Stored (only when tracking is allowed) in localStorage (`pb_attr_first`, `pb_attr_last`) and cookie `pb_attr` (JSON `{first,last}`, 30 days, `SameSite=Lax`, `Domain=.poembooth.com`) so `book.poembooth.com` can read it.
- All links to `book.poembooth.com` (or `NEXT_PUBLIC_BOOKING_URL`'s host), including ones rendered later, get the last-touch `utm_*` and `fbclid` appended. Existing params (`boothType`, `style`, explicit `utm_*`) are never overwritten.
- When PostHog is loaded the values are registered as event properties (`first_utm_source`, `last_utm_source`, ...) and, with consent, set as person properties (last = `$set`, first = `$set_once`).

### How to test

1. Set `NEXT_PUBLIC_META_PIXEL_ID` in `.env.local`, run `npm run dev`.
2. Install the [Meta Pixel Helper](https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc) Chrome extension.
3. Open `http://localhost:3000/en/nl?utm_source=meta&utm_medium=paid&utm_campaign=test&fbclid=abc`. Before accepting cookies the helper shows no pixel; after accepting it shows `PageView` (with an event id).
4. Navigate to Styles: a new `PageView` plus `ViewContent`.
5. In DevTools: `document.cookie` contains `pb_attr` (on poembooth.com with `Domain=.poembooth.com`), and every `book.poembooth.com` link carries the utm/fbclid params next to existing ones.
6. In Meta Events Manager > Test events you can verify the events arrive.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
