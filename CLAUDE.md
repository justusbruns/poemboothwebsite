# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

## Architecture Overview

**Poem Booth Website** - Marketing site for AI-powered portrait/poetry generation service. Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4.

### URL Structure: `/{locale}/{region}`

- **Locales:** `en`, `nl`, `de`, `fr`, `it` (5 languages)
- **Regions:** `us`, `eu` (affects pricing/content)
- Root `/` redirects to `/en/eu`

### Key Integrations

| System | Purpose | Location |
|--------|---------|----------|
| **Sanity CMS** | Content management | `/sanity/` schemas, `/studio` route |
| **Supabase** | Hub pricing data | `/src/lib/supabase/server.ts` |
| **next-intl** | Internationalization | `/src/i18n/`, `/src/messages/` |

### Directory Structure

```
/src/app
├── page.tsx                    # Root redirect to /{locale}/{region}
├── [locale]/[region]/page.tsx  # Main landing page
└── studio/[[...tool]]/         # Sanity CMS studio

/src/components
├── /layout    # Header, Footer, navigation
├── /sections  # Hero, Gallery, Pricing sections
└── /ui        # Button, Container, SectionHeading

/src/i18n
├── routing.ts  # Locale/region config, country mappings
└── request.ts  # Server-side i18n message loading

/sanity
├── /schemas   # Content type definitions
└── /lib       # Client, queries, image URL builder
```

### Data Flow

1. **Page Load** (`[locale]/[region]/page.tsx`):
   - Fetches all Sanity content via single GROQ query with region filter
   - Fetches hub pricing from Supabase via `getHubByRegion(region)`
   - Transforms localized fields: `{en, nl, de, fr, it}` → locale-specific string
   - Passes data to section components

2. **Localized Content Pattern**:
   ```typescript
   // Sanity fields use localizedString schema: {en, nl, de, fr, it}
   const getLocalizedValue = (field, locale) => field[locale] || field.en || ""
   ```

3. **Region Visibility**: Sanity content has `regionVisibility` field (`"us"`, `"eu"`, `"all"`) for filtering

### Component Patterns

- **Server Components**: Default; fetch data at page level
- **Client Components**: Marked `"use client"`; use `useTranslations()`, `useParams()`
- **Async Params**: `params: Promise<{locale, region}>` pattern (Next.js 15+)

### Styling

Tailwind CSS 4 with custom theme in `globals.css`:
- Brand colors: `text-text-primary`, `bg-bg-secondary`, etc.
- Fonts: `font-display` (Century Old Style), `font-body` (Inter)
- Custom utilities: `.section-padding`, `.animate-ticker`

### Environment Variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET
SUPABASE_ENV (production|staging)
NEXT_PUBLIC_SUPABASE_URL_PROD, NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD
NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_BOOKING_URL
```

### Deployment

- Vercel with `vercel.json` specifying `"framework": "nextjs"`
- Environment variables configured in Vercel dashboard
