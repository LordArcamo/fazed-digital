# Internal linking plan and audit

The Navigator · 2 Nov 2026 · scope: www.fazeddigital.com (Astro static build, 85 indexable pages)

Internal links are the one ranking lever we fully control. They tell Google which pages matter, which query each page owns, and how pages relate. This doc records the crawl, the keyword map, the hub-and-spoke model, and every link change made on 2 Nov 2026. The link data lives in one file, `src/data/links.ts`, so future changes happen there, not page by page.

## 1. Method

- Built the site (`npm run build`, Node 24) and crawled `dist/client` with a script (ultrahtml parser).
- For each page it counted inbound and outbound internal links, the anchor texts, and click depth from `/`. It also checked for broken links, links that hit a `vercel.json` redirect, trailing-slash links (`trailingSlash: false` redirects them), `#fragment` links to missing ids, apex-host links and vague anchors ("read more", "here", "learn more").
- **Contextual** = links inside `<main>`, excluding the breadcrumb trail. **Chrome** = header, menu, footer and the season pill. A page counts as a **near-orphan** when 2 or fewer other pages link to it from content.
- Counts are "linking pages", not raw links: 50 links from one page count once.

## 2. Findings

### Site-wide numbers

| Metric | Before | After |
|---|---|---|
| Indexable pages | 85 | 85 |
| Orphans (0 contextual inbound) | 2 (`/terms`, `/halloween`) | 2 (same, both intentional) |
| Near-orphans (1–2 contextual inbound) | 3 (`/ecommerce` 1, `/framer` 2, `/webflow` 2) | 0 |
| Money pages, avg contextual inbound pages ¹ | 33.6 (lowest: 1) | 43.6 (lowest: 13) |
| Platform pages (`/framer`, `/webflow`, `/ecommerce`), avg | 1.7 | 18.0 |
| Case studies `/work/01–09`, avg | 7.0 (lowest: 4) | 13.2 (lowest: 8) |
| Blog posts: links to money pages and cases, avg per post | 3.9 | 5.7 |
| Broken internal links | 0 | 0 |
| Links through a redirect / trailing slash / missing `#id` / apex host | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| Vague anchors ("read more", "here"…) | 0 | 0 |
| Max click depth from `/` | 2 (all posts) | 2 |
| Visible breadcrumbs where BreadcrumbList exists, below top level | posts, hubs, cases | + `/framer`, `/webflow`, `/ecommerce`, `/web-design-iligan-city` |

¹ `/services`, both 7-day pages, `/web-design-iligan-city`, `/framer`, `/webflow`, `/ecommerce`, `/audit`. The home page gets 3 contextual links by design: it is linked from the logo on every page.

### Per page (contextual inbound pages, outbound contextual targets)

| Page | Inbound before → after | Outbound before → after | Depth |
|---|---|---|---|
| `/services` | 58 → 73 | 28 → 34 | 1 |
| `/lp/7-day-website` | 63 → 66 | 3 → 3 | 1 |
| `/lp/7-day-website/ph` | 66 → 67 | 4 → 4 | 1 |
| `/web-design-iligan-city` | 10 → 21 | 12 → 14 | 1 |
| `/framer` | **2 → 22** | 5 → 11 | 1 |
| `/webflow` | **2 → 19** | 5 → 10 | 1 |
| `/ecommerce` | **1 → 13** | 7 → 14 | 1 |
| `/audit` | 67 → 68 | 0 → 0 (landing mode, on purpose) | 1 |
| `/lab` | 5 → 12 | 3 → 7 | 1 |
| `/work` | 20 → 22 | 12 → 15 | 1 |
| `/about` | 57 → 57 | 4 → 9 | 1 |
| `/work/01` A Framing Company | 11 → 20 | 7 → 10 | 1 |
| `/work/02` Cleen & Green | 11 → 25 | 7 → 10 | 1 |
| `/work/03` CrateOnScene | 7 → 10 | 7 → 8 | 1 |
| `/work/04` The Telecom Shop | 8 → 15 | 8 → 10 | 1 |
| `/work/05` Canwell | 6 → 8 | 7 → 8 | 1 |
| `/work/06` 8Drive | 6 → 8 | 6 → 7 | 1 |
| `/work/07` UGLQ | 6 → 8 | 7 → 7 | 1 |
| `/work/08` QLD Law Group | 4 → 8 | 8 → 8 | 1 |
| `/work/09` Dotted Studios | 4 → 17 | 7 → 11 | 1 |

