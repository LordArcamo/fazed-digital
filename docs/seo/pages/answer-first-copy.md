# Answer-first copy: home, services, work, contact, audit + pricing guide

copyStatus: draft (owner approval needed) · Wordsmith, 21 Oct 2026 · Brief: `audit-2026-10-21.md` §M1/§M4, `geo-aeo-audit.md` §4
Facts come only from `src/data/*.ts` (proof, site, lp, services, cases, team), `src/components/Lp.astro` package rows, `/terms` (50% deposit) and the owner answers recorded in `web-design-iligan-city.astro` (in person in Iligan + CDO; Bisaya/Tagalog/English). "120+ projects since 2022" is owner-confirmed (proof.ts, 2026-10-19).
H1s and hero layouts do not change. Only the paragraph under each H1 changes.

**Use data variables, not hard-coded numbers**, so prices stay in one place:
`prices.usd.starter` ($499) · `prices.php.starter` (₱19,999) · `prices.customRange` ($5,000–$20,000) · `prices.usd.care` / `prices.php.care` · `NAP.city` · `NAP.hours` · `countries.length` (3) · `caseIndex.length` (8). Import from `../data/proof`, `../data/site`, `../data/cases`.

---

## 1. Answer-first opening paragraphs

### 1.1 Home `/` (hero deck under "Built in Iligan. Live worldwide.")

File: `src/pages/index.astro`, line 50, `<p class="t-body-l hero-deck">`.

**Replace exactly:**
> Websites, brands and web apps for owners who want to be found, trusted and chosen. Made in the Philippines, shipped to the USA, Australia and home.

**With (35 words, 2 sentences):**
> Fazed Digital is a web design, branding and SEO studio in Iligan City, Philippines, for owners in the USA, Australia and home. Fixed-price websites start at $499 (₱19,999) and go live in 7 business days.

Astro:
```astro
<p class="t-body-l hero-deck">Fazed Digital is a web design, branding and SEO studio in Iligan City, Philippines, for owners in the USA, Australia and home. Fixed-price websites start at {prices.usd.starter} ({prices.php.starter}) and go live in 7 business days.</p>
```
Notes: `prices` must be added to the existing `../data/proof` import. The deck is 9 words longer than today's (26 → 35). If it wraps to too many lines on the 390px hero, use this fallback (29 words), which drops the market list because the hero strip and the Unfold section already carry it: "Fazed Digital is a web design, branding and SEO studio in Iligan City, Philippines. Fixed-price websites start at $499 (₱19,999) and go live in 7 business days."

### 1.2 `/services` (intro paragraph)

File: `src/pages/services.astro`, line 37, `<p class="t-body-l s-deck">`.

**Replace exactly:**
> Brand, website, search, product and systems, built by one team so they actually fit together. Hire us for one piece, or let us connect the lot.

**With (56 words):**
> Fazed Digital is one team in Iligan City, Philippines, with five services that fit together: web design, brand identity, SEO, product design and custom systems. Fixed-price websites start at $499 (₱19,999) and go live in 7 business days. Custom builds take 4–12+ weeks and typically run $5,000–$20,000. Hire us for one piece, or connect the lot.

Note: `.s-deck { max-width: 44ch; }` will make this tall. Suggest 56ch to match the `/work` deck (layout call for the developer, not a copy change).

### 1.3 `/work` (intro paragraph)

File: `src/pages/work.astro`, line 25, `<p class="t-body-l w-deck">`.

**Replace exactly:**
> Websites, brands, platforms and portals for a framing contractor in Utah, a law firm in Queensland, a cleaning brand at home and five more. Every one is live.

**With (55 words):**
> Eight of the 120+ projects Fazed Digital has delivered since 2022, for clients in the USA, Australia and the Philippines. Websites, brands, platforms and portals for a framing contractor in Utah, a law firm in Queensland, a cleaning brand at home and five more. Each build took 5 to 14 weeks. Every one is live.

Facts: 8 cases and 3 countries (`cases.ts`); durations 5, 6, 8, 8, 10, 10, 12 and 14 weeks (`cases.ts`); 120+ since 2022 (`proof.ts`). Astro: `{caseIndex.length}` can't print "Eight" as a word, so keep the word and update it by hand when a case is added.

