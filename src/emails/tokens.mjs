// Design tokens for Poem Booth email (and the web pages that mirror an email, like
// the newsletter thank-you page). Values follow src/app/globals.css @theme; email
// clients can't read CSS variables, so they live here as plain values.
// Same shape as the VOUW tokens (vouw-website emails/tokens.mjs) so layout.mjs is
// shared code.
export const color = {
  paper: "#F7F7F3",      // page background            (--color-bg-secondary)
  card: "#FFFFFF",       // letter background          (--color-bg-primary)
  ink: "#333333",        // headline                   (--color-text-primary)
  ink2: "#555555",       // body
  ink3: "#808080",       // notes, footer
  line: "#E5E5E5",       // rules                      (--color-border)
  control: "#333333",    // button background          (--color-button-primary)
  controlFg: "#FFFFFF",  // button text                (--color-button-text)
  glow: "#333333",       // links
  // Dark mode (clients that honour prefers-color-scheme: Apple Mail, iOS Mail,
  // Outlook for Mac/iOS, Outlook.com via [data-ogsc]).
  dark: {
    paper: "#1A1A18",
    card: "#242422",
    ink: "#F7F7F3",
    ink2: "#D6D6D0",
    ink3: "#A3A39C",
    line: "#3A3A36",
    control: "#F7F7F3",
    controlFg: "#333333",
    glow: "#F7F7F3",
  },
};

export const font = {
  // Century Old Style isn't a web font in mail; Georgia is the closest safe serif.
  display: "'Century Old Style', Georgia, 'Times New Roman', serif",
  ui: "Inter, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
};

export const size = {
  width: 560,      // letter max width (px)
  title: 30,       // headline
  body: 16,
  note: 13,
  footer: 12,
  logoWidth: 120,  // displayed; the PNG is 2x (240px)
};

export const brand = {
  name: "Poem Booth",
  // Fixed URLs on the public host, no redirects (some clients don't follow them for images).
  logoUrl: "https://www.poembooth.com/email/logo.png",
  logoLightUrl: "https://www.poembooth.com/email/logo-light.png", // for dark mode
  address: "Poem Booth by VOUW · Generaal Vetterstraat 57, 1059 BT Amsterdam",
  site: "https://www.poembooth.com",
  siteLabel: "poembooth.com",
};
