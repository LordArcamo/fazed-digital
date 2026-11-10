# /services/automations · page copy (NEW)

The Wordsmith · 10 Nov 2026 · copyStatus: draft · data id `automations` (proposed; the mock used `auto`) · Service 06 / 07 · template: Direction C "Runtime" (months)
Source of every offer fact: owner decisions in `docs/seo/pages/service-pages.md:528–538` (10 Nov 2026). These prices are **not in `proof.ts` yet**; they must be added there before build so the page, the chat and /services quote the same numbers.

**Honesty rule for this page:** there are no client automation projects yet. The only proof is our own business: the contact form and the site chat send every lead to Gmail and HubSpot automatically. Always say "we run this on our own business", never "client work". No result numbers.

## 1. Meta

| Field | Copy | Chars |
|---|---|---|
| Title | Business Automation Services: n8n, Zapier & Make \| Fazed | 56 |
| Meta description | We automate repeat work with n8n, Zapier, Make, HubSpot or custom code. One workflow from $299, live in 5 business days. Start with a free 15-minute check. | 155 |
| Primary keyword | business process automation services | |
| Secondary | workflow automation for small business · n8n automation · zapier automation services · make.com automation · hubspot automation | |

Keywords are the Wordsmith's proposal; the Navigator has not SERP-checked this page [TBC]. Do not use "Zapier expert", "certified" or "partner" (no such status exists).

## 2. Hero

- **Crumbs:** Home / Services / Automations
- **Eyebrow:** Service 06 / 07 · Automations
- **H1 line 1:** Business automations.
- **H1 line 2 (gray-400):** Let your tools do the busywork.
- **Intro (57 words):**
  Fazed Digital automates the repeat work in your business with n8n, Zapier, Make, HubSpot or custom code. Leads, follow-ups, reports, handoffs between apps: if your team does it the same way every time, we can automate it. A single automation is $299 (₱9,999) and goes live in 5 business days. Start with a free 15-minute automation check.
- **CTA primary:** Book a free 15-minute automation check → `/contact?service=automations`
- **CTA secondary (ghost):** See the packages → `#price`

### Meter

| Slot | Value |
|---|---|
| label | Live in |
| number | 5 |
| unit | business days |
| tail | from $299 · ₱9,999 |

### Ruler (months)

- **unit:** months · **span:** 12 · ticks M0 … 12
- **fast marker:** at 5 business days (≈ 0.25 month), label "Single automation · live in 5 business days"
- **fix windows (short lime segments after go-live):** "14 days of fixes" (Single), "30 days of fixes" (Pack)
- **band:** months 1–12, label "Automation care · $99/month · monitoring and fixes when a tool changes"
- **bars:** only our own business, until there is client proof.

| case | label | months | source |
|---|---|---|---|
| own | Our own lead flow · form + chat → Gmail + HubSpot · running since Oct 2026 | computed at build from the start date (1 in Nov 2026) | owner (task brief); start date from `git log`: `src/lib/mail.ts` first commit 2026-10-18 (Gmail alerts), `src/pages/api/chat-lead.ts` 2026-11-05 (chat) [TBC: owner confirms the start month] |

- **aria-label:** "How an automation runs: a single automation goes live in 5 business days, with 14 days of fixes, and optional monthly care after that. Our own lead flow has run on automation since October 2026."
- **If the start date is not confirmed:** drop the bar; keep the marker, fix windows and care band. Never plot a placeholder.

## 3. What we automate · who it's for

- **Eyebrow:** What we automate · who it's for
- **H2:** If it's the same every time, *it can run itself.*
- **Lead:** Most small teams lose hours to copying details from one app to another: a new lead into the CRM, a booking into the calendar, an order into a spreadsheet. We connect the tools you already pay for so that work happens on its own, the same way, every time.
- **"What we work with"**:
  - **n8n.** Flexible workflows, including ones that run on your own server.
  - **Zapier.** Quick links between thousands of everyday apps.
  - **Make.** Visual, multi-step scenarios.
  - **HubSpot.** Lead capture, contact records and follow-ups inside your CRM.
  - **Custom code.** For systems with no ready-made link, and for AI agents.
- **Line under the list:** We pick the tool that fits what you already use, not the one we like best.
- **"Good fit if"**:
  - Someone on your team copies the same details between apps every week
  - New leads wait in an inbox before anyone follows up
  - You pay for tools that don't talk to each other

[TBC: the one-line tool descriptions are general descriptions of the tools, not claims about past work. Owner to confirm the n8n self-hosting line is something we offer.]

## 4. We run this on our own business (replaces the case chapters)