### 1.4 `/contact` (intro paragraph)

File: `src/pages/contact.astro`, line 33, `<p class="t-body-l ct-deck">`.

**Replace exactly:**
> Tell us what you need and when you need it. A real person replies within one business day, Monday to Friday.

**With (53 words):**
> Tell us what you need and when you need it. A real person at Fazed Digital in Iligan City, Philippines replies within one business day, Monday to Friday. Fixed-price websites start at $499 (₱19,999). Custom projects are quoted after a short discovery call. Meet us in Iligan or Cagayan de Oro, or online.

Note: `.ct-deck { max-width: 44ch; }`. Same width suggestion as `/services`.

---

## 2. Homepage FAQ (4 items, visible copy = FAQPage JSON-LD)

Suggested H2: "Questions owners ask first". Plain text only, so the same strings can feed `FAQPage`. Suggested home: a `homeFaq` export in `src/data/` (for example next to `serviceFaq` in `services.ts`), rendered with the existing `Faq.astro`.

**Q: How much does a website cost?**
A: Our fixed-price 7-day websites start at $499 (₱19,999 in the Philippines). Growth is $899 (₱34,999) and Pro is $1,499 (₱59,999). Extra pages are $79 (₱2,500). Custom websites and systems are quoted after a discovery call and typically run $5,000–$20,000. Care plans start at $99/month (₱3,500). *(45 words)*

**Q: How long does it take?**
A: A 7-day website goes live in 7 business days if you send everything we need on Day 1 and your feedback within 24 hours at each review. If we miss it on our side, you get 20% off. Custom websites take 4 to 12+ weeks, brand identity 4–6 weeks, and our system builds have run 8–14 weeks. *(57 words)*

**Q: Can a Philippine studio build for a US or Australian business?**
A: Yes. Most of our case studies are for clients in the USA and Australia, including a framing contractor in Utah and a law firm in Queensland. We work remotely with clear milestones, regular video check-ins and written updates. Prices are in US dollars, paid by Wise or bank transfer. Queensland is 2 hours ahead of us. *(56 words)*

**Q: Who owns the website?**
A: You do. Once it’s paid for, the domain, hosting, logins, design files and content are yours, all in your name. There’s no lock-in contract. If you want us to look after it, care plans start at $99/month (₱3,500 in the Philippines). *(41 words)*

Sources: `proof.ts` prices; `lp.ts` (7-day condition, 20% off, Wise/bank for USD, ownership); `services.ts` (`serviceFaq`, chapter timelines, "domain, hosting, logins and files are yours"); `index.astro` steps ("all in your name"); `strategy.md` §2 (Brisbane 2 h ahead; Queensland has no daylight saving, so this holds all year). Optional: link the case names in the visible answer only (`/work/01`, `/work/08`). The JSON-LD stays plain text.

---

## 3. `/audit` (who runs the call)

File: `src/pages/audit.astro`, line 37, `<p class="t-body-l au-deck">`. Current text:
> Book a free 15-minute call. We’ll look at your website with you and point out the 3 fixes that would bring you the most calls and enquiries. <strong>No site yet? Book anyway.</strong>

**Option A, new line under the deck** (e.g. in the `au-note` slot or as a small line after the deck):
> Run by the Fazed Digital team in Iligan City, Philippines: the studio behind 120+ websites, brands and systems since 2022.

**Option B, inline (what `geo-aeo-audit.md` §4 asks for):**
> Book a free 15-minute call with Fazed Digital, a web studio in Iligan City, Philippines. We’ll look at your website with you and point out the 3 fixes that would bring you the most calls and enquiries. <strong>No site yet? Book anyway.</strong>

---

## 4. Blog: expanded `web-design-pricing-guide`

