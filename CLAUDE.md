# Fazed Digital — CLAUDE.md

## Project Overview

Fazed Digital's marketing website. Built with **Astro 4 + React 18 + GSAP 3** and deployed to Vercel at `https://fazeddigital.com`.

## Stack

| Layer | Tool |
|---|---|
| Framework | Astro 4 (SSG) |
| UI islands | React 18 via `@astrojs/react` |
| Animation | GSAP 3.12 + `@gsap/react` (`useGSAP` hook) |
| Styling | Global CSS variables in `src/styles/global.css` (no Tailwind) |
| Deployment | Vercel (`vercel.json`) |

## Commands

```bash
npm run dev        # dev server at localhost:4321
npm run build      # production build → dist/
npm run preview    # serve dist/ locally
```

## Architecture Rules

### Hydration strategy
- **`client:only="react"`** — above-fold, must render immediately: `Cursor`, `Nav`, `Loader`, `ScrollProgress`, `HeroSection`, `MarqueeSection`, hero animation components
- **`client:visible`** — everything below the fold; hydrates when it enters the viewport via IntersectionObserver

Never switch a below-fold component back to `client:only` — it defeats the lazy hydration performance work.

### Animated SVG components (hero anims)
Each page has a dedicated `*HeroAnim.tsx` React component placed in the hero section:
- `AboutHeroAnim` — orbiting dot rings using `svgOrigin`
- `ServicesHeroAnim` — pentagon of service nodes with draw-in lines
- `WorkHeroAnim` — dot grid with scan sweep
- `ContactHeroAnim` — location pin with signal rings (Iligan City coords)
- `NotFoundAnim` — radar sweep

**Critical bug to avoid:** Never set `opacity: 0` as an inline SVG style when also using `gsap.from(el, { autoAlpha: 0 })`. GSAP reads the current state as the TO target, so `opacity:0 → opacity:0` keeps the element invisible forever. Let GSAP own the initial hidden state; don't set it in JSX.

### GSAP in React
Always use `useGSAP` from `@gsap/react` with a `scope` ref — never raw `useEffect`:
```tsx
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);
const svgRef = useRef<SVGSVGElement>(null);
useGSAP(() => { /* animations */ }, { scope: svgRef });
```

For SVG group rotations, use `svgOrigin: "cx cy"` (SVG coordinate space), not CSS `transformOrigin`.

If using `MotionPathPlugin`, import and register it explicitly:
```tsx
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(useGSAP, MotionPathPlugin);
```

### CSS variables
All design tokens live in `src/styles/global.css`. Key vars:
- `--black`, `--white`, `--accent` (#c9ff57 lime green), `--gray-*`, `--border`, `--surface`, `--muted`
- `--font-display` (Chillax italic), `--font-body` (Satoshi), `--font-mono` (JetBrains Mono)
- `--radius`, `--container`

Never hardcode hex colors or font names in components — reference variables.

### Component patterns
- `.astro` pages import React components and add hydration directives
- Shared layout: `src/layouts/Layout.astro` (includes `<head>`, fonts, ViewTransitions)
- Fonts loaded async via `rel="preload"` + `media="print" onload` pattern (no render blocking)
- View Transitions enabled via `<ViewTransitions />` in Layout

### Performance
- Vite `manualChunks`: gsap, react-dom, react split into separate cached bundles
- `prefetch: { prefetchAll: true, defaultStrategy: 'hover' }` — all internal links prefetched on hover
- `compressHTML: true`

## Page Map

| Route | File |
|---|---|
| `/` | `src/pages/index.astro` |
| `/about` | `src/pages/about.astro` |
| `/services` | `src/pages/services.astro` |
| `/work` | `src/pages/work.astro` |
| `/work/[01–06]` | `src/pages/work/[slug].astro` |
| `/blog` | `src/pages/blog/index.astro` |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` |
| `/contact` | `src/pages/contact.astro` |
| `/404` | `src/pages/404.astro` |

## Key Components

| Component | Purpose |
|---|---|
| `HeroSection` | Homepage hero with particle canvas |
| `ServicesSection` | Service cards (6 services) |
| `WorkSection` | Portfolio preview grid |
| `ProcessSection` | 4-step process accordion |
| `StatsSection` | Animated counters |
| `WhyFazedSection` | Differentiators grid |
| `TestimonialsSection` | Client testimonials |
| `AboutSection` | Homepage about strip |
| `TeamSection` | Team member cards |
| `ContactSection` | Full contact form |
| `MarqueeSection` | Scrolling ticker (used on all pages) |
| `MagneticButton` | GSAP magnetic hover effect |
| `AnimatedText` | Word-by-word reveal on mount |
| `Cursor` | Custom cursor that follows mouse |
| `Loader` | Page load sequence |
| `ScrollProgress` | Top progress bar |
| `ImageStrip` | Horizontal image marquee |
| `ServiceIcon` | Per-service animated SVG icons (5 variants) |
| `Footer` | Site footer with nav + contact info |

## Content Notes
- Agency based in **Iligan City, Philippines**
- Contact: `info@fazeddigital.com` · `+63 922 123 4567`
- Business hours: Mon–Fri 8:30am–5:00pm
- Blog posts and work case studies are currently hardcoded arrays in their respective page files (no CMS)
