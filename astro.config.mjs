import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://www.balajeerc.info",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-light",
      wrap: true,
    },
  },
  server: {
    // Allow access via Cloudflare quick tunnels (dev only convenience)
    allowedHosts: true,
  },
});