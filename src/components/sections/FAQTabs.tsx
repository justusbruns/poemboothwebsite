"use client";

import { useState } from "react";

const TABS = ["general", "agencies", "private", "boothTypes"] as const;
type Tab = (typeof TABS)[number];

interface FAQTabsProps {
  tabLabels: Record<Tab, string>;
}

export default function FAQTabs({ tabLabels }: FAQTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("general");

  const handleTabClick = (tab: Tab) => {
    TABS.forEach((t) => {
      document.getElementById(`faq-panel-${t}`)?.classList.add("hidden");
    });
    document.getElementById(`faq-panel-${tab}`)?.classList.remove("hidden");
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-10 mb-8">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => handleTabClick(tab)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTab === tab
              ? "bg-text-primary text-bg-primary"
              : "bg-bg-secondary text-text-secondary hover:text-text-primary"
          }`}
        >
          {tabLabels[tab]}
        </button>
      ))}
    </div>
  );
}
