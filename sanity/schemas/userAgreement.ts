import { defineField, defineType } from "sanity";

export default defineType({
  name: "userAgreement",
  title: "User Agreement",
  type: "document",
  fields: [
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      description: "Which region this agreement applies to",
      options: {
        list: [
          { title: "United States (MacAllen Media)", value: "us" },
          { title: "Europe & Rest of World (VOUW BV)", value: "eu" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      description: "Page title for the user agreement",
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
      description: "Date when the agreement was last updated",
    }),
    // Content fields for each language (Portable Text)
    defineField({
      name: "content_en",
      title: "Content (English)",
      type: "array",
      of: [{ type: "block" }],
      description: "User agreement content in English",
    }),
    defineField({
      name: "content_nl",
      title: "Content (Dutch)",
      type: "array",
      of: [{ type: "block" }],
      description: "User agreement content in Dutch",
    }),
    defineField({
      name: "content_de",
      title: "Content (German)",
      type: "array",
      of: [{ type: "block" }],
      description: "User agreement content in German",
    }),
    defineField({
      name: "content_fr",
      title: "Content (French)",
      type: "array",
      of: [{ type: "block" }],
      description: "User agreement content in French",
    }),
    defineField({
      name: "content_it",
      title: "Content (Italian)",
      type: "array",
      of: [{ type: "block" }],
      description: "User agreement content in Italian",
    }),
  ],
  preview: {
    select: {
      region: "region",
      title: "title.en",
    },
    prepare({ region, title }) {
      return {
        title: title || "User Agreement",
        subtitle: region === "us" ? "United States" : "Europe & ROW",
      };
    },
  },
});