- **Eyebrow:** Proof · our own business
- **H2:** No client automations to show yet. *Here's ours.*
- **Body:** When you fill in our contact form or leave your details in our site chat, nobody copies them anywhere. The lead lands in our Gmail inbox and in HubSpot at the same moment, and a chat lead arrives with a summary and the conversation attached. If one channel fails, the others still get the lead. We built it, and we run on it every day.
- **Small print (mono):** Our own business, not a client project.
- **Optional diagram (DOM text, field-drawn):** Contact form / Site chat → Gmail (team alert) + HubSpot (contact record)
- No sticky week meter on this page.

## 5. Packages

- **Eyebrow:** Price, on the same line
- **H2:** Five ways in. *One is free.* (`id="price"`)

| Package | Price | What you get |
|---|---|---|
| **Free automation check** | Free | A 15-minute call. We look at how work moves through your business and name what's worth automating first. |
| **Single automation** | $299 · ₱9,999 | One workflow, live in 5 business days, with 14 days of fixes. |
| **Automation pack** | $899 · ₱29,999 | Up to 3 connected workflows, a walkthrough video and written steps, and 30 days of fixes. |
| **Custom automation** | from $2,500 · quoted in ₱ | Custom code, AI agents, and systems with no ready-made link. |
| **Automation care** | $99/month · ₱3,500/month | Monitoring, and fixes when a tool changes. |

- **Under the table:** Tool subscriptions (Zapier, Make, n8n, HubSpot and the rest) are in your own name and paid by you, so the automations stay yours if we stop working together.
- **Ruler version (desktop):** the five sit on the month line: Free at M0, Single at 5 business days, Pack after it [TBC: Pack timeline], Custom as a point labelled "from $2,500", Care as the band from month 1.

## 6. Founding rate

- **Eyebrow:** Founding clients
- **H2:** 20% off *for our first 3 clients.*
- **Body:** Automations is our newest service, so the first 3 automation clients get 20% off. Nothing is asked in return.
- **Small print:** Founding rate for the first 3 automation clients only. [TBC: compliance note in section 15]

## 7. You own it

- **Eyebrow:** Ownership
- **H2:** Your accounts. *Your automations.*
- **Body:** We build inside your own accounts, and every tool subscription is in your name. Packs come with a walkthrough video and written steps, so your team knows what runs, when and why.

## 8. Process

- **Eyebrow:** Process and timeline
- **H2:** Same five steps. *Measured in days.*
- **Steps:**
  1. **Free check.** A 15-minute call about how work moves through your business.
  2. **Scope and price.** Which workflow, which tools, and the fixed price, before we start.
  3. **Build.** In your own accounts, with your tool subscriptions in your name.
  4. **Live.** A single automation goes live in 5 business days.
  5. **Fixes, then care.** 14 days of fixes (30 on a pack), then optional monthly care.
- **Timeline line:** A single automation goes live in 5 business days. Packs and custom work are timed when we scope them. [TBC: Pack and Custom timelines]

## 9. FAQ (6)

- **Eyebrow:** FAQ · 06 · **H2:** Questions about automations

1. **Which tools do you use?** n8n, Zapier, Make, HubSpot and custom code. We pick what fits the tools you already use. If two apps have no ready-made link, we write the code that connects them.
2. **What can you automate?** Any process your team repeats the same way: moving leads into a CRM, follow-up emails, reports, bookings, handoffs between apps. If you're not sure, the free 15-minute check is for exactly that.
3. **How much does it cost?** A single automation is $299 (₱9,999) and goes live in 5 business days. A pack of up to 3 connected workflows is $899 (₱29,999). Custom work with code or AI agents starts at $2,500. Care is $99 a month.
4. **Who pays for the tools?** You do, directly. Every tool subscription is in your own name, so the automations stay yours.
5. **What happens when one of the apps changes?** Every automation comes with a fixes window: 14 days for a single automation, 30 days for a pack. After that, automation care at $99 a month covers monitoring and fixes when a tool changes.
6. **Have you done this for other businesses?** Not as a paid service yet. Automations is our newest service. We run our own lead flow on it: every contact form and chat lead goes to Gmail and HubSpot automatically. Our first 3 automation clients get 20% off.

## 10. Read before your call

| slug | title | category · date | read |
|---|---|---|---|
| online-booking-system-philippines | Online Booking System in the Philippines: Build or Buy? | Development · 03 Nov 2026 | 4 min |
| contact-page-design | Contact Page Design: How to Build a Page That Converts Visitors Into Enquiries | Design · 16 Oct 2026 | 4 min |
| get-more-google-reviews | How to Get More Google Reviews: A Practical Guide for Small Business Owners | Strategy · 18 Oct 2026 | 5 min |
| website-maintenance-guide | Website Maintenance for Small Businesses: What It Costs and Why Skipping It Is Expensive | Development · 13 Aug 2026 | 5 min |

