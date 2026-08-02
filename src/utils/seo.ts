/** Build a canonical URL for the given pathname. */
export function getCanonicalURL(pathname: string, siteUrl: URL): string {
  let path = pathname;
  if (path === "/index.html") path = "/";
  // Ensure trailing slash for non-root paths (matching our static output)
  if (path.length > 1 && !path.endsWith("/")) path += "/";
  return new URL(path, siteUrl).toString();
}
