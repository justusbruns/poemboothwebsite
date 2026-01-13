import { defineField, defineType } from "sanity";

export default defineType({
  name: "bookingSection",
  title: "Booking Section",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "localizedString",
      description: 'Section title (e.g., "Booking & Rates")',
    }),
    defineField({
      name: "ctaButtonText",
      title: "CTA Button Text",
      type: "localizedString",
      description: 'Button text (e.g., "Get a Quote")',
    }),
    defineField({
      name: "footnote",
      title: "Footnote",
      type: "localizedText",
      description: "Footnote text (e.g., pricing disclaimer)",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Booking Section" };
    },
  },
});
