# /services/web-design · page copy

The Wordsmith · 10 Nov 2026 · copyStatus: draft · data id `web` · Service 01 / 07 · template: Direction C "Runtime"
Brief: `docs/seo/pages/service-pages.md` §2.1 · Mock: `docs/design/service-pages/direction-C/index.html` (default view)

## 1. Meta

| Field | Copy | Chars |
|---|---|---|
| Title | Custom Web Design & Development Services \| Fazed Digital | 56 |
| Meta description | Custom websites, never templates, in WordPress, Astro, Next.js or Webflow. 7-day sites from $499; custom builds $5,000–$20,000. You own everything. | 147 |
| Primary keyword | web design and development services | |
| Secondary | custom website design and development · website design and development company · web design company philippines · website redesign | |

## 2. Hero

- **Crumbs:** Home / Services / Web design
- **Eyebrow:** Service 01 / 07 · Web design & development
- **H1 line 1:** Web design & development.
- **H1 line 2 (gray-400):** A website that brings in enquiries.
- **Intro (59 words, real HTML under the H1):**
  Fazed Digital designs and builds custom websites, never templates, from Iligan City, Philippines, for businesses in the USA, Australia and the Philippines. We build in WordPress, Astro, React, Next.js or Webflow, mobile-first and to WCAG 2.1 AA. Fixed-price sites start at $499 (₱19,999) and go live in 7 business days. Custom builds take 4–12+ weeks and typically run $5,000–$20,000.
- **CTA primary:** Start a website project → `/contact?service=web`
- **CTA secondary (ghost, hidden on phones):** See real build times → `#proof`

### Meter (lime answer line)

| Slot | Value |
|---|---|
| label (mono) | Live in |
| number (lime Clash) | 7 |
| unit (small) | days |
| tail (mono) | from $499 · ₱19,999 |

### Ruler

- **unit:** weeks · **span:** 14 · ticks W0, 1 … 14 · unit label: "weeks →"
- **band:** weeks 4–12, label "Custom builds · 4–12+ weeks · $5,000–$20,000"
- **fast marker:** week 1, label "7-day website"
- **bars** (shortest first, each textured from its case shot bin):

| case | label (DOM, above/next to bar) | weeks | source |
|---|---|---|---|
| 09 | 09 Dotted Studios · 1 wk | 1 | `src/data/cases.ts:146` |
| 01 | 01 A Framing Company · 6 wks | 6 | `src/data/cases.ts:18` |
| 04 | 04 The Telecom Shop · 10 wks | 10 | `src/data/cases.ts:130` |
| 08 | 08 QLD Law Group · 14 wks | 14 | `src/data/cases.ts:114` |

- **aria-label:** "Our real website projects by build length: Dotted Studios 1 week, A Framing Company 6 weeks, The Telecom Shop 10 weeks, QLD Law Group 14 weeks."
- **Phone:** labels sit above each bar; band and fast labels drop (the meter already says them).

## 3. What you get · who it's for

- **Eyebrow:** What you get · who it's for
- **H2:** Every week of it, *spelled out.*
- **Lead:** We build in WordPress when your team wants to edit everything themselves, and in Astro, React, Next.js or Webflow when speed and flexibility matter most. We'll recommend the right fit, not the one we like best. When it launches, the domain, hosting, logins and files are yours. No lock-in.
- **"In every build"** (list):
  - Custom design, no templates
  - Built in WordPress, Astro, React, Next.js or Webflow
  - Mobile-first, accessibility to WCAG 2.1 AA
  - Core Web Vitals optimisation
  - Headless or editable CMS, with handover training
  - Ongoing support and maintenance (plans from $99/month)
- **"Good fit if"** (list):
  - Your site looks older than your business
  - You're losing bids or bookings to competitors who just look more credible
  - You need a site your own team can update

## 4. Two ways to work with us

- **Eyebrow:** Two ways in
- **H2:** Fixed price in 7 days, *or custom.*
- **Lead:** Most studios say "it depends". We publish both routes.

