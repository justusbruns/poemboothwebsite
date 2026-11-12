// Types for the shared JS email layout (layout.mjs is kept as plain JS so it stays
// byte-compatible with vouw-website's copy).
export declare const esc: (s: unknown) => string;
export declare function renderEmail(opts: {
  title: string;
  bodyHtml?: string;
  button?: { label: string; url: string };
  note?: string;
  unsubscribeUrl?: string;
  preheader?: string;
  raw?: boolean;
  lang?: string;
}): { html: string; text: string };
