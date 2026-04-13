import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  fields: [
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Display order in carousel (1 = first, 2 = second, …)",
    }),
    defineField({
      name: "eventName",
      title: "Event Name",
      type: "string",
      description: "Name of the event — shown in the carousel list and as caption",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "localizedString",
    }),
    defineField({
      name: "editionType",
      title: "Edition Type",
      type: "string",
      options: {
        list: [
          { title: "Portrait", value: "portrait" },
          { title: "Original (Poem)", value: "original" },
        ],
      },
    }),
    defineField({
      name: "contextText",
      title: "Context",
      type: "string",
      description: "One sentence about this event (e.g. 'Guests could walk up and leave with a personal poem in minutes.')",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
      description: "Show in featured gallery section",
    }),
    defineField({
      name: "regionVisibility",
      title: "Region Visibility",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "US", value: "us" },
          { title: "EU", value: "eu" },
          { title: "All", value: "all" },
        ],
      },
      initialValue: ["all"],
    }),
  ],
  preview: {
    select: {
      eventName: "eventName",
      order: "order",
      regionVisibility: "regionVisibility",
      media: "image",
    },
    prepare({ eventName, order, regionVisibility, media }) {
      const regions = (regionVisibility as string[] | undefined)?.join(", ") ?? "—";
      const num = order != null ? `#${order}` : "no order";
      return {
        title: eventName || "(no name)",
        subtitle: `${num} · ${regions}`,
        media,
      };
    },
  },
});