| | 7-day website | Custom build |
|---|---|---|
| Price | Starter $499 · Growth $899 · Pro $1,499 (₱19,999 · ₱34,999 · ₱59,999) | Typically $5,000–$20,000, quoted after a discovery call |
| Time | Live in 7 business days | 4 weeks for simpler builds, 12+ for complex ones |
| Pages | 5, 8 or 10+ custom-designed pages | Scoped to what the site must do |
| Included | On-page SEO setup, contact form, 2 or 3 revision rounds (unlimited on Pro); Growth adds a blog and CMS, Google Analytics and Search Console; Pro is e-commerce ready | Custom design, the platform that fits your team, CMS handover training |
| Best for | New and growing small businesses | Bigger sites, stores, migrations and anything with custom features |
| Next step | Get live in 7 days → `/lp/7-day-website` (PH: `/lp/7-day-website/ph`) | Start a website project → `/contact?service=web` |

- **Footnote:** Extra pages are $79 (₱2,500) each. Booking systems, membership portals and custom e-commerce are scoped separately, with the price upfront.

## 5. Which platform, and why

- **Eyebrow:** Platform
- **H2:** The right fit, *not our favourite.*
- **Rows** (from `nocode.ts` `choose`, plus WordPress):
  - **WordPress.** When you want to edit everything yourself.
  - **Astro, React or Next.js.** When performance and flexibility matter most.
  - **Framer.** Best for design-led marketing sites, launch pages and waitlists that need to look great and go live fast. → Framer websites `/framer`
  - **Webflow.** Best when you want more structure: bigger CMS needs, a strict class system and detailed interactions, edited by a marketing team. → Webflow websites `/webflow`
  - **Selling online?** We build stores and run migrations, like The Telecom Shop's move from Magento to PrestaShop. → E-commerce stores and migrations `/ecommerce`
- **Already designed it?** We can build from your own Figma file. Dotted Studios designed their site in Figma; we kept their layout, palette, type and copy and built the motion, content system and enquiry form on top.

## 6. Proof · real runs, shortest first

- **Eyebrow:** Proof · 04 real runs, shortest first
- **H2:** Real projects. *Real weeks.*
- **Sticky meter label (desktop):** "{client} · {n} wks"

| big | small line | strip (mono) | client (h3) | headline | Before | After | link | caption |
|---|---|---|---|---|---|---|---|---|
| 01 | week · Website + CMS | Case 09 / 09 · Branding studio · Iligan City, PH · 2026 | Dotted Studios | From a dead link to a site built around the work. | Their work lived on Behance and Facebook, and the website on their profiles led to a dead portfolio page. | We built the site from their own Figma design. It went live at dottedstudios.com one week after the build started. | Read the Dotted Studios case → `/work/09` | dottedstudios.com · Week 1 of 14 |
| 06 | weeks · WordPress website | Case 01 / 09 · Construction · Utah, USA · 2024 | A Framing Company | A website they now pitch new work with. | An outdated site with no portfolio. They were losing bids to competitors who simply looked more credible online. | A portfolio-led WordPress site the team edits themselves. It's now a core part of how they pitch for work. | Read the A Framing Company case → `/work/01` | aframingcompany.com · Week 6 of 14 |
| 10 | weeks · Magento to PrestaShop migration | Case 04 / 09 · Telco retail · Australia · 2024 | The Telecom Shop | Magento to PrestaShop. Zero data loss. | Their Magento store had become slow, expensive to maintain and hard to update. | Catalogue, customers and order history moved in stages, with zero data loss and minimal disruption to trading. | Read the Telecom Shop case → `/work/04` | thetelecomshop.com · Week 10 of 14 |
| 14 | weeks · Website + web app + mobile app | Case 08 / 09 · Legal · Queensland, AU · 2025 | QLD Law Group | Three products. One client experience. | They needed a website, a secure client portal and a mobile app: three connected products. | All three shipped as one suite. Clients now self-serve document uploads and status checks. | Read the QLD Law Group case → `/work/08` | qldlawgroup.com.au · Week 14 of 14 |

- **Image alt** (from `CASE_EXTRA[nn].alt`): e.g. "Homepage of Dotted Studios' website, designed and built by Fazed Digital".
- **Under the list (one line):** Brand and website together? See Cleen & Green → `/work/02`.

## 7. Process and price

- **Eyebrow:** Process and timeline
- **H2:** Same five steps. *The length changes.*
- **Steps:**
  1. **Short call.** What the site must do, who it's for, and what you already have. You get a price and a timeline upfront.
  2. **Direction.** A look and a page plan, agreed before we build, so there are no surprises later.
  3. **Build.** Custom design, built in the platform that fits your team.
  4. **Review.** You test it on a staging link and we make the changes.
  5. **Launch and hand over.** Domain, hosting, logins and files are yours. No lock-in.
