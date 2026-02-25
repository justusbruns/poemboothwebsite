import { defineField, defineType } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title.en" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "localizedText",
      description: "Short summary for listing pages and SEO",
    }),
    defineField({
      name: "body_en",
      title: "Body (English)",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
        {
          type: "object",
          name: "youtube",
          title: "YouTube Video",
          fields: [
            { name: "url", type: "url", title: "YouTube URL" },
          ],
          preview: {
            select: { url: "url" },
            prepare({ url }: { url?: string }) {
              return { title: "YouTube Video", subtitle: url };
            },
          },
        },
      ],
    }),
    defineField({
      name: "body_nl",
      title: "Body (Dutch)",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
        {
          type: "object",
          name: "youtube",
          title: "YouTube Video",
          fields: [
            { name: "url", type: "url", title: "YouTube URL" },
          ],
        },
      ],
    }),
    defineField({
      name: "body_de",
      title: "Body (German)",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
        {
          type: "object",
          name: "youtube",
          title: "YouTube Video",
          fields: [
            { name: "url", type: "url", title: "YouTube URL" },
          ],
        },
      ],
    }),
    defineField({
      name: "body_fr",
      title: "Body (French)",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
        {
          type: "object",
          name: "youtube",
          title: "YouTube Video",
          fields: [
            { name: "url", type: "url", title: "YouTube URL" },
          ],
        },
      ],
    }),
    defineField({
      name: "body_it",
      title: "Body (Italian)",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
        {
          type: "object",
          name: "youtube",
          title: "YouTube Video",
          fields: [
            { name: "url", type: "url", title: "YouTube URL" },
          ],
        },
      ],
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "AI & Technology", value: "ai-technology" },
          { title: "Events", value: "events" },
          { title: "Tips & Inspiration", value: "tips-inspiration" },
          { title: "Case Studies", value: "case-studies" },
          { title: "News", value: "news" },
        ],
      },
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "localizedString",
      description: "Override the title for search engines",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "localizedText",
      description: "Override the excerpt for search engines",
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
      title: "Published Date (Newest)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title.en",
      date: "publishedAt",
      media: "coverImage",
    },
    prepare({ title, date, media }) {
      return {
        title: title || "Untitled",
        subtitle: date
          ? new Date(date).toLocaleDateString()
          : "No date",
        media,
      };
    },
  },
});
