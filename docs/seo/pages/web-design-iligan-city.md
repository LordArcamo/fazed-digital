---
page: /web-design-iligan-city
copyStatus: draft            # needs owner approval before it ships
author: The Wordsmith (conversion-copywriter), with The Navigator's brief (docs/seo/strategy.md §4.1)
date: 2026-10-19
primaryKeyword: web designer in iligan city
secondaryKeywords: [web design iligan city, website developer iligan, seo iligan, website design lanao del norte]
reader: an Iligan City business owner who runs on Facebook and Messenger and wants customers to find them on Google
promise: a website customers can find on Google, live in 7 business days from ₱19,999, from a studio based in Iligan
primaryCTA: /audit (free 15-minute website check)
secondaryCTA: /lp/7-day-website/ph
sources: src/data/site.ts (NAP, hours) · src/data/proof.ts (prices, caps; no USER-REVISE-LATER stats) · src/data/lp.ts (PH FAQ: payment, in-person, guarantee) · src/data/services.ts · src/data/cases.ts · src/data/team.ts · src/components/Lp.astro (package rows, 7-day process, guarantee wording) · src/pages/audit.astro (what the free check covers)
---

# /web-design-iligan-city: page copy

## Notes for the developer (do not print)

- Everything inside `[TBC …]` and every "Dev note" is for us, not for the page. `scripts/lint-dist.mjs` fails the build on a printed `[TBC`. Lines that depend on a TBC are marked **SHIP ONLY IF CONFIRMED**; leave them out until the owner says yes.
- Pull every price, the phone, email and hours from `src/data` (`prices.php`, `NAP`, `capsCopy`, `lpFaq(true)`), not from this file. If a number here ever disagrees with `src/data`, `src/data` wins.
- Keep one FAQ array for the visible FAQ and the FAQPage JSON-LD (the `lp.ts` pattern), so the two never drift.
- Do NOT show any `proof.ts` stat marked USER-REVISE-LATER (120+, 98%, 4x, 12+, 100% on-time, 7x faster) or `lpTrust` on this page. No reviews, no ratings, no `AggregateRating`.
- Spelling follows the site: British (enquiries, optimised, colour).
- `hreflang`: this page is PH-only. `lang="en"` plus `<link rel="alternate" hreflang="en-PH">` pointing at itself is enough; no USD twin.
- Suggested field formation: `node` (local/one-place feel) or `days7` for the pricing section, as you see fit.

## Voice (5 rules taken from the live site)

