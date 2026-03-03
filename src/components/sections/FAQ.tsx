import { getTranslations } from "next-intl/server";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FAQTabs from "./FAQTabs";

const TABS = ["general", "agencies", "private", "editions"] as const;
type Tab = (typeof TABS)[number];

const FAQ_KEYS: Record<Tab, string[]> = {
  general: ["q1", "q2", "q3", "q4", "q5"],
  agencies: ["q1", "q2", "q3", "q4"],
  private: ["q1", "q2", "q3", "q4"],
  editions: ["q1", "q2", "q3", "q4"],
};

export default async function FAQ({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "faq" });

  const tabLabels: Record<Tab, string> = {
    general: t("tabs.general"),
    agencies: t("tabs.agencies"),
    private: t("tabs.private"),
    editions: t("tabs.editions"),
  };

  return (
    <section id="faq" className="section-padding bg-bg-primary">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        {/* Tab buttons — client component for interactivity only */}
        <FAQTabs tabLabels={tabLabels} />

        {/* All tab panels rendered in HTML — crawlable without JS */}
        <div className="max-w-3xl mx-auto">
          {TABS.map((tab) => (
            <div
              key={tab}
              id={`faq-panel-${tab}`}
              className={tab === "general" ? "" : "hidden"}
            >
              {FAQ_KEYS[tab].map((key) => (
                <details key={key} className="group border-b border-border">
                  <summary className="flex w-full items-center justify-between py-5 cursor-pointer [&::-webkit-details-marker]:hidden [&::marker]:hidden">
                    <span className="text-base font-medium text-text-primary pr-4">
                      {t(`${tab}.${key}.q`)}
                    </span>
                    <svg
                      className="w-5 h-5 shrink-0 text-text-secondary transition-transform duration-200 group-open:rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </summary>
                  <div className="pb-5">
                    <p className="text-text-secondary leading-relaxed">
                      {t(`${tab}.${key}.a`)}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
