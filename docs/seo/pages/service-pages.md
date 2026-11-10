# Five service pages: URLs, briefs, hub, navigation and rollout

The Navigator · 10 Nov 2026 · scope: www.fazeddigital.com · status: **plan and briefs only, nothing built**

The owner wants one page per service. Today the five services are fragment anchors on one page (`/services#web`, `#brand`, `#seo`, `#product`, `#systems`). Google indexes `/services#seo` as `/services`, so none of the five can rank on its own for "SEO services", "brand identity design" or "custom booking system". This doc gives the builder and The Wordsmith everything needed to split them out: final URLs, a brief per page, what happens to `/services`, every link to repoint, the navigation call, and the rollout.

**Facts used** come only from: `src/data/services.ts` (`services`, `chapters`, `serviceFaq`), `src/data/proof.ts` (prices, caps, flags), `src/data/cases.ts` (`cases`, `CASE_EXTRA`), `src/data/case-seo.ts` (case FAQs), `src/data/home.ts` (`homeFaq`), `src/data/lp.ts` (package rows, process, FAQ), `src/data/nocode.ts` (`choose`), `src/data/site.ts`, `src/data/team.ts`, `src/pages/terms.astro`, `src/pages/web-design-iligan-city.astro`, and the posts arrays (read only). `CASE_METRICS_REAL` is `false`, so **no lead, conversion, speed or ranking numbers appear anywhere** in these pages. There is no `copy/services.md` in this repo; the chapter copy lives in `services.ts`.

---

## 0. Findings that shape everything

1. **Two of the five pages are thin on facts today: SEO and product design.** Neither has a price, neither has a measured result (`CASE_METRICS_REAL = false`), and product design has no stated timeline. Branding has exactly **one** real brand case (Cleen & Green). Web design and custom systems have plenty. Each brief below has a "Too thin?" box saying what is missing. Build the strong pages first (§5).
2. **A live blog post makes a claim the site cannot back.** `cleaning-business-branding-philippines` (posts array in `src/pages/blog/[slug].astro`, FAQ) says "Our brand identity packages are listed on our services page". No brand package or brand price exists anywhere (`proof.ts` has none). Either the owner gives a brand starting price for `/services/branding` (TBC-1), or the sentence is corrected. It sits inside the posts array, so the fix needs the owner's explicit OK.
3. **Nobody searches the words "custom systems" or "product design" the way we use them.** Autocomplete and SERPs show buyers say "custom software development", "custom booking system", "web app development company", "client portal development", and "UI UX design". In the Philippines, "product design" SERPs return industrial and physical-product firms (Brash Inc., Design 1st). This drives two URL choices in §1.
4. **Entity conflict in a live search index.** A site-restricted web search on 10 Nov 2026 returned an old apex homepage titled "Fazed Digital Creative Agency" with an address at Grange QLD 4051 (Brisbane), plus old trailing-slash URLs (`/work/`, `/work/06/`). The live site is correct: the apex 308-redirects to `https://www.fazeddigital.com/`, `/work/` 308-redirects to `/work`, and no "Grange" appears on the live home page (checked with curl). This is a stale index (the engine behind it is Bing-like). AI answers built on it may say we are in Brisbane. Action: Bing Webmaster Tools URL inspection and recrawl of `https://fazeddigital.com/` and `/`, IndexNow on, and check every directory profile for that address (TBC-9). The new pages should carry the Iligan NAP in schema via `ORG_REF` only (no second address anywhere).
5. **We do not rank for any service query yet.** The same check found only `/work`, `/work/06` and one blog post indexed for a brand-plus-service search. Honest expectation per page is in each brief.

---

## 1. Final URLs

Pattern: `/services/<slug>`, lowercase, hyphens, no trailing slash (`vercel.json` has `trailingSlash: false`). This is the pattern Philippine and Australian competitors use (Optimind `/services/web-design/`, Devinium `/services/client-and-staff-portals/`, ITInspire `/services/custom-software-development-australia/`), and it gives a clean breadcrumb Home › Services › X. Astro can serve `src/pages/services.astro` and `src/pages/services/[slug].astro` side by side.

| Service (data id) | Final URL | Why this slug (evidence below and in §8) |
|---|---|---|
| Web design & development (`web`) | **`/services/web-design`** | "web design services", "website design and development services", "web design company philippines", "web design agency philippines" all exist in autocomplete (PH, US, AU). Short, matches the footer label. |
| Brand identity (`brand`) | **`/services/branding`** | "branding agency philippines" is the **first** PH autocomplete suggestion for "branding agency"; AU suggests "branding agency australia". "brand identity design services" also exists, so the title and H1 carry "brand identity". `branding` covers both. |
| SEO marketing (`seo`) | **`/services/seo`** | "seo services philippines", "local seo services philippines", "affordable seo services philippines", "seo services for small businesses" (US), "seo services australia". The slug "seo" is the term itself; the title adds "services". |
| Product design (`product`) | **`/services/ui-ux-design`** (alternative: `/services/product-design`) | "ui ux design agency", "ui ux design philippines" and "ui ux design cost philippines" exist; "product design agency" autocomplete is mostly India/London/NYC, and the PH product-design SERP is physical product firms. The page name stays "Product design (UX/UI)" so the site's naming does not change. If the owner prefers naming consistency over search phrasing, `/services/product-design` is acceptable; decide once, before launch (TBC-8). |
| Custom systems (`systems`) | **`/services/web-app-development`** (alternative: `/services/custom-systems`) | "custom software development philippines", "custom software development company philippines", "web app development company in australia", "custom booking system", "client portal development", "membership website development" exist. "Custom systems" returns nothing as a search phrase. `strategy.md` §4.5 and `internal-linking.md` used `/services/custom-systems` as a working name; neither is built, so switching costs nothing. The H1 and footer can still say "Custom systems". Decide once (TBC-8). |

Slug choice is a light ranking signal; title, H1, the opening paragraph and internal anchors matter more. The two alternatives are not wrong, just less aligned with how buyers type. Whatever is chosen is permanent: no renames later.

**Keyword ownership after the split** (update `internal-linking.md` §3 when built):

| Query family | Owner |
|---|---|
| web design studio / agency Philippines (brand + location) | `/` (unchanged) |
| web design, branding and SEO services (umbrella) | `/services` (hub) |
| web design and development services, custom website design | `/services/web-design` |
| fixed-price / 7-day website, website in a week | `/lp/7-day-website` (+ `/ph`), unchanged |
| Framer / Webflow / e-commerce websites | `/framer`, `/webflow`, `/ecommerce`, unchanged |
| brand identity design services, branding agency Philippines | `/services/branding` (the price question stays with `/blog/brand-identity-price-philippines`) |
| SEO services (small business, local SEO Philippines) | `/services/seo` ("seo iligan" stays with `/web-design-iligan-city` + `/blog/seo-iligan-city`) |
| UI/UX design, product design for apps, MVP design | `/services/ui-ux-design` |
| custom web app / software development, custom booking system, client and membership portals | `/services/web-app-development` (the niche long-tails stay with `/work/06`, `/work/07`, `/work/08`, which link up) |

---

## 2. Page briefs

