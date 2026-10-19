# GEO / AEO audit: www.fazeddigital.com

The Navigator · 2026-10-19 · facts checked against `src/data/*.ts` (site.ts, proof.ts, services.ts, lp.ts, team.ts, cases.ts) and the built HTML of HEAD `11940a6`. The live site matches.

## TL;DR
1. **The search engines and AI engines do not know Fazed Digital exists yet.** Web searches for "Fazed Digital", "fazeddigital.com", "Fazed Digital Iligan City web design" and every target query found **no result from the site and no third-party listing**. Answers default to similarly named firms (**Faze Digital** London, **Faze47 Digital** London, FZP Digital, Fuze Digital). The top job is entity creation and disambiguation, not on-page tweaks.
2. The on-site technical base is strong. Schema is on every page, one host, valid hreflang, an open robots.txt, AI bots get 200s, and llms.txt exists. The gaps are a few schema enrichments, the answer-first openings on money pages, and the off-site profiles (Google Business Profile, Bing, directories).
3. **Honesty risk.** The money pages show unverified stats that AI engines will happily quote: 120+ projects, 98% satisfaction, 4x ROI uplift, 12+ websites, 100% on-time, 7x faster. They contradict each other (120+ vs 12+). Resolve them before you seek citations.

---

## 1. Entity consistency

### What is consistent (good)
| Fact | Site pages | JSON-LD (`Base.astro:30-60`) | llms.txt | Instagram bio |
|---|---|---|---|---|
| Name | Fazed Digital | Fazed Digital | Fazed Digital | Fazed Digital (@fazedddigital) |
| Location | Iligan City, Lanao del Norte, PH | addressLocality/Region/Country, geo 8.2280/124.2452 | same | "Iligan City, PH" |
| Founded | "Est. 2022" (home, about) | `foundingDate: "2022"` | "est. 2022" | not stated |
| Email / phone | info@fazeddigital.com · +63 906 825 3451 | same (`telephone: +639068253451`) | same | not shown |
| Hours | Mon–Fri 8:30am–5:00pm PHT | openingHoursSpecification 08:30–17:00 | same | n/a |
| Services | 5 (web, brand, SEO, product, systems) | hasOfferCatalog 5 | 5 | "Web design · Branding · SEO" |
| 7-day prices | $499 / $899 / $1,499; ₱19,999 / ₱34,999 / ₱59,999 | LP Service Offers match | match | "From $499" |
| Custom range | $5,000–$20,000 | `priceRange: "$499–$20,000"` | match | n/a |
| Markets | USA, Australia, PH | areaServed PH/US/AU | match | n/a |

