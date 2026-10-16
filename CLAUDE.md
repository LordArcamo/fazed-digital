# Fazed Digital — CLAUDE.md

Marketing site for Fazed Digital (www.fazeddigital.com). **Astro 7.4 (static) + three.js 0.186 WebGPU/TSL dot field + GSAP 3.15 + Lenis**, deployed on Vercel. No React. Read `README.md` first.

## Rules that matter
- **Blog contract:** never edit lines inside either `const posts = [` array (`src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`). The nightly routine appends there. `scripts/extract-posts.mjs` fails the build if an entry is missing a field.
- **One host:** `SITE_URL` in `src/data/site.ts` (www). `scripts/lint-dist.mjs` fails on apex URLs, printed `[TBC`, and "never claim" items.
- **Proof:** stats, testimonials, caps and placeholder flags live only in `src/data/proof.ts`. Never invent facts.
- **Palette:** CSS variables only (`src/styles/tokens.css`): #090909 / #F5F4F0 / #C9FF57 (+ #9FCC2E, gray ladder). gray-500 is for hairlines only, never text.
- **ClientRouter:** bundled scripts run once. Page work goes through `bus.onPage` / `bus.onSwap` (`src/lib/bus.ts`), and every component script guards with `dataset.bound` and calls its init immediately + on `astro:page-load`.
- **Pre-3D JS ≤ 12 KB gz:** never import gsap/three from a component script; the motion and GL chunks are dynamic imports in `src/boot/main.ts`.
- **Field:** formations are CPU-generated (`src/field/formations.ts`) and morphed in a stateless TSL vertex stage (`points.tsl.ts`). Sections opt in with `data-f="<formation>"`. Focus-layer formations (layer ≥ 1) are in page space and follow `uFocusY`.
- Never switch an effect off to fix a problem without asking. Tune it and report.
- Dev: `npm run dev` (port 4351). If Vite shows 504 "Outdated Optimize Dep", delete `node_modules/.vite` and restart.
