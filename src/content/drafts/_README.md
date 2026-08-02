# Drafts

Working drafts and idea stubs. Files here are **never published**: the `/drafts`
routes only exist on the dev server (`pnpm dev`), and nothing in this directory
appears on the home page, in the sitemap, or in the RSS/Atom feeds.

Frontmatter — only `title` is required:

```markdown
---
title: "Some half-formed idea"
description: "Optional one-liner"
tags: ["optional"]
---
```

Browse them at http://localhost:4321/drafts/ while the dev server runs.

To publish one:

```
pnpm publish-draft <filename>          # uses today's date
pnpm publish-draft <filename> 2026-08-10
```

That moves the file into `src/content/posts/` and fills in `pubDate`. Or just
move the file by hand and add a `pubDate`.

(This file is named with a leading underscore so Astro's content loader ignores
it — otherwise it would fail the collection schema for lacking a `title`.)
