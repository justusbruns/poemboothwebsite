import { defineField, defineType } from "sanity";

export default defineType({
  name: "localizedString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({
      name: "en",
      title: "English",
      type: "string",
    }),
    defineField({
      name: "nl",
      title: "Dutch",
      type: "string",
    }),
    defineField({
      name: "de",
      title: "German",
      type: "string",
    }),
    defineField({
      name: "fr",
      title: "French",
      type: "string",
    }),
    defineField({
      name: "it",
      title: "Italian",
      type: "string",
    }),
  ],
});
