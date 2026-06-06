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

## Updating incidents

Edit `src/data/incidents.ts`, push to GitHub. Cloudflare Pages rebuilds on push

For every 10th incident tracked, I will consider adding another 2hu character to the site. Most sprites are taken from [Spriters Resource](https://www.spriters-resource.com/)