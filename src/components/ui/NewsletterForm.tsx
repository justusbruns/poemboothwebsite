"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { CONSENT_TEXT, normLocale } from "@/lib/newsletter-copy";

type State = "idle" | "loading" | "done" | "invalid" | "consent" | "error";

interface NewsletterFormProps {
  variant: "dark" | "light";
  /** next-intl namespace that has `placeholder` and `cta` keys */
  namespace: string;
  /** where the form sits, logged with the signup */
  location: "footer" | "section";
}

// Newsletter signup (Resend, double opt-in via /api/newsletter). Same flow as vouw.com.
export default function NewsletterForm({ variant, namespace, location }: NewsletterFormProps) {
  const t = useTranslations(namespace);
  const f = useTranslations("newsletterForm");
  const params = useParams<{ locale: string; region: string }>();
  const lang = normLocale(params?.locale);
  const [email, setEmail] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<State>("idle");

  const isDark = variant === "dark";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) return setState("consent");
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, organisation, consent, website, location, lang, region: params?.region }),
      });
      if (res.ok) return setState("done");
      const data = await res.json().catch(() => ({}));
      setState(data?.error === "invalid_email" ? "invalid" : data?.error === "consent_required" ? "consent" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className={`font-display text-lg leading-snug ${isDark ? "text-white" : "text-text-primary"}`}>
        {f("checkInbox")}
      </p>
    );
  }

  const inputClass = isDark
    ? "w-full min-w-0 rounded-md px-4 py-2.5 text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
    : "w-full min-w-0 rounded-md px-4 py-2.5 text-sm bg-white border border-black/15 text-text-primary placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20";

  const buttonClass = isDark
    ? "shrink-0 rounded-md px-5 py-2.5 text-sm font-medium bg-white text-text-primary hover:bg-white/90 disabled:opacity-60 transition-colors"
    : "shrink-0 rounded-md px-5 py-2.5 text-sm font-medium bg-text-primary text-white hover:bg-text-primary/80 disabled:opacity-60 transition-colors";

  const errorText = state === "invalid" ? f("invalidEmail") : state === "consent" ? f("consentRequired") : state === "error" ? f("error") : null;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
      {/* Honeypot: hidden from people and screen readers, bots tend to fill it. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
        <label>Website <input type="text" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} /></label>
      </div>

      <div className="flex flex-row gap-3">
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "invalid" || state === "error") setState("idle");
          }}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          aria-invalid={state === "invalid"}
          className={`flex-1 ${inputClass}`}
        />
        <button type="submit" disabled={state === "loading"} className={buttonClass}>
          {state === "loading" ? "…" : t("cta")}
        </button>
      </div>

      <input
        type="text"
        name="organization"
        autoComplete="organization"
        maxLength={120}
        value={organisation}
        onChange={(e) => setOrganisation(e.target.value)}
        placeholder={f("organisation")}
        aria-label={f("organisation")}
        className={inputClass}
      />

      <label className={`flex gap-2.5 items-start cursor-pointer text-xs leading-relaxed ${isDark ? "text-white/70" : "text-text-secondary"}`}>
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => {
            setConsent(e.target.checked);
            if (state === "consent") setState("idle");
          }}
          className="mt-0.5 h-4 w-4 shrink-0"
          style={{ accentColor: isDark ? "#ffffff" : "#333333" }}
        />
        <span>{CONSENT_TEXT[lang]}</span>
      </label>

      {errorText && (
        <p role="alert" className={`text-xs ${isDark ? "text-red-300" : "text-red-600"}`}>{errorText}</p>
      )}
    </form>
  );
}
