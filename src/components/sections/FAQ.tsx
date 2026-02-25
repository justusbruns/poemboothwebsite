"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const TABS = ["general", "agencies", "private", "editions"] as const;
type Tab = (typeof TABS)[number];

const FAQ_KEYS: Record<Tab, string[]> = {
  general: ["q1", "q2", "q3", "q4", "q5"],
  agencies: ["q1", "q2", "q3", "q4"],
  private: ["q1", "q2", "q3", "q4"],
  editions: ["q1", "q2", "q3", "q4"],
};

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        className="flex w-full items-center justify-between py-5 text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium text-text-primary pr-4">
          {question}
        </span>
        <svg
          className={`w-5 h-5 shrink-0 text-text-secondary transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-96 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-text-secondary leading-relaxed">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const t = useTranslations("faq");
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <section id="faq" className="section-padding bg-bg-primary">
      <Container>
        <SectionHeading title={t("title")} subtitle={t("subtitle")} />

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mt-10 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-text-primary text-bg-primary"
                  : "bg-bg-secondary text-text-secondary hover:text-text-primary"
              }`}
            >
              {t(`tabs.${tab}`)}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto">
          {FAQ_KEYS[activeTab].map((key) => {
            const itemKey = `${activeTab}.${key}`;
            return (
              <AccordionItem
                key={itemKey}
                question={t(`${activeTab}.${key}.q`)}
                answer={t(`${activeTab}.${key}.a`)}
                isOpen={!!openItems[itemKey]}
                onToggle={() => toggleItem(itemKey)}
              />
            );
          })}
        </div>
      </Container>
    </section>
  );
}
