import { getTranslations } from "next-intl/server";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FAQTabs from "./FAQTabs";

const TABS = ["general", "agencies", "private", "boothTypes"] as const;
type Tab = (typeof TABS)[number];

const FAQ_KEYS: Record<Tab, string[]> = {
  general: ["q1", "q2", "q3", "q4", "q5"],
  agencies: ["q1", "q2", "q3", "q4"],
  private: ["q1", "q2", "q3", "q4"],
  boothTypes: ["q1", "q2", "q3"],
};

export default async function FAQ({ locale, region }: { locale: string; region: string }) {
  const t = await getTranslations({ locale, namespace: "faq" });

  const isUS = region === "us";

  const tabLabels: Record<Tab, string> = {
    general: t("tabs.general"),
    agencies: t("tabs.agencies"),
    private: t("tabs.private"),
    boothTypes: t("tabs.boothTypes"),
  };

  // Region-specific answer for "Where can I hire?"
  const hireAnswer = isUS
    ? t.raw("general.q5.a_us") as string
    : t.raw("general.q5.a_eu") as string;

  return (
    <section id="faq" className="section-padding bg-bg-primary">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        <FAQTabs tabLabels={tabLabels} />

        <div className="max-w-3xl mx-auto">
          {TABS.map((tab) => (
            <div
              key={tab}
              id={`faq-panel-${tab}`}
              className={tab === "general" ? "" : "hidden"}
            >
              {FAQ_KEYS[tab].map((key) => {
                const answer =
                  tab === "general" && key === "q5"
                    ? hireAnswer
                    : t.raw(`${tab}.${key}.a`) as string;

                return (
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
                      <p
                        className="text-text-secondary leading-relaxed [&_a]:text-text-primary [&_a]:underline [&_a]:hover:no-underline"
                        dangerouslySetInnerHTML={{ __html: answer }}
                      />
                    </div>
                  </details>
                );
              })}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
