import { defineField, defineType } from "sanity";

export default defineType({
  name: "localizedText",
  title: "Localized Text",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "nl",
      title: "Dutch",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "de",
      title: "German",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "fr",
      title: "French",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "it",
      title: "Italian",
      type: "text",
      rows: 3,
    }),
  ],
});
