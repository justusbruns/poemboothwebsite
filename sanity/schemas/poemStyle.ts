import { defineField, defineType } from "sanity";

export default defineType({
  name: "poemStyle",
  title: "Poem Style",
  type: "document",
  fields: [
    defineField({
      name: "styleName",
      title: "Style Name",
      type: "string",
      description: 'Name of the poem style (e.g., "Happy", "Ellen Deckwitz")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "styleDescription",
      title: "Style Description",
      type: "text",
      description: "Brief description of this poem style for CMS users",
    }),
    defineField({
      name: "poems",
      title: "Poem Examples",
      type: "array",
      of: [
        {
          type: "object",
          name: "poemExample",
          title: "Poem Example",
          fields: [
            defineField({
              name: "backgroundImage",
              title: "Background Image",
              type: "image",
              options: { hotspot: true },
              description: "Photo that will be shown blurred behind the poem",
            }),
            defineField({
              name: "poemText",
              title: "Poem Text",
              type: "localizedText",
              description: "The poem content (preserve line breaks) - add translations for each language",
            }),
            defineField({
              name: "attribution",
              title: "Attribution",
              type: "string",
              description: 'Optional: "In the style of..." or poet credit',
            }),
          ],
          preview: {
            select: {
              poemText: "poemText.en",
              media: "backgroundImage",
            },
            prepare({ poemText, media }) {
              const firstLine = poemText?.split("\n")[0] || "Untitled poem";
              return {
                title: firstLine.slice(0, 50) + (firstLine.length > 50 ? "..." : ""),
                media,
              };
            },
          },
        },
      ],
      description: "Add multiple poem examples for this style",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
      description: "Order in which styles appear in tabs (lower = first)",
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
      title: "styleName",
      poemsCount: "poems",
    },
    prepare({ title, poemsCount }) {
      const count = poemsCount?.length || 0;
      return {
        title: title || "Untitled Style",
        subtitle: `${count} poem${count !== 1 ? "s" : ""}`,
      };
    },
  },
});