Shared rules for all five (The Wordsmith):
- **UK spelling** (the site's convention; Australian readers accept it). No em dashes (site convention in `case-seo.md`). Plain words.
- **Prices are variables, never typed:** `prices.usd.*`, `prices.php.*`, `prices.customRange`, `caps`, `capsCopy` from `proof.ts`. **PH Starter must render through `offerPrice('php','starter')`** (`src/data/offers.ts`, which reads `proof.ts`): `FOUNDING_PH.on` is `true` (₱14,999 founding rate, 5 spots), so a hard "from ₱19,999" would contradict the PH LP while the offer runs. USD prices are unaffected.
- **Answer-first:** the paragraph directly under the H1 is the 40–60 word answer (below). It must be real HTML text, not injected by JS.
- **Cases:** only from `cases.ts`. Link each with a descriptive anchor to `/work/NN`. No metrics.
- **FAQ:** visible on the page, same strings in `FAQPage` JSON-LD, plain text. Each question marked up **once sitewide** (Google: mark up only one instance of repeated FAQ content), so FAQs that move here from the hub's `serviceFaq` leave the hub's markup (§3.4).
- **CTA:** primary `/contact?service=<id>` (keeps the existing form param), secondary as stated per page. The cap line `capsCopy.custom` where relevant.
- **Schema:** `Service` with `'@id': ${url}#service`, `name`, `serviceType`, `description`, `url`, `provider: ORG_REF`, `areaServed` (`[{ '@type': 'Country', name: 'Philippines' }, { '@type': 'Country', name: 'United States' }, { '@type': 'Country', name: 'Australia' }]`, the three countries in `cases.ts`); `FAQPage` via `faqPage()`; `BreadcrumbList` via `crumbs([['Services','/services'],[name, path]])` plus the visible `Crumbs` component (the `PlatformPage.astro` pattern). FAQPage is valid markup but Google shows FAQ rich results only for government and health sites since 2023; we add it for AI engines and Bing, not for a rich result.
- **Data home:** one new file, `src/data/service-pages.ts`, in the `case-seo.ts` style (title, description, h1, intro, sections, faq, related), keyed by service id, plus an `href` field added to each `chapters` entry and each `services` entry so every link in the codebase reads one source.
- **Design:** not briefed here. The design bar (`feedback_fazed_design_bar`) applies: no generic card grid. The field formation per page is a design call (the services glyphs exist in `Glyph.astro`).

Character counts below were checked by script.

---

### 2.1 Web design & development · `/services/web-design`

**Market and reader.** Small-business owners in the USA and Australia hiring a remote studio, and Philippine owners who want more than a template. Intent: hire.

**Queries**
| Query | Intent | Market | Realistic |
|---|---|---|---|
| web design and development services (primary) | Hire | All | H, 6–12+ months |
| custom website design and development | Hire | All | M–H |
| website design and development company / agency | Hire | All (autocomplete) | H |
| web design company philippines, web design agency philippines | Hire | PH, offshore buyers | H; the home page owns the brand version, this page supports it |
| website redesign (cost) | Compare | US | M via blog, this page as the money link |

**Title (56):** `Custom Web Design & Development Services | Fazed Digital`
**Meta (147):** `Custom websites, never templates, in WordPress, Astro, Next.js or Webflow. 7-day sites from $499; custom builds $5,000–$20,000. You own everything.`
**H1:** `Web design & development.` / `A website that brings in enquiries.` (two-line rhythm used site-wide; line 2 is the chapter outcome, shortened)

**Answer-first intro (59 words):**
> Fazed Digital designs and builds custom websites, never templates, from Iligan City, Philippines, for businesses in the USA, Australia and the Philippines. We build in WordPress, Astro, React, Next.js or Webflow, mobile-first and to WCAG 2.1 AA. Fixed-price sites start at $499 (₱19,999) and go live in 7 business days. Custom builds take 4–12+ weeks and typically run $5,000–$20,000.

Sources: `chapters[web]` (no templates, platforms, WCAG 2.1 AA, 4–12+ weeks), `proof.ts` (`prices.usd.starter`, PH starter via `offerPrice`, `customRange`), `site.ts` (city), `cases.ts` (countries).

**Sections, in order, and what each proves**
1. **Two ways to work with us** (table): the 7-day package (Starter / Growth / Pro rows from `lp.ts`: pages, revision rounds, SEO setup, CMS, GA4 + Search Console, e-commerce ready) beside a custom build (4–12+ weeks, quoted after a discovery call, typically `customRange`). *Proves:* we publish real prices; most competitors say "it depends" (`strategy.md` §2).
2. **What every site includes**: the `chapters[web].get` list, each with one plain sentence (custom design; WordPress/Astro/React/Next.js/Webflow; mobile-first and WCAG 2.1 AA; Core Web Vitals; editable CMS with handover training; support plans). *Proves:* scope is concrete.
3. **Which platform, and why**: the three rows of `nocode.ts` `choose` (Framer, Webflow, custom code) plus the `serviceFaq` platforms answer, linking `/framer`, `/webflow`, `/ecommerce`. *Proves:* "We'll recommend the right fit, not the one we like best" (`chapters[web].body`).
4. **Proof: five live builds** (see cases). *Proves:* range (trade site, studio site, brand + site, store migration, law firm suite) and real durations.
5. **How a project runs**: 7-day process (5 steps from `lp.ts`: brief, design Days 2–3, build Days 4–5, review on staging Day 6, launch) and the custom route (discovery call, scope, quote, 50% deposit per `/terms`, design, build, launch). *Proves:* predictability.
6. **You own it, and after launch**: domain, hosting, logins and files are yours, no lock-in (`chapters[web].body`, `serviceFaq`); IP assigned on full payment (`/terms` §3); care plans from `prices.usd.care` (`prices.php.care`) cover updates, backups, security monitoring, uptime checks and small content changes (`lp.ts` FAQ). *Proves:* no lock-in.
7. **Good fit if**: `chapters[web].fit`.
8. **FAQ** (below). 9. **Related reading**. 10. **CTA** + "Also: brand identity / SEO" cross-links.

**More than the chapter:** the chapter has 3 paragraphs, 6 bullets, 3 cases and a timeline line. The page adds the package-vs-custom table, the platform decision, the process, ownership and IP terms, care-plan contents, two more cases and six FAQs.

**Cases (cases.ts only)**
- `/work/01` A Framing Company · USA (Utah) · WordPress · 6 weeks · "A site they now pitch new work with."
- `/work/09` Dotted Studios · Iligan City, PH · built from the client's Figma, three.js particle field, content system · 1 week
- `/work/02` Cleen & Green · PH · brand identity + WordPress site · 8 weeks
- `/work/04` The Telecom Shop · AU · Magento to PrestaShop, zero data loss · 10 weeks (link onward to `/ecommerce`)
- `/work/08` QLD Law Group · Queensland, AU · website as part of website + portal + app · 14 weeks

**Prices (proof.ts):** Starter `$499` / Growth `$899` / Pro `$1,499`; PHP via `offerPrice` (standard ₱19,999 / ₱34,999 / ₱59,999); extra page `$79` / `₱2,500`; care `$99/month` / `₱3,500/month`; custom `$5,000–$20,000`. Cap: `capsCopy.custom` and, for 7-day, `capsCopy.sevenDay`.

**FAQ (5)**
| Q | A (draft, from existing copy) | Source |
|---|---|---|
| How much does a website cost? | Our fixed-price 7-day websites start at $499 (₱19,999 in the Philippines). Growth is $899 and Pro is $1,499. Extra pages are $79. Custom websites are quoted after a discovery call and typically run $5,000–$20,000. | `home.ts` homeFaq[0], `proof.ts` (render PHP via `offerPrice`) |
| How long does a website take? | A 7-day website goes live in 7 business days if you send everything on Day 1 and feedback within 24 hours at each review; if we miss it on our side, you get 20% off. Custom websites take 4 weeks for simpler builds and 12+ weeks for complex ones. | `home.ts` homeFaq[1], `chapters[web].timeline` |
| Which platforms do you build on? | WordPress when you want to edit everything yourself. Astro, React or Next.js when performance and flexibility matter most. Framer or Webflow when your marketing team wants a site builder. We recommend the best fit for you. | `serviceFaq` (moves here from the hub's markup) |
| Will I own my website? | Yes. Your domain, hosting, logins, design files and content are yours once paid for. No lock-in contracts. | `serviceFaq`, `/terms` §3 |
| Can you build our site from our own Figma design? | Yes. Dotted Studios designed their site in Figma, so we kept their layout, palette, type and copy, then built the motion, the content system and the enquiry form on top. It went live one week after the build started. | `case-seo.ts` 09 |
| Do you offer support after launch? | Yes. Monthly care plans start at $99/month (₱3,500 in the Philippines) and cover updates, backups, security monitoring, uptime checks and small content changes. | `serviceFaq`, `lp.ts` FAQ |

**Related posts (real slugs):** `how-long-to-build-a-website`, `wordpress-vs-custom-build`, `signs-website-needs-redesign`, `small-business-website-cost-us`, `website-cost-australia-2027`, `web-design-pricing-guide`.

**Schema:** `Service` (serviceType "Web design and development") + `hasOfferCatalog` with three `Offer`s (Starter/Growth/Pro, `priceCurrency: 'USD'`, prices from `proof.ts`, `url` `/lp/7-day-website`); `FAQPage`; `BreadcrumbList`. No Offer for the custom range (it is "typical", not a price).

**Internal links**
- *In:* hub chapter `#web` ("Web design and development in detail"), footer, home services deck (plane 0 and list), `links.ts` `T.web` (feeds the "Put this guide to work" block on 35 hand-mapped posts, plus rule-matched new ones), `cases.ts` `S.web` (cases 01, 02, 04, 05, 08, 09), `case-seo.ts` related (01, 03, 05, 08, 09), `nocode.ts` `choose` "Custom code" row (on `/framer` and `/webflow`), `cover.ts` Design/Development categories, `/web-design-iligan-city` (optional, row 1 currently links the PH LP).
- *Out:* `/lp/7-day-website`, `/lp/7-day-website/ph` (PH market span), `/framer`, `/webflow`, `/ecommerce`, the five cases, `/services/branding`, `/services/seo`, `/audit`, `/contact?service=web`, the six posts.

**TBC:** none blocking. Optional: are first-year domain and hosting inside the 7-day price (`answer-first-copy.md` §5 TBC 1, still open).

**Too thin?** No. Strongest page after systems.

---

### 2.2 Brand identity · `/services/branding`

**Market and reader.** Philippine owners who have moved up-market (primary), plus US/AU small businesses buying brand + website together. Intent: hire.

**Queries**
| Query | Intent | Market | Realistic |
|---|---|---|---|
| brand identity design services (primary) | Hire | All | M–H |
| branding agency philippines | Hire | PH | M–H (Clutch and DesignRush lists own page one) |
| brand identity and website, rebrand small business | Hire | All | M |
| logo design price philippines, brand identity price philippines | Compare | PH | owned by `/blog/brand-identity-price-philippines`; this page is its money link |
| branding agency brisbane/sydney | Hire | AU | **do not target** (no AU brand case, no AU office) |

**Title (56):** `Brand Identity Design: Logo, Colour & Guidelines | Fazed`
**Meta (154):** `Brand identity from a Philippine studio: positioning first, then logo system, colour, type, guidelines and templates your team can use. 4–6 week projects.`
**H1:** `Brand identity design.` / `Look as good as you actually are.`

**Answer-first intro (59 words):**
> Fazed Digital designs complete brand identities: logo and its variations, colour, typography, guidelines and templates. We start with positioning, not the logo, and hand over a system your team can use for years. Brand projects typically take 4–6 weeks, and we can build the website in the same project, as we did for Cleen & Green in the Philippines.

Sources: `chapters[brand]` (body, get, timeline), `cases.ts` 02.

**Sections**
1. **Positioning before pixels**: who you are for, what they should feel; then the system; then written rules (`chapters[brand].body`). *Proves:* method, not just a logo.
2. **What you get**: the six `chapters[brand].get` items, each explained in one line (logo and all variations; typography system and font licensing guidance; colour palette and usage rules; guidelines document; social templates; print and packaging). *Proves:* a system, not a file.
3. **Brand and website in one project**: Cleen & Green (8 weeks, brand + WordPress site + franchise page). Link `/services/web-design`. *Proves:* our differentiator (brand and site from one team, `services.astro` deck "Five services. One connected brand.").
4. **What you own**: IP in final deliverables assigned on full payment (`/terms` §3; the brand price post says the same). *Proves:* no lock-in.
5. **Good fit if**: `chapters[brand].fit`.
6. **FAQ**, 7. **Related reading**, 8. **CTA** `/contact?service=brand`.

**More than the chapter:** method section, deliverables explained, the combined brand + web route, ownership terms, six FAQs. **Not** more cases, because there are none (see "Too thin?").

**Cases:** `/work/02` Cleen & Green only (`discipline: ['brand','web']`). **Do not present `/work/09` Dotted Studios as brand work**: we built their site from their own Figma; the brand is theirs. It may appear as "a website for a branding studio" in related links only, as `links.ts` does.

**Prices:** none in `proof.ts` for brand-only work. Allowed: "brand plus website, like Cleen & Green, is custom work; our custom projects typically fall between $5,000 and $20,000" (`case-seo.ts` 02 FAQ). Brand-only starting price: **TBC-1**. Until then the page says brand projects are quoted per project after a short call (wording from `brand-identity-price-philippines`: "scoped per client").

**FAQ (5)**
| Q | A | Source |
|---|---|---|
| How long does a brand identity project take? | Brand identity projects typically take 4–6 weeks, from the positioning brief to the final guidelines handover. A full brand and website together take longer; Cleen & Green took 8 weeks. | `serviceFaq`, `chapters[brand].timeline`, blog `brand-identity-price-philippines` FAQ, `cases.ts` 02 |
| What does a brand identity include? | Logo design and all its variations, a typography system with font licensing guidance, a colour palette with usage rules, a brand guidelines document, social media templates, and print and packaging design. | `chapters[brand].get` |
| Do you start with the logo? | No. We start with positioning: who you are for and what they should feel. Then we design the system, write the rules down and hand you files your team can use for years. | `chapters[brand].body` |
| Can you design the website too? | Yes. For Cleen & Green in the Philippines we built the brand identity and a WordPress site with service pages, a quote request flow and a franchise page, in one 8-week project. | `cases.ts` 02, `case-seo.ts` 02 |
| Who owns the brand files? | You do. On full payment, all intellectual property in the final deliverables is assigned to you. | `/terms` §3 |

**Related posts:** `why-brand-identity-matters`, `brand-identity-price-philippines`, `rebranding-when-and-how`, `brand-style-guide`, `logo-design-small-business`, `cleaning-business-branding-philippines` (only after its "packages are listed on our services page" line is fixed or made true; it is in the posts array but not yet in `posts.json`, which regenerates at build).

**Schema:** `Service` (serviceType "Brand identity design"), `FAQPage`, `BreadcrumbList`. No Offer (no price).

**Internal links**
- *In:* hub `#brand`, footer, home deck plane 1, `T.brand` (Branding posts), `S.brand` (case 02), `case-seo.ts` 02 related, `cover.ts` Branding, `/web-design-iligan-city` row 3, `HUB_LINKS.Branding` (add the service).
- *Out:* `/work/02`, `/services/web-design`, `/web-design-iligan-city` (local owners), `/contact?service=brand`, the posts.

**TBC:** TBC-1 (brand price or "quoted per project" wording), TBC-4 (any other brand projects among the 120+ that can be shown, with permission), TBC-2 fix in the cleaning post.

**Too thin? Partly.** One brand case, no price, no brand imagery on the site beyond the Cleen & Green site screenshot. What would make it strong: (a) a starting price or range for brand-only work, (b) Cleen & Green brand assets (logo lock-ups, palette, guideline pages) as images with permission, (c) a second brand case. Without (a) or (b) the page is still worth shipping (it answers "brand identity design services" better than an anchor), but ship it third.

---

### 2.3 SEO marketing · `/services/seo`

**Market and reader.** Owners with a decent site nobody finds, mainly Philippine local businesses and US/AU small businesses. Intent: hire, with heavy research first.

**Queries**
| Query | Intent | Market | Realistic |
|---|---|---|---|
| seo services for small business (primary) | Hire | US, AU | H |
| local seo services philippines, seo services philippines | Hire | PH | H (SEO firms are, unsurprisingly, good at SEO: Syntactics, Spiralytics, Digital Marketing Philippines, freelancers on pinoyseo.ph) |
| affordable seo services philippines, seo philippines price | Compare | PH | M, **only if we publish a price** (TBC-3) |
| how much does seo cost for a small business per month | Learn/compare | US | blog first (calendar), this page as money link |
| seo iligan, seo cagayan de oro | Hire | PH local | owned by `/web-design-iligan-city`, `/blog/seo-iligan-city`, `/blog/seo-cagayan-de-oro`; they link here |

**Title (60):** `SEO Services for Small Businesses: Local & Technical | Fazed`
**Meta (149):** `Technical fixes, a keyword plan, on-page work, local SEO and Google Business Profile, plus a plain-English monthly report. Setup takes about a month.`
**H1:** `SEO marketing.` / `Get found by people already looking for you.`

**Answer-first intro (57 words):**
> Fazed Digital's SEO service fixes your site's technical foundation, builds a keyword and content plan, optimises every page and earns relevant links. We set up Search Console and GA4 and, if you serve an area, your Google Business Profile. Setup takes about a month, and results usually show in 6–12 months. You get a plain-English report every month.

Sources: `chapters[seo]` (body, get, timeline), `serviceFaq` (SEO timing).

**Sections**
1. **Month one: the foundation** (technical audit and fixes, keyword plan, tracking: GA4 + Search Console). `serviceFaq`: "Setup takes about a month: the technical fixes, keyword plan and tracking." *Proves:* a defined start.
2. **Every month after**: on-page optimisation, content plan, relevant links only, the monthly report ("what we did, what moved, and what's next", `chapters[seo].body`). *Proves:* what a retainer buys.
3. **Local SEO and Google Business Profile**: for businesses that serve an area (`chapters[seo].get`; Iligan page row 2 copy). Link `/web-design-iligan-city`. *Proves:* local competence.
4. **SEO built into a new site**: what the 7-day packages already include (Starter: on-page SEO setup; Growth: advanced on-page SEO, GA4 + Search Console; `lp.ts` rows). Link the LPs. *Proves:* the cheapest honest entry point, with a real price.
5. **Honest timelines**: 6–12 months, no ranking promises ("No one can promise rankings", `case-seo.ts` 04 FAQ). *Proves:* trustworthy; rare in this SERP.
6. **Proof**: A Framing Company (enquiries from contractors and developers, "some finding them through search", `CASE_EXTRA['01'].resultCopy`, no numbers); The Telecom Shop migration built to avoid losing ground in search (`CASE_EXTRA['04'].challengeCopy`, `case-seo.ts` 04 FAQ); our own site: the number of guides (compute from the posts data, today 59; the chapter's "37+" is out of date) and structured data on every page. *Proves:* we practise it; it does **not** prove client SEO results, and the copy must not imply it does.
7. **Good fit if**, 8. **FAQ**, 9. **Related reading**, 10. CTA: primary `/contact?service=seo`, soft `/audit` (free 15-minute check).

**More than the chapter:** month-one vs ongoing breakdown, local SEO section, the in-package SEO with prices, honest-timeline section, report contents, six FAQs.

**Cases:** `/work/01` (search as one source of enquiries, no metrics), `/work/04` (migration that protected search). Both are web projects with an SEO element (`servicesUsed` includes `S.seo`). **No client SEO-retainer case exists in `cases.ts`.**

**Prices:** no SEO retainer price in `proof.ts` (chapter: "Ask us about options on your discovery call"). Allowed: the 7-day package rows with their prices (SEO setup included). Retainer starting price: **TBC-3**.

**FAQ (6)**
| Q | A | Source |
|---|---|---|
| How long does SEO take? | Setup takes about a month: the technical fixes, keyword plan and tracking. Results usually show in 6–12 months, depending on your market and competition. You get a plain-English report every month. | `serviceFaq` (moves here from the hub's markup) |
| What do you do in the first month? | We audit and fix the technical foundation, build the keyword and content plan, and set up Google Search Console and GA4 so we can measure from day one. | `chapters[seo].body/get`, `serviceFaq` |
| Do you do local SEO and Google Business Profile? | Yes, for businesses that serve an area. We fix the technical basics, plan the keywords local customers actually type, optimise each page and set up your Google Business Profile so you can show on Maps. | `chapters[seo].get`, `web-design-iligan-city.astro` builds row 2 |
| What's in the monthly report? | What we did, what moved and what's next, in plain English. | `chapters[seo].body` |
| Do you build links? | Only relevant ones. No link schemes. | `chapters[seo].get` |
| Is SEO included when you build a website? | The basics are. Every 7-day package includes on-page SEO setup, and Growth adds advanced on-page SEO plus Google Analytics and Search Console. Ongoing SEO is a separate retainer. | `lp.ts` package rows, `chapters[seo].timeline` |

**Related posts:** `seo-for-new-websites`, `local-seo-small-business-guide`, `google-business-profile-optimization`, `technical-seo-small-business`, `keyword-research-small-business`, `seo-cagayan-de-oro`.

**Schema:** `Service` (serviceType "Search engine optimisation"), `FAQPage`, `BreadcrumbList`. No Offer.

**Internal links**
- *In:* hub `#seo`, footer, home deck plane 2, `T.seo` (SEO posts), `S.seo` (cases 01, 04), `case-seo.ts` 04 related, `cover.ts` SEO category, `/web-design-iligan-city` row 2 ("How SEO works with us"), `SERVICE_ALSO.seo` stays on the hub.
- *Out:* `/audit`, `/web-design-iligan-city`, `/work/01`, `/work/04`, `/blog/category/seo`, both 7-day LPs, `/services/web-design`, `/contact?service=seo`, the posts.

**TBC:** TBC-3 (retainer starting price, or confirm "options on the discovery call"), TBC-5 (any client who allows a Search Console screenshot or result; `CASE_METRICS_REAL` stays `false` otherwise), TBC-6 (is AI-search / AI Overviews visibility a sold part of SEO? `strategy.md` §3.6 routes "ai overviews small business" here, but `services.ts` does not list it, so the page must not claim it).

**Too thin? Yes, today.** An SEO page with no price, no client result and no SEO case is weak against SEO agencies whose pages show packages and case numbers. What would fix it: a retainer starting price (TBC-3) and one client result with permission (TBC-5). Without them, ship it fourth, lean on process transparency, the in-package SEO prices and the honest-timeline section, and keep "results" language to what `cases.ts` says.

---

### 2.4 Product design (UX/UI) · `/services/ui-ux-design`

**Market and reader.** Founders turning an idea into an MVP (US), and organisations whose platform "works but confuses people" (AU/PH). Intent: hire.

**Queries**
| Query | Intent | Market | Realistic |
|---|---|---|---|
| ui ux design agency (primary) | Hire | All | H (autocomplete skews to Indian city modifiers; Clutch lists) |
| ui ux design philippines, ui ux design cost philippines | Hire / compare | PH, offshore buyers | M |
| product design agency for startups, mvp design | Hire | US | M–H (marketplace freelancers dominate) |
| pwa vs native app | Learn | US | owned by `/work/03`; links up |

**Title (59):** `Product Design (UX/UI) for Apps & Platforms | Fazed Digital`
**Meta (152):** `Research, flows, wireframes and Figma UI for apps, portals and MVPs, with a design system and developer-ready handoff. Design only, or design and build.`
**H1:** `Product design.` / `Apps and platforms people finish using.`

**Answer-first intro (54 words):**
> Fazed Digital designs apps, portals and platforms: user research and information architecture first, then wireframes, prototypes and high-fidelity UI in Figma, with a design system and a developer-ready handoff. We can build it too, or hand the files to your own developers. CrateOnScene went from scope to a live web app in 5 weeks.

Sources: `chapters[product]` (body, get), `cases.ts` 03.

**Sections**
1. **Research and structure first, polished UI second** (`chapters[product].body`). *Proves:* method.
2. **What you get**: `chapters[product].get` explained (research and interviews; IA; wireframes and prototypes; Figma UI; design system; developer-ready handoff).
3. **Design only, or design and build**: "whether we build it or your own team does" (`chapters[product].body`); link `/services/web-app-development`. *Proves:* flexible engagement.
4. **Scoping an MVP tightly**: CrateOnScene's first release (event discovery, driver profiles, business listings, organiser tools, nothing else), PWA reasoning (`case-seo.ts` 03 FAQs). *Proves:* speed through scope.
5. **Designing for several kinds of user**: CrateOnScene (four user types), UGLQ (three roles), QLD Law Group (portal designed around the client), 8Drive (screens for staff who use it all day). *Proves:* role-aware design, which is the real skill on show.
6. **Good fit if**, 7. **FAQ**, 8. **Related reading** + `/lab` ("Exploring what's possible?", existing `SERVICE_ALSO.product`), 9. CTA `/contact?service=product`.

**More than the chapter:** the chapter has two short paragraphs and two cases. The page adds the engagement models, MVP scoping, the multi-role section with four cases, PWA vs native and five FAQs.

**Cases:** `/work/03` CrateOnScene (USA, 5 weeks), `/work/08` QLD Law Group (AU, 14 weeks), `/work/07` UGLQ (AU, 12 weeks), `/work/06` 8Drive (PH, 10 weeks). All four list `S.product` in `servicesUsed`. They are design **and** build projects; the copy must not present them as design-only engagements.

**Prices:** none for design-only. Allowed: design-and-build like CrateOnScene "typically falls in our $5,000 to $20,000 range" (`case-seo.ts` 03). Design-only price and timeline: **TBC-7**.

**FAQ (5)**
| Q | A | Source |
|---|---|---|
| Do you build it, or only design it? | Either. You get developer-ready files and a design system whether we build it or your own team does. | `chapters[product].body` |
| What do we get at handoff? | High-fidelity UI in Figma, a design system and a developer-ready handoff, so your developers can build without guessing. | `chapters[product].get`, `.fit` |
| How long does an MVP take? | CrateOnScene took 5 weeks from scoping to launch. The speed came from a tight scope: event discovery, driver profiles, business listings and organiser tools, and nothing else in the first release. | `case-seo.ts` 03 |
| Should an MVP be a PWA or a native app? | For CrateOnScene a progressive web app made sense: people add it to their home screen with no app store in the way, and one build serves phones and desktops. A native app suits products that need deeper device features. | `case-seo.ts` 03 |
| Can one platform serve several kinds of user? | Yes. CrateOnScene serves drivers, spectators, businesses and organisers at once, and UGLQ Connect gives Grand Lodge administrators, lodge secretaries and members access by role, each seeing only what is relevant. | `case-seo.ts` 03, 07 |

**Related posts:** `ux-mistakes-killing-conversions`, `website-navigation-design`, `visual-hierarchy-web-design`, `website-accessibility-guide`, `mobile-first-web-design`, `typography-web-design`.

**Schema:** `Service` (name "Product design (UX/UI)", serviceType "UX and UI design"), `FAQPage`, `BreadcrumbList`. No Offer.

**Internal links**
- *In:* hub `#product`, footer, home deck plane 3, `T.product` (posts: navigation, accessibility, visual hierarchy, UX mistakes), `S.product` (cases 03, 06, 07, 08), `case-seo.ts` 03 and 06 related, `HUB_LINKS.Design`.
- *Out:* `/work/03`, `/work/08`, `/work/07`, `/work/06`, `/services/web-app-development`, `/lab`, `/contact?service=product`, the posts.

**TBC:** TBC-7 (is design-only sold; price; typical timeline), TBC-8 (slug).

**Too thin? Yes, for a stand-alone design offer.** Every case is design plus build, there is no price or timeline for design-only work, and the site shows no research or Figma artefacts. What would fix it: TBC-7 answers and 2–3 images of real flows or Figma screens from a case (with permission). If the owner cannot supply them, keep the page but frame it honestly as "the design half of our app and portal builds", and ship it last.

---

### 2.5 Custom systems (web apps, booking systems, portals) · `/services/web-app-development`

**Market and reader.** Australian organisations (law, membership, health), Philippine operators running bookings on spreadsheets and Messenger, US founders. Intent: hire; highest-value service (`customRange`, `caps.customPerMonth` 3).

**Queries**
| Query | Intent | Market | Realistic |
|---|---|---|---|
| custom web app development / web app development company (primary family) | Hire | All; "web app development company in australia" in AU autocomplete | M–H |
| custom software development philippines / company philippines | Hire | PH | M |
| custom booking system, online booking system philippines, booking system philippines | Hire / build vs buy | PH | M (post `online-booking-system-philippines` covers build-or-buy; this page converts) |
| client portal development, membership website development | Hire | AU, US | M |
| car rental booking system, membership portal for non-profits, law firm client portal | Hire | niche | owned by `/work/06`, `/work/07`, `/work/08` (`case-seo.md`), which link up here |

**Title (58):** `Custom Web Apps, Booking Systems & Portals | Fazed Digital`
**Meta (145):** `Booking systems, membership and client portals, and admin tools built around how your team works. Builds of 8–14 weeks, typically $5,000–$20,000.`
**H1:** `Custom web apps and portals.` / `Built around how your team works.`

**Answer-first intro (59 words):**
> Fazed Digital builds custom web applications for teams that have outgrown spreadsheets and tools that don't talk to each other: booking and fleet systems, membership and client portals, admin dashboards and automation. Access is by role and secure by default. Our system builds have run 8–14 weeks and typically cost $5,000–$20,000. We take on 3 custom projects a month.

Sources: `chapters[systems]` (body, get, timeline), `proof.ts` (`customRange` "includes custom systems", `caps.customPerMonth`).

**Sections**
1. **What we build, by problem** (one row each, linked to the case): bookings and fleet (8Drive), membership portal across a network (UGLQ Connect), client portal + iOS/Android app (QLD Law Group), public site + admin portal (Canwell), multi-user MVP as a PWA (CrateOnScene). *Proves:* five live systems in three countries.
2. **Build or buy? An honest answer**: packaged software suits many organisations; custom earns its cost when your structure or workflow is unusual (UGLQ, 8Drive's chauffeur scheduling); for simple needs, an off-the-shelf tool plus a good website often serves better for far less. Sources: `case-seo.ts` 06, 07 FAQs; blog `online-booking-system-philippines`. *Proves:* we will say no; this is the strategy's "build or buy?" section (`strategy.md` §4.5).
3. **How a system project runs**: discovery, scoping, design, build, handoff (blog `online-booking-system-philippines` service paragraph), 50% deposit (`/terms`), max 3 custom projects a month (`capsCopy.custom`).
4. **Timelines from real builds** (table): CrateOnScene 5 weeks, Canwell 8, 8Drive 10, UGLQ 12, QLD Law Group 14 (`cases.ts` `duration`). *Proves:* predictable ranges, quotable by AI engines.
5. **Roles, security, integrations**: access by role (UGLQ, QLD Law Group), APIs and integrations, payment gateways inside bespoke booking, ordering or membership platforms (blog `payment-gateway-philippines-gcash` service paragraph; `chapters[systems].get`). *Proves:* the technical scope.
6. **After launch**: ongoing maintenance and support (`chapters[systems].get`); IP in final deliverables assigned on full payment (`/terms` §3). Price of system support: TBC-10.
7. **Working with Australia / the Philippines**: two short lines linking `/australia` (three of the four AU cases are systems) and `/web-design-iligan-city` (`SERVICE_ALSO.systems`).
8. **Good fit if**, 9. **FAQ**, 10. **Related reading**, 11. CTA `/contact?service=systems` ("Scope a system").

**More than the chapter:** the chapter is two paragraphs, six bullets, three cases and one timeline sentence. The page adds the problem-by-case map (five cases), build-or-buy, the process, the timeline table, roles/integrations/payments, after-launch terms, market links and six FAQs. This is the page `strategy.md` §4.5 asked for.

**Cases:** `/work/06` 8Drive (PH, 10 weeks; no public link, private staff system), `/work/07` UGLQ Connect (Queensland, 12 weeks), `/work/08` QLD Law Group (Queensland, 14 weeks), `/work/05` Canwell (AU, 8 weeks), `/work/03` CrateOnScene (USA, 5 weeks).

**Prices:** `prices.customRange` ($5,000–$20,000, "includes custom systems"); `capsCopy.custom`. Nothing else.

**FAQ (6)**
| Q | A | Source |
|---|---|---|
| How much does a custom system cost? | Custom websites and systems typically fall in our $5,000 to $20,000 range, depending on scope: the users, roles and data involved. We quote once the scope is clear. | `proof.ts`, `case-seo.ts` 05 and 08 FAQs |
| How long does it take to build? | Our system builds have run 8–14 weeks: Canwell 8, 8Drive 10, UGLQ 12 and QLD Law Group 14. CrateOnScene, a tightly scoped MVP, took 5. | `chapters[systems].timeline`, `cases.ts` |
| Should we build a custom system or buy software? | Packaged software suits many organisations. A custom system earns its cost when your structure or workflow is unusual, like UGLQ's network of lodges or 8Drive's chauffeur scheduling alongside bookings and fleet. | `case-seo.ts` 06, 07 |
| Can our clients or members serve themselves? | Yes. QLD Law Group's clients track their matter, upload documents and message their lawyer in the portal and the iOS and Android app, and UGLQ members see only what is relevant to their role. | `case-seo.ts` 07, 08, `chapters[systems].fit` |
| Can you add online payments, including GCash? | Yes. Payment gateway setup is part of our custom systems work when a booking, ordering or membership platform needs its own checkout, not just a plugin. | blog `payment-gateway-philippines-gcash` (service paragraph) |
| Do you look after the system after launch? | Yes. Ongoing maintenance and support is part of the service, and the system is built so it can grow with you. | `chapters[systems].get`, `.body` |

**Related posts:** `online-booking-system-philippines`, `payment-gateway-philippines-gcash`, `wordpress-vs-custom-build`, `website-maintenance-guide`, `offshore-web-design-australia`, `outsource-web-development-philippines`.

**Schema:** `Service` (serviceType "Custom web application development"), `FAQPage`, `BreadcrumbList`. Optional: an `ItemList` of the five cases as `CreativeWork` with `url` `/work/NN` (the `PlatformPage` pattern). No Offer (the range is "typical").

**Internal links**
- *In:* hub `#systems`, footer, home deck plane 4, `T.systems` (posts: booking, payment gateway, maintenance; `DEFAULT_ANCHOR` "Custom booking systems and portals"), `S.systems` (cases 03, 05, 06, 07, 08), `case-seo.ts` related (03, 05, 06, 07, 08), `PLATFORM_LINKS.webflow.next`, `HUB_LINKS.Development`, `/web-design-iligan-city` row 4 ("Scope a system"), **new:** `/australia` (add one contextual link), **new rule** in `links.ts` `RULES`: `/booking|portal|membership|web app|software/` → `systems` placed after the case rules.
- *Out:* the five cases, `/services/ui-ux-design`, `/australia`, `/web-design-iligan-city`, `/contact?service=systems`, the posts.

**TBC:** TBC-8 (slug), TBC-10 (support pricing for systems; whether `care` plans apply), TBC-11 (stack names for cases 05, 06, 07, 08: `case-seo.md` says the data names none, so the page names no stack for them).

**Too thin?** No. Build it first.

---

## 3. What happens to `/services`

### 3.1 It stays as the hub
- **H1 "Five services. / One connected brand." is MUST-KEEP** (README). Unchanged.
- Title and meta: apply the `strategy.md` §5 proposal now that the hub is an umbrella page: **Title (60)** `Web Design, SEO, Branding & Web App Services | Fazed Digital` · **Meta (145)** `Custom websites, brand identity, SEO, product design and custom web apps from a Philippine studio. 7-day sites from $499; custom builds $5k–$20k.` (prices via variables).
- Each chapter becomes a **summary that hands off**: keep `h2`, `outcome`, the first body paragraph, the "What you get" list (or its first 3–4 items), one proof line, and add a prominent descriptive link to the page ("Web design and development in detail", "Brand identity: process and deliverables", "How our SEO service works", "Product design (UX/UI) in detail", "Custom web apps, booking systems and portals"). Move the long lists, all proof items beyond one, related reading and the "Also" lines to the service pages. The hub must stay a real page (an intro to each service plus links), not a list of links, and must not repeat the service pages paragraph for paragraph.

### 3.2 The `#web`-style anchors: no 301s, and none are possible
- A fragment (`#web`) is never sent to the server, so Vercel redirects (`vercel.json`) cannot see or match it. A 301 from `/services#web` to `/services/web-design` is technically impossible, and unnecessary: Google treats `/services#web` as `/services`, so no ranking signal sits on the fragment URL and nothing is lost.
- **Keep the ids** `web`, `brand`, `seo`, `product`, `systems` (and `faq`) on the hub chapters. Every old link, bookmark, chat transcript and the six links inside the posts arrays then still land on the right summary, which links onward. The link crawl in `internal-linking.md` checks for `#fragment` links to missing ids, so removing an id would also create a broken-link finding.
- **Do not add a JavaScript hash redirect** (`if (location.hash === '#web') location = '/services/web-design'`). It would hijack the hub's own jump navigation (the pentagon vertices are `href="#web"` etc., `services.astro` `.s-jump`), break the back button, and Google ignores it anyway.
- The pentagon jump links stay in-page (they are the hub's scroll choreography). The chapter summary is one click from the page.
- **What to do instead:** repoint every internal link to the new URLs (§3.3), update the hub's `ItemList` schema, and let the fragment links that cannot be edited (posts arrays) resolve to the hub.

### 3.3 Every place that links to `/services#…` (grep, 10 Nov 2026)

Excluding `.claude/worktrees/*` (stale agent copies; do not edit) and `docs/design/home-services-concepts/*.html` (design mock-ups).

| File:line | What | Action |
|---|---|---|
| `src/data/links.ts:12–16` | `T.web/brand/seo/product/systems` | Repoint `href` to the new pages. **This one change repoints the "Put this guide to work" block on every post, the hub links, `SERVICE_ALSO`, `LAB_LINKS` and `PLATFORM_LINKS`.** Do it per service as each page ships. |
| `src/data/cases.ts:166–170` | `S` map (`servicesUsed` on every case page) | Repoint. |
| `src/data/case-seo.ts:21, 39, 58, 59, 79, 98, 99, 117, 118, 137, 156, 157, 177` | case "related" links | Repoint (13 links). |
| `src/components/Footer.astro:4` | Services column, 5 links | Repoint; labels can stay. |
| `src/pages/index.astro:101, 108, 114, 119, 160` | home services deck planes (`/services#${services[i].id}`) | Repoint via a new `href` on `services` in `services.ts`. |
| `src/pages/index.astro:181` | home services list `h3` links | Same. |
| `src/pages/index.astro:309` | "More answers" → `/services#faq` | **Keep** (the FAQ stays on the hub). |
| `src/lib/cover.ts:20–23` | blog category → service (`SEO`, `Branding`, `Design`, `Development`) | Repoint (`Development` → `/services/web-design`; keep the mapping). |
| `src/data/nocode.ts:211` | `choose` "Custom code" row → `/services#web` | Repoint to `/services/web-design` (or `/services/web-app-development`, since the row says "apps, portals, bookings"; recommend web-app-development). |
| `src/pages/web-design-iligan-city.astro:25, 26, 27` | builds rows: SEO, brand, systems | Repoint. |
| `src/pages/services.astro:16` | `ItemList` schema `url: …/services#${c.id}` | Point each `Service` `url` and `@id` at the new page (`${url}#service`). |
| `src/pages/services.astro` chapter CTAs, proof links | | Unchanged (`/contact?service=…`, `/work/NN`); add the hand-off link per chapter. |
| `src/lib/chat/knowledge.ts:75` | page list "/services: all services (anchors: …)" | List the five new URLs. |
| `src/lib/chat/knowledge.ts:106` | services heading `(/services#${c.id})` | Use the new `href`. |
| `scripts/gen-llms.mjs:26` | services lines in llms.txt | Use the new `href` (§5.2). |
| `public/llms.txt:14–18` | generated output | Regenerates on build; do not hand-edit. |
| `src/layouts/Base.astro:60–62` | `hasOfferCatalog` (names only, no URL today) | Add `url` and `'@id': ${url}#service` per item so the Organization graph points at the five Service entities. |
| `src/pages/blog/[slug].astro` lines 44, 176, 283, 346, 455, 638 (posts `cleaning-business-branding-philippines`, `online-booking-system-philippines`, `payment-gateway-philippines-gcash`, `brand-identity-price-philippines`, `ecommerce-website-price-philippines`, `seo-iligan-city`) | in-body links inside the posts array | **Do not edit** (blog contract). They keep working via the kept ids. If the owner later approves an array edit, repoint them in one reviewed change. |
| `docs/seo/routine-prompt.md:24` | money-page check accepts `/services#…` | Allow `/services/<slug>` (check against the service data file); stop issuing `/services#…`. |
| `docs/seo/content-calendar.md` (22 lines) | money pages `/services#…` | Find/replace unticked lines per service as each page ships (`strategy.md` §8 pattern). |
| `docs/seo/strategy.md`, `internal-linking.md`, `case-seo.md`, `pages/web-design-iligan-city.md`, `audit-2026-10-21.md` | references | Update the keyword-ownership table (§1 above) and note the new URLs; history can stay. |

Also: `src/components/ContactForm.astro` reads `?service=web|brand|seo|product|systems`; keep those ids.

### 3.4 Hub FAQ
Keep cross-service questions on the hub with `FAQPage` markup: outside the Philippines, overall timelines, overall cost, ownership, support. Move "Which platforms do you build on?" (web) and "How long does SEO take?" (SEO) to their service pages and drop them from the hub's `FAQPage` JSON-LD (visible copy can stay on the hub as plain text, or be removed). One marked-up instance per question sitewide.

---

## 4. Navigation: header dropdown or not?

**Recommendation: no Services dropdown in the header.** List the five pages in the footer (already a Services column), on the `/services` hub, on the home services deck, and optionally as one compact line in the full-screen menu.

Why, on SEO:
- The footer already links all five pages from every page. A header dropdown adds a second sitewide boilerplate link to the same five URLs; search engines weight sitewide navigation links lightly and contextual links (posts, cases, hub) heavily. The contextual work in §2 and §3.3 moves far more than a dropdown would. `internal-linking.md` §2 measured click depth 2 for every page today; the new pages are depth 1 from the footer and the hub, so a dropdown does not improve crawl depth.
- The hub becomes the pages' strongest internal referrer (it has 73 contextual inbound pages per `internal-linking.md`). Sending header traffic to the hub keeps that authority flowing through descriptive anchors.

Why, on usability:
- Five items is a small set; one hub page that explains how they fit together ("One connected brand") is the site's positioning, and a dropdown skips it.
- The rail is already tight: `Header.astro` notes six links fit "from 1180 at the tight rhythm (measured 2026-11-10)". A dropdown trigger plus a panel adds hover-intent timing, a tap-to-open state on touch (where "Services" can no longer go straight to the hub without a second tap), keyboard and `inert` handling inside the existing focus-trap code, and ClientRouter re-binding. All of that is risk for a small gain, and it would need to stay inside the pre-3D JS budget (≤ 12 KB gz).
- On phones the full-screen menu is the navigation; a nested accordion inside it would push rows below the fold on ≤720px-tall phones (README: 44px rows there).

What to do in the menu: if the designer can fit it without breaking the 390 × ≤720 layout, add one small mono line under the Services row ("Web · Brand · SEO · Product · Systems", five links). If it does not fit, skip it; the hub is one tap away.

**Revisit** after 8 weeks of GA4 data: if `/services` shows high exits with few clicks to the five pages, or GSC shows the pages under-crawled, reconsider a header pattern then.

---

## 5. Rollout order, llms.txt, sitemap, lint and chat

### 5.1 Order
0. **Groundwork (one change):** add `href` to `chapters` and `services` in `services.ts`, create `src/data/service-pages.ts` and `src/pages/services/[slug].astro` (getStaticPaths over the services that have data, so unbuilt services keep pointing at the hub), add OG entries in `scripts/generate-og.mjs` (it renders a fixed list today), and decide TBC-8 (slugs).
1. **`/services/web-app-development`**: highest value, five real cases, niche queries winnable, no blocking TBC. Repoint `T.systems`, `S.systems`, case-seo systems links, footer, home plane 4, Iligan row 4, `nocode.ts` custom-code row; add the `/australia` link and the `RULES` entry.
2. **`/services/web-design`**: biggest demand, most inbound links. Repoint `T.web`, `S.web`, case-seo web links, footer, home plane 0, `cover.ts` Design/Development.
3. **`/services/branding`**: after TBC-1 (price or wording) and the cleaning-post fix (TBC-2). Repoint `T.brand`, `S.brand`, case-seo 02, footer, home plane 1, `cover.ts` Branding, Iligan row 3.
4. **`/services/seo`**: ideally after TBC-3 and TBC-5. Repoint `T.seo`, `S.seo`, case-seo 04, footer, home plane 2, `cover.ts` SEO, Iligan row 2.
5. **`/services/ui-ux-design`**: after TBC-7. Repoint `T.product`, `S.product`, case-seo 03/06, footer, home plane 3.
After each: the hub chapter gets its hand-off link, the hub `ItemList` URL updates, request indexing in Search Console (URL Inspection, per `reference_search_console`) and Bing Webmaster Tools, and swap the matching lines in `content-calendar.md`. Pages 1 and 2 can ship together; the rest wait on facts, not on build effort.

**Honest timing (new domain):** impressions within 2–6 weeks of indexing. Systems long-tails ("custom booking system philippines", "client portal development" variants) 3–6 months. Web design and branding head terms 6–12+ months and only with links (directory profiles, client "site by" credits, `strategy.md` §6). SEO-services terms are the hardest of the five.

### 5.2 llms.txt
`scripts/gen-llms.mjs` line 26 builds the Services section from `chapters` with `/services#id`. Change it to one line per page with its real URL and two facts, e.g. `- [Custom web apps, booking systems & portals](https://www.fazeddigital.com/services/web-app-development): bookings, membership and client portals, admin tools; builds of 8–14 weeks; typically $5,000–$20,000; cases 8Drive, UGLQ, QLD Law Group, Canwell.` Keep a `[All services](…/services)` line first. Prices in llms.txt are already the pattern (the 7-day line). It regenerates on every build; `posts.json` is regenerated before it (`extract-posts.mjs`), so the Guides list picks up `cleaning-business-branding-philippines` (missing from today's checked-in `posts.json`, 58 vs 59 entries in the arrays).

### 5.3 Sitemap
No config change. `@astrojs/sitemap` picks up the new static routes automatically; `serialize` strips trailing slashes; non-blog pages get no `lastmod` by design (`astro.config.mjs`). Submit nothing new: `sitemap-index.xml` is already in Search Console; request indexing per URL. Turn on IndexNow in Bing (ChatGPT search uses Bing's index).

### 5.4 `scripts/lint-dist.mjs`
Nothing required: it already fails on apex URLs, printed `[TBC`, and never-claim items, which covers placeholders in the new pages. **Optional guard (recommended):** fail when a non-blog HTML file contains `href="/services#(web|brand|seo|product|systems)"` (absolute path form only, so the hub's own `href="#web"` jump links pass). That stops regressions once all five pages exist. Add it after page 5 ships, not before.

### 5.5 Chat knowledge (`src/lib/chat/knowledge.ts`)
- Lines 75 and 106: switch to the new URLs (read `href` from `chapters`) so Fazzy links visitors to the detail pages.
- If the builder feeds `service-pages.ts` content (intros, FAQs) into `sharedKnowledge()`, every string must pass `noMoney` like the chapters do: the web and systems intros and FAQs contain prices. Prices belong only in `marketKnowledge()`. `scripts/lint-chat.mjs` fails the build otherwise. Never type facts into `knowledge.ts`.
- `src/lib/chat/guard.ts` needs nothing: no new markets or prices are introduced.

---

## 6. Owner confirmations [TBC]

None of these may print on the site; the build fails on `[TBC`.

1. **TBC-1 Brand price.** A brand-only starting price or range for `proof.ts`, or confirm the page says "quoted per project".
2. **TBC-2 Cleaning post.** Approve correcting "Our brand identity packages are listed on our services page" in `cleaning-business-branding-philippines` (posts array edit), unless TBC-1 makes it true.
3. **TBC-3 SEO retainer.** A starting monthly price, and what a month includes, or confirm "options on the discovery call".
4. **TBC-4 More brand work.** Any other brand projects from the 120+ that can be shown, with permission and images.
5. **TBC-5 SEO proof.** Any client who allows a Search Console screenshot or a stated result (would also allow `CASE_METRICS_REAL` for that case).
6. **TBC-6 AI search.** Is AI-search / AI Overviews visibility a sold part of SEO?
7. **TBC-7 Design-only.** Do you sell product design without the build? Price and typical timeline.
8. **TBC-8 Slugs.** Approve `/services/ui-ux-design` and `/services/web-app-development` (or the alternatives `/services/product-design`, `/services/custom-systems`). Permanent once live.
9. **TBC-9 Old address.** A search index still shows "101 Days Rd, Grange QLD 4051" for Fazed Digital from the old site. Was it ever a real address? Remove it from any directory or profile that still lists it.
10. **TBC-10 System support.** Price of maintenance for custom systems; do the `care` plans apply?
11. **TBC-11 Stacks.** Technologies used for Canwell, 8Drive, UGLQ and QLD Law Group, if you want them named.
12. **H1 approval.** The five new H1s above are proposals (they are not MUST-KEEP, but the owner approves new H1s).

---

## 7. Measurement (add to the Monday check in `strategy.md` §9)

- Search Console, Pages: filter `/services/`. Queries regex per page: web `web design|website design|web development|custom website`; brand `brand|branding|logo|rebrand`; SEO `\bseo\b|search engine|google business|local seo`; product `ui ?ux|product design|mvp|figma|prototype`; systems `web app|software|booking system|portal|membership|custom system`.
- Watch cannibalisation: `/services/web-design` vs `/` and `/lp/7-day-website`; `/services/branding` vs `/blog/brand-identity-price-philippines`; `/services/web-app-development` vs `/work/06–08`. The owner page should hold the head term; if two pages split impressions for 8+ weeks, adjust titles, not content.
- GA4: clicks from `/services` to each page; `contact?service=` submissions by service.
- Monthly prompt check (ChatGPT, Perplexity, Gemini, Copilot): "custom booking system developer Philippines", "brand identity design studio Philippines", "who builds membership portals for Australian associations", "SEO services for small business Philippines". Record whether a `/services/*` page or a case is cited, and whether any answer states the Grange QLD address.

---

## 8. Sources (observed 10 Nov 2026)

**Autocomplete** (`https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl={ph|us|au}&q=…`). Note: the `gl` parameter changed little (results are biased to the requester's location), so these show phrasing that exists, not per-market volume. Get volumes from Search Console once impressions arrive.
- "branding agency" → PH: `branding agency philippines` first; AU: `branding agency australia/melbourne/sydney/brisbane`.
- "brand identity design" → `brand identity design services`.
- "seo services philippines" → `local seo services philippines`, `affordable seo services philippines`; "seo philippines" → `seo philippines price`, `philippines seo agency`, `local seo philippines`; "seo services" → `seo services for small businesses`, `seo services australia`.
- "web design philippines" → `website design philippines price`, `web design company philippines`, `web design agency philippines`, `website development philippines`; "website design and development" → `… services`, `… company`, `… agency`, `… cost`.
- "ui ux design philippines" → `ui ux design cost philippines`; "ui ux design agency" (Indian city modifiers); "product design agency" → `… for startups`, `… india/london/nyc`.
- "custom software development philippines" → `custom software development company philippines`; "custom booking system" → `custom booking engine`, `custom booking software`; "booking system philippines" → `online booking system philippines`, `reservation system philippines`; "web app development australia" → `web app development company in australia`; "client portal development" → `customer portal development company`; "membership portal development" → `membership website development`; "custom web app development" → no suggestions.

**SERPs (web search, US-based engine)**
- Web design PH: [Clutch PH web developers](https://clutch.co/ph/web-developers?page=4), [Clutch PH web designers](https://clutch.co/ph/web-designers?page=6), [DesignRush PH web development](https://www.designrush.com/agency/web-development-companies/ph), [Syntactics web design](https://syntacticsinc.com/web-design-and-development), [Optimind /services/web-design/](https://www.myoptimind.com/services/web-design/?amp=1), [Designblue Manila llms.txt](https://designbluemanila.com/llms.txt). Directories dominate; agency pages use `/services/<service>`.
- Custom vs template (US): [Sigma Solve](https://www.sigmasolve.com/blog/custom-website-design-vs-templates-which-is-best-for-your-business), [Igniting Business](https://www.ignitingbusiness.com/blog/6-advantages-of-custom-web-design-over-template-based-website-design), [Marketeam (AU)](https://marketeam.com.au/resources/articles/web-design/is-custom-website-design-worth-it-for-a-small-business).
- Branding PH: [Clutch PH branding](https://clutch.co/ph/agencies/branding), [Tribox Design (DesignRush)](https://www.designrush.com/agency/profile/tribox-design), [Mindfuse (DesignRush)](https://www.designrush.com/agency/profile/mindfuse), [Springhive Cebu](https://springhive.co/locations/branding-agency-cebu/). Brand package contents/prices: [Logoworks](https://logoworks.com/brand-identity-package-price/), [ManyPixels](https://www.manypixels.co/blog/brand-design/brand-identity-design-services), [Dribbble brand identity services](https://dribbble.com/services/2227-Brand-Identity).
- SEO PH: [Digital Marketing Philippines small business SEO](https://digitalmarketingphilippines.com/small-business-seo-services/), [DMP local SEO](https://digitalmarketingphilippines.com/services/local-seo-services/), [Syntactics local SEO](https://www.syntacticsinc.com/local-seo-services/), [Spiralytics local SEO](https://www.spiralytics.com/?p=17559), [TechBehemoths local search PH](https://techbehemoths.com/companies/local-search/philippines?page=2). Offshore SEO (US/AU): [USource AU](https://usource.me/au/outsourcing/philippines-seo-services/), [USource US](https://usource.me/us/outsourcing/philippines-seo-services/), [Truelogic](https://www.truelogic.com.ph/blog/seo/outsource-seo-checklist).
- UX/product PH: [Clutch PH UI/UX Manila](https://clutch.co/ph/agencies/ui-ux/manila), [Clutch PH product design](https://clutch.co/ph/agencies/product-design) (Brash Inc., Design 1st: physical product), [Wavespace](https://www.wavespace.agency/locations/ui-ux-agency-in-philippines), [design316 (TechBehemoths)](https://techbehemoths.com/company/design316). Startup product design: [Dribbble MVP product design](https://dribbble.com/services/119841-MVP-Product-Design), [Contra product design for startups](https://contra.com/s/so2eRrMY-product-design-for-startups).
- Custom software PH: [Clutch PH developers](https://clutch.co/ph/developers/small-business?page=2), [Syntactics custom software](https://syntacticsinc.com/custom-software-development), [Upwork booking system gig](https://www.upwork.com/services/product/development-it-i-will-build-you-a-complete-online-booking-system-with-automated-workflows-2050427958746166871). Web apps AU: [Devinium client and staff portals](https://devinium-website.pages.dev/services/client-and-staff-portals/), [Appello](https://appello.com.au/services/software-development/web-app-development-in-australia), [ITInspire](https://www.itinspire.com.au/services/custom-software-development-australia/). Cost guides: [Kolonell booking platform cost](https://kolonell.com/en/blog/custom-booking-platform-development-cost-2026), [Upstack Studio](https://upstackstudio.com/blog/custom-booking-app-development/).
- Our own presence (site-restricted search): returned [fazeddigital.com (old title, Grange QLD address in the index)](https://fazeddigital.com/), [/work/](https://www.fazeddigital.com/work/), [/work/06/](https://www.fazeddigital.com/work/06/), [/blog/on-page-seo-checklist](https://www.fazeddigital.com/blog/on-page-seo-checklist). Unrestricted "fazeddigital.com services" returned only look-alike brands (Faze Digital, FZP Digital, Faze47, Fuze), as in `strategy.md` §1.
- Live checks (curl): `/services` 200, `/services/web-design` 404, `/services/custom-systems` 404; apex → www 308; `/work/` → `/work` 308; live sitemap lists 26 non-blog URLs, none under `/services/`.

## Owner pricing decisions (10 Nov 2026)

Source: owner in chat. These are not in `proof.ts` yet. They go in when the pages are built, so the site, the chat assistant and /services all quote the same numbers.

- **Branding:** quoted per project, with no "from" price.
- **SEO:** includes AI search (ChatGPT and Google AI answers). There are no client results yet, so don't claim any.
- **UI/UX design:** design-only work is offered.
- **Web app development:** custom pricing, separate from the 7-day packages and care plans.
- **Automations:** n8n, Zapier, Make, HubSpot and custom code, for any business process. There are no clients yet. Approved prices:

| Package | USD | PHP | Includes |
|---|---|---|---|
| Free automation check | Free | Free | The existing 15-minute call (/audit) |
| Single automation | $299 | ₱9,999 | One workflow, live in 5 business days, 14 days of fixes |
| Automation pack | $899 | ₱29,999 | Up to 3 connected workflows, walkthrough video and written steps, 30 days of fixes |
| Custom automation | from $2,500 | quoted | Custom code, AI agents, systems with no ready-made link |
| Automation care | $99/month | ₱3,500/month | Monitoring, and fixes when a tool changes |

  Founding rate: 20% off for the first 3 automation clients, with nothing asked in return. The owner's 6 Nov rule in offers.ts says no discount may be tied to a review. Tool subscriptions are in the client's own name.
- **Social media management:** covers all the client's platforms. No clients yet. Approved by the owner 10 Nov 2026:

| Plan | USD/month | PHP/month | Includes |
|---|---|---|---|
| Starter | $399 | ₱14,999 | Up to 3 platforms, 12 designed posts a month, captions, scheduling, monthly report |
| Growth (recommended) | $799 | ₱29,999 | Up to 5 platforms, 20 posts including 4 short videos, stories, replies to comments and DMs on business days, monthly report and call |
| Pro | $1,499 | ₱49,999 | All the client's platforms, 30 posts including 8 short videos, ads management (ad spend paid by the client), content calendar |

  Terms: 3-month minimum, then month to month with 30 days' notice. Founding rate: 20% off for the first 3 months for the first 3 clients, with nothing asked in return (the offers.ts 6 Nov rule).
