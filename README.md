# how-many-days-since-a-major-cybersecurity-incident

Tracks how many days have passed since the last major cybersecurity incident.

Built with [Astro](https://astro.build). Simple static site

View it [here](https://howmanydayssinceamajorcybersecurityincident.morber11.workers.dev)

## Commands

| Command               | Action                         |
| :-------------------- | :----------------------------- |
| `npm install`         | Install dependencies           |
| `npm run dev`         | Start local dev server         |
| `npm run build`       | Build production site to dist/ |
| `npm run preview`     | Preview production build       |
| `npm test`            | Run unit tests                 |
| `npx astro check`     | Run type checking              |

## Updating incidents

Edit `src/data/incidents.ts`, push to GitHub. Cloudflare Pages rebuilds on push