1. Short sentences. One idea each. ("No lock-in." "No pressure either way.")
2. Talk to the owner as "you", about their customers, not about us.
3. Two-beat headlines with a dimmed second half ("Small studio. Serious reach.").
4. Concrete over clever: page counts, days, pesos, named cases.
5. Honest edges stated plainly (conditions on the 7-day promise, SEO takes months, these cases aren't from Iligan).

---

## Meta

- **Title (59 chars):** `Web Design in Iligan City: Websites, SEO & Branding | Fazed`
- **Meta description (147 chars):** `Web design, SEO and branding from a studio based in Iligan City. Meet in person, pay by GCash or Maya, and go live in 7 business days from ₱19,999.`
- **Canonical:** `https://www.fazeddigital.com/web-design-iligan-city`
- **OG image alt:** "Fazed Digital: web design in Iligan City, websites from ₱19,999"

---

## Hero

**Eyebrow (mono):** Iligan City · Lanao del Norte · Mon–Fri 8:30am–5:00pm PHT

**H1:** Web design in Iligan City, *from a studio based here.*
(Dimmed half: "from a studio based here.")

**Answer-first opening (57 words):**
Fazed Digital is a web design, branding and SEO studio based in Iligan City, Lanao del Norte. We build fast, mobile-first websites for local businesses, set up so customers can find you on Google. Fixed-price websites start at ₱19,999 and go live in 7 business days. Meet us in person in Iligan, or work with us online.

**Buttons:**
- Primary: `Book my free 15-minute website check →` → `/audit`
- Secondary (ghost): `See peso prices` → `#prices` (on-page anchor)

**Under the buttons (mono, small):** Free · 15 minutes · Google Meet · No obligation

---

## H2: Your customers already search. Make sure they find you.

Most Iligan businesses start on Facebook, and that makes sense: it's where your customers chat, ask about prices and send a message. But when someone types "near me" into Google, or opens Google Maps to find a place to eat, stay or get something fixed, a Facebook page alone often isn't what shows up.

A website fixes that. It gives Google a page it can show, gives customers one place to see your services, prices and hours, and gives you something you own, whatever happens to your feed.

This page is for you if:
- Your enquiries live in Messenger, and some get lost.
- A competitor shows up on Google Maps and you don't.
- You just got your business permit and want to look established from day one.
- Visitors to the city (for the falls, for work, for school) look you up before they arrive, and find nothing they can book or call from.

Dev note: link "Facebook page alone" → `/blog/facebook-page-vs-website`.

---

## H2: What we build for Iligan businesses

### Websites you can update yourself
Custom design, never a template. Built mobile-first, because most people meet your business on a phone. We build in WordPress when your team wants to edit everything, or Astro when speed matters most. When it launches, the domain, hosting, logins and files are yours. No lock-in.
→ `See the 7-day website packages` (`/lp/7-day-website/ph`)

### Local SEO and Google Business Profile
For businesses that serve an area. We fix the technical basics, plan the keywords people in Iligan actually type, optimise each page, and set up your Google Business Profile so you can show on Maps. Setup takes about a month. Results usually show in 6–12 months, depending on your market and competition. Every month you get a plain-English report.
→ `How SEO works with us` (`/services#seo`)

### Brand identity
Logo, colours, type and simple guidelines, so your signage, menu, Facebook page and website all look like the same business. Brand projects typically take 4–6 weeks.
→ `See our brand work` (`/services#brand`)

### Booking systems and custom tools
When a spreadsheet and Messenger can't keep up: bookings, memberships, client portals and admin dashboards built around how your team works. Our system builds have run 8–14 weeks.
→ `Scope a system` (`/services#systems`)

Dev note: four cards, each from `services.ts`. Product design is left off on purpose (one page, one job); it stays on `/services`.

---

## H2: How it works: *in person or online.*

### Meet us in Iligan, or don't
If you're in or near Iligan City, we can meet in person for the kickoff. If you'd rather not, we run it on a video call. Either way, the rest happens online: you review designs and the test site from your phone or laptop.

[TBC-L2: where in-person meetings happen (our place, yours, or a café) and whether there is an office clients can visit. **SHIP ONLY IF CONFIRMED:** one extra sentence, e.g. "We'll come to you, or you can visit us at …"]

### Same hours as you
We work Monday to Friday, 8:30am to 5:00pm Philippine time. Call or text +63 906 825 3451, or email info@fazeddigital.com.

### Your 7 days, step by step
1. **Day 1: Kickoff and brief.** You fill in a short brief and send your logo, photos and references. We confirm goals and the timeline.
2. **Days 2–3: Design.** We design your custom mockups. You send feedback within 24 hours.
3. **Days 4–5: Build.** We build the full site: mobile-first, fast-loading and set up for Google.
4. **Day 6: Review.** You test it on our staging link. We make the final changes.
5. **Day 7: Launch.** Your site goes live. We connect the domain, set up hosting and hand everything over.

**The promise, with its conditions:** we launch in 7 business days as long as we have your content on Day 1 and your feedback within 24 hours at each review. If we miss the deadline on our side, you get 20% off the project fee.

[TBC-L3, **SHIP ONLY IF CONFIRMED:** "We're happy to talk it through in Bisaya, Tagalog or English."]

---

## H2 (id="prices"): Peso prices, *fixed upfront.*

| | **Starter** | **Growth** | **Pro** |
|---|---|---|---|
| Price | ₱19,999 | ₱34,999 | ₱59,999 |
| Best for | New businesses getting online | Growing small businesses | Businesses ready to scale |
| Pages | 5 custom-designed pages | 8 custom-designed pages | 10+ custom pages |
| Included | Mobile-responsive layout · On-page SEO setup · Contact form | Custom design system · Advanced on-page SEO · Blog + CMS setup · Google Analytics + Search Console | Full brand integration · Performance optimised (under 2s load) · E-commerce ready · Priority support |
| Revisions | 2 rounds | 3 rounds | Unlimited |
| Delivery | 7 business days | 7 business days | 7 business days |

- Extra pages: ₱2,500 each.
- Maintenance (updates, backups, security monitoring, uptime checks, small content changes): from ₱3,500/month.
- Booking systems, membership portals and custom online shops are scoped separately, and you get the price upfront.
- Pay by GCash, Maya (PayMaya), bank transfer (BPI or Metrobank) or Wise.
- We take on 15 seven-day builds a month, max.

**Button:** `See the full 7-day package details →` → `/lp/7-day-website/ph`

Dev note: rows mirror `Lp.astro` `plans[].rows` and `prices.php`; import them rather than retyping. Caps line = `capsCopy.sevenDay`.

---

## H2: The same team that built these.

We're based in Iligan, and our work runs businesses in the Philippines, Utah and Queensland. None of the projects below are Iligan businesses, and we won't pretend they are. They're the standard your site gets.

- **Cleen & Green · Philippines · Brand + website.** A premium eco cleaning brand, a WordPress site the team edits themselves, and a franchise section that opened a new growth channel. → `Read the Cleen & Green case` (`/work/02`)
- **8Drive · Philippines · Booking + fleet system.** Bookings, fleet, customers and chauffeurs for a car rental company, moved from manual work into one system. → `Read the 8Drive case` (`/work/06`)
- **A Framing Company · Utah, USA · WordPress website.** A portfolio-led site the contractor now uses to pitch new work. → `Read the A Framing case` (`/work/01`)
- **The Telecom Shop · Australia · E-commerce migration.** Magento to PrestaShop: full catalogue, customers and order history moved with zero data loss. → `Read the Telecom Shop case` (`/work/04`)

**Link under the list:** `See all 8 case studies →` (`/work`)

**Image alt suggestions** (existing files):
- `/images/work-cleen.jpg`: "Cleen & Green website on desktop and phone, green eco cleaning brand"
- `/images/work-8drive.jpg`: "8Drive car rental booking system dashboard"
- `/images/work-aframing.jpg`: "A Framing Company website showing completed framing projects in Utah"
- `/images/work-telecom.jpg`: "The Telecom Shop online store after the move to PrestaShop"

[TBC-L1, **SHIP ONLY IF CONFIRMED:** an Iligan or Lanao del Norte client we may name goes FIRST in this list, with their permission and a link to their live site.]

---

## H2: Not sure what you need? *Start with a free check.*

Book a free 15-minute call on Google Meet. We'll look at your website with you and check three things:
- **Is it easy on a phone?** Can people read it, tap it and find what they came for?
- **Does your contact form actually work?** A broken form loses enquiries quietly.
- **Can Google read your pages?** The titles, descriptions and structure Google uses to decide when to show you.

You leave with the 3 fixes most likely to bring you more calls and enquiries. Make them yourself, or ask us to. No site yet, only a Facebook page? Book anyway, and bring the page link.

**Button:** `Book my free 15-minute website check →` → `/audit`
**Note (mono):** Free · No obligation · Times show in your timezone

---

## H2: Also working with Cagayan de Oro and Northern Mindanao

Cagayan de Oro is an easy day trip from Iligan, and we work with businesses there and across Northern Mindanao. Everything runs online, from the Day 1 brief to launch, with the same peso prices and payment options.

[TBC-L4, **SHIP ONLY IF CONFIRMED:** "We can meet CDO clients in person too." Keep this section to this one paragraph. No CDO address, no CDO client unless real.]

---

## H2: Questions Iligan owners ask us

(Visible FAQ. The FAQPage JSON-LD below uses this exact text.)

**How much does a website cost in Iligan City?**
Our fixed-price websites start at ₱19,999 for 5 pages (Starter), ₱34,999 for 8 pages with a blog (Growth) and ₱59,999 for 10+ pages, e-commerce ready (Pro). Extra pages are ₱2,500 each. Booking systems and custom online shops are quoted separately, with the price upfront.

**How long does it take to build a website?**
7 business days on our fixed-price packages, as long as we have your content on Day 1 and your feedback within 24 hours at each review. If we miss the deadline on our side, you get 20% off. Larger custom websites take 4 weeks for simpler builds and 12+ weeks for complex ones.

**Do I still need a website if my business is on Facebook?**
Keep your Facebook page. It's where many customers message you. A website adds what Facebook can't: pages Google can show when someone searches for what you sell, one place for your services, prices and hours, and a site you own and control. The two work best together.

**Can you help my business show up on Google Maps?**
Yes. Local SEO and Google Business Profile setup are part of our SEO service, for businesses that serve an area. Setup takes about a month, and results usually show in 6–12 months, depending on your market and competition. Every website package also includes on-page SEO setup.

**Can we meet in person?**
If you're in or near Iligan City, yes. Otherwise we run the kickoff on a video call. We work Monday to Friday, 8:30am to 5:00pm Philippine time.

**How do I pay?**
GCash, Maya (PayMaya), bank transfer (BPI or Metrobank) and Wise.

Dev note: in the visible FAQ only, link "Facebook" answer → `/blog/facebook-page-vs-website`, "Google Business Profile" → `/blog/google-business-profile-optimization`, "₱19,999" → `/lp/7-day-website/ph#pricing`. JSON-LD stays plain text.

---

## Closing CTA band

**H2:** Ready when you are. *Start with 15 minutes.*
**Body:** Book a free website check, or go straight to the 7-day packages. Either way, you talk to the people who build your site.
**Primary:** `Book my free 15-minute website check →` → `/audit`
**Secondary:** `See the 7-day website packages (₱)` → `/lp/7-day-website/ph`
**Tertiary (text link):** `Or call +63 906 825 3451 (Mon–Fri, 8:30am–5:00pm)` → `tel:+639068253451`

## NAP block (footer of the page; must match `site.ts` character for character)

Fazed Digital
Iligan City, Lanao del Norte, Philippines
+63 906 825 3451 · info@fazeddigital.com
Mon–Fri 8:30am–5:00pm PHT

Dev note: no street address and no embedded map pin until TBC-L2/L5 are answered. When the Google Business Profile exists, add "Find us on Google Maps" linking to its share URL and add that URL to the org `sameAs`.

---

## JSON-LD (suggested)

Only true facts. The site-wide `ProfessionalService` (`#organization`) already carries NAP, hours and geo, so this page references it instead of repeating it. Generate the FAQ entity from the same array as the visible FAQ.

```json
[
  {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://www.fazeddigital.com/web-design-iligan-city#service",
    "name": "Web design in Iligan City",
    "serviceType": "Website design and development",
    "description": "Custom, mobile-first websites, local SEO and branding for businesses in Iligan City and Lanao del Norte, from a studio based in Iligan City. Fixed-price websites from ₱19,999, live in 7 business days.",
    "url": "https://www.fazeddigital.com/web-design-iligan-city",
    "provider": { "@id": "https://www.fazeddigital.com/#organization" },
    "areaServed": [
      { "@type": "City", "name": "Iligan City" },
      { "@type": "AdministrativeArea", "name": "Lanao del Norte" }
    ],
    "availableChannel": {
      "@type": "ServiceChannel",
      "servicePhone": { "@type": "ContactPoint", "telephone": "+639068253451", "contactType": "sales", "areaServed": "PH" },
      "serviceUrl": "https://www.fazeddigital.com/audit"
    },
    "offers": [
      { "@type": "Offer", "name": "Starter Website Package", "price": "19999", "priceCurrency": "PHP", "description": "5 custom-designed pages, mobile-responsive layout, on-page SEO setup, contact form, 2 revision rounds, 7-day delivery", "url": "https://www.fazeddigital.com/lp/7-day-website/ph", "availability": "https://schema.org/InStock" },
      { "@type": "Offer", "name": "Growth Website Package", "price": "34999", "priceCurrency": "PHP", "description": "8 custom-designed pages, custom design system, advanced on-page SEO, blog + CMS setup, Google Analytics + Search Console, 3 revision rounds, 7-day delivery", "url": "https://www.fazeddigital.com/lp/7-day-website/ph", "availability": "https://schema.org/InStock" },
      { "@type": "Offer", "name": "Pro Website Package", "price": "59999", "priceCurrency": "PHP", "description": "10+ custom pages, full brand integration, performance optimised, e-commerce ready, priority support, unlimited revisions, 7-day delivery", "url": "https://www.fazeddigital.com/lp/7-day-website/ph", "availability": "https://schema.org/InStock" }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "How much does a website cost in Iligan City?", "acceptedAnswer": { "@type": "Answer", "text": "Our fixed-price websites start at ₱19,999 for 5 pages (Starter), ₱34,999 for 8 pages with a blog (Growth) and ₱59,999 for 10+ pages, e-commerce ready (Pro). Extra pages are ₱2,500 each. Booking systems and custom online shops are quoted separately, with the price upfront." } },
      { "@type": "Question", "name": "How long does it take to build a website?", "acceptedAnswer": { "@type": "Answer", "text": "7 business days on our fixed-price packages, as long as we have your content on Day 1 and your feedback within 24 hours at each review. If we miss the deadline on our side, you get 20% off. Larger custom websites take 4 weeks for simpler builds and 12+ weeks for complex ones." } },
      { "@type": "Question", "name": "Do I still need a website if my business is on Facebook?", "acceptedAnswer": { "@type": "Answer", "text": "Keep your Facebook page. It's where many customers message you. A website adds what Facebook can't: pages Google can show when someone searches for what you sell, one place for your services, prices and hours, and a site you own and control. The two work best together." } },
      { "@type": "Question", "name": "Can you help my business show up on Google Maps?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Local SEO and Google Business Profile setup are part of our SEO service, for businesses that serve an area. Setup takes about a month, and results usually show in 6–12 months, depending on your market and competition. Every website package also includes on-page SEO setup." } },
      { "@type": "Question", "name": "Can we meet in person?", "acceptedAnswer": { "@type": "Answer", "text": "If you're in or near Iligan City, yes. Otherwise we run the kickoff on a video call. We work Monday to Friday, 8:30am to 5:00pm Philippine time." } },
      { "@type": "Question", "name": "How do I pay?", "acceptedAnswer": { "@type": "Answer", "text": "GCash, Maya (PayMaya), bank transfer (BPI or Metrobank) and Wise." } }
    ]
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.fazeddigital.com/" },
      { "@type": "ListItem", "position": 2, "name": "Web design in Iligan City", "item": "https://www.fazeddigital.com/web-design-iligan-city" }
    ]
  }
]
```

Dev notes on the schema:
- In code, use `ORG_REF`, `faqPage(faq)` and `crumbs([['Web design in Iligan City', '/web-design-iligan-city']])` from `src/lib/schema.ts`; the block above shows the intended output.
- The Pro offer says "performance optimised" without the "under 2s" figure, to keep a speed number out of structured data.
- Add `{ "@type": "AdministrativeArea", "name": "Northern Mindanao" }` to `areaServed` only if the CDO paragraph ships.
- No `LocalBusiness` duplicate, no `review`, no `aggregateRating`.

---

## Internal links

**From this page (descriptive anchors):**
| Anchor | Target |
|---|---|
| Book my free 15-minute website check | `/audit` |
| See the 7-day website packages (₱) / See peso prices | `/lp/7-day-website/ph` (and `#pricing`) |
| How SEO works with us | `/services#seo` |
| See our brand work | `/services#brand` |
| Scope a system | `/services#systems` |
| Read the Cleen & Green case | `/work/02` |
| Read the 8Drive case | `/work/06` |
| Read the A Framing case | `/work/01` |
| Read the Telecom Shop case | `/work/04` |
| See all 8 case studies | `/work` |
| Facebook page vs website | `/blog/facebook-page-vs-website` |
| Google Business Profile optimisation | `/blog/google-business-profile-optimization` |
| Local SEO guide (optional, in the SEO card) | `/blog/local-seo-small-business-guide` |
| Website prices in the Philippines (optional, under the price table) | `/blog/web-design-pricing-guide` |

**To this page (anchor text = "web design in Iligan City" or "web designer in Iligan City"):**
- Home page: the "Fazed Digital is a small studio in Iligan City, Mindanao…" paragraph (link "Iligan City").
- Footer: "Iligan City" (strategy §5, footer item 3).
- `/lp/7-day-website/ph`: eyebrow "Built in Iligan City" or near the in-person FAQ.
- `/about`: "started in Iligan City in 2022".
- Blog: the 21 Oct "SEO in Iligan City" post and 20 Nov "Business Permit Done in Iligan?" post (calendar swap, strategy §8); add from 2–3 older PH posts (`facebook-page-vs-website`, `local-seo-small-business-guide`) as a separate reviewed change.
- `/contact`: optional line "Based in Iligan? We can meet in person." → this page.

---

## [TBC] Owner must confirm

| # | Question | Affects |
|---|---|---|
| L1 | Any Iligan, Lanao del Norte or Cagayan de Oro client we may name (with permission and a live link)? | Proof section, first slot |
| L2 | In-person meetings: where (our place, the client's, a café)? Is there an office clients can visit? | "Meet us in Iligan" block |
| L3 | Do we work with clients in Bisaya / Tagalog? | One sentence in "How it works" |
| L4 | Will we meet Cagayan de Oro clients in person? | CDO paragraph; whether `/web-design-cagayan-de-oro` gets built |
| L5 | Publish a street address, or list as a service-area business? Confirm postal code 9200. | NAP block, Google Business Profile, org schema |
| L6 | Can Google Business Profile setup be added to a 7-day package, and at what peso price? What does an SEO retainer cost in pesos? | SEO card, Maps FAQ (we could then name a price) |
| L7 | A peso range for custom websites and systems (the only published range is $5,000–$20,000)? | Prices section, cost FAQ |
| L8 | Is the "15 seven-day builds a month" cap still true? | Prices section |
| L9 | A real team or workspace photo taken in Iligan? | Hero or "How it works" (local trust, GBP photos) |
| L10 | Local memberships (chamber of commerce, DICT, university partners) we can mention or link? | Optional trust line, local links |
| L11 | Approve this copy (copyStatus: draft) and the H1. | Whole page |

Not used on purpose: every `proof.ts` stat marked USER-REVISE-LATER, `lpTrust`, testimonials (`LP_REVIEWS_REAL = false`) and any case metric (`CASE_METRICS_REAL = false`).
