# Fazed Digital

Marketing site for **Fazed Digital** — a creative & digital agency based in Iligan City, Philippines.

Live: [fazeddigital.com](https://fazeddigital.com)

## Stack

- **[Astro 4](https://astro.build/)** — static site generator, 21 pre-rendered pages
- **React 18** — interactive components (islands)
- **TypeScript**
- **[GSAP 3](https://gsap.com/)** + `@gsap/react` — scroll, hero, and decorative animations
- **Lottie** — vector animations
- **Storybook 8** — isolated component dev

## Pages

| Route | Purpose |
|---|---|
| `/` | Homepage — hero, services, process, image strip, stats, work, testimonials, contact |
| `/about` | Company story + team |
| `/services` | Service offerings with animated icons |
| `/work` | Project grid with category filters (Brand / Web / E-commerce / Product) |
| `/work/[slug]` | Individual case study |
| `/blog` + `/blog/[slug]` | Editorial |
| `/contact` | Contact form + info |
| `/privacy`, `/terms`, `/404` | Legal & error |

## Getting started

```bash
npm install
npm run dev          # http://localhost:4321
```

### Other scripts

```bash
npm run build           # production build → ./dist
npm run preview         # preview the production build locally
npm run storybook       # Storybook dev server → http://localhost:6006
npm run build-storybook # static Storybook build
```

## Project layout

```
src/
  components/   # React + Astro components (Hero, Services, Process, Work, etc.)
  layouts/      # Layout.astro (shared shell)
  pages/        # File-based routing
  stories/      # Storybook stories
  styles/       # global.css
public/         # static assets
.storybook/     # Storybook config
```

## Deployment

Deployed on **Vercel** — pushes to `main` trigger a build automatically.

`vercel.json` pins the install command to `npm install --legacy-peer-deps` to work around a Storybook 8.6 peer-dependency conflict that breaks Vercel's default install. `.npmrc` mirrors the same setting for local consistency.

## Author

Built by **Lord Arcamo** — founder, Fazed Digital.
