# /services/web-app-development · page copy

The Wordsmith · 10 Nov 2026 · copyStatus: draft · data id `systems` · Service 05 / 07 · template: Direction C "Runtime"
Brief: `docs/seo/pages/service-pages.md` §2.5 + owner decision "Web app development: custom pricing, separate from the 7-day packages and care plans" (`service-pages.md:527`)

**Change from the mock:** the mock's systems FAQ says "Monthly maintenance plans start at $99/month". That is wrong for this page. Care plans are for websites; system support is priced with the build.

## 1. Meta

| Field | Copy | Chars |
|---|---|---|
| Title | Custom Web Apps, Booking Systems & Portals \| Fazed Digital | 58 |
| Meta description | Booking systems, membership and client portals, and admin tools built around how your team works. Builds of 8–14 weeks, typically $5,000–$20,000. | 145 |
| Primary keyword | custom web app development | |
| Secondary | custom software development philippines · custom booking system · client portal development · membership website development · web app development company in australia | |

## 2. Hero

- **Crumbs:** Home / Services / Web apps
- **Eyebrow:** Service 05 / 07 · Custom web apps
- **H1 line 1:** Custom web apps and portals.
- **H1 line 2 (gray-400):** Built around how your team works.
- **Intro (59 words):**
  Fazed Digital builds custom web applications for teams that have outgrown spreadsheets and tools that don't talk to each other: booking and fleet systems, membership and client portals, admin dashboards and automation. Access is by role and secure by default. Our system builds have run 8–14 weeks and typically cost $5,000–$20,000. We take on 3 custom projects a month.
- **CTA primary:** Scope a system → `/contact?service=systems`
- **CTA secondary (ghost):** See real build times → `#proof`

### Meter

| Slot | Value |
|---|---|
| label | Our builds |
| number | 8–14 |
| unit | wks |
| tail | typically $5,000–$20,000 |

### Ruler

- **unit:** weeks · **span:** 14 · ticks W0 … 14
- **band:** weeks 8–14, label "Our system builds · 8–14 weeks"
- **fast marker:** none
- **bars:**

| case | label | weeks | source |
|---|---|---|---|
| 05 | 05 Canwell · 8 wks | 8 | `src/data/cases.ts:66` |
| 06 | 06 8Drive · 10 wks | 10 | `src/data/cases.ts:82` |
| 07 | 07 UGLQ · 12 wks | 12 | `src/data/cases.ts:98` |
| 08 | 08 QLD Law Group · 14 wks | 14 | `src/data/cases.ts:114` |
| 03 (optional 5th) | 03 CrateOnScene · MVP · 5 wks | 5 | `src/data/cases.ts:50` (check the 1024 × 768 height before adding) |

- **aria-label:** "Our real system projects by build length: Canwell 8 weeks, 8Drive 10 weeks, UGLQ 12 weeks, QLD Law Group 14 weeks."
- **Texture:** invert Canwell (`05a`) and UGLQ (`07`) as the mock does.

## 3. What you get · who it's for

- **Eyebrow:** What you get · who it's for
- **H2:** Every week of it, *spelled out.*
- **Lead:** Off-the-shelf tools rarely fit. So your team ends up working around spreadsheets, inboxes and three apps that don't talk to each other. We build the one system that replaces them: bookings, memberships, portals, dashboards and the automation in between.
- **"In every build"**:
  - Full-stack web applications
  - Custom API design and integration
  - Business process automation
  - Internal tools and dashboards
  - Database architecture and optimisation
  - Ongoing maintenance and support
- **"Good fit if"**:
  - Your operations run on manual processes and memory
  - You've outgrown a patchwork of legacy tools
  - You need clients or members to self-serve

## 4. What we build, by problem

- **Eyebrow:** By problem
- **H2:** Five systems. *Three countries.*

| Problem | What we built | Case |
|---|---|---|
| Bookings and fleet on paper and memory | One app for bookings, real-time fleet availability, customers, chauffeurs and reporting | 8Drive · Philippines → `/work/06` |
| A network running on disconnected tools | A role-based membership portal for every lodge in the state | UGLQ Connect · Queensland → `/work/07` |
| Clients calling for updates | A client portal plus iOS and Android app: track matters, upload documents, message their lawyer | QLD Law Group · Queensland → `/work/08` |
| A public site and an ops tool, built apart | The public website and a separate admin portal, delivered together | Canwell · Australia → `/work/05` |
| An idea that needs real users, fast | A multi-user MVP shipped as an installable PWA | CrateOnScene · USA → `/work/03` |

- **Under the table:** Need one workflow automated, not a whole system? → Business automations `/services/automations`

## 5. Proof · real runs, shortest first

- **Eyebrow:** Proof · 04 real runs, shortest first
- **H2:** Real projects. *Real weeks.*

