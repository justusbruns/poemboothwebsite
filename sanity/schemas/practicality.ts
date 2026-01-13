import { defineField, defineType } from "sanity";

export default defineType({
  name: "practicality",
  title: "Practicality",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      description: 'Item title (e.g., "Footprint", "Setup & Teardown")',
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      description: "SVG icon or image",
      options: { hotspot: true },
    }),
    defineField({
      name: "iconSvg",
      title: "Icon SVG Code",
      type: "text",
      description: "Alternatively, paste SVG code directly",
      rows: 5,
    }),
    defineField({
      name: "valueUS",
      title: "US Value",
      type: "localizedString",
      description: 'Value for US region (e.g., "5ft x 5ft")',
    }),
    defineField({
      name: "valueEU",
      title: "EU Value",
      type: "localizedString",
      description: 'Value for EU region (e.g., "1.5m x 1.5m")',
    }),
    defineField({
      name: "bullets",
      title: "Bullet Points",
      type: "array",
      of: [{ type: "localizedString" }],
      description: "List items (for items like Setup & Teardown with multiple values)",
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
      media: "icon",
    },
    prepare({ title, media }) {
      return {
        title: title || "Untitled",
        media,
      };
    },
  },
});
