import { defineField, defineType } from "sanity";

export default defineType({
  name: "footer",
  title: "Footer Settings",
  type: "document",
  fields: [
    // Contact Information
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      initialValue: "contact@poembooth.com",
    }),
    defineField({
      name: "instagramHandle",
      title: "Instagram Handle",
      type: "string",
      initialValue: "@poembooth.ai",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      initialValue: "https://instagram.com/poembooth.ai",
    }),

    // Admin Address
    defineField({
      name: "adminCompany",
      title: "Admin Company Name",
      type: "string",
      initialValue: "VOUW B.V.",
    }),
    defineField({
      name: "adminStreet",
      title: "Admin Street",
      type: "string",
      initialValue: "Krugerplein 4-1",
    }),
    defineField({
      name: "adminCity",
      title: "Admin City",
      type: "string",
      initialValue: "1091KX Amsterdam",
    }),
    defineField({
      name: "adminCountry",
      title: "Admin Country",
      type: "string",
      initialValue: "The Netherlands",
    }),

    // Studio Address
    defineField({
      name: "studioStreet",
      title: "Studio Street",
      type: "string",
      initialValue: "Generaal Vetterstraat 57",
    }),
    defineField({
      name: "studioCity",
      title: "Studio City",
      type: "string",
      initialValue: "1059 BT Amsterdam",
    }),
    defineField({
      name: "studioCountry",
      title: "Studio Country",
      type: "string",
      initialValue: "The Netherlands",
    }),

    // Legal Information
    defineField({
      name: "vatNumber",
      title: "VAT Number",
      type: "string",
      initialValue: "NL861856703B01",
    }),
    defineField({
      name: "chamberNumber",
      title: "Chamber of Commerce Number",
      type: "string",
      initialValue: "80932932",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Footer Settings" };
    },
  },
});