- **Timeline line:** Websites take 4 weeks for simpler builds and 12+ weeks for complex ones. On the 7-day route it's Day 1 brief, Days 2–3 design, Days 4–5 build, Day 6 review on staging, Day 7 launch. → Get live in 7 days `/lp/7-day-website`
- **Price line** (eyebrow "Price, on the same line"):
  - point at week 1: label "7-day website · week 1", value "$499" + "₱19,999"
  - range over weeks 4–12: label "Custom · 4–12+ weeks", value "$5,000–$20,000"
- **Price sub:** Live in 7 business days, or 20% off if we miss it on our side (you send everything on Day 1 and feedback within 24 hours). Custom websites are quoted after a discovery call. A 50% deposit starts the work. Care plans from $99/month (₱3,500) cover updates, backups, security monitoring, uptime checks and small content changes.

## 8. You own it

- **Eyebrow:** After launch
- **H2:** Yours, *all of it.*
- **Body:** Your domain, hosting, logins, design files and content are yours once paid for. On full payment, all intellectual property in the final deliverables is assigned to you. No lock-in contracts. If you want us to keep looking after it, care plans start at $99/month.

## 9. FAQ (6)

- **Eyebrow:** FAQ · 06 · **H2:** Questions about web design

1. **How much does a website cost?** Our fixed-price 7-day websites start at $499 (₱19,999 in the Philippines). Growth is $899 and Pro is $1,499. Extra pages are $79. Custom websites are quoted after a discovery call and typically run $5,000–$20,000.
2. **How long does a website take?** A 7-day website goes live in 7 business days if you send everything on Day 1 and feedback within 24 hours at each review. If we miss it on our side, you get 20% off. Custom websites take 4 weeks for simpler builds and 12+ weeks for complex ones.
3. **Which platforms do you build on?** WordPress when you want to edit everything yourself. Astro, React or Next.js when performance and flexibility matter most. Framer or Webflow when your marketing team wants a site builder. We recommend the best fit for you.
4. **Will I own my website?** Yes. Your domain, hosting, logins, design files and content are yours once paid for. No lock-in contracts.
5. **Can you build our site from our own Figma design?** Yes. Dotted Studios designed their site in Figma, so we kept their layout, palette, type and copy, then built the motion, the content system and the enquiry form on top. It went live one week after the build started.
6. **Do you offer support after launch?** Yes. Monthly care plans start at $99/month (₱3,500 in the Philippines) and cover updates, backups, security monitoring, uptime checks and small content changes.

## 10. Read before your call

- **Eyebrow:** Read before your call (read time as lime dots)

| slug | title | category · date | read |
|---|---|---|---|
| how-long-to-build-a-website | How Long Does It Take to Build a Small Business Website? | Strategy · 02 Nov 2026 | 5 min |
| wordpress-vs-custom-build | WordPress vs Custom Build: Which Is Right for Your Business? | Development · 10 Sep 2026 | 5 min |
| signs-website-needs-redesign | 7 Signs Your Business Website Needs a Redesign | Design · 02 Jul 2026 | 5 min |
| market slot (`data-market`): US `small-business-website-cost-us` · AU `website-cost-australia-2027` · PH `web-design-pricing-guide` | Small Business Website Cost in the US: A 2027 Price Guide / How Much Does a Website Cost in Australia in 2027? / How Much Does a Website Cost in the Philippines in 2026? | Strategy · 04 Nov / 01 Nov / 03 Oct 2026 | 5 / 5 / 8 min |

## 11. Close

- **Eyebrow:** Ready when you are
- **H2:** Week 0 *starts here.*
- **Body:** Send a short brief. We'll reply within one business day with questions, a rough scope and next steps.
- **Caps (mono lime):** We take on 3 custom projects a month. · We take on 15 seven-day builds a month, max.
- **CTA primary:** Start a website project → `/contact?service=web`
- **CTA ghost:** Next: Brand identity → `/services/branding`
- **Also line:** Need it in a week? Get live in 7 days → `/lp/7-day-website` · See peso pricing (₱) → `/lp/7-day-website/ph` (PH only)
- **Seven-service line:** Web design · Branding · SEO · UI/UX · Web apps · Automations · Social media (current lit)

## 12. JSON-LD notes

