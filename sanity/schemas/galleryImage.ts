import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  fields: [
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
      name: "eventName",
      title: "Event Name",
      type: "string",
      description: "Name of the event where this was taken",
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
      editionType: "editionType",
      media: "image",
    },
    prepare({ eventName, editionType, media }) {
      return {
        title: eventName || "Gallery Image",
        subtitle: editionType,
        media,
      };
    },
  },
});
