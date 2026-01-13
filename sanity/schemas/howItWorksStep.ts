import { defineField, defineType } from "sanity";

export default defineType({
  name: "howItWorksStep",
  title: "How It Works Step",
  type: "document",
  fields: [
    defineField({
      name: "stepNumber",
      title: "Step Number",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(10),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      description: 'Step title (e.g., "Press & Pose")',
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
      description: "Step description",
    }),
    defineField({
      name: "icon",
      title: "Icon",
      type: "image",
      description: "Icon or illustration for this step",
      options: { hotspot: true },
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
      title: "Step Number",
      name: "stepAsc",
      by: [{ field: "stepNumber", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      stepNumber: "stepNumber",
      title: "title.en",
      media: "icon",
    },
    prepare({ stepNumber, title, media }) {
      return {
        title: `Step ${stepNumber}: ${title || "Untitled"}`,
        media,
      };
    },
  },
});
