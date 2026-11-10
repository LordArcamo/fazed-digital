# Jury: service pages (/services/<slug> ×7 + the reworked /services hub)

Reviewed 10 Nov 2026, against the uncommitted tree on `main`. Judged against Direction C "Runtime" (`directions.md`), the copy in `copy/service-pages/*.md`, the owner pricing decisions (`docs/seo/pages/service-pages.md`, from line 520), and `proof.ts`, `cases.ts` and `services.ts`.

**How it was checked.** `npm run build` passes (lint-dist and lint-chat are clean, and no tracked file changed). The site was served with `sirv` from `.vercel/output/static` on :4352. I used headless Chrome through puppeteer-core, with a desktop UA so the geo swap runs. GL was live (WebGPU, T1).
- **Screens:** 1440×900 and 1920×1080, 1280×720, 1024×768, 390×844 and 375×667.
- **Behaviour:** menu at all of those sizes, reduced motion, no-JS, and the keyboard tab order.
- **Navigation:** ClientRouter between the hub, three service pages, home and back. ScrollTrigger and IntersectionObserver counts were tracked at each step.
- **Prices:** the geo swap (`?geo=ph` with the Asia/Manila time zone, and `?geo=intl`). I read every visible price text node, FAQ answers included.
- **Lighthouse 12.8:** mobile and desktop, ×3 pages.
- **Contact:** `/api/contact` on `astro dev`, with **invalid** payloads only. Nothing valid was sent.
- **Code:** JSON-LD parse, sitemap, internal-link crawl of `dist/`, and a diff of all 30 modified files.

## Scores

| Criterion | Weight | Score |
|---|---|---|
| Design | 40% | 7.6 |
| Usability | 30% | 7.4 |
| Creativity | 20% | 8.2 |
| Content | 10% | 7.8 |
| **Weighted** | | **7.7** |

| Gate | Result |
|---|---|
| Performance | **Pass.** Lighthouse mobile 96 / desktop 100 on web-design, automations and social. CLS 0, TBT 0 ms. Mobile LCP is 2.6 s (simulated slow 4G; the LCP element is the intro paragraph). The GL chunk is 188 KB gz. |
| Mobile | **Pass, with P1s.** No horizontal overflow at 390/375, and the answer-first hero works. The menu branch shows one of seven links. At 375×667 the ruler sits under the dock. |
| Accessibility | **Pass.** Lighthouse a11y 100 ×6. Visible focus on every tab stop, a skip link first, one H1, no duplicate ids and no dangling `aria-labelledby`. The ruler and flow are `role="img"` with full sentences. The price line has an sr-only list. Reduced motion works: no Lenis, no bar draw, no mask, meter on the CSS fallback. No-JS shows all content with both currencies. |
| Video-readiness | **7/10.** Web design, web apps and UI/UX are recordable: the bars draw from W0, then the meter fills and the screens develop out of the dot pitch. Automations, SEO and social have no case runs, so after the hero they are type only. The cookie card covers the left third of the ruler on first visit (desktop). |

**Verdict: Honorable Mention level. Don't ship as-is; ship once P0-1 is fixed (one line of CSS).** Runtime is a real idea, executed with discipline: the signature is the answer-first content, and every bar traces to `cases.ts`. What holds it back from SOTD is a grid break on every page at ≥1440, three retainer pages that run out of signature after the first screen, and a PH price that disagrees with itself across the site.

## Top 3 that are genuinely great (keep)

1. **The ruler is the answer.** Real build lengths, each bar textured with a core sample of the client's own screen (`shotBand`, shared by the SSR poster and the GL formation). The 7-day marker carries the fast buyer, and the 14-week bar sits honestly beside it. No other agency can put this chart on their site.
2. **Proof chapters.** Each has a mega week numeral ("01", "06", "10", "14"), a 14-segment run bar, the screenshot developing out of the dot pitch, and the sticky meter filling week rows as each case crosses the middle. The meter label follows the case (e.g. "The Telecom Shop · 10 wks"). It holds up under reduced motion (CSS fallback) and without JS.
3. **Honesty is built into the code.** `rulerBars()` throws on a client bar on a months ruler and on an `own` bar without a commit. The commits `583ecb7` (2026-10-18) and `120cffb` (2026-10-19) exist and match. "No client automations to show yet. Here's ours." is the right line.
   - **Prices:** every price is a variable from `proof.ts`. Automations and social match the owner tables exactly ($299/$899/from $2,500/$99 a month and ₱9,999/₱29,999/quoted/₱3,500; $399/$799/$1,499 and ₱14,999/₱29,999/₱49,999, with a 3-month minimum).
   - **No invented results:** none are claimed for SEO, automations or social. Both founding rates say "Nothing is asked in return."
   - **Geo swap:** it leaks no wrong-market price on any page tested.
   - **ClientRouter:** clean. ScrollTrigger counts return to the same number per page (hub 11, web 17/16, web apps 19), and the meter IO is created once per visit and disconnected on swap. The field switches to `runtime`/`meter` correctly, back/forward restores the meter state, and nothing double-binds.