### Mismatches and risks
| # | Issue | Where | Fix | Owner |
|---|---|---|---|---|
| E1 | **Conflicting proof numbers**: "120+ Projects delivered" (home, about) vs "12+ Websites delivered" (both LPs). Also "98% Client satisfaction", "4x Avg ROI uplift", "100% On-time delivery", "7x Faster than industry avg". All are flagged `USER-REVISE-LATER` / `[TBC-21]` in `src/data/proof.ts:6-9, 24-28`. | `/`, `/about`, `/lp/7-day-website`, `/lp/7-day-website/ph` | Owner confirms real numbers, or sets `show: false` until they can be backed up. Never put them in schema or llms.txt (correctly absent today). | Owner |
| E2 | Founder: schema lists only `founder: Lord Arcamo`, but `team.ts:4` and `/about` name **Reancirl Balaba, Co-Founder**. | `Base.astro:51` | `founder: [{ '@id': SITE_URL + '/about#lord' }, { '@id': SITE_URL + '/about#reancirl' }]`, and give the Person nodes on `/about` matching `@id`s (see S4). | Dev |
| E3 | Facebook page name is "**Fazed Digital \| Iligan City**" (page title seen via fetch). Other profiles use "Fazed Digital". | facebook.com/profile.php?id=61557960053584 | Rename the page to "Fazed Digital" and keep the city in the category/address fields. Set a vanity URL (facebook.com/fazeddigital) if available. | Owner |
| E4 | The Instagram handle is `fazedddigital` (three d's), so it is easy to mistype and to mis-associate. | site.ts:18 | If `@fazeddigital` is free, claim it and redirect. Otherwise keep it, and make sure every bio links to www.fazeddigital.com (it does). | Owner |
| E5 | The org description says "clients in the USA, Australia and the Philippines", but the USD LP Service says `areaServed: "Worldwide"`. This is consistent enough, but `"Worldwide"` is not a Place. | `src/pages/lp/7-day-website.astro:12`, `services.astro:15` | Use `areaServed: [{ '@type': 'Country', name: 'United States' }, { '@type': 'Country', name: 'Australia' }, { '@type': 'Country', name: 'Philippines' }]`, or drop it and rely on the provider. | Dev |
| E6 | Name collision with Faze Digital (London) and Faze47 Digital (London) in third-party indexes. | off-site | Always write "Fazed Digital, a web design studio in Iligan City, Philippines" in bios, directory listings and guest posts. Consistent sameAs links (S1). | Owner |
| E7 | "Four years later" is hard-coded. It will be wrong from 2027. | `src/pages/about.astro:46` | Use `{YEARS}` from site.ts (number to word, or "{YEARS} years later"). | Dev |
| E8 | Google Business Profile: **none found** (web search for the name plus Maps returned nothing). | off-site | Create it (see Owner to-dos). | Owner |

---

## 2. Structured data

### Present today (all parse as valid JSON-LD)
| Page | Types |
|---|---|
| every page | `ProfessionalService` (`#organization`) + `WebSite` (`#website`) |
| `/` | + `ItemList` (8 cases) |
| `/services` | + `ItemList` of 5 `Service`, `FAQPage` (7), `BreadcrumbList` |
| `/work` | + `ItemList`, `BreadcrumbList` |
| `/work/NN` | + `CreativeWork` (creator → org), `BreadcrumbList` |
| `/lab` | + `CollectionPage` → `ItemList` of `CreativeWork` (concept sites, labelled fictional) |
| `/about` | + `AboutPage`, 4 × `Person`, `BreadcrumbList` |
| `/contact` | + `ContactPage`, `FAQPage`, `BreadcrumbList` |
| `/blog` | + `Blog`, `BreadcrumbList` |
| `/blog/<slug>` | + `Article` (author Person, publisher → org), `BreadcrumbList` (Home › Blog › Category › Post) |
| both LPs | + `Service` with 3 `Offer`s (USD / PHP), `FAQPage`, `BreadcrumbList` |
| `/audit` | + `FAQPage`, `BreadcrumbList`. **No Service/Offer.** |
| `/privacy`, `/terms` | `BreadcrumbList` |

Nothing misrepresents facts. Prices, FAQ answers and cases all match `src/data`. FAQPage text equals the visible FAQ (`lp.ts:1` notes this on purpose).

### Proposed additions (exact)
**S1 · Organization enrichments** (`src/layouts/Base.astro:30-57`)
```ts
address: { '@type': 'PostalAddress', addressLocality: NAP.city, addressRegion: NAP.region, postalCode: '9200', addressCountry: NAP.countryCode },
// [TBC] owner: confirm 9200 and whether to publish a streetAddress (Google's LocalBusiness guidelines want one; omit it if you work from home)
logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/logo-512.png`, width: 512, height: 512 },  // needs a raster logo file; SVG works but a PNG is safer for Google's logo feature
founder: [{ '@id': `${SITE_URL}/about#lord` }, { '@id': `${SITE_URL}/about#reancirl` }],
sameAs: [...SOCIALS.map((s) => s.href) /* + GBP share URL, Clutch, LinkedIn company page once they exist */],
```
**S2 · `/audit` Service + free Offer** (`src/pages/audit.astro:30`)
```ts
const schema = [
  { '@context': 'https://schema.org', '@type': 'Service', name: 'Free 15-minute website check', serviceType: 'Website review',
    provider: ORG_REF, url: `${SITE_URL}/audit`, areaServed: [/* PH, US, AU as in E5 */],
    description: 'A free 15-minute video call on Google Meet. We check whether your site is easy on a phone, whether your contact form works, and whether Google can read your pages, then give you 3 fixes.',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' } },
  faqPage(faq), crumbs([['Free website check', '/audit']]),
];
```
**S3 · LP Offers carry what is included** (`src/pages/lp/7-day-website.astro:13`, `ph.astro:13`): add `description: rows.join(', ')` from the package rows in `src/components/Lp.astro:20-22`, plus `url: SITE_URL + '/lp/7-day-website#pricing'`. Move the package arrays into `src/data/lp.ts` so the schema and the visible table share one source.

**S4 · Person `@id`s and Article author link** (`src/pages/about.astro` Person nodes; `src/pages/blog/[slug].astro` template below the posts array)
- About: `'@id': `${SITE_URL}/about#lord`` (etc.), plus `image` when `photo` is set (lord, russel).
- Article: `author: { '@type': 'Person', '@id': `${SITE_URL}/about#${authorId(author)}`, name, jobTitle, url }`. Use date-only `datePublished: date-as-YYYY-MM-DD`. `new Date(date).toISOString()` drifts with the build machine's timezone: the local build in PHT gave `2026-10-17T16:00Z` for an 18 Oct post. Add `isPartOf: { '@id': SITE_URL + '/blog#blog' }`.

**S5 · Case studies** (`src/pages/work/[slug].astro`): fine as `CreativeWork`. Optionally add `sourceOrganization: ORG_REF`. Do **not** add `review`/`aggregateRating` (no real reviews: `LP_REVIEWS_REAL = false`).

FAQ rich results are limited to government and health sites since 2023. Keep FAQPage anyway, because answer engines and AI engines still parse it.

---

## 3. Crawl and AI access

| Check | Result |
|---|---|
| robots.txt (live) | `User-agent: *` / `Allow: /`, Disallow `/_styleguide`, `/_formations`, plus the Sitemap line. **GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, Bingbot and Googlebot are all allowed** (no specific blocks). |
| Firewall vs bots | Live `GET /services` with GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, bingbot and Googlebot user agents → all **200, full 119 KB HTML** (6 requests, 2 s apart). Vercel's firewall challenged heavy polling earlier today. **Owner: in Vercel → Firewall, make sure no "Bot protection / AI bots" managed rule is set to challenge or deny.** A challenge page returned to a real crawler would silently de-index the site. |
| Content in HTML | Yes. Static HTML: copy, FAQs and case text are server-rendered, and nothing depends on JS for text. |
| Sitemap | `/sitemap-index.xml` → 65 URLs, www, no trailing slash, excludes 404/styleguide. Weakness: `lastmod` = build time on every URL (see lighthouse-audit.md #4). |
| llms.txt | Good base: summary, contact, prices, services, 8 cases, Lab (labelled fictional), 37 guides. **Missing:** (a) `/audit` (free 15-min check), (b) `/about` with the team names and roles, (c) what each package includes (5 / 8 / 10+ pages, revisions), (d) payment methods (GCash, Maya, BPI/Metrobank, Wise), (e) "who it's for" (small businesses in PH, US, AU), (f) a disambiguation line ("Not affiliated with Faze Digital, London."), (g) the platforms (WordPress, Astro, React, Next.js, Webflow). Edit `scripts/gen-llms.mjs:11-25` (generated, so do not hand-edit `public/llms.txt`). |
| Bing Webmaster Tools | No `msvalidate.01` meta and no `BingSiteAuth.xml`. Easiest route: **import from Google Search Console** (no code). ChatGPT search and Copilot lean on Bing's index, so this is the single highest-value GEO step. |
| IndexNow | Not set up. Steps: generate a key, add `public/<key>.txt` containing the key, and add `scripts/indexnow.mjs`. After a production deploy, it POSTs changed URLs (new blog posts from the nightly routine, plus the sitemap diff) to `https://api.indexnow.org/indexnow`. Trigger it from the nightly routine after its push (once Vercel reports the deploy ready), or from a Vercel deploy webhook. |
| Google Search Console | Verification file present (`public/googleb56cde69b8c57615.html`). Owner: confirm the **Domain property** (DNS) covers apex + www. Submit `https://www.fazeddigital.com/sitemap-index.xml`, and use URL Inspection → Request indexing on the 8 money pages. |
| Duplicate URLs | `/services/` returns 200 (canonical OK). Add `"trailingSlash": false` in vercel.json (lighthouse-audit.md #3). |

---

## 4. Answer-readiness (first 40–60 words) · brief for The Wordsmith

Rule: the first visible paragraph should say **what it is, who it is for, how much, and how fast** in plain words an AI can lift verbatim. All facts below come from `src/data`. Keep the H1s (MUST-KEEP per README). Change only the deck/lead paragraph under them.

| Page | Opening today (visible text order) | Gap | Proposed lead (true facts only) |
|---|---|---|---|
| `/` (`src/pages/index.astro:50`) | "Websites, brands and web apps for owners who want to be found, trusted and chosen. Made in the Philippines, shipped to the USA, Australia and home." Then a grid ruler "Col 01 … Pitch 24px" (see lighthouse-audit.md #5). | No "agency/studio", no price, no speed, no Iligan in the sentence | "Fazed Digital is a web design, branding and SEO studio in Iligan City, Philippines. We build websites, brands and web apps for small businesses in the USA, Australia and the Philippines. Fixed-price websites start at $499 (₱19,999) and go live in 7 business days." (46 words) |
| `/services` (`src/pages/services.astro` hero deck) | "Brand, website, search, product and systems, built by one team so they actually fit together. Hire us for one piece, or let us connect the lot." | No who, price or timing | "Five services from one team in Iligan City, Philippines: web design, brand identity, SEO, product design and custom systems. Websites take 4–12+ weeks, or 7 days on our fixed-price package from $499. Custom websites and systems typically run $5,000–$20,000." (41 words) |
| `/lp/7-day-website` | "We design, build and launch professional websites for small businesses: fully custom, mobile-ready and set up for Google. From $499, fixed price. You own everything." | Good. Missing "7 business days" condition and "who builds it" | Add one clause: "…launched in 7 business days by Fazed Digital, a studio in Iligan City, Philippines. From $499, fixed price. You own everything." |
| `/lp/7-day-website/ph` | "…for Philippine businesses… From ₱19,999, fixed price. Pay via GCash, Maya or bank." | Good. Add place and condition | "…launched in 7 business days by a team in Iligan City, Mindanao. From ₱19,999, fixed price. Pay via GCash, Maya or bank." |
| `/audit` | "Book a free 15-minute call. We’ll look at your website with you and point out the 3 fixes…" | Good answer-first. Who is missing | Add "…with Fazed Digital, a web studio in Iligan City, Philippines" to the first sentence. Shorten the meta description (lighthouse-audit.md #6). |
| `/contact` | "Tell us what you need and when you need it. A real person replies within one business day, Monday to Friday." | Fine for intent. Add the price anchor | Add a line: "Fixed-price websites start at $499 (₱19,999). Custom projects are quoted after a short discovery call." |

**H2s mirroring real questions** (add as FAQ items where they are missing): "How much does a website cost in the Philippines?" (both LPs and `/services` already answer this; good), "How long does it take to build a website?", "Can a Philippine agency build a website for a US business?" (`serviceFaq[0]` answers it; add the same Q to the USD LP FAQ in `lp.ts`), "What is included in a $499 website?" (answer from the `Lp.astro:20` rows).

**Do NOT claim** (unverified, `proof.ts`): 120+ projects, 98% satisfaction, 4x ROI, 12+ websites, 100% on-time, 7x faster, any testimonial or review, any case metric (`CASE_METRICS_REAL = false`).

---

## 5. Prompt / SERP check (2026-10-19, WebSearch)

| Query | Fazed Digital appears? | Who dominates |
|---|---|---|
| "Fazed Digital" | **No** | Faze Digital (London, casestudies.com), Faze47 Digital (DesignRush), Fuze Digital (G2), FazeWorld, FZP Digital |
| fazeddigital.com | **No** (the site itself is not returned) | same look-alike names |
| Fazed Digital Iligan City web design | **No** | El Norte SEO & Designs (DesignRush, Iligan, est. 2019), Philippine Web Experts (Freelancer.com, Iligan), Sinag Digital Marketing (DesignRush), freelancer profiles |
| web design agency Iligan City | **No** | El Norte SEO & Designs (DesignRush). Everything else is Illinois results, so the query is weakly served |
| web design agency Mindanao Philippines | **No** | Web Design Davao (outsorcy), 9100 Web Studio (Camiguin, lovable.app), DesignRush/Freelancer profiles |
| 7 day website Philippines | **No** | Travel itineraries only (Rough Guides, Trip.com, Agoda). The intent is ambiguous, and "website in 7 days Philippines" is the better target |
| website designed and launched in 7 days fixed price $499 | **No** | Contra freelancer listings, NZ "website in a week" (myvirtualassistant.co.nz), UENI, diamondheartstudio |
| affordable web design agency Philippines for US small business | **No** | **DesignRush** profiles (Starfish, Philwebservices, Ideyasweb), GoodFirms directory, Hubstaff/VirtualStaffFinder articles |

Takeaways:
- **Directories are the citation layer for agency queries.** DesignRush, GoodFirms, Clutch and Freelancer/Hubstaff profiles are what the answers quote. Listing Fazed there (honestly, with real cases) is the fastest route into AI answers.
- "Web design agency Iligan City" is winnable. There is one real competitor (El Norte SEO & Designs), plus a GBP and a directory listing.
- Re-run this check monthly in ChatGPT search, Perplexity, Gemini and Copilot. Log it in a table like the one above.

Sources: designrush.com/agency/profile/el-norte-seo-designs · designrush.com/agency/profile/faze47-digital · casestudies.com/company/faze-digital · designrush.com/agency/profile/starfish-web-design · goodfirms.co/directory/country/top-web-design-companies/philippines · freelancer.com/u/philwebexpert · outsorcy.com/companies/web-design-davao · webstudio9100.lovable.app · contra.com/s/AeqbgcmU-business-website-7-day-launch · myvirtualassistant.co.nz/website-in-a-week · instagram.com/fazedddigital (bio: "Websites live in 7 days ⚡ … From $499 · Iligan City, PH", 71 followers).

---

## 6. Prioritised fix list

| # | Action | Where | Who | Impact |
|---|---|---|---|---|
| 1 | Create a **Google Business Profile** (Fazed Digital · category "Website designer" · Iligan City · phone · hours · services with prices · link to www) | Google | Owner | Local pack and Gemini/AI Overviews entity. Biggest local lever |
| 2 | **Bing Webmaster Tools** (import from GSC) + submit the sitemap. Then IndexNow | Bing / `public/`, `scripts/` | Owner, then Dev | ChatGPT search and Copilot visibility |
| 3 | Directory profiles: **DesignRush, GoodFirms, Clutch**, plus a LinkedIn company page. Use the same name, description, founding year, prices and 8 real cases. Add them to `sameAs` | off-site + `site.ts:16` | Owner | The citation layer for "agency Philippines" answers |
| 4 | Resolve the **unverified stats** (E1) | `src/data/proof.ts` | Owner | Prevents AI repeating false or contradictory claims |
| 5 | Answer-first leads on `/`, `/services` and both LPs (section 4) | pages above | Wordsmith → Dev | AEO snippets and AI quotes |
| 6 | Schema S1–S4 (founders, postalCode, raster logo, `/audit` Service, Person @ids, date-only Article dates) | `Base.astro`, `audit.astro`, LPs, `about.astro`, `[slug].astro` template | Dev | Entity clarity |
| 7 | llms.txt additions (section 3) | `scripts/gen-llms.mjs` | Dev | GEO retrieval |
| 8 | Home grid-ruler text → CSS (lighthouse-audit.md #5) | `src/pages/index.astro:61` | Dev | Clean extracted text |
| 9 | Vercel firewall: confirm verified bots and AI crawlers are not challenged | Vercel dashboard | Owner | Prevents silent de-indexing |
| 10 | Facebook page name → "Fazed Digital", vanity URL | Facebook | Owner | Entity consistency |
| 11 | "Site by Fazed Digital" footer credit on client sites (with permission) and on the 6 Lab concept sites (*.vercel.app), linking to www | client sites, Lab repos | Owner | Earned links and entity mentions |
| 12 | Sitemap real `lastmod`, `trailingSlash: false` | `astro.config.mjs:17`, `vercel.json` | Dev | Crawl efficiency |

## 7. Owner to-dos (need your accounts or confirmations)
- [ ] **Google Search Console**: confirm a Domain property, submit the sitemap, request indexing for `/`, `/services`, `/work`, `/lp/7-day-website`, `/lp/7-day-website/ph`, `/audit`, `/contact`, `/about`. Check Pages → "Discovered – currently not indexed".
- [ ] **Bing Webmaster Tools**: sign in → Import from GSC → submit the sitemap → enable IndexNow (send the key to Dev).
- [ ] **Google Business Profile**: create and verify it (postcard or video). Primary category "Website designer", secondary "Marketing agency" / "Graphic designer". Service area: Iligan City + Philippines. Add services with the real prices, hours Mon–Fri 8:30–17:00, and photos of the team and work. Ask real past clients for reviews. **No incentives and no fake reviews.**
- [ ] **Directories**: DesignRush, GoodFirms, Clutch (Clutch verifies client reviews by phone), LinkedIn company page, Upwork agency profile link to the site. Use one description everywhere: *"Fazed Digital is a web design, branding and SEO studio in Iligan City, Philippines (est. 2022), building websites, brands and web apps for small businesses in the USA, Australia and the Philippines."*
- [ ] **Confirm**: Iligan postal code 9200 for schema, and whether to publish a street address. The real project count (120+ vs 12+). Whether 98% / 4x / 100% / 7x can be backed up. Whether a raster logo (512×512 PNG) can be added.
- [ ] **Vercel Firewall**: check that the managed bot rules do not challenge verified crawlers (Googlebot, Bingbot, GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot).
- [ ] **PSI API key** (free) so the Lighthouse table in `lighthouse-audit.md` can be completed for desktop and the remaining pages.
