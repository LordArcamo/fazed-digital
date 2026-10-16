# Fazed Digital: www.fazeddigital.com

Web design, branding and SEO studio in Iligan City, Philippines. This is the **NETWORK** redesign (branch `redesign-network`, local only): one persistent GPU dot field lives behind every page and forms the Fazed mark, the services pentagon, each client's screenshot, a globe with arcs to client countries, the team rings and one contact node.

## Stack (exact versions, lockfile committed)

| Layer | Package | Why |
|---|---|---|
| Shell | `astro@7.4.0` + `@astrojs/vercel@11.0.15`, `@astrojs/sitemap@3.7.4` | Static output; the 2 `/api/*` routes are `prerender = false` (one `_render` function, `nodejs24.x`). `<ClientRouter />` keeps the canvas alive across pages (`transition:persist`). |
| 3D | `three@0.186.1` (`WebGPURenderer` + TSL) | One node graph, compiled to WGSL on WebGPU or GLSL on the WebGL2 backend. |
| Motion | `gsap@3.15.0` (ScrollTrigger), `lenis@1.3.27` | One clock: `gsap.ticker` drives Lenis and the field. |
| Fonts | Clash Display (self-hosted, Fontshare kit), `@fontsource-variable/plus-jakarta-sans@5.3.0`, `@fontsource/space-mono@5.3.0` | See licences below. |
| Build-time | `satori@0.26.0` + `@resvg/resvg-wasm@2.6.2` (OG, formation bake), `sharp@0.35.5`, `puppeteer-core@25.14.0`, `sirv-cli@3.0.1`, `typescript@6.0.3` | |