Content gap: no post on automation yet. These four are the closest real posts (form follow-up, review links sent automatically, forms that silently stop sending). Suggest an automation post for the content calendar, e.g. "Zapier vs Make vs n8n for a small business".

## 11. Close

- **Eyebrow:** Ready when you are
- **H2:** Day 1 *starts here.*
- **Body:** Book a free 15-minute check, or send a short brief. We'll reply within one business day with questions, a rough scope and next steps.
- **CTA primary:** Book a free 15-minute automation check → `/contact?service=automations`
- **CTA ghost:** Next: Social media management → `/services/social-media-management`
- **Also line:** Need a whole system, not one workflow? → Custom web apps and portals `/services/web-app-development`
- **Seven-service line** (current lit).
- No caps line (the caps in `proof.ts` cover 7-day builds and custom projects; there is no automation cap) [TBC].

## 12. JSON-LD notes

- `Service`: `@id` `…/services/automations#service`, name "Business automations", serviceType "Business process automation", description = intro, `provider: ORG_REF`, `areaServed` PH, US, AU.
- `hasOfferCatalog` with `Offer`s: Free automation check (price 0), Single automation 299 USD, Automation pack 899 USD, Automation care 99 USD with `priceSpecification` `UnitPriceSpecification` (`unitCode` MON). No Offer for Custom ("from" is not a price).
- `FAQPage` from section 9. `BreadcrumbList` Home › Services › Automations.

## 13. Price tokens (add to `proof.ts` first)

| Printed | Proposed variable |
|---|---|
| $299 / ₱9,999 | `automation.usd.single` / `automation.php.single` |
| $899 / ₱29,999 | `automation.usd.pack` / `automation.php.pack` |
| from $2,500 / quoted | `automation.usd.customFrom` / `automation.php.custom = 'quoted'` |
| $99/month / ₱3,500/month | reuse `prices.usd.care` / `prices.php.care` only if the owner wants them tied; otherwise `automation.*.care` (same values today) |
| 20% / 3 clients | `FOUNDING_AUTOMATION = { on: true, off: 20, spots: 3 }` in `offers.ts` |

Keep prices out of the chat's shared knowledge block (`scripts/lint-chat.mjs`).

## 14. Facts and sources

| Fact | Source |
|---|---|
| Tools: n8n, Zapier, Make, HubSpot, custom code; any business process; no clients yet | `docs/seo/pages/service-pages.md:528` (owner, 10 Nov 2026) |
| Free check = a 15-minute call booked through /contact?service=automations (not /audit, which is a website check) | `service-pages.md:532` |
| Single $299 / ₱9,999, one workflow, 5 business days, 14 days of fixes | `service-pages.md:533` |
| Pack $899 / ₱29,999, up to 3 connected workflows, walkthrough video + written steps, 30 days of fixes | `service-pages.md:534` |
| Custom from $2,500, quoted in ₱, custom code, AI agents, no ready-made link | `service-pages.md:535` |
| Care $99/month / ₱3,500/month, monitoring and fixes when a tool changes | `service-pages.md:536` |
| Founding rate 20% off first 3, nothing asked in return (offers.ts:6 rule); tools in client's name | `service-pages.md:538` |
| Contact form → Gmail + HubSpot | `src/pages/api/contact.ts:5`, `:69`; `src/lib/hubspot.ts:1–2` |
| Chat lead → Gmail + CRM + HubSpot, all at once; one channel failing never loses the lead; transcript sent | `src/pages/api/chat-lead.ts:5–6`, `:11–12`, `:15` |
| Lead flow running since Oct 2026 | `git log`: `src/lib/mail.ts` 2026-10-18 [TBC] |
| Reply within one business day | `src/pages/services.astro:90` |
| Posts | `src/data/.generated/posts.json` |

## 15. TBC

- RESOLVED 10 Nov: the CTA goes to `/contact?service=automations` (option c). /audit is unchanged.
- RESOLVED 10 Nov: founding rate asks nothing in return, per the owner's 6 Nov rule in `src/data/offers.ts:6`.
- [TBC] Start month for the "own lead flow" ruler bar.
- [TBC] Pack and Custom timelines.
- [TBC] Contact form option and id for automations (`automations` proposed; `ContactForm.astro:6` has none today).
- [TBC] n8n self-hosting line in section 3.
- [TBC] Keywords: Navigator to SERP-check.
- [TBC] H1 approval.
