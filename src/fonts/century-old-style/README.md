# Century Old Style Std Font

To add the Century Old Style Std font:

1. Download the font files from the font provider
2. Convert to .woff2 format if needed (use a tool like Transfonter)
3. Add the following files to this directory:
   - `CenturyOldStyleStd-Regular.woff2`
   - `CenturyOldStyleStd-Bold.woff2`

The font is already configured in:
- `src/app/layout.tsx` (font loading)
- `src/app/globals.css` (CSS variables)

Until the font is added, the site will fallback to Georgia serif font.
