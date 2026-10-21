import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";

export default defineConfig({
  output: "static",
  site: "https://howmanydayswithoutamajorcybersecurityincident.com",
  adapter: cloudflare(),
  integrations: [svelte()],
});