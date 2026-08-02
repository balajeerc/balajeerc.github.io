import { getCollection } from "astro:content";

// Atom 1.0 feed served at /feed.xml — the path the old Jekyll site used
// (jekyll-feed), so existing subscribers keep working after the Astro migration.

const AUTHOR = "Balajee Ramachandran";

const escape = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET(context) {
  const posts = await getCollection("posts");
  const sorted = posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const site = context.site;
  const url = (path) => new URL(path, site).toString();
  const updated = (sorted[0]?.data.pubDate ?? new Date()).toISOString();

  const entries = sorted
    .map((post) => {
      const link = url(`/posts/${post.id.replace(/\.md$/, "")}/`);
      const published = post.data.pubDate.toISOString();
      const summary = post.data.description
        ? `\n    <summary>${escape(post.data.description)}</summary>`
        : "";
      return `  <entry>
    <title>${escape(post.data.title)}</title>
    <link href="${escape(link)}"/>
    <id>${escape(link)}</id>
    <published>${published}</published>
    <updated>${published}</updated>${summary}
  </entry>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escape(AUTHOR)}</title>
  <subtitle>Programmer. Blogger. Nice Guy.</subtitle>
  <link href="${escape(url("/feed.xml"))}" rel="self"/>
  <link href="${escape(url("/"))}"/>
  <id>${escape(url("/"))}</id>
  <updated>${updated}</updated>
  <author>
    <name>${escape(AUTHOR)}</name>
  </author>
${entries}
</feed>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8" },
  });
}