Node: Vercel builds on **24.x** (`engines`). Locally, Node ≥ 22.22 is needed for Astro 7.4 (this machine's system Node is 22.16, so a Node 24 binary was used).

React, `@astrojs/react`, `@gsap/react`, `lucide-react` and Storybook are gone. Every component is an `.astro` file with vanilla TS.

## Commands

```bash
npm install
npm run dev          # http://localhost:4351
npm run build        # extract-posts → bake-formations → generate-og → gen-llms → astro build → lint-dist
npm run preview:lh   # precompress + sirv the static output on :4352 (brotli/gzip, like Vercel) for Lighthouse
npm run check        # astro check
```

`npm run build` **fails** if the blog array contract breaks (`scripts/extract-posts.mjs`), or if the output contains an apex `https://fazeddigital.com` URL, a printed `[TBC` marker, or a "never claim" item from `copy/proof.md` §G (`scripts/lint-dist.mjs`).

## T0 spike result: GO on three/webgpu + TSL

Measured in `spike/` (`npx vite build --config spike/vite.config.mjs`), on an Apple M4 in headless Chrome with GPU flags:

| Criterion | Result |
|---|---|
| (a) GL chunk ≤ 190 KB gz | Stock `three/webgpu`: 242 KB gz. With `src/field/three-plugin.mjs` it is **188.5 KB gz / 152 KB br** in the spike, and **192 KB gz / 156 KB br** in the site (the site chunk also holds the formations + controller, ~8 KB gz). See "Workarounds". |
| (b) WebGL2 backend identical | `forceWebGL` frame vs the WebGPU frame: **0 px differ**. |
| (c) first frame after chunk load | 204–257 ms cold, 85 ms warm, 104 ms at 4× CPU throttle. WebGL2 with a cold shader cache: 2.9 s once, then 62 ms. |
| (d) main-thread compile | No long task during `compileAsync` (the only 4×-throttle task is the 85 ms chunk parse). |
| (e) fps | 60 fps at T1 (61,440 points + compute spring) on both backends. |
| (f) no-GPU → poster | SwiftShader routes to t0. **Note:** default headless Chrome on this Mac reports a real Metal GPU and renders GL; the perf watchdog covers slow headless cases. |

### Workarounds (honest list)
- `src/field/three-plugin.mjs` resolves `three/webgpu` to a minimal entry (`src/field/three-entry.js`, using `WebGPURenderer.Nodes` + `BasicNodeLibrary`) and `three/tsl` to `three/src/nodes/TSL.js`. It also stubs `XRManager`, `PMREMGenerator` and `ShadowNode` (no XR, env maps or lights are used). In dev, `optimizeDeps.exclude: ['three']` avoids two TSL copies.
- `ColorManagement.enabled = false` + a linear output colour space, so alpha blending happens in sRGB numbers like CSS. That gives poster parity: GL dots land within 0.3 px of the CSS dots.
- The canvas is transparent over a CSS lattice (`#field-root .lattice`). The lattice is the permanent ground, so the GL "lattice" formation sits exactly on the CSS dots.
- The GPU probe runs in a Worker (OffscreenCanvas) and is cached per session. Creating a WebGL context on SwiftShader blocked the main thread for 1.8 s (it showed up as Lighthouse TBT).
- ClientRouter replaces `<html>` attributes on every swap. `boot/main.ts` carries the runtime classes (`gl-live`, `lenis`, …) onto `newDocument`.

## Architecture

- `src/layouts/Base.astro`: head and SEO (`@graph` ProfessionalService + WebSite, canonical on the www host), font preloads, inline boot flags, `<ClientRouter>`, the persisted `#field-root` (CSS lattice + canvas), cursor, skip link, Header/Footer (or the LP header/footer), consent banner.
- `src/boot/main.ts` (pre-3D, ~8.5 KB gz incl. ClientRouter): header state, menu (focus trap, Esc, `inert`), consent (GA4 loads **only after "Accept analytics"**), and the route lifecycle. It loads `motion` at idle, and `gpu` → `field/controller` after `load`+idle on desktop or on the first interaction on mobile. Reading pages (`formation="none"`: blog posts, legal) load neither.
- `src/field/`: `field.ts` (renderer, A/B/M instanced buffers, CPU snapshot for interrupted morphs, cursor links, arcs, WebGPU compute spring), `points.tsl.ts` (stateless morph + analytic curl + push + ripples + tilt; lattice/white/lime tone ramp; halo pass), `formations.ts` (lattice, mark, shot, pentagon + glyphs, globe, rings, node, path4, days7, wordmark, scatter), `controller.ts` (page → formation beats, hero scrub, wake, handshake, watchdog, `?record`), `tiers.ts`, `watchdog.ts`.
- `src/motion/`: Lenis + ScrollTrigger, reveals, cursor node, magnetic CTAs, home choreography (services pin with 5 real step buttons, flood wipe, day nodes), work-index preview, case plates.
- `src/data/`: `site.ts` (NAP, socials, computed `YEARS`), `proof.ts` (**the one editable file for stats, testimonials, flags and caps**), `cases.ts` (the `cases` array moved verbatim + `CASE_EXTRA`), `services.ts`, `team.ts`, `lp.ts`, `images.ts`.
- `scripts/`: `bake-formations.mjs` (`public/formations/*.bin`: mark mask 0.65 KB br, shots 1.4–11 KB br, glyphs 5.9 KB, globe land bitmask 2.5 KB, wordmark), `extract-posts.mjs`, `generate-og.mjs` (53 OG images), `gen-llms.mjs`, `lint-dist.mjs`, `precompress.mjs`.

### Field tiers and gate
T1 61,440 points (desktop, ≥8 cores, ≥1024 px, compute spring on WebGPU) · T2 20,480 (mobile/other) · T3 8,192 (low memory/cores) · T0 poster (SwiftShader/llvmpipe/softpipe/"Basic Render"/WebGPU fallback adapter without WebGL2, `saveData`, `?gl=off`, init failure). `?gl=force` skips the checks. `?record` forces GL at T1, hides the cursor, uses `dt = 1/60`, and runs a scripted 30 s home scroll. The watchdog fires once (avg < 24 fps over 2 consecutive 4 s windows, ignoring 30 fps caps, the first 3 s and hidden tabs): it stops the loop, destroys Lenis, returns to poster mode and keeps the scroll position.

## Blog contract (nightly 1:05 AM routine)
The two `const posts = [` arrays stay in `src/pages/blog/index.astro` and `src/pages/blog/[slug].astro`, **byte-identical** (verified against HEAD). Only the imports above them and the template below them changed. At render:
- author photos are mapped locally (`src/lib/authors.ts`; `wp-content` URLs are ignored).
- `content` links are rewritten from the apex to `https://www.fazeddigital.com`.
- H2s get ids for the TOC.
- covers are generative SVG from `slug` × `category`.

Category hubs live at `/blog/category/{seo,branding,design,development,strategy}`. **Tell the routine:** use `/images/team/{lord,russel}.jpeg` for author photos, keep `excerpt` ≤ 155 chars (16 of 37 are longer today), and keep every field (the build fails otherwise).

## Licences
- **Clash Display** (Indian Type Foundry, Fontshare). The ITF FFL in the kit says: *"You may self-host the Font Software on your own servers or infrastructure for use on your own websites"* (§01). It forbids modification, subsetting and format conversion (§02). So the **unmodified** kit woff2 files are self-hosted in `public/fonts/clash/` with `LICENSE`, and the unmodified kit woff files sit in `scripts/fonts/` for OG rendering. Conclusion: **self-hosting is permitted.**
- Plus Jakarta Sans and Space Mono: SIL OFL 1.1 (via Fontsource).
- Natural Earth 110 m land: public domain. More in `CREDITS.md`.

## Copy mapping (`../copy/*.md` → code)
| Copy file / section ids | Where |
|---|---|
| home.md HOME-01…09 + answers (H1 option **B** "Built in Iligan. / Live worldwide.") | `src/pages/index.astro`, `src/data/{services,proof,team}.ts` |
| services.md SERV-HERO, SERV-01…05, SERV-FAQ, SERV-CTA | `src/pages/services.astro`, `src/data/services.ts` (`chapters`, `serviceFaq`) |
| work.md WORK-*, CASE-* (8 cases) | `src/pages/work.astro`, `src/pages/work/[slug].astro`, `src/data/cases.ts` (`CASE_EXTRA`) |
| about.md ABOUT-* | `src/pages/about.astro` |
| contact.md CONTACT-* | `src/pages/contact.astro`, `src/components/ContactForm.astro` |
| lp-7-day-usd.md / lp-7-day-ph.md LP-* | `src/components/Lp.astro`, `src/data/lp.ts`, `src/components/LpForm.astro` |
| blog-index.md BLOG-* | `src/components/BlogList.astro`, `src/pages/blog/*`, `src/lib/cover.ts` |
| global.md GLOBAL-* | `Header.astro`, `Footer.astro`, `CookieBanner.astro`, `Base.astro` |
| not-found.md | `src/pages/404.astro` |
| lab.md (USER ANSWERS) + `../brief/lab-spec.md` (H1 "Concept sites. / Real craft.", alternatives in a comment) | `src/pages/lab.astro`, `src/data/lab.ts`, `src/components/{LabSheetPoster,LabIndex,Engine,IndexPreview}.astro`; teasers in `about.astro` (`.a-engine` → `/lab#engine`), `index.astro` (process line), `work.astro` (deck line) |
| seo-strategy.md (titles, descriptions, schema, hubs, llms.txt) | page frontmatter, `src/lib/schema.ts`, `scripts/gen-llms.mjs` |

**Kept current wording** (MUST-KEEP until the user approves the proposed lines): the H1s on /services, /work, /about, /contact, /blog, /404 and the LPs. Proposed titles and ≤155-char descriptions are applied. Placeholders that render as clearly marked placeholders while their flag in `proof.ts` is `false`: `LP_REVIEWS_REAL` (LP reviews) and `CASE_METRICS_REAL` (case metrics).

## Fazed Lab (/lab)
- **Flags** (`src/data/lab.ts`): `LAB_04 = 'full' | 'text' | 'hide'` (#04 Halde Ø1 uses a CC BY-NC-SA 4.0 base mesh; `'full'` = the user's choice 2026-10-17, with the visible credit on its entry; `'text'`/`'hide'` ship no Halde-derived pixel: the bake deletes `lab-04*` and the plate/silhouette drop out). `LAB_SHOW_JURY = false` (scores are never shown). Every count (eyebrow, menu hint, JSON-LD, OG) is computed from `labItems`.
- **Field:** `slate` (the 5×2 contact sheet; static frames first and unshuffled, so the 4.2 s auto-advance only morphs the lead; hover/focus on a caption holds it, 6 s after leave it resumes; in-view only), `lab` (index: `fz:lab` → `F.sil` at 1.5× the plate), `pipeline8` (8 stations + 3 gates + agent rings + tool square, lit by the page script's `fz:pipe`). Bins: `public/formations/lab-NN.bin` (Shot format, luma → matte) + `lab-NN-poster.webp` (the T0/SVG sheet), baked from `scripts/lab-src/` (block 3b). Curl eases to 1.5 on `slate`/`pipeline8` so the frames read as drawn lines.
- **Plates:** `src/assets/lab/0N.jpg` from fresh captures (`scripts/capture-lab.mjs`). Re-capture before relaunching: the #02 raffle clock dates the plate.
- **Nav:** Lab after Work; Blog leaves the top rail only (dock ≥1180, menu, footer keep it). Menu = 8 rows, `sd-idx` total computed; ≤720px-tall phones get 44px rows + email/phone on one row.

## Known gaps / next
See `../media/build/PROGRESS.md` for the latest state and the exact next step.
