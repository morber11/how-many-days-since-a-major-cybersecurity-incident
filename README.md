# How Many Days Since A Major Cybersecurity Incident (hmdsamci)

Pronounced *hum-duh-sam-see*

Tracks how many days have passed since the last major cybersecurity incident. Manually updated via `src/data/incidents.ts`. Dates of incidents are based on when they were first reported, not the specific date they occurred

Experimenting with Cloudflare pages + astro

Static site built with [Astro](https://astro.build)

View it here: [hmdsamci](https://howmanydayssinceamajorcybersecurityincident.morber11.workers.dev)

## Commands

| Command               | Action                         |
| :-------------------- | :----------------------------- |
| `npm install`         | Install dependencies           |
| `npm run dev`         | Start local dev server         |
| `npm run build`       | Build production site to dist/ |
| `npm run preview`     | Preview production build       |
| `npm test`            | Run unit tests                 |
| `npx astro check`     | Run type checking              |
| `npm run discover`    | Find and add new incidents     |
| `npm run sort`        | Sort incidents and companies   |

## Updating incidents

Edit `src/data/incidents.ts`, push to GitHub. Cloudflare Pages rebuilds on push

## Discovering new incidents

Previously done manually, there is now a command to assist

`npm run discover` reads security news RSS feeds, asks an LLM to pick the major incidents, archives each source on archive.is and adds them to `src/data/incidents.ts`

```bash
npm run discover -- --from 2026-10-10 --to 2026-10-14
```

- Both dates are optional. `--from` defaults to a week ago and `--to` defaults to today
- Requires an API key for the chosen LLM provider in `.env`. The provider is `anthropic` unless `DISCOVER_PROVIDER` in `.env` or `--provider` says otherwise

```bash
ANTHROPIC_API_KEY=[YOUR API KEY]
DEEPSEEK_API_KEY=[YOUR API KEY]
GEMINI_API_KEY=[YOUR API KEY]
DISCOVER_PROVIDER=deepseek
```

- Entries whose `sourceUrl` is not an archive.is link (usually marked `// TODO: archive manually`) could not be archived automatically, likely due to timeout (archive can take a while if it's not already done) or captcha. Run `npm run archive` to retry them

For every 10th incident tracked, I will consider adding another 2hu character to the site. Most sprites are taken from [Spriters Resource](https://www.spriters-resource.com/)
