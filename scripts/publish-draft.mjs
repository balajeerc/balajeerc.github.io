#!/usr/bin/env node
// Move a draft into src/content/posts/, stamping it with a pubDate.
//
//   pnpm publish-draft my-idea            # publishes with today's date
//   pnpm publish-draft my-idea.md 2026-08-10

import { readFile, writeFile, rename, access } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const draftsDir = join(root, "src/content/drafts");
const postsDir = join(root, "src/content/posts");

const [nameArg, dateArg] = process.argv.slice(2);

if (!nameArg) {
  console.error("usage: pnpm publish-draft <draft-filename> [YYYY-MM-DD]");
  process.exit(1);
}

const filename = nameArg.endsWith(".md") ? nameArg : `${nameArg}.md`;
const src = join(draftsDir, filename);
const dest = join(postsDir, filename);

const exists = async (path) =>
  access(path).then(
    () => true,
    () => false
  );

if (!(await exists(src))) {
  console.error(`No such draft: src/content/drafts/${filename}`);
  process.exit(1);
}
if (await exists(dest)) {
  console.error(`A post named ${filename} already exists — rename the draft.`);
  process.exit(1);
}

const pubDate = dateArg ?? new Date().toISOString().slice(0, 10);
if (!/^\d{4}-\d{2}-\d{2}$/.test(pubDate)) {
  console.error(`Invalid date: ${pubDate} (expected YYYY-MM-DD)`);
  process.exit(1);
}

const contents = await readFile(src, "utf8");
const match = contents.match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (!match) {
  console.error(`${filename} has no frontmatter block.`);
  process.exit(1);
}

const [block, frontmatter] = match;
const updated = /^pubDate:/m.test(frontmatter)
  ? frontmatter.replace(/^pubDate:.*$/m, `pubDate: ${pubDate}`)
  : `${frontmatter}\npubDate: ${pubDate}`;

await writeFile(src, contents.replace(block, `---\n${updated}\n---`));
await rename(src, dest);

console.log(`Published src/content/posts/${filename} (pubDate: ${pubDate})`);
