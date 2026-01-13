import { defineField, defineType } from "sanity";

export default defineType({
  name: "hero",
  title: "Hero Section",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "localizedString",
      description: 'Main headline (e.g., "From Moment to Masterpiece")',
    }),
    defineField({
      name: "subheadline",
      title: "Subheadline",
      type: "localizedText",
      description: "Supporting text below the headline",
    }),
    defineField({
      name: "ctaButtonText",
      title: "CTA Button Text",
      type: "localizedString",
      description: 'Primary call-to-action button (e.g., "Book now")',
    }),
    defineField({
      name: "ctaEmailText",
      title: "Email CTA Text",
      type: "localizedString",
      description: 'Secondary email CTA (e.g., "Or email contact@poembooth.com")',
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      description: "Main hero image (person with artistic frame)",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Hero Section" };
    },
  },
});
