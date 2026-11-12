import Link from "next/link";
import { color as C, size as S, brand as B } from "@/emails/tokens.mjs";

// Web twin of the base email layout (src/emails/layout.mjs): logo header, title,
// body, buttons, small note, footer with the address. Used for pages that close an
// email loop, like the newsletter thank-you page.
type Btn = { href: string; label: string };
export default function LetterCard({ title, children, buttons = [], note }: { title: string; children: React.ReactNode; buttons?: Btn[]; note?: string | null }) {
  const pad = "clamp(24px,6vw,48px)";
  return (
    <div style={{ background: C.paper, padding: "clamp(40px,8vw,96px) 16px" }}>
      <article style={{ maxWidth: S.width, margin: "0 auto", background: C.card, border: `1px solid ${C.line}` }}>
        <div style={{ padding: `40px ${pad} 32px` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/email/logo.png" width={S.logoWidth} alt={B.name} style={{ display: "block", width: S.logoWidth, height: "auto" }} />
        </div>
        <h1 className="font-display" style={{ fontSize: "clamp(26px,4vw,34px)", lineHeight: 1.15, color: C.ink, margin: 0, padding: `0 ${pad} 18px` }}>{title}</h1>
        <div className="font-body" style={{ fontSize: S.body, lineHeight: 1.65, color: C.ink2, padding: `0 ${pad} 28px` }}>{children}</div>
        {buttons.length ? (
          <div style={{ padding: `0 ${pad} 28px`, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {buttons.map((b, i) => (
              <Link key={b.href} href={b.href} className="font-body" style={{ display: "inline-block", fontSize: 15, fontWeight: 500, padding: "15px 28px", borderRadius: 2, textDecoration: "none",
                background: i === 0 ? C.control : "transparent", color: i === 0 ? C.controlFg : C.ink, border: `1px solid ${i === 0 ? C.control : C.ink}` }}>{b.label}</Link>
            ))}
          </div>
        ) : null}
        {note ? <p className="font-body" style={{ fontSize: S.note, lineHeight: 1.6, color: C.ink3, margin: 0, padding: `0 ${pad} 36px` }}>{note}</p> : null}
        <div style={{ padding: `0 ${pad} 36px` }}>
          <div className="font-body" style={{ borderTop: `1px solid ${C.line}`, paddingTop: 20, fontSize: S.footer, lineHeight: 1.6, color: C.ink3 }}>{B.address}</div>
        </div>
      </article>
    </div>
  );
}