## P0: broken

**P0-1. Every `prose` section is off the grid at ≥1440 px, on all seven pages.**
- **Where:** `src/pages/services/[slug].astro:93` puts `sv-${s.kind}` on the `<section>`, so prose sections get `class="sv-sec sv-prose"`. The component rule `.sv-prose { display: grid; gap: 1.5rem; max-width: 72ch; }` (line 315) therefore also hits the **section**. The section shrinks to 72ch (896 px) and pins left, and its `.container` loses `margin-inline: auto`.
- **Measured left edge:**

| Viewport | Prose sections | Every other section |
|---|---|---|
| 1440 | 58 px | 108 px |
| 1920 | 64 px | 354 px |
| 1024 / 1280 | aligned | aligned |

- **Pages affected:** SEO has 6 prose sections. Branding, automations and social have 3 each, UI/UX and web apps 2, web design 1 ("Yours, all of it.").
- **Fix:** don't reuse component class names as section modifiers. Change line 93 to `class:list={['sv-sec', `sv-k-${s.kind}`]}`. Also check the other kinds: `.sv-table` and `.sv-rows` are harmless today but have the same collision.

## P1: holds back the score

**P1-1. The automations ruler crowds its labels and leaves 11 months empty.**
- **Where:** `src/data/service-pages.ts:503-511`, `src/components/RuntimeRuler.astro:43,97,99`.
- **What's wrong (1440 and 1024):**
  - The mark label "Single automation · live in 5 business days" (row 0) and the band label "Automation care · $99/month · monitoring and fixes when a tool changes" (row 2, `top: 13px`) are both 10 px lime mono, 3 px apart. They read as one paragraph, and the second sits on the band's first dot row.
  - "14 days of fixes" (`.rr-runl`, `bottom: calc(var(--bot) - 6px)`) collides with the tick at month 1.
  - The product's whole life (5 days + 14 days) is the first 6% of a 12-month axis.
- **Fix, best option:** plot automations in **weeks**, not months (it is not a retainer; care is optional). Set `unit: 'weeks', span: 8`, with:
  - `marks: [{ at: 1, label: 'Live in 5 business days' }]`
  - `runs: [{ from: 1, to: 3, label: '14 days of fixes' }]`
  - `bands: [{ from: 3, to: 8, label: 'Optional care · $99/month' }]`

  This needs the `rulerBars()` months-only rule for `own` bars relaxed, or show the lead-flow bar as weeks since 2026-10-18 (3 weeks).
- **Fix, minimum:**
  - Shorten the band label to "Optional care · $99/month".
  - Right-align a band label whose band ends at `span` (`.rr-bandl.end { left: auto; right: 0; }`), so it never meets the marker label.
  - Raise `.rr-bandl.rr-row2` to `top: 16px`.
  - Move `.rr-runl` above the baseline: `bottom: calc(var(--bot) + 8px)`.

**P1-2. The PH starting price says ₱14,999 unlabelled, while the rest of the site says ₱19,999.**
- **What's wrong:**
  - `service-pages.ts:78` (`phStarter = offerPrice('php','starter')`), `services.ts:127` and `services.astro:63` print the founding rate (first 5 clients, deposit) as the plain "from" price.
  - The web-design table reads "Starter ₱14,999 · Growth ₱34,999 · Pro ₱59,999".
  - On the same screen, the menu's hard-coded hint (`Header.astro:74`, "FROM $499 · ₱19,999") says ₱19,999.
  - "How much does a website cost?" is now marked up on three pages with two answers: `/` and `/contact` say ₱19,999, `/services/web-design` says ₱14,999.
  - `public/llms.txt` line 10 says ₱19,999 and line 16 says ₱14,999.

  Using `offerPrice` follows the SEO plan; showing it **without the founding label** is the problem. A limited rate reads as the standard price.
- **Fix:** where `offerPrice(...).founding` is true, render "₱14,999 founding rate (standard ₱19,999)". Apply this in the web-design meter tail, the table cell, the price point, the intro and the FAQ (a small `phFrom()` helper in `service-pages.ts`), and in the hub deck and `serviceFaq`. Drive the menu hint from `offerPrice` (as the dock already does in LP mode), and add the label in `gen-llms.mjs`.