Entry: `src/pages/blog/[slug].astro` line 615 (and the card at `src/pages/blog/index.astro` line 208).
**Contract warning:** CLAUDE.md says never edit lines inside either `const posts = [` array. This rewrite changes an existing entry's `title`, `excerpt`, `readTime` and `content`, so Lord must approve editing in place. Otherwise, use an override map outside the arrays (the `seoTitle`/`seoDescription` pattern from audit §M4, extended to `content`). Slug, category, date, author (Reancirl Balaba, who writes our pricing guides per `team.ts`) and image are unchanged.

- **Primary keyword:** website cost philippines · **Secondary:** website design philippines price, how much does it cost to create a website in the philippines, website maintenance cost philippines
- **New title (56 chars):** How Much Does a Website Cost in the Philippines in 2026?
- **New excerpt (140 chars):** Website prices in the Philippines run from about ₱15,000 to ₱800,000+. See what drives the cost, the hidden fees, and how to compare quotes.
- **readTime:** 8 min read (about 1,660 words)
- **Internal links (4):** /lp/7-day-website/ph, /audit, /lp/7-day-website, /web-design-iligan-city. **External sources (2, both opened 21 Oct 2026):** Designblue Manila cost breakdown (published 4 May 2026: ₱50k–₱100k freelancer/template, ₱100k–₱250k small agency, ₱250k–₱800k+ boutique/enterprise, ₱15,000 templated example, 5–10 pages ₱100k–₱250k); Starfish homepage (packages from ₱28,000 / ₱45,000 / ₱60,000).
- **Removed from the old version:** the unsourced tiers (under ₱30k / ₱50k–₱150k / ₱200k+), the quoted "three quotes" anecdote, and the invented 0.5% vs 2.5% conversion example.
- The audit asked for a table, but `<table>` is not an allowed tag, so the tiers are bolded paragraphs.
- Tags used: `<p>`, `<h2>`, `<strong>`, `<a>` only. No backticks and no `${` in the content.