| big | small line | strip | client | headline | Before | After | link | caption |
|---|---|---|---|---|---|---|---|---|
| 08 | weeks · Web platform + admin portal | Case 05 / 09 · Health & wellness · Australia · 2024 | Canwell | The public site and its ops tool, built as one. | They needed a public website and a solid admin portal for users, practitioners and content, under one system. | Both launched together. The admin portal replaced manual processes and gave the operations team the tools to scale. | Read the Canwell case → `/work/05` | canwell.com.au · Week 8 of 14 |
| 10 | weeks · Booking + fleet system | Case 06 / 09 · Car rental · Philippines · 2024 | 8Drive | From manual bookings to one system. | Bookings, fleet availability, customer records and chauffeur scheduling were mostly manual, with no central system. | One web app now runs bookings, real-time fleet, customers, chauffeurs and reporting. Bookings got noticeably faster. | Read the 8Drive case → `/work/06` | Private staff system · no public link · Week 10 of 14 |
| 12 | weeks · Membership portal | Case 07 / 09 · Non-profit · Queensland, AU · 2024 | UGLQ | One secure portal for a state-wide network. | Membership records, communications and lodge admin ran on disconnected legacy systems. | One role-based portal for Grand Lodge administrators, lodge secretaries and members. Lodge secretaries report big time savings on admin. | Read the UGLQ case → `/work/07` | connect.uglq.org.au · Week 12 of 14 |
| 14 | weeks · Website + web app + mobile app | Case 08 / 09 · Legal · Queensland, AU · 2025 | QLD Law Group | Three products. One client experience. | They needed a website, a secure client portal and a mobile app: three connected products. | Clients track matters, upload documents and message their lawyer in the portal or the iOS and Android app. | Read the QLD Law Group case → `/work/08` | qldlawgroup.com.au · Week 14 of 14 |

## 6. Build or buy? An honest answer

- **Eyebrow:** Build or buy
- **H2:** Sometimes the answer *is "buy".*
- **Body:** Packaged software suits many organisations. A custom system earns its cost when your structure or workflow is unusual, like UGLQ's network of lodges reporting to one governing body, or 8Drive's chauffeur scheduling alongside bookings and fleet. If your needs are simpler, a well-set-up off-the-shelf tool and a good website will often serve you better for far less. We'll tell you which on the first call. → Online Booking System in the Philippines: Build or Buy? `/blog/online-booking-system-philippines`

## 7. Roles, security, integrations

- **Eyebrow:** Under the hood
- **H2:** Access by role. *Secure by default.*
- **Rows:**
  - **Roles.** Each kind of user sees only what's relevant to them: UGLQ's administrators, secretaries and members; QLD Law Group's clients and lawyers.
  - **APIs and integrations.** Custom API design, and the links between your system and the tools you keep.
  - **Payments.** Payment gateway setup, including GCash, when a booking, ordering or membership platform needs its own checkout.
  - **Built to grow.** Database architecture planned so new features can be added, as with Canwell.

## 8. Process and price

- **Eyebrow:** Process and timeline
- **H2:** Same five steps. *The length changes.*
- **Steps:**
  1. **Short call.** How your team works today, what breaks, and who needs access. You get a rough scope and next steps.
  2. **Direction.** Roles, screens and data agreed before we build, so there are no surprises later.
  3. **Build.** Full-stack web app, APIs and the automation in between.
  4. **Review.** Your team tests it on a staging link and we make the changes.
  5. **Launch and hand over.** Ongoing maintenance and support, so it grows with you.
- **Timeline line:** Our system builds have run 8–14 weeks: Canwell 8, 8Drive 10, UGLQ 12, QLD Law Group 14. CrateOnScene, a tightly scoped MVP, took 5.
- **Price line:** one range bar over weeks 8–14, label "Our system builds · 8–14 weeks", value "$5,000–$20,000".
- **Price sub:** Every system is priced on its own scope (the users, roles and data involved), separate from our 7-day website packages. We quote once the scope is clear. A 50% deposit starts the work. Support after launch is priced with the build, not on our website care plans. We take on 3 custom projects a month.

## 9. After launch

- **Eyebrow:** After launch
- **H2:** It's yours. *We stay on call.*
- **Body:** On full payment, all intellectual property in the final deliverables is assigned to you. Ongoing maintenance and support is part of the service, scoped and priced with your build, and the system is built so it can grow with you.

## 10. Working with Australia, or in the Philippines

- **Australia:** Three of our four Australian cases are systems. We work remotely with clear milestones, regular video check-ins and detailed written updates. → Web design for Australian businesses `/australia`
- **Philippines (`data-market="ph"`):** When a spreadsheet and Messenger can't keep up. → Booking systems for Iligan and CDO businesses `/web-design-iligan-city`

## 11. FAQ (6)

- **Eyebrow:** FAQ · 06 · **H2:** Questions about custom web apps

