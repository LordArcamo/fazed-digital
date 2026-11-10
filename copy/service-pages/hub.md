# /services hub · copy changes for seven services

The Wordsmith · 10 Nov 2026 · copyStatus: draft (H1 approved; everything else draft for owner review)
Current page: `src/pages/services.astro` · Brief: `docs/seo/pages/service-pages.md` §3 · Design: `docs/design/service-pages/directions.md` "Navigation for seven services" + "Owner decisions this raises"

## 1. H1: APPROVED

| | Copy |
|---|---|
| Was (MUST-KEEP until now) | Five services. / One connected brand. |
| **Now (approved)** | **Seven services. / One connected brand.** |

- **Approval:** owner approved "Seven services. One connected brand." on 10 Nov 2026, passed on by the coordinator mid-task. Not a proposal.
- **Builder notes:** `services.astro:37` changes line 1 only; keep the `h-l1` / `h-l2` spans and the gray-400 line 2. Update the README's MUST-KEEP entry to the new H1 in the same change. "Seven services." is one character longer than "Five services.", and the H1 is sized off the pentagon (`services.astro:120`). Re-check the ≥24px clearance from the side vertex labels once the pentagon becomes a heptagon (`SERVICE_IDS`, baked glyphs).

## 2. Meta

| Field | Copy | Chars |
|---|---|---|
| Title (was "Web Design, Branding & SEO Services \| Fazed Digital PH", 53) | Web Design, Branding, SEO, Apps & Automation \| Fazed Digital | 60 |
| Meta (was 140) | Websites, brand identity, SEO, UI/UX, web apps, automations and social media from one studio in the Philippines. 7-day sites from $499. | 135 |

The $499 comes from `prices.usd.starter`.

## 3. Hero