**P1-3. The phone menu branch shows one of seven service links, and never the current one.**
- **Where:** `Header.astro:326`.
- **What's wrong:** the branch is 209 px wide at 390 and 194 px at 375, so it shows "04.1 Web design" plus a faded "04". On `/services/automations` the lit item (04.6) is 650 px off to the right. The swipe affordance is a fade only.
- **Fix:** on open, scroll the current item into view. In `menu.ts` `set(true)`: `menu.querySelector('.menu-sub[aria-current]')?.scrollIntoView({ inline: 'center', block: 'nearest' })`. Also consider dropping the mono index on phones (`.menu-sn { display:none }` ≤1023), which fits about two and a half items, or wrapping to two 36 px rows. The README budget ("adds one row") allows the first two.

**P1-4. The phone ruler's lime marker cuts through the bar labels.**
- **Where:** `RuntimeRuler.astro:114` (phone labels are forced to `left: 0`), with the marker at `X(1)` ≈ 25 px (web) or `X(0.25)` (automations).
- **What's wrong:** "09 D|OTTED STUDIOS", "01 A| FRAMING", "THE| TELECOM", "08 Q|LD" (web design), "OUR O|WN SITE" (SEO), "OUR| OWN LEAD FLOW" (automations), at 390 and 375, in both the CSS poster and GL.
- **Fix:** on phones, give `.rr-bl` a black chip (`background: var(--black); padding-right: 6px;`) and `z-index: 1` over the poster/marker, or start the labels after the marker (`left: calc(<marker%> + 8px) !important`).

**P1-5. Home still says "Five services".**
- **Where:** `src/pages/index.astro:97`, "…Five services, one connected system. See all five". It links to a hub whose approved H1 is "Seven services."
- **Fix:** "Seven services, one connected system. See all seven", or the owner's line. Compute it from `SERVICE_TOTAL` so it can't drift again.

