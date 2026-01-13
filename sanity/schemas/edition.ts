import { defineField, defineType } from "sanity";

export default defineType({
  name: "edition",
  title: "Edition",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      description: 'Edition title (e.g., "The Portrait Edition")',
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "isNew",
      title: "Show \"New\" Badge",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "localizedText",
      description: 'Subtitle (e.g., "Take a picture and 30 seconds later...")',
    }),
    defineField({
      name: "duration",
      title: "Duration (seconds)",
      type: "number",
      description: "Time it takes to generate output (e.g., 30 or 10)",
    }),
    defineField({
      name: "outputType",
      title: "Output Type",
      type: "string",
      options: {
        list: [
          { title: "Portrait", value: "portrait" },
          { title: "Poem", value: "poem" },
        ],
      },
    }),
    defineField({
      name: "boothImage",
      title: "Booth Image",
      type: "image",
      options: { hotspot: true },
      description: "Image of the booth",
    }),
    defineField({
      name: "beforeImage",
      title: "Before Image",
      type: "image",
      options: { hotspot: true },
      description: '"Take a picture" example image',
    }),
    defineField({
      name: "afterImage",
      title: "After Image (Legacy)",
      type: "image",
      options: { hotspot: true },
      description: "Single output example (use After Images array instead)",
      hidden: true,
    }),
    defineField({
      name: "afterImages",
      title: "After Images (Slideshow)",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Multiple output examples that cycle on the screen (3-4 sec each)",
      hidden: ({ document }) => document?.outputType === "poem",
    }),
    defineField({
      name: "poemStyles",
      title: "Poem Styles",
      type: "array",
      of: [{ type: "reference", to: [{ type: "poemStyle" }] }],
      description: "Select poem styles to display (only for Original Edition)",
      hidden: ({ document }) => document?.outputType !== "poem",
    }),
    defineField({
      name: "beforeLabel",
      title: "Before Label",
      type: "localizedString",
      description: 'Label under before image (e.g., "Take a picture")',
    }),
    defineField({
      name: "afterLabel",
      title: "After Label",
      type: "localizedString",
      description: 'Label under after image (e.g., "Get a portrait")',
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
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
      isNew: "isNew",
      media: "boothImage",
    },
    prepare({ title, isNew, media }) {
      return {
        title: `${title || "Untitled"}${isNew ? " (New)" : ""}`,
        media,
      };
    },
  },
});
