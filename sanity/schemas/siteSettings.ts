import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      initialValue: "contact@poembooth.com",
    }),
    defineField({
      name: "bookingUrl",
      title: "Booking URL",
      type: "url",
      initialValue: "https://book.poembooth.com",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
