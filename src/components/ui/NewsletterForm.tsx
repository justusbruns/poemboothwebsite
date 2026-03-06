"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

type State = "idle" | "loading" | "success" | "error";

interface NewsletterFormProps {
  variant: "dark" | "light";
  /** next-intl namespace that has `placeholder` and `cta` keys */
  namespace: string;
}

export default function NewsletterForm({ variant, namespace }: NewsletterFormProps) {
  const t = useTranslations(namespace);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const isDark = variant === "dark";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setState("success");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error || "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <p className={`text-sm ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
        Thanks for subscribing!
      </p>
    );
  }

  const inputClass = isDark
    ? "flex-1 min-w-0 rounded-md px-4 py-2.5 text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/40"
    : "flex-1 min-w-0 rounded-md px-4 py-2.5 text-sm bg-white border border-black/15 text-text-primary placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/20";

  const buttonClass = isDark
    ? "shrink-0 rounded-md px-5 py-2.5 text-sm font-medium bg-white text-text-primary hover:bg-white/90 disabled:opacity-60 transition-colors"
    : "shrink-0 rounded-md px-5 py-2.5 text-sm font-medium bg-text-primary text-white hover:bg-text-primary/80 disabled:opacity-60 transition-colors";

  return (
    <div className="flex flex-col gap-2">
      <form onSubmit={handleSubmit} className="flex flex-row gap-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder={t("placeholder")}
          className={inputClass}
        />
        <button type="submit" disabled={state === "loading"} className={buttonClass}>
          {state === "loading" ? "…" : t("cta")}
        </button>
      </form>
      {state === "error" && (
        <p className={`text-xs ${isDark ? "text-red-400" : "text-red-600"}`}>{errorMsg}</p>
      )}
    </div>
  );
}
