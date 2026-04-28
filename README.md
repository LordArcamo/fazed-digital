<div align="center">

<br />

```
███████╗ █████╗ ███████╗███████╗██████╗
██╔════╝██╔══██╗╚══███╔╝██╔════╝██╔══██╗
█████╗  ███████║  ███╔╝ █████╗  ██║  ██║
██╔══╝  ██╔══██║ ███╔╝  ██╔══╝  ██║  ██║
██║     ██║  ██║███████╗███████╗██████╔╝
╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚═════╝
         D I G I T A L
```

**Creative & Digital Agency — Iligan City, Philippines**

[![Live](https://img.shields.io/badge/Live-fazeddigital.com-C9FF57?style=flat-square&labelColor=090909)](https://fazeddigital.com)
[![Astro](https://img.shields.io/badge/Astro-4.x-FF5D01?style=flat-square&logo=astro&logoColor=white&labelColor=090909)](https://astro.build)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=61DAFB&labelColor=090909)](https://react.dev)
[![GSAP](https://img.shields.io/badge/GSAP-3.12-88CE02?style=flat-square&labelColor=090909)](https://gsap.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-fff?style=flat-square&logo=vercel&logoColor=white&labelColor=090909)](https://vercel.com)

<br />

</div>

---

## `>_ STACK`

| Layer | Tool | Version | Notes |
|---|---|---|---|
| Framework | **Astro** | `4.x` | Hybrid SSG + SSR · `output: hybrid` |
| UI Islands | **React** | `18.x` | Selective hydration via Astro islands |
| Animation | **GSAP** + `@gsap/react` | `3.12.x` | ScrollTrigger · `useGSAP` · `quickTo` |
| Styling | **CSS Variables** | — | No Tailwind · `src/styles/global.css` |
| Deployment | **Vercel** | — | `@astrojs/vercel` · `functionPerRoute: false` |
| Email | **Resend** | — | LP lead notifications to team |
| CRM | **HubSpot Free** | — | Contact form via Forms API |
| Spam | **reCAPTCHA v3** | — | Server-side score check |

---

## `>_ GETTING STARTED`

```bash
# Install dependencies
npm install

# Start dev server → http://localhost:4321
npm run dev

# Production build → dist/
npm run build

# Preview production build locally
npm run preview
```

---

## `>_ ENVIRONMENT VARIABLES`

Copy `.env.example` → `.env` and fill in your values:

```bash
# HubSpot — falls back to hardcoded GUID if not set
HUBSPOT_FORM_GUID=c119e15a-357c-4bfb-9264-a1fb3f1a3389

# Google reCAPTCHA v3 — check is SKIPPED if not set
RECAPTCHA_SECRET_KEY=your_secret_key_here

# Resend — required for LP lead email notifications
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM=Fazed Digital <onboarding@resend.dev>

# Pending — LP HubSpot form (not yet created)
# LP_FORM_GUID=
```

> Add all production values in **Vercel → Settings → Environment Variables**

---

## `>_ API ROUTES`

<details>
<summary><strong>POST /api/contact</strong> — Main contact form</summary>

<br />

- Validates `name`, `email`, `message`
- reCAPTCHA v3 soft-check (score threshold `0.3`)
- Submits to HubSpot Forms API

**Fields sent to HubSpot:**
```
firstname · lastname · email · message · service_interest
```

</details>

<details>
<summary><strong>POST /api/lp-submit</strong> — 7-Day Website LP form</summary>

<br />

- Validates `name` + `email` only
- Sends branded HTML notification email via **Resend**
- Full payload logged to Vercel — leads never lost even if email fails
- HubSpot wiring **pending** (waiting for dedicated LP form GUID)

**Notification recipients:**
```
reancirl@gmail.com
russeljessheyrana@gmail.com
lordrynkartracydwight@gmail.com
info@fazeddigital.com
```

</details>

---

## `>_ PAGES`

```
/                     Homepage
├── /about            Company story + team
├── /services         Service offerings
├── /work             Portfolio grid
│   └── /work/[01-04] Case studies
├── /blog             Editorial
│   └── /blog/[slug]  Blog post
├── /contact          Contact form
├── /lp
│   └── /7-day-website  Landing page (multi-step form)
└── /404              Not found
```

---

## `>_ ARCHITECTURE`

### Hydration Strategy

| Directive | Used For |
|---|---|
| `client:only="react"` | Above-fold, renders immediately — `Cursor`, `Nav`, `Loader`, hero anims |
| `client:idle` | Deferred to `requestIdleCallback` — `ScrollProgress` |
| `client:visible` | Below-fold, hydrates on scroll — everything else |

> Never switch a below-fold component to `client:only` — defeats lazy hydration.

### GSAP Patterns

```tsx
// Always useGSAP with scope ref — never raw useEffect
import { useGSAP } from '@gsap/react';
useGSAP(() => { /* animations */ }, { scope: ref });

// SVG group rotations — svgOrigin not transformOrigin
gsap.to('#group', { rotation: 360, svgOrigin: '200 200', repeat: -1, ease: 'none' });

// High-frequency events (mousemove) — always quickTo
const xTo = gsap.quickTo(el, 'x', { duration: 0.38, ease: 'power2.out' });
const yTo = gsap.quickTo(el, 'y', { duration: 0.38, ease: 'power2.out' });
```

---

## `>_ DESIGN TOKENS`

```css
/* Colors */
--black:        #090909
--white:        #F5F4F0
--accent:       #C9FF57   /* electric lime */
--accent-dark:  #9FCC2E

/* Typography */
--font-display: 'Clash Display'      /* Fontshare */
--font-body:    'Plus Jakarta Sans'  /* Google Fonts */
--font-mono:    'Space Mono'         /* Google Fonts */

/* Layout */
--radius:       0.875rem
--container:    1340px
```

> Never hardcode hex values or font names in components — always reference variables.

---

## `>_ KEY COMPONENTS`

<details>
<summary>Show all components</summary>

<br />

| Component | Purpose |
|---|---|
| `HeroSection` | Homepage hero — particles + orbital SVG + scramble text |
| `ParticleCanvas` | Canvas particle network — max 50 dots, O(n²) connections |
| `HeroGraphic` | Orbital sphere SVG — `<animateMotion>` + mouse parallax |
| `ServicesSection` | 6 service cards with animated `ServiceIcon` |
| `ProcessSection` | 4-step process — animated GSAP connector line |
| `WorkSection` | Portfolio preview grid (4 client projects) |
| `StatsSection` | Animated counters |
| `TestimonialsSection` | Client testimonials |
| `ContactSection` | Contact form + reCAPTCHA v3 |
| `MarqueeSection` | Scrolling ticker — used on all pages |
| `MagneticButton` | GSAP magnetic hover — `quickTo` on mousemove |
| `AnimatedText` | Word-by-word reveal on scroll |
| `Cursor` | Custom cursor — event delegation + `quickTo` |
| `Loader` | Page load sequence (~1.4s total) |
| `ScrollProgress` | Top-of-page progress bar |
| `LpForm` | 5-step multi-step brief wizard (LP page only) |
| `Footer` | Site footer with nav + contact info |

</details>

---

## `>_ WORK CASE STUDIES`

Hardcoded in `src/pages/work/[slug].astro` · SVG mockups in `public/images/`

| Slug | Client | Services | Year |
|---|---|---|---|
| `01` | A Framing Company | Web Design + WordPress | 2024 |
| `02` | Cleen & Green | Brand Identity + WordPress | 2025 |
| `03` | CrateOnScene | MVP Platform — PWA | 2024 |
| `04` | The Telecom Shop | E-commerce Migration (Magento → PrestaShop) | 2024 |

---

## `>_ INTEGRATIONS`

<details>
<summary><strong>HubSpot</strong></summary>

<br />

- **Portal ID:** `244473168`
- **Form:** `c119e15a-357c-4bfb-9264-a1fb3f1a3389` (Fazed Digital Main Contact Form)
- **API:** Public Forms Submission API — no auth token needed
- **Custom properties to create** (Settings → Properties → Contacts):

```
website_package     · business_industry  · project_goal
website_style       · pages_needed       · referral_source
```

</details>

<details>
<summary><strong>reCAPTCHA v3</strong></summary>

<br />

- **Site key (public):** `6LdYgc0sAAAAAJy0R-ZRG3VKjadhIoWs_-9VOZ1x`
- **Secret key:** `RECAPTCHA_SECRET_KEY` in Vercel env vars
- **Score threshold:** `0.3` on `/api/contact`
- **Required:** Add `fazeddigital.com` to allowed domains at [google.com/recaptcha/admin](https://google.com/recaptcha/admin)

</details>

<details>
<summary><strong>Resend</strong></summary>

<br />

- LP form triggers a branded HTML email to the full team on every submission
- Set `RESEND_API_KEY` in Vercel
- Soft-fail: if email send fails, lead is still logged to Vercel function logs

</details>

---

## `>_ PERFORMANCE RULES`

| Rule | Why |
|---|---|
| No `@import` in `global.css` | Fonts load async via Layout.astro — CSS `@import` is render-blocking |
| `functionPerRoute: false` | Bundles all routes into 1 serverless fn — stays within Vercel Hobby limit (12) |
| Node `20.x` via `engines` in `package.json` | Forces Vercel to write `nodejs20.x` runtime — Node 18 EOL'd Apr 2025 |
| `ParticleCanvas` capped at 50 particles | O(n²) loop — 50 pts = 1,225 checks/frame vs 4,005 at 90 pts |
| `quickTo` on `MagneticButton` + `Cursor` | No new tween allocated per mousemove pixel |
| `Loader` ≤ 1.5s | Hero animation delay set to 1.3s to match |

---

## `>_ TODO`

```
[ ] Create LP HubSpot form → set LP_FORM_GUID env var in Vercel
[ ] Create 6 custom HubSpot contact properties
[ ] Add fazeddigital.com to reCAPTCHA allowed domains
[ ] Set RESEND_API_KEY in Vercel
[ ] Re-enable reCAPTCHA hard block on /api/contact once domain is verified
[ ] Stripe setup + /api/checkout endpoint
```

---

## `>_ DEPLOYMENT`

Push to `main` → Vercel auto-deploys.

```
Adapter:  @astrojs/vercel/serverless  (v7.8.2)
Runtime:  nodejs20.x
Output:   hybrid (SSG + serverless)
```

---

<div align="center">

<br />

```
8.2280° N · 124.2452° E · Iligan City, Philippines
info@fazeddigital.com · fazeddigital.com
```

*Built by **Lord Arcamo** — Founder, Fazed Digital.*

<br />

</div>