- **Eyebrow** (was "What we do · 05 services · 01 system"): What we do · 07 services · 01 system
- **H1:** Seven services. / One connected brand. (approved)
- **Deck** (was the five-service version at `services.astro:38`):
  Fazed Digital is one team in Iligan City, Philippines, with seven services that fit together: web design, brand identity, SEO and AI search, UI/UX design, custom web apps, automations and social media management. Fixed-price websites start at $499 (₱19,999) and go live in 7 business days. Custom builds take 4–12+ weeks and typically run $5,000–$20,000. Hire us for one piece, or connect the lot.
  (Prices via `prices.usd.starter`, `offerPrice('php','starter')`, `prices.customRange`. 64 words, up from 57; if it's too long for the centred hero, cut "and AI search".)
- **CTAs:** unchanged: Start a project → `/contact` · Get live in 7 days → `/lp/7-day-website`
- **Jump links (heptagon vertices, `.s-jump`):** 01 Web · 02 Brand · 03 SEO · 04 UI/UX · 05 Web apps · 06 Automations · 07 Social. Screen-reader suffix stays ": {chapter h2}". Ids stay `#web #brand #seo #product #systems`; new ids `#automations #social`.

## 4. Chapters: each becomes a summary that hands off

Keep per chapter: `h2`, `outcome`, the first body paragraph, the first 3–4 "What you get" items, one proof line, and a prominent hand-off link. Move the rest to the service pages. Chapter label becomes "Node {n}/07 · {id}".

| # | h2 | outcome | hand-off link (label → href) | CTA |
|---|---|---|---|---|
| 01 | Web design & development | A website that brings in enquiries, not just compliments. | Web design and development in detail → `/services/web-design` | Start a website project |
| 02 | Brand identity | Look as good as you actually are. | Brand identity: process and deliverables → `/services/branding` | Start a brand project |
| 03 | SEO and AI search (was "SEO marketing") | Get found on Google and in AI answers. (was "Get found by people already looking for you.") | How our SEO and AI search service works → `/services/seo` | Ask about SEO |
| 04 | Product design (UI/UX) | Apps and platforms people finish using. | UI/UX and product design in detail → `/services/ui-ux-design` | Start a product project |
| 05 | Custom web apps (was "Custom system development") | Software that fits how your team works. | Custom web apps, booking systems and portals → `/services/web-app-development` | Scope a system |
| 06 | Automations (NEW) | Let your tools do the busywork. | Automations: tools, packages and prices → `/services/automations` | Book a free automation check |
| 07 | Social media management (NEW) | Your pages, handled every week. | Social media plans and what's in them → `/services/social-media-management` | Ask about social media |

### Proof line per chapter (one each)

- **01:** Case 01 · USA · A Framing Company: a WordPress site built around the project portfolio, used in the bidding process. (unchanged, `services.ts:28`)
- **02:** Case 02 · PH · Cleen & Green: a premium eco brand and a WordPress site, plus a franchise section that opened a new growth channel. (unchanged, `services.ts:44`)
- **03:** Our own site · {postCount} practical guides on our blog, plus structured data on every page of this site. We practise what we sell. (replaces the A Framing line, which implies a client SEO result the owner says we can't claim; also fixes the stale "37+"; `services.ts:59`, `posts.json`)
- **04:** Case 03 · USA · CrateOnScene: event discovery designed for four kinds of user, shipped as a PWA in 5 weeks. (unchanged, `services.ts:74`)
- **05:** Case 06 · PH · 8Drive: bookings, fleet, customers and chauffeurs in one rental system. (unchanged, `services.ts:89`)
- **06:** Our own business · Every contact form and site chat lead goes to Gmail and HubSpot automatically. We run on it every day. (owner; `api/contact.ts`, `api/chat-lead.ts`)
- **07:** New service · Founding rate: 20% off the first 3 months for our first 3 clients. (owner, `service-pages.md:547`)

### New chapter copy (06 and 07)

**06 · Automations**
- **Body:** Most small teams lose hours copying details from one app to another. We connect the tools you already pay for, with n8n, Zapier, Make, HubSpot or custom code, so that work runs on its own.
- **What you get:** One workflow, live in 5 business days · Up to 3 connected workflows in a pack · Custom code and AI agents · Monitoring and fixes when a tool changes
- **Good fit if:** Someone copies the same details between apps every week · New leads wait in an inbox · Your tools don't talk to each other
- **Timeline:** A single automation is $299 (₱9,999) and goes live in 5 business days. Start with a free 15-minute check. (prices in the hub copy only if the builder adds them to `proof.ts` first)

**07 · Social media management**
- **Body:** We design your posts, edit short videos from your own photos and footage, write the captions and schedule everything, on every platform you use.
- **What you get:** 12, 20 or 30 posts a month · Short videos on Growth and Pro · Replies to comments and DMs on business days (Growth) · A monthly report
- **Good fit if:** Your last post was weeks ago · Your pages look different every time someone new posts · Messages wait days for a reply
- **Timeline:** Plans from $399 (₱14,999) a month, 3-month minimum, then month to month.

### Changed wording in existing chapters

- **05 body** keeps "…bookings, memberships, portals, dashboards and the automation in between." Add after it: "Need one workflow, not a whole system? See automations." (link `/services/automations`)
- **05 "Do you offer support" overlap:** the systems chapter must not inherit the hub FAQ's "$99/month" line (owner: systems pricing is separate from care plans). See §6.

## 5. Close (`#next`)

- **H2:** unchanged: Pick a node. *We'll connect the rest.*
- **Body, caps, CTAs:** unchanged.
- **Add the seven-service line** above the footer, as on every service page: Web design · Branding · SEO · UI/UX · Web apps · Automations · Social media.

## 6. Hub FAQ (`serviceFaq`)

| Question | Change |
|---|---|
| Do you work with businesses outside the Philippines? | Keep, marked up. |
| How long does a project take? | Keep, marked up. Proposed answer: "Brand identity takes 4–6 weeks. Websites take 4 weeks for simpler builds and 12+ weeks for complex ones, and our system builds have run 8–14 weeks. A single automation goes live in 5 business days. Need a website fast? Our 7-day package has a fixed timeline and price." |
| How much does a website cost? | Keep, marked up. |
| How long does SEO take? | Moves to `/services/seo`. Drop from the hub's `FAQPage` markup (visible text may stay). |
| Will I own my website? | Moves to `/services/web-design`. Drop from hub markup. |
| Which platforms do you build on? | Moves to `/services/web-design`. Drop from hub markup. |
| Do you offer support after launch? | Keep, marked up. Proposed answer: "Yes. Website care plans start at $99/month (₱3,500 in the Philippines). Custom web apps get support scoped and priced with the build, and SEO retainers are available for continued growth." |
| **New:** Can we hire you for just one service? | "Yes. Hire us for one piece, or connect the lot. Most projects start with one service, and the rest are there when you need them." (from the deck; second sentence is new copy, no fact) |

FAQ eyebrow count updates automatically (`FAQ · 06`).

## 7. Schema and other hub-level changes (for the builder)

- `ItemList` (`services.astro:16`): seven `Service` items; each `url` and `@id` point at the service page (`${url}#service`), not `/services#id`. Description = the outcome line.
- Hero formation: `pentagon` → heptagon; the hero poster SVG (`services.astro:31`) draws 5 vertices and needs 7.
- Menu hint in `Header.astro`: "05 SERVICES · 01 SYSTEM" → "07 SERVICES · 01 SYSTEM".
- Footer Services column: seven links, labels Web design · Branding · SEO · UI/UX · Web apps · Automations · Social media.
- `ContactForm.astro:6`: add `['automations', 'Automations']` and `['social', 'Social media management']`; rename `['product', 'Product design']` → `'UI/UX and product design'` (id unchanged).
- `knowledge.ts`: the two new services' prices go in `marketKnowledge()` only, never the shared block.

## 8. Facts and sources

| Fact | Source |
|---|---|
| Current H1, eyebrow, deck, CTAs, end section | `src/pages/services.astro:36–41`, `:84–95` |
| New H1 approved | owner, relayed by the coordinator, 10 Nov 2026 |
| Seven services and their slugs | task brief; `docs/design/service-pages/assets/data.js` nav |
| Prices in deck | `src/data/proof.ts:37–39`; `src/data/offers.ts:16–18` |
| Chapter h2s, outcomes, proof lines | `src/data/services.ts:19`, `:37`, `:50`, `:66`, `:81`, `:28`, `:44`, `:59`, `:74`, `:89` |
| Automations and social facts | `docs/seo/pages/service-pages.md:528–547` |
| No client SEO results | `docs/seo/pages/service-pages.md:525` |
| Systems not on care plans | `docs/seo/pages/service-pages.md:527` |
| FAQ moves and one-markup rule | `docs/seo/pages/service-pages.md:420` |
| Hub FAQ strings | `src/data/services.ts:99–107` |

## 9. TBC

- [TBC] Chapter 03 h2 "SEO and AI search" and outcome "Get found on Google and in AI answers." replace the live "SEO marketing" / "Get found by people already looking for you." Owner approves, or keep the old pair on the hub and use the new pair only on `/services/seo`.
- [TBC] Chapter 05 h2 "Custom web apps" replaces "Custom system development".
- [TBC] Whether the hub shows automation and social prices in chapters 06 and 07 (needs them in `proof.ts` first).
