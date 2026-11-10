# /services/ui-ux-design · page copy

The Wordsmith · 10 Nov 2026 · copyStatus: draft · data id `product` · Service 04 / 07 · template: Direction C "Runtime"
Brief: `docs/seo/pages/service-pages.md` §2.4 + owner decision "UI/UX design: design-only work is offered" (`service-pages.md:526`)

**Honesty rule for this page:** every case below was design **and** build. The copy never presents them as design-only engagements. Design-only is offered (owner), but there is no design-only case, price or typical timeline yet.

## 1. Meta

| Field | Copy | Chars |
|---|---|---|
| Title | UI/UX Design Services for Apps, Portals & MVPs \| Fazed | 54 |
| Meta description | Research, flows, wireframes and Figma UI for apps, portals and MVPs, with a design system and developer-ready handoff. Design only, or design and build. | 152 |
| Primary keyword | ui ux design agency | |
| Secondary | ui ux design services · ui ux design philippines · mvp design · product design for startups | |

## 2. Hero

- **Crumbs:** Home / Services / UI/UX design
- **Eyebrow:** Service 04 / 07 · Product design (UI/UX)
- **H1 line 1:** UI/UX and product design.
- **H1 line 2 (gray-400):** Apps and platforms people finish using.
- **Intro (52 words):**
  Fazed Digital designs apps, portals and platforms: user research and information architecture first, then wireframes, prototypes and high-fidelity UI in Figma, with a design system and a developer-ready handoff. Hire us for the design only, or for design and build. CrateOnScene went from idea to a live web app in 5 weeks.
- **CTA primary:** Start a product project → `/contact?service=product`
- **CTA secondary (ghost):** See real build times → `#proof`

### Meter

| Slot | Value |
|---|---|
| label | Idea to live MVP in |
| number | 5 |
| unit | wks |
| tail | CrateOnScene · design + build |

### Ruler

- **unit:** weeks · **span:** 14 · ticks W0 … 14
- **band:** none (no typical design-only range yet) [TBC-7]
- **fast marker:** none
- **bars** (all design + build; the label says so):

| case | label | weeks | source |
|---|---|---|---|
| 03 | 03 CrateOnScene · design + build · 5 wks | 5 | `src/data/cases.ts:50` |
| 06 | 06 8Drive · design + build · 10 wks | 10 | `src/data/cases.ts:82` |
| 07 | 07 UGLQ · design + build · 12 wks | 12 | `src/data/cases.ts:98` |
| 08 | 08 QLD Law Group · design + build · 14 wks | 14 | `src/data/cases.ts:114` |

- **Unit label override:** "weeks, design + build →"
- **aria-label:** "Our app and platform projects, designed and built by us, by length: CrateOnScene 5 weeks, 8Drive 10 weeks, UGLQ 12 weeks, QLD Law Group 14 weeks."
- **Bar texture note:** UGLQ's screen is light; invert it as the mock does (`INV['07']`). 8Drive is a private system; its texture is a core sample, never a readable screen.

## 3. What you get · who it's for

- **Eyebrow:** What you get · who it's for
- **H2:** Research first. *Polish second.*
- **Lead:** A feature nobody can find is a feature nobody uses. We design the flows, screens and system behind your app or platform: research and structure first, polished UI second.
- **"In every project"** (list, one line each):
  - **User research and interviews.** We talk to the people who'll use it before we draw anything.
  - **Information architecture.** What goes where, and what each kind of user sees.
  - **Wireframes and prototypes.** Clickable flows you can test before a line of code.
  - **High-fidelity UI design in Figma.** Every screen, every state.
  - **Design system creation.** Components and rules, so new screens match the old ones.
  - **Developer-ready handoff.** Files your developers can build from without guessing.
- **"Good fit if"**:
  - You're turning an idea into an MVP
  - Your platform works but confuses people
  - Your dev team needs designs they can build from without guessing

## 4. Design only, or design and build

- **Eyebrow:** Two ways in
- **H2:** We can build it. *Or hand it over.*
- **Body:** You get developer-ready files and a design system whether we build it or your own team does. Hire us for the design only and your developers get Figma files, the design system and a handoff they can build from. Or hire us for both, as CrateOnScene, 8Drive, UGLQ and QLD Law Group did. → Custom web apps and portals `/services/web-app-development`

## 5. Proof · real runs, shortest first

- **Eyebrow:** Proof · 04 design-and-build runs, shortest first
- **H2:** Real projects. *Real weeks.*

