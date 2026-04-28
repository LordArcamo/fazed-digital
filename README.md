# Fazed Digital — Marketing Site

Marketing website for **Fazed Digital**, a creative & digital agency based in Iligan City, Philippines.

**Live:** [fazeddigital.com](https://fazeddigital.com)

---

## Stack

| Layer | Tool | Notes |
|---|---|---|
| Framework | **Astro 4** (hybrid SSG + SSR) | `output: hybrid` — most pages static, API routes serverless |
| UI Islands | **React 18** via `@astrojs/react` | Hydrated selectively per component |
| Animation | **GSAP 3** + `@gsap/react` | ScrollTrigger, useGSAP hook, quickTo |
| Styling | Global CSS variables | No Tailwind — `src/styles/global.css` |
| Deployment | **Vercel** | `@astrojs/vercel/serverless`, `functionPerRoute: false` |
| Email | **Resend** | LP form lead notifications |
| CRM | **HubSpot** (Free) | Contact form submissions via Forms API |
| Spam protection | **Google reCAPTCHA v3** | Server-side score check on `/api/contact` |

---

## Commands

```bash
npm install
npm run dev       # dev server → http://localhost:4321
npm run build     # production build → dist/
npm run preview   # serve dist/ locally
```

---

## Environment Variables

Create a `.env` file in the project root (see `.env.example`):

| Variable | Required | Description |
|---|---|---|
| `HUBSPOT_FORM_GUID` | Optional | HubSpot form GUID — falls back to hardcoded value if not set |
| `RECAPTCHA_SECRET_KEY` | Optional | reCAPTCHA v3 secret key — check is **skipped** if not set |
| `RESEND_API_KEY` | Required for LP leads | Resend API key for LP form email notifications |
| `RESEND_FROM` | Optional | From address — defaults to `Fazed Digital <onboarding@resend.dev>` |
| `LP_FORM_GUID` | Pending | Separate HubSpot form GUID for the LP (not yet created) |

**Vercel:** Add all production values under **Settings → Environment Variables**.

---

## API Routes

### `POST /api/contact`
Main contact form endpoint (`/contact` page).

- Validates name, email, message
- reCAPTCHA v3 soft-check (logs result, doesn't block — re-enable once key is confirmed)
- Submits to HubSpot Forms API with: `firstname`, `lastname`, `email`, `message`, `service_interest`

### `POST /api/lp-submit`
Landing page brief form endpoint (`/lp/7-day-website`).

- Validates name + email only
- Sends notification email via **Resend** to team inboxes
- HubSpot wiring **pending** — waiting for dedicated LP form to be created
- Logs full payload to Vercel function logs (leads never lost even if email fails)

---

## Third-Party Integrations

### HubSpot
- **Portal ID:** `244473168`
- **Form GUID:** `c119e15a-357c-4bfb-9264-a1fb3f1a3389` (Fazed Digital Main Contact Form)
- **API used:** Public Forms Submission API — no auth token needed
- **Custom properties to create** (Settings → Properties → Contacts):
  - `website_package`, `business_industry`, `project_goal`, `website_style`, `pages_needed`, `referral_source`

### reCAPTCHA v3
- **Site key (public):** `6LdYgc0sAAAAAJy0R-ZRG3VKjadhIoWs_-9VOZ1x` — hardcoded in `ContactSection.tsx` and `LpForm.tsx`
- **Secret key:** Set as `RECAPTCHA_SECRET_KEY` in Vercel
- **Score threshold:** `0.3` on `/api/contact`
- **Domain must be registered** at [google.com/recaptcha/admin](https://google.com/recaptcha/admin) — add `fazeddigital.com`

### Resend
- LP form submissions send a branded HTML email to the full team
- Recipients: `reancirl@gmail.com`, `russeljessheyrana@gmail.com`, `lordrynkartracydwight@gmail.com`, `info@fazeddigital.com`
- Set `RESEND_API_KEY` in Vercel

---

## Page Map

| Route | File | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Homepage |
| `/about` | `src/pages/about.astro` | |
| `/services` | `src/pages/services.astro` | |
| `/work` | `src/pages/work.astro` | |
| `/work/[01–04]` | `src/pages/work/[slug].astro` | Case studies (hardcoded) |
| `/blog` | `src/pages/blog/index.astro` | |
| `/blog/[slug]` | `src/pages/blog/[slug].astro` | |
| `/contact` | `src/pages/contact.astro` | |
| `/lp/7-day-website` | `src/pages/lp/7-day-website.astro` | Landing page |
| `/404` | `src/pages/404.astro` | |

---

## Architecture

### Hydration Strategy

| Directive | When to use |
|---|---|
| `client:only="react"` | Above-fold, must render immediately: `Cursor`, `Nav`, `Loader`, hero anims |
| `client:idle` | Deferred to `requestIdleCallback`: `ScrollProgress` |
| `client:visible` | Everything below the fold — hydrates on IntersectionObserver |

> **Never** use `client:only` for below-fold components — it breaks lazy hydration.

### Layouts

- `src/layouts/Layout.astro` — main site shell (fonts, ViewTransitions, SEO)
- `src/layouts/LpLayout.astro` — LP-only shell (stripped nav, reCAPTCHA badge hidden, Cursor)

### GSAP Patterns

```tsx
// Always useGSAP with a scope ref — never raw useEffect
import { useGSAP } from '@gsap/react';
useGSAP(() => { /* animations */ }, { scope: ref });

// SVG rotations — use svgOrigin, not CSS transformOrigin
gsap.to('#group', { rotation: 360, svgOrigin: '200 200', repeat: -1, ease: 'none' });

// High-frequency handlers (mousemove) — always quickTo
const xTo = gsap.quickTo(el, 'x', { duration: 0.38, ease: 'power2.out' });
```

---

## Design Tokens

All tokens in `src/styles/global.css`:

| Token | Value |
|---|---|
| `--black` | `#090909` |
| `--white` | `#F5F4F0` |
| `--accent` | `#C9FF57` (electric lime) |
| `--accent-dark` | `#9FCC2E` |
| `--font-display` | Clash Display (Fontshare) |
| `--font-body` | Plus Jakarta Sans (Google Fonts) |
| `--font-mono` | Space Mono (Google Fonts) |
| `--radius` | `0.875rem` |
| `--container` | `1340px` |

> Never hardcode hex colors or font names in components — always reference variables.

---

## Key Components

| Component | Purpose |
|---|---|
| `HeroSection` | Homepage hero — particle canvas + orbital SVG + scramble text |
| `ParticleCanvas` | Canvas particle network (max 50 dots, O(n²) connection lines) |
| `HeroGraphic` | Orbital sphere SVG — `<animateMotion>` tracks + mouse parallax |
| `ServicesSection` | 6 service cards with animated `ServiceIcon` per card |
| `ProcessSection` | 4-step process with GSAP connector line animation |
| `WorkSection` | Portfolio preview grid (4 client projects) |
| `StatsSection` | Animated counters |
| `TestimonialsSection` | Client testimonials |
| `ContactSection` | Contact form with reCAPTCHA v3 |
| `MarqueeSection` | Scrolling ticker (used on all pages) |
| `MagneticButton` | GSAP magnetic hover — `quickTo` on mousemove |
| `AnimatedText` | Word-by-word reveal on mount |
| `Cursor` | Custom cursor — event delegation + `quickTo` |
| `Loader` | Page load sequence (~1.4s total) |
| `ScrollProgress` | Top progress bar |
| `Footer` | Site footer |
| `LpForm` | 5-step multi-step brief wizard (LP only) |

---

## Work Case Studies

Hardcoded in `src/pages/work/[slug].astro`. SVG mockups in `public/images/`.

| Slug | Client | Services | Year |
|---|---|---|---|
| `01` | A Framing Company | Web Design + WordPress | 2024 |
| `02` | Cleen & Green | Brand Identity + WordPress | 2025 |
| `03` | CrateOnScene | MVP Platform Build (PWA) | 2024 |
| `04` | The Telecom Shop | E-commerce Migration (Magento → PrestaShop) | 2024 |

---

## Performance Rules

| Rule | Reason |
|---|---|
| No `@import url(...)` in `global.css` | Fonts load async via Layout.astro — `@import` blocks rendering |
| `functionPerRoute: false` in Vercel adapter | Keeps all serverless functions bundled into 1 (Hobby plan limit is 12) |
| `ParticleCanvas` max 50 particles | O(n²) connection loop — 50 = ~1,225 checks/frame |
| `MagneticButton` uses `quickTo` refs | No new tween allocated on every mousemove pixel |
| `Cursor` uses event delegation | Replaces per-element binding + MutationObserver on body |
| `Loader` timeline ≤ 1.5s | Page interactive sooner; hero anim delay set to match at 1.3s |

---

## Deployment

- Push to `main` → Vercel auto-deploys
- Node runtime: `20.x` (set via `engines.node` in `package.json`)
- Adapter: `@astrojs/vercel@^7.8.2` (last version compatible with Astro 4)

---

## Pending / TODO

- [ ] Create dedicated LP HubSpot form → add GUID as `LP_FORM_GUID` env var in Vercel
- [ ] Create 6 custom HubSpot contact properties (`website_package`, `business_industry`, `project_goal`, `website_style`, `pages_needed`, `referral_source`)
- [ ] Add `fazeddigital.com` to allowed domains in reCAPTCHA console → re-enable hard block in `/api/contact`
- [ ] Set `RESEND_API_KEY` in Vercel for LP lead email notifications
- [ ] Stripe setup + `/api/checkout` endpoint (future)

---

## Content

- **Agency:** Fazed Digital, Iligan City, Philippines
- **Coordinates:** `8.2280° N · 124.2452° E`
- **Email:** `info@fazeddigital.com`
- **Phone:** `+63 922 123 4567`
- **Hours:** Mon–Fri 8:30am–5:00pm

---

*Built by **Lord Arcamo** — Founder, Fazed Digital.*