- `Service`: `@id` `https://www.fazeddigital.com/services/web-design#service`, name "Web design & development", serviceType "Web design and development", description = the intro, `provider: ORG_REF`, `areaServed` Philippines, United States, Australia.
- `hasOfferCatalog` with three `Offer`s: Starter 499, Growth 899, Pro 1499, `priceCurrency: 'USD'`, `url` `/lp/7-day-website`. No Offer for the custom range (it is "typical", not a price).
- `FAQPage` from section 9 (same strings). Drop "Which platforms do you build on?" and "Will I own my website?" from the hub's `FAQPage` markup (one marked-up instance sitewide).
- `BreadcrumbList`: Home › Services › Web design & development.

## 13. Price tokens (never type these in code)

| Printed | Variable |
|---|---|
| $499 / $899 / $1,499 | `prices.usd.starter / growth / pro` |
| ₱19,999 | `offerPrice('php','starter')` (prints ₱14,999 while `FOUNDING_PH.on`) |
| ₱34,999 / ₱59,999 | `prices.php.growth / pro` |
| $79 / ₱2,500 | `prices.usd.page / prices.php.page` |
| $99/month / ₱3,500/month | `prices.usd.care / prices.php.care` |
| $5,000–$20,000 | `prices.customRange` |
| caps lines | `capsCopy.custom`, `capsCopy.sevenDay` |

## 14. Facts and sources

| Fact | Source |
|---|---|
| Custom design, no templates; platforms WordPress/Astro/React/Next.js/Webflow; "right fit, not the one we like best"; domain, hosting, logins, files yours | `src/data/services.ts:21–23` |
| "In every build" list | `src/data/services.ts:25` |
| "Good fit if" list | `src/data/services.ts:26` |
| 4 weeks simpler, 12+ complex | `src/data/services.ts:32` |
| Prices $499/$899/$1,499, ₱19,999/₱34,999/₱59,999, $79/₱2,500, care $99/₱3,500, custom $5,000–$20,000 | `src/data/proof.ts:37–39` |
| PH Starter founding rate ₱14,999 while on | `src/data/offers.ts:7–18` |
| Caps 3 custom / 15 seven-day a month | `src/data/proof.ts:45–46` |
| Package rows (pages, revisions, SEO, CMS, GA + Search Console, e-commerce ready) | `src/data/lp.ts:40–42` |
| 7-day process Day 1 … Day 7 | `src/data/lp.ts:46–52` |
| 7-day guarantee, 20% off, conditions | `src/data/lp.ts:11` |
| Extra pages, custom features scoped separately | `src/data/lp.ts:25` |
| Care plan contents | `src/data/lp.ts:26` |
| Framer / Webflow rows | `src/data/nocode.ts:209–210` |
| Platforms FAQ answer | `src/data/services.ts:105` |
| Ownership FAQ answer | `src/data/services.ts:104` |
| IP assigned on full payment | `src/pages/terms.astro:12` |
| 50% deposit | `src/pages/terms.astro:29` |
| Reply within one business day | `src/pages/services.astro:90`, `src/pages/contact.astro:19` |
| City, Philippines; markets USA/AU/PH | `src/data/site.ts:12`, `src/data/proof.ts:10` |
| Dotted Studios: 1 week, Website + CMS, Behance/Facebook dead link, own Figma, live dottedstudios.com | `src/data/cases.ts:146–151`, `:273–279`; `src/data/case-seo.ts:170` |
| A Framing Company: 6 weeks, WordPress, Utah, 2024, outdated site no portfolio, pitch work | `src/data/cases.ts:14–19`, `:175–183` |
| The Telecom Shop: 10 weeks, Magento to PrestaShop, zero data loss, minimal disruption | `src/data/cases.ts:126–131`, `:211–219` |
| QLD Law Group: 14 weeks, website + web app + mobile app, self-serve uploads and status checks | `src/data/cases.ts:110–115`, `:259–267` |
| Cleen & Green brand + website link | `src/data/cases.ts:27–34` |
| Post titles, categories, dates, read times | `src/data/.generated/posts.json` |
| Title, meta, H1, intro, FAQ set | `docs/seo/pages/service-pages.md:81–119` |

## 15. TBC

- [TBC] Are first-year domain and hosting inside the 7-day price? (brief §2.1, still open). The copy avoids the question; `lp.ts:20` says domain can be provided, hosting is the client's choice.
- [TBC] H1 line 2 approval (owner approves new H1s).
