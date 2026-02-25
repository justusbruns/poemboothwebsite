import { StructureBuilder } from "sanity/structure";
import { CogIcon, DocumentIcon, ImageIcon, TextIcon } from "@sanity/icons";

// Singleton document types (only one instance should exist)
const singletonTypes = ["siteSettings", "footer", "hero", "bookingSection", "userAgreement"];

// Define singleton list items
const singletonListItem = (
  S: StructureBuilder,
  typeName: string,
  title: string,
  icon?: React.ComponentType
) =>
  S.listItem()
    .title(title)
    .icon(icon || DocumentIcon)
    .child(
      S.document()
        .schemaType(typeName)
        .documentId(typeName)
        .title(title)
    );

export const structure = (S: StructureBuilder) =>
  S.list()
    .title("Content")
    .items([
      // Settings Section
      S.listItem()
        .title("Settings")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Settings")
            .items([
              singletonListItem(S, "siteSettings", "Site Settings", CogIcon),
              singletonListItem(S, "footer", "Footer Settings", DocumentIcon),
            ])
        ),

      S.divider(),

      // Page Content Section
      S.listItem()
        .title("Page Content")
        .icon(TextIcon)
        .child(
          S.list()
            .title("Page Content")
            .items([
              singletonListItem(S, "hero", "Hero Section", DocumentIcon),
              singletonListItem(S, "bookingSection", "Booking Section", DocumentIcon),
              singletonListItem(S, "userAgreement", "User Agreement", DocumentIcon),
            ])
        ),

      S.divider(),

      // Blog
      S.listItem()
        .title("Blog Posts")
        .icon(DocumentIcon)
        .child(
          S.documentTypeList("blogPost")
            .title("Blog Posts")
            .defaultOrdering([{ field: "publishedAt", direction: "desc" }])
        ),

      S.divider(),

      // Collections
      S.listItem()
        .title("How It Works Steps")
        .icon(DocumentIcon)
        .child(S.documentTypeList("howItWorksStep").title("How It Works Steps")),

      S.listItem()
        .title("Editions")
        .icon(DocumentIcon)
        .child(S.documentTypeList("edition").title("Editions")),

      S.listItem()
        .title("Poem Styles")
        .icon(DocumentIcon)
        .child(S.documentTypeList("poemStyle").title("Poem Styles")),

      S.listItem()
        .title("Gallery Images")
        .icon(ImageIcon)
        .child(S.documentTypeList("galleryImage").title("Gallery Images")),

      S.listItem()
        .title("Client Logos")
        .icon(ImageIcon)
        .child(S.documentTypeList("clientLogo").title("Client Logos")),

      S.listItem()
        .title("Practicalities")
        .icon(DocumentIcon)
        .child(S.documentTypeList("practicality").title("Practicalities")),

      S.listItem()
        .title("Pricing Items")
        .icon(DocumentIcon)
        .child(S.documentTypeList("pricingItem").title("Pricing Items")),
    ]);
