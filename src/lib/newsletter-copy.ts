// Newsletter copy shared by the signup form (client) and the API (server).
// The consent sentence lives here, not in messages/*.json, because the server
// logs the exact sentence the visitor saw as proof of consent.
import type { Locale } from "@/i18n/routing";

export const NEWSLETTER_LOCALES = ["en", "nl", "de", "fr", "it"] as const;
export const normLocale = (l: unknown): Locale =>
  (NEWSLETTER_LOCALES as readonly string[]).includes(l as string) ? (l as Locale) : "en";

export const CONSENT_TEXT: Record<Locale, string> = {
  en: "Yes, send me a few letters a year from Poem Booth. Unsubscribe anytime.",
  nl: "Ja, stuur me een paar keer per jaar een brief van Poem Booth. Afmelden kan altijd.",
  de: "Ja, schickt mir ein paar Briefe im Jahr von Poem Booth. Abmelden ist jederzeit möglich.",
  fr: "Oui, envoyez-moi quelques lettres par an de Poem Booth. Désinscription à tout moment.",
  it: "Sì, mandatemi qualche lettera all'anno da Poem Booth. Disiscrizione in qualsiasi momento.",
};

type ConfirmCopy = { subject: string; title: string; preheader: string; hi: string; body: string; button: string; note: string };

export const CONFIRM_EMAIL: Record<Locale, ConfirmCopy> = {
  en: {
    subject: "Confirm your subscription to Poem Booth",
    title: "One click and you're on the list.",
    preheader: "Confirm your email address to receive letters from Poem Booth.",
    hi: "Hi,",
    body: "Thanks for wanting to hear from us. Please confirm your email address so we know it's really you. A few times a year we send a letter about new editions, styles and the events where Poem Booth shows up.",
    button: "Confirm subscription",
    note: "This link works for 7 days. Didn't sign up? Then simply ignore this email and you won't hear from us.",
  },
  nl: {
    subject: "Bevestig je aanmelding bij Poem Booth",
    title: "Eén klik en je staat op de lijst.",
    preheader: "Bevestig je e-mailadres om brieven van Poem Booth te ontvangen.",
    hi: "Hoi,",
    body: "Leuk dat je van ons wilt horen. Bevestig je e-mailadres, dan weten we zeker dat jij het bent. Een paar keer per jaar sturen we een brief over nieuwe edities, stijlen en de events waar Poem Booth opduikt.",
    button: "Aanmelding bevestigen",
    note: "Deze link werkt 7 dagen. Niet aangemeld? Negeer deze mail dan gewoon, je hoort verder niets van ons.",
  },
  de: {
    subject: "Bitte bestätige dein Abo bei Poem Booth",
    title: "Ein Klick, und du bist dabei.",
    preheader: "Bestätige deine E-Mail-Adresse, um Briefe von Poem Booth zu erhalten.",
    hi: "Hallo,",
    body: "Schön, dass du von uns hören möchtest. Bitte bestätige deine E-Mail-Adresse, damit wir wissen, dass du es wirklich bist. Ein paar Mal im Jahr schicken wir einen Brief über neue Editionen, Stile und die Events, auf denen Poem Booth zu Gast ist.",
    button: "Abo bestätigen",
    note: "Dieser Link ist 7 Tage gültig. Nicht angemeldet? Dann ignoriere diese E-Mail einfach, du hörst nichts mehr von uns.",
  },
  fr: {
    subject: "Confirmez votre inscription à Poem Booth",
    title: "Un clic et vous êtes sur la liste.",
    preheader: "Confirmez votre adresse e-mail pour recevoir les lettres de Poem Booth.",
    hi: "Bonjour,",
    body: "Merci de vouloir avoir de nos nouvelles. Confirmez votre adresse e-mail pour que nous sachions que c'est bien vous. Quelques fois par an, nous envoyons une lettre sur les nouvelles éditions, les styles et les événements où l'on retrouve Poem Booth.",
    button: "Confirmer l'inscription",
    note: "Ce lien est valable 7 jours. Vous ne vous êtes pas inscrit ? Ignorez simplement cet e-mail, vous n'entendrez plus parler de nous.",
  },
  it: {
    subject: "Conferma la tua iscrizione a Poem Booth",
    title: "Un clic e sei nella lista.",
    preheader: "Conferma il tuo indirizzo email per ricevere le lettere di Poem Booth.",
    hi: "Ciao,",
    body: "Grazie per voler ricevere nostre notizie. Conferma il tuo indirizzo email, così sappiamo che sei davvero tu. Qualche volta all'anno inviamo una lettera su nuove edizioni, stili e gli eventi in cui compare Poem Booth.",
    button: "Conferma iscrizione",
    note: "Questo link è valido 7 giorni. Non ti sei iscritto? Ignora semplicemente questa email e non riceverai altro da noi.",
  },
};
