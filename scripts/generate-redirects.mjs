/**
 * Generates HTML redirect stubs for old Jekyll URLs.
 * Run after `astro build` to create meta-refresh redirect pages in dist/.
 *
 * GitHub Pages doesn't support server-side redirects, so we use
 * <meta http-equiv="refresh"> which works in all browsers and
 * passes the "0-second" refresh as an instant redirect.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const DIST = new URL("../dist/", import.meta.url).pathname;
const REDIRECTS = JSON.parse(
  readFileSync(new URL("redirects.json", import.meta.url), "utf-8")
);

const template = (to) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=${to}">
  <link rel="canonical" href="${to}">
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="${to}">${to}</a></p>
</body>
</html>`;

let count = 0;
for (const { from, to } of REDIRECTS) {
  // Remove trailing slash from 'from' if present, then normalize
  const fromPath = from.endsWith("/") ? from.slice(0, -1) : from;
  const outDir = join(DIST, fromPath);
  const outFile = join(outDir, "index.html");

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }
  writeFileSync(outFile, template(to), "utf-8");
  count++;
}

console.log(`✓ Generated ${count} redirect stubs`);