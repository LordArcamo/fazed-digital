# Fazed Digital — CLAUDE.md

## Project Overview

Fazed Digital's marketing website. Built with **Astro 4 + React 18 + GSAP 3** and deployed to Vercel at `https://fazeddigital.com`.

## Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | Astro (SSG) | 4.x |
| UI islands | React via `@astrojs/react` | 18.x |
| Animation | GSAP + `@gsap/react` (`useGSAP` hook) | 3.12.x |
| Styling | Global CSS variables in `src/styles/global.css` | — no Tailwind |
| Deployment | Vercel (`vercel.json`) | — |

## Commands

```bash
npm run dev        # dev server at localhost:4321
npm run build      # production build → dist/
npm run preview    # serve dist/ locally
```

---

## Architecture Rules

### Hydration strategy
- **`client:only="react"`** — above-fold, must render immediately: `Cursor`, `Nav`, `Loader`, `MarqueeSection`, hero animation components
- **`client:idle`** — defers to `requestIdleCallback`: `Cursor`, `ScrollProgress` (frees main thread during load)
- **`client:visible`** — everything below the fold; hydrates when it enters the viewport via IntersectionObserver

**Never** switch a below-fold component back to `client:only` — it defeats the lazy hydration performance work.

### Animated SVG components (hero anims)

Each page has a dedicated `*HeroAnim.tsx` React component placed in the hero section. All use `useGSAP` with a `scope` ref on the `<svg>` element.

| Component | Page | Animation technique | Key IDs/classes |
|---|---|---|---|
| `HeroGraphic` | `/` | 3-ellipse orbital sphere; `<animateMotion>` + `<mpath>` for dots on tracks; `quickTo` mouse parallax; CSS `@keyframes hgSpin` for outer dashed ring | `#orbit-a/b/c` (ellipse defs) |
| `AboutHeroAnim` | `/about` | 3 concentric orbit rings (dot groups) rotating at 16s/28s/44s via `svgOrigin`; expanding pulse ring; staggered dot twinkle | `#ab-o1/o2/o3`, `#ab-pulse`, `.ab-dot` |
| `ServicesHeroAnim` | `/services` | Pentagon of 5 service nodes; SVG `strokeDashoffset` draw-in on lines; `back.out` scale-in on nodes; per-node float (`y: -7` sine yoyo); centre pulse | `#sv-pulse`, `.sv-line`, `.sv-node`, `.sv-node-{0–4}` |
| `WorkHeroAnim` | `/work` | 8×5 dot grid; staggered `scale` appear (`grid` stagger); accent dots pulse/scale; base dots twinkle; horizontal scan line sweeps top→bottom | `#wd-scan`, `.wd-dot`, `.wd-accent`, `.wd-base` |
| `ContactHeroAnim` | `/contact` | Location pin drop (`back.out`); 3 signal rings expand outward (`fromTo` repeat); inner dot blink; coordinate text fade-in | `#ch-pin`, `#ch-ring-0/1/2`, `#ch-inner`, `#ch-coords` |
| `NotFoundAnim` | `/404` | Radar sweep arm + sector rotate at 3.5s loop; centre pulse ring; 9 random interference noise dots blink; "searching" dot sequence | `#nf-sweep`, `#nf-sector`, `#nf-center-pulse`, `.nf-noise`, `.nf-s1/s2/s3` |

#### ServiceIcon (per-service icons in ServicesSection)
`src/components/ServiceIcon.tsx` — takes a `service` prop and returns one of 5 animated SVG icons. Each icon uses `useGSAP` for entrance animation.

**Critical bug to avoid:** Never set `opacity: 0` as an inline SVG style when also using `gsap.from(el, { autoAlpha: 0 })`. GSAP reads the current state as the TO value, so `opacity:0 → opacity:0` keeps the element invisible forever. Let GSAP own the initial hidden state entirely.

---

### GSAP patterns used in this project

```tsx
// Always use useGSAP from @gsap/react with a scope ref — never raw useEffect
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(useGSAP);
const svgRef = useRef<SVGSVGElement>(null);
useGSAP(() => { /* animations */ }, { scope: svgRef });
```

```tsx
// For SVG group rotations — use svgOrigin (SVG coordinate space), not CSS transformOrigin
gsap.to('#group', { rotation: 360, svgOrigin: '200 200', repeat: -1, ease: 'none' });
```

```tsx
// High-frequency event handlers (mousemove) — always use quickTo, never gsap.to()
const xTo = gsap.quickTo(el, 'x', { duration: 0.38, ease: 'power2.out' });
const yTo = gsap.quickTo(el, 'y', { duration: 0.38, ease: 'power2.out' });
window.addEventListener('mousemove', e => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
```

```tsx
// SVG animateMotion with mpath — used in HeroGraphic for orbital dots
<circle r="5" fill="rgba(201,255,87,0.9)">
  <animateMotion dur="7s" repeatCount="indefinite">
    <mpath href="#orbit-a" />   {/* references a <path> or <ellipse> in <defs> */}
  </animateMotion>
</circle>
```

```tsx
// strokeDashoffset draw-in — used in ServicesHeroAnim
const len = line.getTotalLength?.() ?? 130;
gsap.set(line, { strokeDasharray: len, strokeDashoffset: len });
gsap.to('.sv-line', { strokeDashoffset: 0, duration: 0.9, stagger: 0.08, ease: 'power2.inOut' });
```

If using `MotionPathPlugin`, import and register it explicitly:
```tsx
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
gsap.registerPlugin(useGSAP, MotionPathPlugin);
```

