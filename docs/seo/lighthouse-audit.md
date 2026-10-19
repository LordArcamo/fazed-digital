# Lighthouse / PageSpeed audit: www.fazeddigital.com

The Navigator · 2026-10-19 · build audited = HEAD `11940a6` (the live site serves the same HTML: titles and descriptions of `/audit` and `/lp/7-day-website` were diffed live vs local, identical).

## How this was measured (read first)

| Source | Status |
|---|---|
| PageSpeed Insights API v5 (no key) | **Blocked.** The first call returned `429 RESOURCE_EXHAUSTED: Quota exceeded for quota metric 'Queries' and limit 'Queries per day'`. The keyless quota is shared by everyone calling without a key, so it was used up before this run. A retry later in the session also returned 429. No PSI numbers exist for today. |
| Local Lighthouse 12.8.2 (mobile, simulated throttling) against the precompressed static build (`.vercel/output/static` on :4352) | 3 pages done (`/`, `/services`, `/work`). Then the coordinator asked that no more local Chrome runs happen, because another agent was using headless Chrome. The run was stopped there. |
| Static SEO pre-check: every Lighthouse 12 SEO audit re-implemented over all 66 built HTML pages, plus live HTTP checks | Done for every page (see below). |

**Why the static pre-check is enough for the SEO score.** Lighthouse 12's SEO category is deterministic. It does not depend on timing. Its scored audits are `is-crawlable`, `document-title`, `meta-description`, `http-status-code`, `link-text`, `crawlable-anchors`, `robots-txt`, `image-alt`, `hreflang` and `canonical`. `tap-targets` was removed in v12, and `structured-data` is manual and unscored. All of them read the HTML, the response headers and robots.txt, and those were all checked directly.

**To get the missing PSI numbers:** create a free PSI API key (Google Cloud console → APIs & Services → enable "PageSpeed Insights API" → Credentials → API key; the quota is 25,000 queries a day). Then run the same sequential loop with `&key=…` appended. The script used is at `scratchpad/psi/run.sh` (it skips pages already fetched and retries once on 429).

## Score table

Lighthouse scores, in the order Perf / A11y / Best-practices / SEO.

| Page | Mobile (local LH 12.8.2) | Desktop | SEO pre-check (static + live headers) |
|---|---|---|---|
| `/` | **98 / 100 / 96\* / 100** (FCP 1.7 s, LCP 2.3 s, TBT 0 ms, CLS 0) | not measured | pass → **100** |
| `/services` | **96 / 100 / 96\* / 100** (FCP 1.8 s, LCP 2.6 s, TBT 0, CLS 0) | not measured | pass → **100** |
| `/work` | **94 / 100 / 96\* / 100** (FCP 1.8 s, LCP 2.9 s, TBT 0, CLS 0) | not measured | pass → **100** |
| `/work/01` | not measured | not measured | pass → 100 |
| `/work/05` | not measured | not measured | pass → 100 |
| `/lab` | not measured | not measured | pass → 100 |
| `/about` | not measured | not measured | pass → 100 |
| `/contact` | not measured | not measured | pass → 100 |
| `/blog` | not measured | not measured | pass → 100 |
| `/blog/get-more-google-reviews` | not measured | not measured | pass → 100 |
| `/lp/7-day-website` | not measured | not measured | pass → 100 (hreflang valid: `en`, `en-PH`, `x-default`, reciprocal) |
| `/lp/7-day-website/ph` | not measured | not measured | pass → 100 (hreflang valid, reciprocal) |
| `/audit` | not measured | not measured | pass → 100 |
| `/privacy` | not measured | not measured | pass → 100 |

\* Best-practices 96 locally comes only from `errors-in-console`. The two 404s are `/_vercel/insights/script.js` and `/_vercel/speed-insights/script.js`, which exist on Vercel but not on a local static server. **This is a local artefact, not a live defect.** Expect 100 live, but confirm with PSI.

### What the SEO pre-check verified on every page
- `<html lang="en">` on all pages. Each page has a unique, non-empty `<title>` and `<meta name="description">`. The only page without them is `googleb56cde69b8c57615.html`, the Search Console verification file, which is not a page and is not in the sitemap.
- `canonical` is absolute, on the www host, and has no trailing slash. It matches the sitemap.
- `robots` meta is `index, follow`. No `X-Robots-Tag` header on any of the 14 audited URLs (live HEAD, all `200`).
- `robots.txt` is valid: `User-agent: *` / `Allow: /` / 2 Disallows / `Sitemap:` on www.
- `crawlable-anchors`: 0 anchors without an `href` or with `javascript:` across 66 pages.
- `link-text`: 0 generic anchor texts ("read more", "learn more", "click here", "here", "more", …) across 66 pages, blog bodies included.
- `image-alt`: 0 `<img>` without an `alt` attribute. Decorative images use `alt=""` on purpose (blog author avatars, Lab poster frames).
- `http-status-code`: 200 on all 14 URLs live. The apex returns `308` to www.

**Verdict: SEO = 100 on every important page today. No SEO fix is needed to reach 100.** The fixes below protect that score and lift Performance and AI and search quality. They are ordered by impact.

## Fix list (deduplicated, ordered by impact)

### 1. `/work` mobile LCP image is lazy-loaded (Perf, `/work` and `/` on phones)
Lighthouse flagged `lcp-lazy-loaded` and `lcp-discovery-insight` on `/work`. The LCP element is the first case thumbnail, `li.wli > a.wrow > picture > img.w-thumb` (A Framing Company), at 2.9 s. The thumbnail only shows on screens narrower than 1024 px, where it sits above the fold on `/work`.

