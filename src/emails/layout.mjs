// The base email layout, shared with vouw.com (vouw-website emails/layout.mjs);
// only tokens.mjs differs. Every Poem Booth email (transactional and broadcast) is
// built from this: logo header, title, body, optional button, small note, footer
// with address and an optional unsubscribe slot.
//
//   renderEmail({ title, bodyHtml, button: { label, url }, note, unsubscribeUrl, preheader })
//     → { html, text }
//
// bodyHtml is trusted HTML (paragraphs). Everything else is escaped, unless
// `raw: true` (used to inject Resend template placeholders like {{{TITLE}}}).
// For broadcasts pass unsubscribeUrl: "{{{RESEND_UNSUBSCRIBE_URL}}}".
//
// Built for the awkward clients: tables + inline styles (Outlook/Word engine),
// colour-scheme meta + prefers-color-scheme (Apple Mail, iOS, Outlook Mac),
// [data-ogsc]/[data-ogsb] (Outlook.com dark), no web fonts required.
import { color as C, font as F, size as S, brand as B } from "./tokens.mjs";

export const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const D = C.dark;
const darkCss = `
:root { color-scheme: light dark; supported-color-schemes: light dark; }
@media (prefers-color-scheme: dark) {
  .v-bg { background-color: ${D.paper} !important; }
  .v-card { background-color: ${D.card} !important; }
  .v-title { color: ${D.ink} !important; }
  .v-body, .v-body p { color: ${D.ink2} !important; }
  .v-note, .v-foot { color: ${D.ink3} !important; }
  .v-foot a, .v-body a { color: ${D.glow} !important; }
  .v-rule { border-color: ${D.line} !important; }
  .v-btn { background-color: ${D.control} !important; }
  .v-btn a { color: ${D.controlFg} !important; }
  .v-logo-light { display: block !important; max-height: none !important; overflow: visible !important; }
  .v-logo-dark { display: none !important; }
}
[data-ogsc] .v-title { color: ${D.ink} !important; }
[data-ogsc] .v-body, [data-ogsc] .v-body p { color: ${D.ink2} !important; }
[data-ogsc] .v-note, [data-ogsc] .v-foot { color: ${D.ink3} !important; }
[data-ogsc] .v-btn a { color: ${D.controlFg} !important; }
[data-ogsb] .v-bg { background-color: ${D.paper} !important; }
[data-ogsb] .v-card { background-color: ${D.card} !important; }
[data-ogsb] .v-btn { background-color: ${D.control} !important; }
[data-ogsc] .v-logo-light { display: block !important; max-height: none !important; overflow: visible !important; }
[data-ogsc] .v-logo-dark { display: none !important; }
@media (max-width: 600px) {
  .v-pad { padding-left: 24px !important; padding-right: 24px !important; }
  .v-title { font-size: 26px !important; }
}`;

export function renderEmail({ title, bodyHtml = "", button, note, unsubscribeUrl, preheader = "", raw = false, lang = "en" } = {}) {
  const t = raw ? (s) => String(s ?? "") : esc;
  const btn = button?.label && button?.url
    ? `<tr><td class="v-pad" style="padding:0 48px 28px">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td class="v-btn" bgcolor="${C.control}" style="background-color:${C.control};border-radius:2px;padding:15px 28px;mso-padding-alt:15px 28px">
      <a href="${t(button.url)}" target="_blank" style="display:inline-block;font-family:${F.ui};font-size:15px;line-height:1;font-weight:500;color:${C.controlFg};text-decoration:none">${t(button.label)}</a>
    </td>
  </tr></table>
</td></tr>`
    : "";
  const noteRow = note
    ? `<tr><td class="v-pad v-note" style="padding:0 48px 36px;font-family:${F.ui};font-size:${S.note}px;line-height:1.6;color:${C.ink3}">${t(note)}</td></tr>`
    : `<tr><td style="padding:0 0 12px;font-size:0;line-height:0">&nbsp;</td></tr>`;
  const unsub = unsubscribeUrl
    ? `<br><a href="${t(unsubscribeUrl)}" style="color:${C.ink3};text-decoration:underline">Unsubscribe</a> · <a href="${B.site}" style="color:${C.ink3};text-decoration:underline">${esc(B.siteLabel)}</a>`
    : "";

  const html = `<!doctype html>
<html lang="${esc(lang)}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<meta name="x-apple-disable-message-reformatting">
<title>${t(title)}</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>${darkCss}</style>
</head>
<body class="v-bg" style="margin:0;padding:0;background-color:${C.paper};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${C.paper};opacity:0">${t(preheader)}&#8199;&#65279;&#847;&#8199;&#65279;&#847;&#8199;&#65279;&#847;</div>
<table role="presentation" class="v-bg" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.paper}" style="background-color:${C.paper}">
<tr><td align="center" style="padding:40px 16px">
<!--[if mso]><table role="presentation" width="${S.width}" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
<table role="presentation" class="v-card" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.card}" style="max-width:${S.width}px;background-color:${C.card};border-collapse:separate">
<tr><td class="v-pad" style="padding:40px 48px 32px">
  <a href="${B.site}" target="_blank" style="text-decoration:none">
    <img class="v-logo-dark" src="${B.logoUrl}" width="${S.logoWidth}" alt="${esc(B.name)}" style="display:block;width:${S.logoWidth}px;max-width:${S.logoWidth}px;height:auto;border:0;outline:none;color:${C.ink};font-family:${F.ui};font-size:16px;letter-spacing:0.14em">
    <!--[if !mso]><!--><div class="v-logo-light" style="display:none;max-height:0;overflow:hidden;mso-hide:all"><img src="${B.logoLightUrl}" width="${S.logoWidth}" alt="" style="display:block;width:${S.logoWidth}px;max-width:${S.logoWidth}px;height:auto;border:0;outline:none"></div><!--<![endif]-->
  </a>
</td></tr>
<tr><td class="v-pad v-title" style="padding:0 48px 18px;font-family:${F.display};font-size:${S.title}px;line-height:1.15;font-weight:normal;color:${C.ink}">${t(title)}</td></tr>
<tr><td class="v-pad v-body" style="padding:0 48px 28px;font-family:${F.ui};font-size:${S.body}px;line-height:1.65;color:${C.ink2}">${bodyHtml}</td></tr>
${btn}
${noteRow}
<tr><td class="v-pad" style="padding:0 48px 36px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td class="v-rule v-foot" style="border-top:1px solid ${C.line};padding-top:20px;font-family:${F.ui};font-size:${S.footer}px;line-height:1.6;color:${C.ink3}">${esc(B.address)}${unsub}</td>
  </tr></table>
</td></tr>
</table>
<!--[if mso]></td></tr></table><![endif]-->
</td></tr>
</table>
</body>
</html>`;

  return { html, text: toText({ title, bodyHtml, button, note, unsubscribeUrl }) };
}

// Plain-text twin (deliverability + clients that prefer text).
function toText({ title, bodyHtml, button, note, unsubscribeUrl }) {
  const body = String(bodyHtml || "")
    .replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>\s*/gi, "\n\n").replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n").trim();
  return [
    title, "", body,
    button?.url ? `\n${button.label}: ${button.url}` : "",
    note ? `\n${note}` : "",
    "\n--", B.address,
    unsubscribeUrl ? `Unsubscribe: ${unsubscribeUrl}` : "",
  ].filter((x) => x !== "").join("\n");
}
