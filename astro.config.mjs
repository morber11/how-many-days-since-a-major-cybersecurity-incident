import process from "node:process";
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import svelte from "@astrojs/svelte";

const mediaFlagIndex = process.argv.indexOf("-media");
const debugMedia = mediaFlagIndex === -1 ? undefined : process.argv[mediaFlagIndex + 1];

export default defineConfig({
    output: "static",
    site: "https://howmanydayswithoutamajorcybersecurityincident.com",
    adapter: cloudflare(),
    integrations: [svelte()],
    vite: {
        define: debugMedia ? { "import.meta.env.DEBUG_MEDIA": JSON.stringify(debugMedia) } : {},
    },
});