### What was wrong (before)

1. **The three platform pages were near-orphans.** `/framer`, `/webflow` and `/ecommerce` got their only contextual links from each other and from `/work/04`. Not one blog post, case study or service chapter linked to them. The footer link alone does not tell Google they matter.
2. **`/services` never linked to the platform pages or the Iligan page,** although its web chapter says "Webflow" and its SEO chapter talks about local SEO.
3. **Cases did not link to their own blog posts.** `/work/04` did not link to `/blog/magento-to-prestashop-migration` (same keyword, see §3), and `/work/01` did not link to `/blog/website-design-general-contractors`.
4. **`/blog/ecommerce-website-price-philippines` did not link to `/ecommerce`,** the page that should convert that reader.
5. **Blog posts linked only to their category's service anchor** (one line, the same for every post in a category) and almost never to a case study.
6. **`/lab` was a dead end** for buyers (only About, Contact, Work).
7. **`/halloween` is linked from every page** through the season pill (82 pages, hidden by CSS outside the season window). See §6, owner decision.
8. Small UI bug: the current item in the blog hub breadcrumb sat 12px above the trail (fixed).

## 3. Keyword ownership and cannibalisation

One page owns each query. Every other page that touches the topic links **to** the owner with a descriptive anchor and does not compete with it in its title or H1. Market notes and search observations: `strategy.md` §2–3 (SERPs observed 19 Oct 2026).

| Query the page should own | Owner | Supporting pages (link up to the owner) |
|---|---|---|
| web design Philippines / web design studio Philippines | `/` (title "Web Design & Branding Studio in the Philippines") | `/services`, `/about`, `/blog/how-to-choose-web-design-agency-philippines` |
| web design services, branding, SEO services | `/services` (+ `#web`, `#brand`, `#seo`, `#product`, `#systems`) | every blog post via "Put this guide to work" |
| web design Iligan City / web designer Iligan | `/web-design-iligan-city` | `/about`, `/work/09`, `/blog/seo-iligan-city`, `/blog/web-developer-cagayan-de-oro`, PH offer cards |
| 7-day website / website in a week / fixed-price website | `/lp/7-day-website` | every non-PH post (offer card), `/services`, `/work`, platform pages |
| website price Philippines (transactional) | `/lp/7-day-website/ph` | PH posts, `/web-design-iligan-city`, `/blog/web-design-pricing-guide` (informational) |
| Webflow developer / Webflow website design | `/webflow` | `/services#web`, 9 blog posts, cases 01/02/09, `/lab`, `/work` |
| Framer developer / Framer website design | `/framer` | `/services#web`, 13 blog posts, cases 01/02/09, `/lab`, `/work` |
| e-commerce website Philippines / online store design | `/ecommerce` | `/services#web`, 8 blog posts, `/work/04`, `/lab`, `/work`, development hub |
| Magento to PrestaShop migration | `/work/04` (proof) **and** `/blog/magento-to-prestashop-migration` (how-to) | now cross-linked both ways |
| free website audit / free website check | `/audit` | `/blog/free-website-audit`, every offer card, SEO hub |
| 3D website / three.js website / immersive website | `/lab` | `/work/09`, 4 blog posts, `/framer`, `/services#product` |

### Cannibalisation found (decisions for the owner)

| Overlap | Risk | Recommendation |
|---|---|---|
| `/work/04` title "Magento to PrestaShop Migration, Zero Data Loss" vs post "Magento to PrestaShop Migration: Lessons From a Real Store Move" | High: same head term in both titles and H1s | Keep both, split intent: the case owns "Magento to PrestaShop migration **case study**", the post owns "how to migrate Magento to PrestaShop". Suggested case title: `Magento to PrestaShop Migration Case Study \| Fazed` (49). Cross-links now exist. |
| `/about` title "…Web Design Agency in Iligan City" vs `/web-design-iligan-city` | Medium: two pages for "web design Iligan" | Retitle About to `About Fazed Digital \| Web Design Studio, Philippines` (51) so the Iligan page owns the local term. About now links to the Iligan page with the anchor "Iligan City". |
| `/blog/fixed-price-website-design` vs `/lp/7-day-website` (strategy §7 reserves "fixed price website" for the LP) | Medium | Keep the post on "what's included in a fixed-price website" (learning intent). It already links to the LP from its body and offer card. If the post outranks the LP for "fixed price website design" in Search Console after 8 weeks, change the post's title to lead with "What's included". |
| `/blog/free-website-audit` vs `/audit` | Low (post links to `/audit`, different format) | No change. Watch in Search Console. |
| `/` vs `/services` for "web design Philippines" | Low | No change: home is the brand and studio page, services is the list of services. |