`src/components/WorkIndex.astro:13` and `:23`
```astro
{caseIndex.map((c) => (
…
<Picture class="w-thumb" … loading="lazy" decoding="async" />
```
Fix:
```astro
{caseIndex.map((c, i) => (
…
<Picture class="w-thumb" … loading={i === 0 && services ? 'eager' : 'lazy'} fetchpriority={i === 0 && services ? 'high' : 'auto'} decoding="async" />
```
Only `/work` passes `services`. On the home page the index sits further down, so it stays lazy. Expected result: `/work` mobile LCP drops by about 0.4–0.6 s and Perf goes from 94 to about 97–98. Cost on desktop: the 480w AVIF loads even though `.w-thumb` is `display:none` there, about 20 KB once.

### 2. Long-cache headers for static, non-hashed assets (Perf on repeat visits; PSI "Use efficient cache lifetimes")
Live check: `/fonts/plus-jakarta-sans-latin-wght-normal.woff2` returns `cache-control: public, max-age=0, must-revalidate`. The same holds for `/fonts/clash/*`, `/formations/*.bin`/`.webp` and `/images/*`. Lighthouse listed 14–22 resources and about 166–282 KiB of cache savings per page. Only `/_astro/*` is immutable by default.

`vercel.json` (repo root, not `src/`). Add:
```json
"headers": [
  { "source": "/fonts/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
  { "source": "/formations/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=604800, stale-while-revalidate=86400" }] },
  { "source": "/images/(.*)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=604800, stale-while-revalidate=86400" }] }
]
```
Fonts never change name or content (the licence forbids modifying them), so `immutable` is safe. Formations and team images get re-baked under the same name, so they get 7 days, not immutable.

### 3. One URL per page: trailing-slash variants return 200 (crawl hygiene)
`https://www.fazeddigital.com/services/` returns **200** with the same HTML, and the canonical points to `/services`. Lighthouse does not fail this, but it creates duplicate URLs for Bing and for AI crawlers that ignore canonicals. `astro.config.mjs:11` has `trailingSlash: 'ignore'`.

Fix in `vercel.json`: add `"trailingSlash": false`. Vercel then sends `/services/` to `/services` with a 308. Check the 2 `/api/*` routes afterwards, because forms post to `/api/contact` and `/api/lp-submit` without a slash, which is fine.

### 4. Sitemap `lastmod` is the build time for every URL (crawl signal)
`astro.config.mjs:17`: `lastmod: new Date(),`. All 65 URLs claim they changed at every deploy. Google ignores `lastmod` once it proves unreliable, so new posts lose their freshness signal.

Fix: remove the global `lastmod`. In `serialize(item)` (lines 18–24), set `item.lastmod` from `src/data/.generated/posts.json` (the post `date`) for `/blog/<slug>`. For other pages, use a small static map, or omit the field.

### 5. Home text extractors read a grid ruler as content (AI/GEO quality, not LH)
`src/pages/index.astro:61` renders `<div class="ruler container" aria-hidden="true">` containing `Col 01 … Col 12 Pitch 24px` as real text. `aria-hidden` hides it from screen readers but not from crawlers. Non-rendering AI crawlers (GPTBot, ClaudeBot, PerplexityBot) therefore read "Col 02 Col 03 … Pitch 24px" straight after the hero. Fix: keep the look and move the labels into CSS, e.g. `<span class="mono" data-c="01"></span>` with `.ruler span::before { content: 'Col ' attr(data-c); }` and `.ruler-pitch::before { content: 'Pitch 24px'; }`. This is a visual no-op.

### 6. Cheap snippet-length fixes (CTR, not LH)
These are not Lighthouse failures. They are SERP truncations.

| File:line | Current | Proposed |
|---|---|---|
| `src/pages/audit.astro:31` description, 172 chars | "Book a free 15-minute website check. We’ll look at your site with you and point out the 3 fixes that would bring you the most calls and enquiries. No site yet? Book anyway." | "Book a free 15-minute website check with Fazed Digital. We find the 3 fixes that would bring your business more calls and enquiries. No site yet? Book anyway." (155) |
| `src/pages/blog/[slug].astro` template (`pageTitle`, below the posts array): titles over 44 chars get no brand suffix | e.g. `/blog/get-more-google-reviews` title is 75 chars | Leave the post titles alone (the nightly contract). Tell the routine to keep `title` ≤ 60 chars, or add an optional `seoTitle` in the template that falls back to `title`. This is template code below the array, so it is allowed. |
| Blog excerpts used as descriptions | 16 of 37 excerpts are over 155 chars (README) | Routine rule: `excerpt` ≤ 155 chars (already in README; repeat it in the routine prompt). |

### 7. Unused JS on first load (Perf, low priority)
`/_astro/ScrollTrigger.*.js` shows 22–27 KiB of unused JS at load on `/`, `/services` and `/work`. It is already a dynamic import at idle (per the CLAUDE.md budget), so this is by design. Leave it, unless PSI live shows TBT above 0.

## Not checked / follow-ups
- Desktop scores and the 11 unmeasured mobile pages: rerun PSI with a key (see top).
- Live Best-practices: confirm 100 once PSI works (the Vercel scripts load there).
- Real-user data (CrUX / Vercel Speed Insights): the site is new and probably has no CrUX data yet. Use the Vercel Speed Insights dashboard (`<SpeedInsights />` is already in `Base.astro:120`).
