import { defineField, defineType } from "sanity";

export default defineType({
  name: "pricingItem",
  title: "Pricing Item",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      description: 'Item title (e.g., "Transport rate", "Base rental fee")',
    }),
    defineField({
      name: "descriptionUS",
      title: "Description (US)",
      type: "localizedText",
      description: "Description for US region",
    }),
    defineField({
      name: "descriptionEU",
      title: "Description (EU)",
      type: "localizedText",
      description: "Description for EU region",
    }),
    defineField({
      name: "priceUS",
      title: "Price (US)",
      type: "string",
      description: 'US price display (e.g., "$1,200/day")',
    }),
    defineField({
      name: "priceEU",
      title: "Price (EU)",
      type: "string",
      description: 'EU price display (e.g., "€950/day")',
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "localizedString",
      description: 'Optional note (e.g., "excludes 30km radius")',
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title.en",
      priceUS: "priceUS",
      priceEU: "priceEU",
    },
    prepare({ title, priceUS, priceEU }) {
      return {
        title: title || "Untitled",
        subtitle: `US: ${priceUS || "-"} | EU: ${priceEU || "-"}`,
      };
    },
  },
});