## 4. Hub-and-spoke model

```
                         /  (brand, studio)
                          │
   ┌──────────────┬───────┴────────┬────────────────┬──────────────┐
/services      /work            /blog             /lab       /web-design-iligan-city
 (service hub)  (proof hub)      (content hub)     (craft)     (local hub)
   │  #web ──── /framer, /webflow, /ecommerce  (platform spokes)
   │  #brand    │                 │
   │  #seo ──── /web-design-iligan-city, /audit
   │  #systems  │                 │
   │            /work/01–09 ◄──── posts ("Put this guide to work")
   │              │  ▲            │  ▲
   └──── 7-day LPs (conversion) ◄─┴──┴── offer card on every post
```

Rules the templates now follow:

1. **Posts → spokes.** Every post ends with "Put this guide to work": three links, usually one service or platform page, one case study and one related page, each with its own anchor and a one-line note drawn from site facts. The offer card below it carries the 7-day page and `/audit`, so the block avoids repeating them.
2. **Cases ↔ posts and platforms.** Each case lists related cases, related services and related guides (`case-seo.ts`). Marketing-site cases (01, 02, 09) also offer the site-builder route ("Prefer a site builder? We also design and build Framer websites and Webflow websites"). The store migration (04) points to `/ecommerce` and the e-commerce-ready Pro package.
3. **Platforms → guides, cases, next steps.** `/framer`, `/webflow` and `/ecommerce` each have a "Keep exploring" block (3–4 guides, plus the 7-day route, a relevant case and the Lab or Iligan page) and a visible breadcrumb (Home / Services / X websites).
4. **Services → platforms and local.** The web chapter links Webflow, Framer and e-commerce. The SEO chapter links the Iligan page and `/audit`. The systems chapter links the Iligan page, and the product chapter links the Lab.
5. **Hubs → money pages.** Each blog category hub links its service and 2–3 related money pages or cases.
6. **Lab → services.** The Lab's closing CTA links custom web design, Framer, Webflow and online stores.
7. **Never link** `/halloween` (seasonal), the private Greenleaf preview, or Lab #04 Halde from lists on the home page or the LPs.

## 5. Implemented on 2 Nov 2026 (no business decision needed)

| File | Change |
|---|---|
| `src/data/links.ts` (new) | The link map: fact-only notes per money page, hand-written anchors for all 55 existing posts, topic rules plus a category fallback for posts the nightly routine adds, hub links, platform "Keep exploring" lists, case platform links, Lab links and service-chapter "Also" lines. |
| `src/components/RelatedLinks.astro` (new) | Plain-HTML link block (no JS). Tap targets are 44px or taller, colours come from tokens only. |
| `src/components/Crumbs.astro` (new) | Visible breadcrumb matching the page's BreadcrumbList. |
| `src/pages/blog/[slug].astro` | Template only, below the posts array (array bytes unchanged, checksum verified). Replaced the one-line "Need help with this?" link with the "Put this guide to work" block. |
| `src/components/BlogList.astro` | Category hubs link 2–3 related money pages. Fixed the hub breadcrumb's current item alignment. |
| `src/components/PlatformPage.astro` | Breadcrumbs, plus a "Keep exploring" section before the FAQ. |
| `src/pages/work/[slug].astro` | Site-builder / store sentence under the related links. |
| `src/data/case-seo.ts` | New related links: 01 → contractors post; 02 → brand price post; 03 → how-long post; 04 → Magento post; 05 → offshore AU post; 06 → Iligan page; 09 → SEO Iligan post and Lab. |
| `src/pages/services.astro` | "Also" line under Related reading for the web, SEO, systems and product chapters. |
| `src/pages/lab.astro` | "Same team, everyday builds" line linking web design, Framer, Webflow and online stores. |
| `src/pages/work.astro` | Hero line: "Platform builds: Framer sites · Webflow sites · Online stores". |
| `src/pages/about.astro` | "Rooted in Mindanao" now links Iligan City → Iligan page and the client types → cases 01, 04, 08, 02. |
| `src/pages/web-design-iligan-city.astro` | Breadcrumb. The CDO paragraph links the CDO post, and the FAQ "More" line links the SEO Iligan post. |

