"use client";

import NewsletterForm from "@/components/ui/NewsletterForm";

export default function FooterNewsletter() {
  return (
    <div className="w-full md:w-80">
      <NewsletterForm variant="dark" namespace="footer" />
    </div>
  );
}