---

### CSS variables
All design tokens live in `src/styles/global.css`. **Never hardcode hex colors or font names in components — reference variables.**

| Token | Value |
|---|---|
| `--black` | `#090909` |
| `--white` | `#F5F4F0` |
| `--accent` | `#C9FF57` (electric lime) |
| `--accent-dark` | `#9FCC2E` |
| `--gray-900 … gray-100` | 9-step grayscale ladder |
| `--border` | `var(--gray-700)` |
| `--surface` | `var(--gray-900)` |
| `--muted` | `var(--gray-500)` |
| `--font-display` | Clash Display (loaded from fontshare) |
| `--font-body` | Plus Jakarta Sans (Google Fonts) |
| `--font-mono` | Space Mono (Google Fonts) |
| `--radius` | `0.875rem` |
| `--container` | `1340px` |

Fonts are loaded **async** via `rel="preload"` + `media="print" onload` in `Layout.astro`. There are **no `@import` statements in `global.css`** — those would block rendering.

---

### Performance rules

These were hard-won — don't regress them.

| Rule | Reason |
|---|---|
| No `@import url(...)` in `global.css` | Fonts load async via Layout.astro; `@import` in CSS is render-blocking |
| No `prefetchAll: true` in `astro.config.mjs` | Pre-fetches every page on load; use `defaultStrategy: 'hover'` only |
| `ParticleCanvas` max **50 particles** | O(n²) connection loop; 50 → ~1,225 checks/frame vs 90 → ~4,005 |
| Squared distance in `ParticleCanvas` inner loop | Skips `Math.sqrt` for ~97% of particle pairs that exceed LINK distance |
| `MagneticButton` uses `quickTo` refs | Avoids allocating a new GSAP tween on every `mousemove` pixel |
| `Cursor` uses event delegation (`mouseover`/`mouseout` on `document`) | Replaces per-element binding + `MutationObserver({ subtree: true })` on body |
| `Loader` timeline ≤ 1.5s total | Page is interactive sooner; hero animation delay matches at `1.3s` |
| Scramble text uses GSAP `onUpdate` tween | Replaced `setInterval(..., 28ms)` — runs inside the shared rAF loop |
| `lottie-web` removed from `package.json` | Was never imported; saved ~140KB from the bundle |
| `Vite manualChunks` splits gsap / react-dom / react | Each cached independently by the browser |
| `compressHTML: true` in `astro.config.mjs` | Strips whitespace from HTML output |

---

### Component patterns
- `.astro` pages import React components and add hydration directives
- Shared layout: `src/layouts/Layout.astro` (includes `<head>`, fonts, ViewTransitions)
- Fonts loaded async via `rel="preload"` + `media="print" onload` pattern (no render blocking)
- View Transitions enabled via `<ViewTransitions />` in Layout

---

## Page Map

| Route | File |
|---|---|
| `/` | `src/pages/index.astro` |
| `/about` | `src/pages/about.astro` |
| `/services` | `src/pages/services.astro` |
| `/work` | `src/pages/work.astro` |
| `/work/[01–04]` | `src/pages/work/[slug].astro` |
| `/blog` | `src/pages/blog/index.astro` |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` |
| `/contact` | `src/pages/contact.astro` |
| `/404` | `src/pages/404.astro` |

---

## Key Components

| Component | Purpose |
|---|---|
| `HeroSection` | Homepage hero — particle canvas + orbital graphic + scramble text |
| `ParticleCanvas` | Canvas particle network (max 50 dots, O(n²) connection lines) |
| `HeroGraphic` | Orbital sphere SVG — `<animateMotion>` tracks + mouse parallax |
| `ServicesSection` | Service cards (6 services) with `ServiceIcon` per card |
| `WorkSection` | Portfolio preview grid (4 real client projects) |
| `ProcessSection` | 4-step process accordion |
| `StatsSection` | Animated counters |
| `WhyFazedSection` | Differentiators grid |
| `TestimonialsSection` | Client testimonials |
| `AboutSection` | Homepage about strip |
| `TeamSection` | Team member cards |
| `ContactSection` | Full contact form |
| `MarqueeSection` | Scrolling ticker (used on all pages) |
| `MagneticButton` | GSAP magnetic hover — `quickTo` on `mousemove` |
| `AnimatedText` | Word-by-word reveal on mount |
| `Cursor` | Custom cursor — event delegation, `quickTo` for position |
| `Loader` | Page load sequence (~1.4s total) |
| `ScrollProgress` | Top progress bar |
| `ImageStrip` | Horizontal image marquee |
| `ServiceIcon` | Per-service animated SVG icons (5 variants) |
| `Footer` | Site footer with nav + contact info |

---

## Work Case Studies

Case study data is hardcoded in `src/pages/work/[slug].astro`. SVG mockup images live in `public/images/`.

| Slug | Client | Services | Year |
|---|---|---|---|
| `01` | A Framing Company | Web Design + WordPress | 2024 |
| `02` | Cleen & Green | Brand Identity + WordPress | 2025 |
| `03` | CrateOnScene | MVP Platform Build (PWA) | 2024 |
| `04` | The Telecom Shop | E-commerce Migration (Magento → PrestaShop) | 2024 |

---

## Content Notes
- Agency based in **Iligan City, Philippines**
- Coordinates: `8.2280° N · 124.2452° E`
- Contact: `info@fazeddigital.com` · `+63 922 123 4567`
- Business hours: Mon–Fri 8:30am–5:00pm
- Blog posts and work case studies are currently hardcoded arrays (no CMS)