```html
<p>A small business website in the Philippines costs anywhere from about ₱15,000 for a template site to ₱250,000 or more for a custom agency build. Published price guides put most freelancer and small-agency work between ₱50,000 and ₱250,000. Our own fixed-price packages at Fazed Digital start at ₱19,999 for a 5-page custom site, live in 7 business days. This guide explains why quotes vary so much, what to budget for after launch, and how to compare offers side by side.</p>
<h2>The short answer</h2>
<p>There is no single price for "a website", because two quotes for a "5-page business site" can describe very different amounts of work. As a rough map of the market, <a href="https://designbluemanila.com/blogs/how-much-does-a-website-cost-in-the-philippines-an-honest-breakdown">Designblue Manila's 2026 cost breakdown</a> puts freelancer and template work at ₱50,000 to ₱100,000, small agencies at ₱100,000 to ₱250,000, and boutique or enterprise agencies at ₱250,000 to ₱800,000 and up. Their own FAQ mentions templated quotes as low as ₱15,000. Package studios publish lower starting points: <a href="https://www.starfi.sh">Starfish</a>, for example, lists website packages from ₱28,000, ₱45,000 and ₱60,000.</p>
<p>Those are other studios' figures, not ours, and every one of them says "from". The useful question is not "what is the average price?" but "what am I getting for this price, and what will it cost me after launch?"</p>
<h2>What drives the cost of a website</h2>
<p>Almost every quote you get is built from the same six things. Once you can see them, any quote becomes easier to read.</p>
<p><strong>Custom design or a template.</strong> A template is a ready-made layout with your logo and text dropped in. It is fast and cheap, and it looks like thousands of other sites. Custom design means someone designs your pages around your business and your customers. That takes more hours, so it costs more.</p>
<p><strong>Number of pages.</strong> A home page, about page, services page and contact page is a very different job from a 20-page site with a page for every service and branch. More pages means more design, more writing and more testing.</p>
<p><strong>Features.</strong> A contact form is simple. Online booking, an online shop, a member login or a client portal are small software projects of their own. They are usually the biggest jump in price, because they need building, testing and looking after.</p>
<p><strong>Content.</strong> Who writes the text and who takes the photos? If you supply everything, the price stays lower. If the studio writes your copy, sources images or runs a photo shoot, expect that to show up in the quote.</p>
<p><strong>SEO and tracking.</strong> A site that Google can read properly needs page titles, descriptions, a clean structure, fast loading and tools like Google Analytics and Search Console set up. Some quotes include this. Some leave it out and sell it later as a separate service.</p>
<p><strong>Who does the work, and how fast.</strong> A solo freelancer, a small studio and a large agency have very different costs to cover. Timelines matter too: a fixed scope with a short deadline can keep the price down, while open-ended projects with unlimited changes tend to cost more.</p>
<h2>Typical price tiers in the Philippines</h2>
<p>Using the published ranges above, here is what you can usually expect at each level. Treat these as a guide, not a rule. Prices change between cities, studios and years.</p>
<p><strong>Template sites (roughly ₱15,000 to ₱50,000).</strong> A theme with your logo, colours and text. Often built on WordPress or a site builder. Fine for a business that just needs to show up online, less useful if you want the site to bring in enquiries on its own.</p>
<p><strong>Freelancer and small studio work (roughly ₱50,000 to ₱250,000).</strong> More design input, a proper page structure, and usually some SEO set-up. Designblue's FAQ puts a basic five-to-ten page business site at ₱100,000 to ₱250,000.</p>
<p><strong>Agency and custom builds (₱250,000 and up).</strong> Strategy workshops, fully custom design and development, and features like e-commerce, bookings or member areas. Often paired with a monthly support agreement.</p>
<h2>Our prices, for comparison</h2>
<p>We publish our prices so you don't have to guess. These are Fazed Digital's own fixed-price 7-day packages for Philippine businesses:</p>
<p><strong>Starter, ₱19,999.</strong> 5 custom-designed pages, mobile-responsive layout, on-page SEO set-up, a contact form and 2 revision rounds. For new businesses getting online.</p>
<p><strong>Growth, ₱34,999.</strong> 8 custom-designed pages, a custom design system, advanced on-page SEO, a blog and CMS, Google Analytics and Search Console, and 3 revision rounds. For growing small businesses.</p>
<p><strong>Pro, ₱59,999.</strong> 10+ custom pages, full brand integration, performance tuning for loads under 2 seconds, e-commerce ready, priority support and unlimited revisions. For businesses ready to scale.</p>
<p>Every package is custom-designed, not a template, and goes live in 7 business days. The condition: you send everything we need on Day 1 and your feedback within 24 hours at each review. If we miss the date on our side, you get 20% off the project fee. Extra pages are ₱2,500 each. Booking systems, membership portals and custom e-commerce are scoped separately, and you get that price upfront. You can pay by GCash, Maya, bank transfer (BPI or Metrobank) or Wise. See everything included on the <a href="https://www.fazeddigital.com/lp/7-day-website/ph">7-day website packages in pesos</a>.</p>
<p>Why can a fixed package cost less than a typical agency quote? Because the scope is set before we start: a known number of pages, a known number of revision rounds and a 7-day schedule. That works for most small business sites. It is not the right fit for a complex system, and we will tell you if yours needs a custom quote instead.</p>
<h2>Hidden costs to budget for</h2>
<p>The build price is only part of what a website costs you. Ask about each of these before you sign.</p>
<p><strong>Domain name.</strong> Your web address (yourbusiness.com or yourbusiness.ph) is renewed every year. Make sure it is registered in your name, not the developer's. If someone else owns the domain, they effectively own your online address.</p>
<p><strong>Hosting.</strong> Hosting is the server your site lives on, usually paid monthly or yearly. Cheap shared hosting can make a good site slow. Ask which host the studio uses, what it costs to renew, and whose account it sits in.</p>
<p><strong>Maintenance.</strong> Websites need software updates, backups and security checks, especially on WordPress. You can do this yourself, or pay someone to do it. Our care plans start at ₱3,500 a month and cover updates, backups, security monitoring, uptime checks and small content changes. A plan is optional, but skipping maintenance completely is a common way for sites to get hacked or break after an update.</p>
<p><strong>Content changes and extra pages.</strong> Find out what a new page or a text change costs after launch. If you can edit the site yourself through a CMS, small changes cost you nothing but time.</p>
<p><strong>Paid tools and licences.</strong> Premium themes, plugins, booking tools, email accounts and payment gateways can each carry their own fees. A good quote lists them so you are not surprised later.</p>
<h2>How to compare website quotes</h2>
<p>Put your quotes side by side and check each one against these questions. A studio you can trust will answer all of them clearly.</p>
<p><strong>What exactly is included?</strong> Number of pages, features, revision rounds and SEO set-up should be written down. "Complete website" is not a scope.</p>
<p><strong>Is it custom or a template?</strong> Both can be the right choice. Just make sure you know which one you are paying for.</p>
<p><strong>Who owns the site?</strong> The domain, hosting, logins, design files and content should be yours once you have paid. Avoid contracts that lock you in.</p>
<p><strong>How long will it take, and what do you need from me?</strong> A timeline only means something if you know what you must provide, and when.</p>
<p><strong>What happens after launch?</strong> Ask about maintenance, support and the cost of changes. Can your team update the site themselves?</p>
<p><strong>Who does the work?</strong> Will the people you speak to actually design and build your site, or is it passed on to someone else?</p>
<p><strong>How do I pay?</strong> Most studios take a deposit before starting. Ours is 50%, as set out in our terms. Know the payment schedule before work begins.</p>
<p>Not sure your current site is worth rebuilding at all? Book a <a href="https://www.fazeddigital.com/audit">free 15-minute website check</a>. We look at your site with you and point out the 3 fixes that would bring you the most calls and enquiries. No site yet? Book anyway.</p>
<h2>Buying from outside the Philippines?</h2>
<p>If your business is in the USA, Australia or elsewhere, the same packages are priced in US dollars: Starter $499, Growth $899 and Pro $1,499, with extra pages at $79 and care plans from $99 a month. Custom websites and systems are quoted after a discovery call and typically run $5,000 to $20,000, depending on scope. Overseas clients pay by Wise or bank transfer. Most of our case studies are for clients in the USA and Australia, and we work remotely with clear milestones, regular video check-ins and written updates. See the <a href="https://www.fazeddigital.com/lp/7-day-website">7-day website packages in USD</a>.</p>
<h2>Frequently asked questions</h2>
<p><strong>How much is a simple website in the Philippines?</strong> A simple 5-page business site can cost from around ₱15,000 for a template to ₱100,000 or more from an agency, based on published price guides. Our own custom 5-page Starter package is a fixed ₱19,999, live in 7 business days.</p>
<p><strong>Is ₱19,999 the full price?</strong> It is the fixed price for the Starter package as listed. Extra pages are ₱2,500 each, and features like bookings or an online shop are quoted separately before work starts. Maintenance is optional and starts at ₱3,500 a month.</p>
<p><strong>Who owns the website when it is done?</strong> You do. Once it is paid for, the domain, hosting, logins, design files and content are yours. There is no lock-in contract.</p>
<p><strong>Can we meet in person?</strong> Yes, if you are in Iligan City or Cagayan de Oro. We do not have a client office yet, so we meet at your business or somewhere convenient. We are happy to talk in Bisaya, Tagalog or English. Read more about <a href="https://www.fazeddigital.com/web-design-iligan-city">web design in Iligan City</a>.</p>
```

---

## 5. To confirm with the client ([TBC], none of these are printed in the copy)

1. **Domain and hosting fees on 7-day packages:** are the first-year domain and hosting costs inside the ₱19,999 / $499, or billed separately? The guide only says "we connect the domain and set up hosting" (true per `Lp.astro`) and tells readers to ask. If they are included, add one line to the post's hidden-costs section and to the home FAQ.
2. **Deposit on 7-day packages:** `/terms` says 50% for projects in general. The pricing guide says "Ours is 50%, as set out in our terms". Confirm this also applies to the 7-day packages.
3. **"Queensland is 2 hours ahead":** this is a time-zone fact (from strategy.md). Confirm you're happy to say it to Australian buyers, or swap in "Our hours are Mon–Fri 8:30am–5:00pm Philippine time."
4. **Hero length:** check the 35-word home deck at 390px. If it wraps past what the hero allows, use the 29-word fallback in §1.1.