| big | small line | strip | client | headline | Before | After | link | caption |
|---|---|---|---|---|---|---|---|---|
| 05 | weeks · MVP platform (PWA) | Case 03 / 09 · Automotive events · USA · 2024 | CrateOnScene | Idea to live platform in 5 weeks. | An idea for one hub where drivers, spectators, businesses and organisers find each other. It had to feel polished from day one, not like a prototype. | A tight first release (event discovery, driver profiles, business listings, organiser tools) with a car-culture UI and browsing by event type, date and location. Shipped as an installable PWA. | Read the CrateOnScene case → `/work/03` | crateonscene.com · Week 5 of 14 |
| 10 | weeks · Booking + fleet system | Case 06 / 09 · Car rental · Philippines · 2024 | 8Drive | Screens for staff who use it all day. | Bookings, fleet, customer records and chauffeur scheduling were mostly manual. | One system for the whole rental workflow, with every screen designed for speed in a premium dark UI that matches the brand. | Read the 8Drive case → `/work/06` | Private staff system · no public link · Week 10 of 14 |
| 12 | weeks · Membership portal | Case 07 / 09 · Non-profit · Queensland, AU · 2024 | UGLQ | Three roles. Each sees only what's relevant. | Member records, communications and lodge admin lived in disconnected legacy systems. | One role-based portal: Grand Lodge administrators, lodge secretaries and members each see only what's relevant to them, in a design that reflects the organisation's heritage. | Read the UGLQ case → `/work/07` | connect.uglq.org.au · Week 12 of 14 |
| 14 | weeks · Website + web app + mobile app | Case 08 / 09 · Legal · Queensland, AU · 2025 | QLD Law Group | A portal designed around the client. | The firm needed a website, a client portal and a mobile app that felt like one product. | A clear, secure, accessible client experience across all three, with the firm's red palette carried through every screen. | Read the QLD Law Group case → `/work/08` | qldlawgroup.com.au · Week 14 of 14 |

## 6. Scoping an MVP tightly

- **Eyebrow:** MVPs
- **H2:** Fast comes from *what you leave out.*
- **Body:** CrateOnScene went from scoping to launch in 5 weeks. The speed came from a tight scope: event discovery, driver profiles, business listings and organiser tools, and nothing else in the first release. A progressive web app made sense: people add it to their home screen with no app store in the way, and one build serves phones and desktops.

## 7. Designing for several kinds of user

- **Eyebrow:** Roles
- **H2:** One platform, *many kinds of user.*
- **Rows:**
  - **CrateOnScene:** drivers, spectators, businesses and organisers, at once. → `/work/03`
  - **UGLQ Connect:** Grand Lodge administrators, lodge secretaries and members, each seeing only what's relevant. → `/work/07`
  - **QLD Law Group:** a portal designed around the client: clear, secure and accessible. → `/work/08`
  - **8Drive:** screens for staff who use the system all day. → `/work/06`

## 8. Process and price

- **Eyebrow:** Process and timeline
- **H2:** Same five steps. *The length changes.*
- **Steps:**
  1. **Short call.** What the product must do, who uses it and what exists today.
  2. **Research.** Interviews with the people who'll use it.
  3. **Structure.** Information architecture, flows, wireframes and a prototype.
  4. **UI.** High-fidelity screens in Figma and the design system behind them.
  5. **Handoff.** Developer-ready files for your team, or we build it.
- **Timeline line:** Our design-and-build projects have run 5–14 weeks: CrateOnScene 5, 8Drive 10, UGLQ 12, QLD Law Group 14. [TBC-7: typical design-only timeline]
- **Price line:** one range bar over weeks 5–14, label "Design + build", value "typically $5,000–$20,000". No design-only marker until it has a price.
- **Price sub:** Design-and-build projects like CrateOnScene typically fall in our $5,000–$20,000 range. Design-only projects are quoted once we know the scope. [TBC-7] We take on 3 custom projects a month.

## 9. FAQ (5)

- **Eyebrow:** FAQ · 05 · **H2:** Questions about UI/UX design

1. **Can you only design it, without building it?** Yes. You get high-fidelity UI in Figma, a design system and a developer-ready handoff, so your own developers can build without guessing. If you'd rather we build it too, we do that as well.
2. **What do we get at handoff?** High-fidelity UI in Figma, a design system and a developer-ready handoff, so your developers can build without guessing.
3. **How long does an MVP take?** CrateOnScene took 5 weeks from scoping to launch, design and build together. The speed came from a tight scope: event discovery, driver profiles, business listings and organiser tools, and nothing else in the first release.
4. **Should an MVP be a PWA or a native app?** For CrateOnScene a progressive web app made sense: people add it to their home screen with no app store in the way, and one build serves phones and desktops. A native app suits products that need deeper device features.
5. **Can one platform serve several kinds of user?** Yes. CrateOnScene serves drivers, spectators, businesses and organisers at once, and UGLQ Connect gives Grand Lodge administrators, lodge secretaries and members access by role, each seeing only what is relevant.

