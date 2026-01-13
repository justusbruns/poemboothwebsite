/**
 * Seed Sanity CMS with translations from src/messages/*.json
 *
 * Run with: npx tsx scripts/seed-sanity.ts
 *
 * Requires SANITY_API_TOKEN environment variable with write permissions.
 * Get a token from: https://www.sanity.io/manage/project/{projectId}/api#tokens
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Load environment variables
dotenv.config({ path: path.join(__dirname, "../.env.local") });

// Load translation files
const messagesDir = path.join(__dirname, "../src/messages");
const en = JSON.parse(fs.readFileSync(path.join(messagesDir, "en.json"), "utf-8"));
const nl = JSON.parse(fs.readFileSync(path.join(messagesDir, "nl.json"), "utf-8"));
const de = JSON.parse(fs.readFileSync(path.join(messagesDir, "de.json"), "utf-8"));
const fr = JSON.parse(fs.readFileSync(path.join(messagesDir, "fr.json"), "utf-8"));
const it = JSON.parse(fs.readFileSync(path.join(messagesDir, "it.json"), "utf-8"));

// Helper to create localized string object
function localized(getter: (t: typeof en) => string) {
  return {
    en: getter(en),
    nl: getter(nl),
    de: getter(de),
    fr: getter(fr),
    it: getter(it),
  };
}

// Create Sanity client with write permissions
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function seed() {
  console.log("Seeding Sanity with translations...\n");

  if (!process.env.SANITY_API_TOKEN) {
    console.error("ERROR: SANITY_API_TOKEN environment variable is required.");
    console.error("Get a token from: https://www.sanity.io/manage");
    console.error("Add to .env.local: SANITY_API_TOKEN=your_token_here");
    process.exit(1);
  }

  // 1. Hero Section
  console.log("Creating Hero document...");
  await client.createOrReplace({
    _type: "hero",
    _id: "hero",
    headline: localized((t) => t.hero.headline),
    subheadline: localized((t) => t.hero.subheadline),
    ctaButtonText: localized((t) => t.hero.ctaButton),
    ctaEmailText: localized((t) => t.hero.ctaEmail),
  });
  console.log("  ✓ Hero created\n");

  // 2. How It Works Steps
  console.log("Creating How It Works steps...");
  const steps = [
    { num: 1, key: "step1" as const },
    { num: 2, key: "step2" as const },
    { num: 3, key: "step3" as const },
  ];

  for (const step of steps) {
    await client.createOrReplace({
      _type: "howItWorksStep",
      _id: `howItWorksStep-${step.num}`,
      stepNumber: step.num,
      title: localized((t) => t.howItWorks[step.key].title),
      description: localized((t) => t.howItWorks[step.key].description),
      order: step.num,
    });
    console.log(`  ✓ Step ${step.num} created`);
  }
  console.log("");

  // 3. Editions
  console.log("Creating Edition documents...");

  // Portrait Edition
  await client.createOrReplace({
    _type: "edition",
    _id: "edition-portrait",
    title: localized((t) => t.editions.portrait.title),
    slug: { _type: "slug", current: "portrait" },
    isNew: true,
    subtitle: localized((t) => t.editions.portrait.subtitle),
    duration: 30,
    outputType: "portrait",
    beforeLabel: localized((t) => t.editions.portrait.beforeLabel),
    afterLabel: localized((t) => t.editions.portrait.afterLabel),
    order: 1,
    regionVisibility: ["all"],
  });
  console.log("  ✓ Portrait Edition created");

  // Original Edition
  await client.createOrReplace({
    _type: "edition",
    _id: "edition-original",
    title: localized((t) => t.editions.original.title),
    slug: { _type: "slug", current: "original" },
    isNew: false,
    subtitle: localized((t) => t.editions.original.subtitle),
    duration: 10,
    outputType: "poem",
    beforeLabel: localized((t) => t.editions.original.beforeLabel),
    afterLabel: localized((t) => t.editions.original.afterLabel),
    order: 2,
    regionVisibility: ["all"],
  });
  console.log("  ✓ Original Edition created\n");

  // 4. Site Settings
  console.log("Creating Site Settings...");
  await client.createOrReplace({
    _type: "siteSettings",
    _id: "siteSettings",
    siteName: "Poem Booth",
    contactEmail: "contact@poembooth.com",
  });
  console.log("  ✓ Site Settings created\n");

  console.log("✅ Sanity seeding complete!");
  console.log("\nYou can now:");
  console.log("1. Go to http://localhost:3000/studio");
  console.log("2. Add images to Hero, How It Works steps, and Editions");
  console.log("3. Edit any translations directly in the CMS");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