Not touched: the home page hero and home sections (sensitive), both 7-day LPs and `/audit` (conversion pages, kept focused), the posts arrays, `src/forms/lp.ts`, `src/lib/mail.ts`, `src/pages/api/lp-submit.ts`.

### Maintaining it

- **New posts from the nightly routine** get links automatically from the topic rules in `links.ts` (e.g. a post with "gcash" or "shop" in its slug gets `/ecommerce`; "contractor" gets `/work/01`; "iligan" or "cdo" gets the Iligan page), plus the category's service. Once a month, add a hand-written entry to `POSTS` in `links.ts` for each new post, so its anchors are specific.
- **New money page** (e.g. `/pricing`, `/services/custom-systems`): add a key to `T` in `links.ts`, then point the relevant `POSTS`, `RULES`, `SERVICE_ALSO` and `case-seo.ts` entries at it.
- **Re-run the crawl** after big changes. The crawler is not in the repo. Ask for it to be added as `scripts/crawl-links.mjs` if you want it as a build step.

## 6. Owner decisions

1. **Retire `/halloween` properly.** Now that the season is over: (a) stop rendering `SeasonPill` outside Oct 1–Nov 1, or remove it until next year, so 82 pages stop linking to a seasonal page; (b) add a 301 from `/halloween` to `/audit` in `vercel.json`; (c) take it out of the sitemap. This switches off a seasonal effect, so it needs your OK.
2. **Cannibalisation titles** (§3): the `/work/04` title and the `/about` title.
3. **Home page.** Today it has no contextual link to `/framer`, `/webflow` or `/ecommerce`. A single line under "See all five services" (e.g. "Also: Framer sites · Webflow sites · Online stores") would pass the strongest page's authority to them. The services section is GSAP-pinned, so this needs a design check.
4. **New pages worth building** (from `strategy.md` §4, still the right order):
   - `/services/custom-systems` (owns "car rental booking system", "membership portal", "client portal"; four real cases to stand on)
   - `/pricing` (owns price-intent queries in every market)
   - `/outsource-web-design-philippines` (US/UK)
   - `/australia` (four AU cases)
   - **Don't build** a CDO page until there is a CDO client or a regular in-person offer there. The Iligan page plus the CDO post cover it honestly for now.
5. **`/terms`** has no contextual links (footer only). That is normal for a legal page, so no action needed.

## 7. Off-site and Search Console actions (owner)

1. **Google Search Console + Bing Webmaster Tools.** Verify www, submit `sitemap-index.xml`, and request indexing for `/framer`, `/webflow`, `/ecommerce`, `/web-design-iligan-city`, `/services` and `/work/04`. Turn on IndexNow in Bing (ChatGPT search uses Bing's index).
2. **Google Business Profile for Iligan City,** with the exact name, phone, hours and service area from `src/data/site.ts`. Website link: `/web-design-iligan-city`.
3. **Earned "Website by Fazed Digital" credits** from live clients (Dotted Studios, A Framing Company, Cleen & Green), with their permission, each linking to its case study. These are the most relevant backlinks we can get.
4. **Directory listings with identical details:** Clutch / The Manifest, GoodFirms, DesignRush, TechBehemoths. These rank for our local queries today. Add a Webflow Experts / Framer Experts application once there is one client build on each platform.
5. **Measure every Monday:** queries and pages for the platform pages and the Iligan page in GSC, the Magento query split between `/work/04` and the post, and AI referrers (chat.openai.com, perplexity.ai, gemini). Once a month, ask ChatGPT, Perplexity and Gemini "Webflow developer Philippines", "web design Iligan City" and "Magento to PrestaShop migration case study", and note whether Fazed is cited.

Timeline, honestly: internal links help Google find and weigh pages within days of a recrawl. Rankings for the platform and local terms usually take 3–6 months on a young domain, and longer without the off-site work above.