## 10. Read before your call

| slug | title | category · date | read |
|---|---|---|---|
| ux-mistakes-killing-conversions | 7 UX Mistakes That Are Quietly Killing Your Conversion Rate | Design · 05 Mar 2025 | 5 min |
| website-navigation-design | Website Navigation Design: How to Structure Your Menu So Visitors Never Get Lost | Design · 11 Oct 2026 | 4 min |
| visual-hierarchy-web-design | Visual Hierarchy in Web Design: How to Guide Visitors to the Action That Matters | Design · 05 Oct 2026 | 4 min |
| website-accessibility-guide | Website Accessibility for Small Businesses: What It Is, Why It Matters, and How to Start | Development · 07 Oct 2026 | 5 min |

Content gap: no post on MVP or app design yet.

## 11. Close

- **Eyebrow:** Ready when you are
- **H2:** Week 0 *starts here.*
- **Body:** Send a short brief. We'll reply within one business day with questions, a rough scope and next steps.
- **Caps:** We take on 3 custom projects a month.
- **CTA primary:** Start a product project → `/contact?service=product`
- **CTA ghost:** Next: Custom web apps → `/services/web-app-development`
- **Also line:** Exploring what's possible? Immersive 3D concept sites in the Fazed Lab → `/lab`
- **Seven-service line** (current lit).

## 12. JSON-LD notes

- `Service`: `@id` `…/services/ui-ux-design#service`, name "Product design (UI/UX)", serviceType "UX and UI design", `provider: ORG_REF`, `areaServed` PH, US, AU.
- No `Offer`.
- `FAQPage` from section 9. `BreadcrumbList` Home › Services › Product design (UI/UX).

## 13. Price tokens

| Printed | Variable |
|---|---|
| $5,000–$20,000 | `prices.customRange` |
| caps | `capsCopy.custom` |

## 14. Facts and sources

| Fact | Source |
|---|---|
| "A feature nobody can find…", research and structure first | `src/data/services.ts:68` |
| Developer-ready files and design system whether we build or your team does | `src/data/services.ts:69` |
| Deliverables list | `src/data/services.ts:71` |
| Good fit if | `src/data/services.ts:72` |
| Design-only offered | `docs/seo/pages/service-pages.md:526` (owner, 10 Nov 2026) |
| CrateOnScene: 5 weeks, PWA, four user types, tight scope, car-culture UI, browse by type/date/location | `src/data/cases.ts:44–51`, `:199–207`; `src/data/case-seo.ts:53–55` |
| CrateOnScene typical range | `src/data/case-seo.ts:53` |
| 8Drive: 10 weeks, manual before, screens designed for speed, premium dark UI, no public link | `src/data/cases.ts:76–83`, `:235–243`; `src/data/case-seo.ts:114` |
| UGLQ: 12 weeks, three roles, heritage design | `src/data/cases.ts:92–99`, `:247–255`; `src/data/case-seo.ts:133` |
| QLD Law Group: 14 weeks, designed around the client, red palette | `src/data/cases.ts:108–115`, `:259–267` |
| All four list Product design in `servicesUsed` | `src/data/cases.ts:206`, `:242`, `:254`, `:266` |
| Caps | `src/data/proof.ts:46` |
| Lab link line | `src/data/links.ts:191` |

## 15. TBC

- [TBC-7] Design-only price (or confirm "quoted once we know the scope") and typical design-only timeline. With a timeline, the ruler gets a design-only band.
- [TBC] 2–3 images of real flows, wireframes or Figma screens from a case, with permission. The page currently shows only finished screens.
- [TBC] 8Drive: is a screenshot of the private system OK to show on this page? The work page shows one today (`public/images/work-*.jpg`); confirm permission covers this page. Caption avoids "shown with permission" until confirmed.
- [TBC-8] Slug `/services/ui-ux-design` approved (the task brief lists it; brief §6 still marks it open).
- [TBC] H1 line 1 "UI/UX and product design." keeps the site's "Product design" name and the search phrase. Owner picks this or "UI/UX design."