1. **How much does a custom system cost?** Custom websites and systems typically fall in our $5,000 to $20,000 range, depending on scope: the users, roles and data involved. Systems are priced separately from our 7-day packages, and we quote once the scope is clear.
2. **How long does it take to build?** Our system builds have run 8–14 weeks: Canwell 8, 8Drive 10, UGLQ 12 and QLD Law Group 14. CrateOnScene, a tightly scoped MVP, took 5.
3. **Should we build a custom system or buy software?** Packaged software suits many organisations. A custom system earns its cost when your structure or workflow is unusual, like UGLQ's network of lodges or 8Drive's chauffeur scheduling alongside bookings and fleet.
4. **Can our clients or members serve themselves?** Yes. QLD Law Group's clients track their matter, upload documents and message their lawyer in the portal and the iOS and Android app, and UGLQ members see only what is relevant to their role.
5. **Can you add online payments, including GCash?** Yes. Payment gateway setup is part of our custom systems work when a booking, ordering or membership platform needs its own checkout, not just a plugin.
6. **Do you look after the system after launch?** Yes. Ongoing maintenance and support is part of the service. It's scoped and priced with your build rather than on our website care plans, and the system is built so it can grow with you.

## 12. Read before your call

| slug | title | category · date | read |
|---|---|---|---|
| online-booking-system-philippines | Online Booking System in the Philippines: Build or Buy? | Development · 03 Nov 2026 | 4 min |
| payment-gateway-philippines-gcash | GCash Payments on Your Website: Gateway Options Explained | Development · 31 Oct 2026 | 5 min |
| wordpress-vs-custom-build | WordPress vs Custom Build: Which Is Right for Your Business? | Development · 10 Sep 2026 | 5 min |
| offshore-web-design-australia | Offshore Web Design Australia: Working With a Philippine Studio | Strategy · 22 Oct 2026 | 5 min |

Market swap option (US): `outsource-web-development-philippines` in slot 4.

## 13. Close

- **Eyebrow:** Ready when you are
- **H2:** Week 0 *starts here.*
- **Body:** Send a short brief. We'll reply within one business day with questions, a rough scope and next steps.
- **Caps:** We take on 3 custom projects a month.
- **CTA primary:** Scope a system → `/contact?service=systems`
- **CTA ghost:** Next: Automations → `/services/automations`
- **Seven-service line** (current lit).

## 14. JSON-LD notes

- `Service`: `@id` `…/services/web-app-development#service`, name "Custom web apps and portals", serviceType "Custom web application development", `provider: ORG_REF`, `areaServed` PH, US, AU.
- No `Offer` (the range is "typical").
- Optional `ItemList` of the five cases as `CreativeWork` with `url` `/work/NN`.
- `FAQPage` from section 11. `BreadcrumbList` Home › Services › Custom web apps.

## 15. Price tokens

| Printed | Variable |
|---|---|
| $5,000–$20,000 | `prices.customRange` |
| 3 custom projects | `capsCopy.custom` / `caps.customPerMonth` |

## 16. Facts and sources

| Fact | Source |
|---|---|
| Lead paragraph, "Access by role, secure by default, built to grow" | `src/data/services.ts:83–84` |
| Deliverables list | `src/data/services.ts:86` |
| Good fit if | `src/data/services.ts:87` |
| 8–14 weeks with per-case numbers | `src/data/services.ts:93` |
| Custom range includes systems | `src/data/proof.ts:39` |
| Custom pricing, separate from 7-day packages and care plans | `docs/seo/pages/service-pages.md:527` (owner, 10 Nov 2026) |
| Caps | `src/data/proof.ts:43–46` |
| Canwell: 8 weeks, AU, 2024, public site + admin portal, manual processes removed, ready for future features | `src/data/cases.ts:59–67`, `:223–231`; `src/data/case-seo.ts:92–93` |
| 8Drive: 10 weeks, PH, 2024, manual before, one system, bookings noticeably faster, no public link | `src/data/cases.ts:75–83`, `:235–243`; `src/data/case-seo.ts:114` |
| UGLQ: 12 weeks, QLD, 2024, legacy systems, role-based, secretaries report big time savings | `src/data/cases.ts:91–99`, `:247–255` |
| QLD Law Group: 14 weeks, QLD, 2025, portal + iOS/Android | `src/data/cases.ts:107–115`, `:259–267`; `src/data/case-seo.ts:151` |
| CrateOnScene: 5 weeks, MVP, PWA, USA | `src/data/cases.ts:43–51` |
| Build-or-buy answer | `src/data/case-seo.ts:113`, `:132`; blog `online-booking-system-philippines` |
| GCash payment gateway answer | brief `docs/seo/pages/service-pages.md:358` (from blog `payment-gateway-philippines-gcash` service paragraph) |
| Remote working line | `src/data/services.ts:100` |
| Three of four AU cases are systems (05, 07, 08 vs 04) | `src/data/cases.ts` `CASE_EXTRA` country + discipline |
| IP on full payment; 50% deposit | `src/pages/terms.astro:12`, `:29` |
| "When a spreadsheet and Messenger can't keep up" | `src/pages/web-design-iligan-city.astro:27` |

## 17. TBC

- [TBC-10] Resolved in principle by the owner (system support is not on care plans). Still open: is there a standard monthly support price for systems, or is it always quoted?
- [TBC-11] Stack names for Canwell, 8Drive, UGLQ and QLD Law Group, if the owner wants them named. The page names none.
- [TBC] Is the 8Drive screenshot OK to show here (private system)? Caption avoids "shown with permission" until confirmed.
- [TBC-8] Slug `/services/web-app-development` approved.
