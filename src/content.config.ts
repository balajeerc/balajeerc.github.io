import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

// Working drafts and idea stubs. Never built into the published site — they are
// only routed under /drafts by the dev server. Publishing = moving the file into
// src/content/posts/ (see scripts/publish-draft.mjs).
const drafts = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pubDate: z.date().optional(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { posts, drafts };