**P1-6. Check that HubSpot accepts the two new service values (I couldn't check this).**
- **Where:** `src/pages/api/contact.ts:16-17` adds `automations` → "Automations" and `social` → "Social Media Management". The label goes to HubSpot's `service_interest` (`src/lib/hubspot.ts:24`).
- **Why it matters:** if `service_interest` is a dropdown property, HubSpot rejects unknown options. The lead still reaches Gmail and the CRM, but not HubSpot.
- **Fix:** add both options to the HubSpot property before shipping, or confirm it is a free-text field. The API change itself is correct and minimal. Without it, these leads would arrive as "Not specified". Invalid payloads return 400 with the right messages.

## P2: polish

1. **Ghost CTA hidden on phones.** `[slug].astro:451` hides `.sv-ghost` on phones. On SEO it is the only link to `/audit` ("Book a free 15-minute website check"), a real conversion path. Keep the ghost on phones when its href isn't an in-page `#…`.
2. **"Book" leads to a form.** "Book a free 15-minute automation check" (`service-pages.ts:501`) lands on `/contact`, a form with no booking. The routing was resolved in copy §193; the verb wasn't. Use "Ask for a free 15-minute automation check", or say on `/contact?service=automations` that we reply with a call time.
3. **Cookie card covers the ruler.** At ≥1024 the card (`CookieBanner.astro:13`, bottom-left 440 px) covers the left third of the ruler, including W0, the 7-day marker and the first bar labels, on every first visit. Pin it bottom-right on `[data-page="runtime"]`, or lift the ruler.
4. **Plan rows go solid on phones.** At 3 px pitch, `.rr-plan` turns 30 posts a month into a solid line on social, so "one dot per post" is lost. On phones, plot one dot per **week** of posts, or drop to Starter/Pro only.
5. **Own bars end in a finish node.** On the automations and SEO rulers, the `own` bar ends in the lime "build finished" node. It is ongoing work, so draw an open arrow or a hollow ring (`formations.ts` `runtime()` and `.rr-node`) for `kind === 'own'`.
6. **Hub OG image unused.** `public/og/services.png` was regenerated with "Seven services. One connected brand.", but the hub still passes no `image` and ships `/og/home.png` (`services.astro:47-53`). Add `image="/og/services.png"`.
7. **Hub title length.** The hub title is 64 characters ("Web Design, Branding, SEO, Apps & Automation | Fazed Digital") and will truncate. Try "Web Design, Branding, SEO, Apps & Automation | Fazed" (≤60).
8. **Conflicting Service entities.** Hub ItemList entries reuse the service pages' `@id` (`…/services/<slug>#service`) with a different `description` and `areaServed: 'Worldwide'`, where the pages say three countries (`services.astro:40`). Emit only `{ '@id', name, url }` on the hub, so each entity has one definition.
9. **FAQ markup duplicated across pages.** "How much does a website cost?" is on `/`, `/contact` and `/services/web-design`. "How long does a website take?" is on `/australia` and web design. Two UI/UX questions repeat `/work/03`. Mark up each question on one page; the hub already does this de-dupe for service pages.
10. **Glyph bin cached in the old format.** `glyphs.bin` changed format (count header) under the same URL, and `/formations/*` is cached for 7 days (`vercel.json`). Returning visitors get the old file: `parseGlyphs` throws, the `.catch` swallows it, and home and hub nodes lose their glyphs for up to a week. Rename it to `glyphs7.bin`, or append `?v=<hash>` in `controller.ts:26`.
11. **Stale chat anchors.** `src/lib/chat/knowledge.ts:76` still lists "anchors: #web, #brand, #seo, #product, #systems". Add `#automations, #social`, or derive the list from `SERVICE_NAV`.
12. **Desktop menu taller than laptop screens.** At 1280×720 and 1366×768 the menu (scroll height 963/993) pushes "Get live in 7 days" to the fold and the contact strip below it. This was partly true before; the branch adds about 88 px. In the `max-height: 820px` range, tighten `.menu-label` or set the branch on one row with `gap: 0 .9rem`.
13. **Dot word nearly touches the branch.** At 1280 the menu's dot word ("Automations") starts about 12 px right of "04.4 UI/UX". Reduce `maxL` from 0.44 W to 0.40 W at <1366 (`menu-dots.ts`).
14. **Ruler below the fold at 375×667.** The ruler sits entirely under the dock, so the signature isn't in the first screen. At `max-height: 700px`, phones could drop the intro to 3 lines with a "More" link, or put the ruler above the intro. This is an owner call; the spec only promised 844.
15. **`llms.txt` spacing.** Line 21 reads "From $399 (₱14,999) /month". Drop the space, as in `gen-llms.mjs` `money()`.
16. **Pre-3D JS sits over 12 KB site-wide.** My measure is every eagerly loaded module concatenated and gzipped, plus the inline boot, geo and page scripts, excluding Vercel analytics:

| Page | Pre-3D JS (gz) |
|---|---|
| Service pages | 14.2 KB |
| `/about` (unchanged) | 13.7 KB |
| Home | 16.5 KB |

This change adds about 0.37 KB gz (the inline `initRuntime` script, plus a few bytes in `menu.ts` and `contact.ts`). It respects the rule's intent: no gsap or three in component scripts, and motion and GL stay dynamic. But the site baseline already sits over 12 KB by this measure. Agree on one method (`scripts/` has no budget check) and add it to `lint-dist`.

## Rule checks (CLAUDE.md)

| Rule | Result |
|---|---|
| Palette tokens only | Pass. The new CSS uses `var(--…)` only. `#000`/`rgba(0,0,0,…)` appear only in mask images. The hub SVG hex literals were there before. |
| gray-500 never text | Pass. Used only for the meter and baseline dots. |
| ClientRouter (`dataset.bound`, page-load init, no double binding, no stale field) | Pass. Tested hub → web → automations → web apps → hub → back → social → home → web. |
| No gsap/three in component scripts | Pass. `motion/runtime.ts` sits inside the dynamic motion chunk. |
| Blog `const posts = [` arrays | Untouched. `git diff` is empty for both files. |
| www host only | Pass. lint-dist is clean and no apex URL is in `dist/`. |
| Sitemap | All 7 service URLs are present. |
| Titles / descriptions | 52–62 characters / 145–155 characters. |
| One H1, canonical, JSON-LD | One H1 per page and a canonical on www. Service + FAQPage + BreadcrumbList (+ ItemList on web apps) all parse. |
| Internal links | No broken internal links in `dist/`. |

## Facts traced

| Fact | Source |
|---|---|
| Case lengths: Dotted 1, CrateOnScene 5, A Framing 6, Cleen & Green 8, Canwell 8, Telecom 10, 8Drive 10, UGLQ 12, QLD 14 weeks | `cases.ts` |
| Every before/after line, and "noticeably faster", "big time savings", "tools to scale", "dead portfolio page", "matching their existing catalogue structure" | `cases.ts` |
| GCash payments | Brief `service-pages.md:358` |
| WCAG 2.1 AA, deliverables | `services.ts` |
| Reply hours and time zones | NAP hours. The AU/US conversions are correct. |
| "Three of our four Australian cases are systems" | Computed from `cases.ts` |

**Lines still marked `// TBC owner`:** the brand deliverable notes, the AI-search wording, the design-only quote, the social monthly approval and the pack/custom timelines. They read as defaults rather than inventions; the owner should confirm them before ads point here.
