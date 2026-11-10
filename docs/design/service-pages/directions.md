# Service page template: three directions

One template for seven service pages (`/services/web-design`, `/branding`, `/seo`, `/ui-ux-design`, `/web-app-development`, `/automations`, `/social-media-management`). The mocks use real copy for two services: web design and custom web apps (systems). The H1s and answer-first intros come from `docs/seo/pages/service-pages.md` §2.1 and §2.5. Everything else comes from `services.ts`, `cases.ts` and `proof.ts`. Automations and Social media management have no copy yet, so they appear only in the nav and the footer.

Mocks: `direction-{A,B,C}/index.html`. Add `?s=systems` for the second service, `?menu=1` for the nav proposal, `?state=fix` (B only) for the after state and `?still` for reduced motion. They open from `file://`. Fonts load from `public/fonts` by relative path. The dot field is a 2D-canvas stand-in for the GPU field: same formations, morphs and anchoring, at lower fidelity. Case screens are drawn from luma grids baked from `public/images/work-*.jpg` (`assets/shots.js`), the same idea as `public/formations/*.bin`.

Boards (`boards/`): `{A,B,C}-1440.jpg`, `{A,B,C}-390.jpg` (web design), `{A,B,C}-systems-{1440,390}.jpg`, `B-1440-fix.jpg`, `B-systems-1440-fix.jpg`, `C-menu-1440.jpg`, `C-menu-390.jpg`.

All three directions share the following:
- Page order from the brief: answer-first hero, what you get, who it's for, 2–4 cases, process and timeline, price where `proof.ts` has one, FAQ, related posts, closing CTA, next service.
- The existing header rail and dock, with Services lit. The footer's Services column grows to seven, and the current page is lit.
- Two-line H1 rhythm, white then gray-400. The H1 is real HTML. Formations are an enhancement; every label the field "draws" is DOM text.
- No new pre-3D JS. The section beats are `data-f` formations driven by `controller.ts` in the GL chunk. The before/after switch in B is the only interactive piece, and it is a plain button that works without the field.

---

## A · Resolve

**Idea.** The service glyph resolves, in dots, into the real client screen that proves the claim. Scrolling past the cases re-resolves the plate into each next screen.

**First screen, desktop.** Crumbs, a lime eyebrow ("Service 01 / 07 · Web design & development") and a full-width two-line H1 (about 80 px). Below that sit two columns. On the left: the answer-first intro, the CTA pair and a 2×2 facts ledger (7-day from $499 · ₱19,999 / 4–12+ weeks / $5,000–$20,000 / care from $99/month). On the right: a dot plate bleeding off the right edge, with the hero case's screen (Dotted Studios for web, 8Drive for systems) and a mono caption ("Case 09 · Dotted Studios · Iligan City, PH · Built in 1 week →"). Hovering the plate wipes dots to pixels.

**First screen, phone.** The work comes first. The plate is a full-bleed band directly under the top bar, then the caption, then the H1, intro and CTA. The crumbs drop on phones; the BreadcrumbList JSON-LD carries them.

**Case proof.** One sticky plate (7 columns) beside scrolling chapters (4 columns). Each chapter has a mono strip, the client at d2, a one-line result, before/after lines, weeks and a link. When a chapter crosses the middle of the screen, the plate morphs into that client's screen. On phones the plate is replaced by the real screenshot inline in each chapter.

**FAQ + related.** FAQ uses the 4/8 split of `services.astro`, reusing `Faq.astro` unchanged. Related posts are full-width rows (title in Clash, mono category · read time · date, lime arrow), not cards.

**Motion.** Glyph → screen on arrival (1.3 s), screen → screen per chapter, plus the hover wipe. Reduced motion: formations snap, there is no hover wipe, and the chapters show static screenshots.

**Field fit.** It reuses `shot()` and the baked shot bins; most of the engineering exists already. It needs a glyph per service: two new glyphs on top of the five in `public/formations/glyphs`.

**Risks.**
- It is the closest to the home page (dots bloom into client work). It is on-brand, but the least new.
- Screens with a white background (UGLQ and Canwell admin logins) read weakly as dots. The mock inverts them, and the systems hero leads with 8Drive instead.
- Automations and Social have no screen to resolve into until there is a case, so those pages would fall back to the glyph only.

## B · The Fix

**Idea.** Each page opens on the client's problem drawn as scattered dots, labelled with the page's own "Good fit if" lines. The scroll assembles the mess into what we build, and every case is told as the same before → after.

**First screen, desktop.** The copy column (5 columns) holds the eyebrow, the H1 (about 66 px, four lines), intro and CTAs. The stage (7 columns, bleeding right) holds the mess.
- For web: a tilted 2016 slider, three loose columns and a skewed contact form, labelled "Your site looks older than your business", "You're losing bids…" and "You need a site your own team can update".
- For systems: a spreadsheet, an inbox and three apps whose connectors stop short. These are the tools named in `chapters.systems.body`.

The hero is pinned for about 110 vh. Past 35 % progress the dots fly into the fix (`B-1440-fix.jpg`, `B-systems-1440-fix.jpg`):
- For web: a desktop frame and a phone frame, with one lime block labelled "Call · book · buy".
- For systems: a hub, "One system", with five modules (Bookings, Memberships, Portals, Dashboards, Automation) inside three role rings.

The fit labels strike out and the get labels light. A Before ●—○ After button does the same for keyboard and reduced-motion users.

**First screen, phone.** H1, then a 270 px band of the mess with the fit lines on it, then the switch. The band fixes itself as it passes the middle of the screen. Intro and CTA come below the fold. The phone's answer-first block is split by the art, which is the trade-off.

**Case proof.** Full-width bands. Each has a mono strip, BEFORE (gray, Clash 2 rem) → AFTER (white), then the client at d2 and a 16:7 screen that wipes from a dot mask to pixels when it enters. The copy is the case's own challenge and result lines.

**FAQ + related.** "Before you ask." A 5/7 split, with related reading under the FAQ heading in the left column.

**Motion.** One scroll-scrubbed morph (the signature), the case wipes and reveals. Reduced motion: no pin; the switch toggles instantly; the cases show pixels directly.

**Field fit.** A new pair of formations per service: 14 bespoke `mess`/`fix` generators for seven services. Automations fits naturally (manual steps → one flow). Social does too (scattered posts → a calendar grid).

**Risks.**
- Highest build and design cost. Each new service needs an illustrated metaphor.
- A pinned hero conflicts with "pin sparingly" and with Lenis on low-end phones.
- The mess is a drawing of the client's world, so it can read as mocking the visitor if the art is too literal.
- The first screen on phones pushes the intro below the art.

## C · Runtime (recommended)

**Idea.** Every service page is drawn on one dot ruler of weeks. Our real projects are plotted at their real lengths, so "how long, how much, and has anyone like me done it" is answered by one line in the first screen.

**First screen, desktop.**
- Crumbs, eyebrow, and a full-width two-line H1.
- Left: intro + CTAs. Right: the answer in lime Clash ("Live in **7** days · from $499 · ₱19,999" for web; "Our builds **8–14** wks · typically $5,000–$20,000" for systems).
- The bottom 30 % is the ruler: W0–W14 ticks, the typical band shaded in faint lime dots, a lime marker for the 7-day website, and one bar per case ending in a lime node. Web shows Dotted 1 · A Framing 6 · Telecom 10 · QLD Law 14; systems shows Canwell 8 · 8Drive 10 · UGLQ 12 · QLD Law 14.
- Each bar is textured with a core sample of that client's real screen. It is as long as the build took, and the bars are `cases.ts` data.

**First screen, phone (`C-390.jpg`, `C-systems-390.jpg`).** Eyebrow, H1, the lime answer line, intro, CTA, then a compact 4-bar ruler above the dock. Every answer-first element and the signature fit in 844 px. The ruler labels sit above each bar, and the band and fast labels drop out (the answer line already says them).

**Case proof.** Shortest first. Each case opens on a mega week count ("01", "06", "10", "14" at 13vw) with a mono "weeks · what we built" line. Next to it are a 14-segment lime run bar and the real screenshot, captioned with the live host or "Private system · shown with permission". A sticky run meter in the left gutter fills week rows as each case arrives. This is a field formation, a variation of `days7`.

**Process + price.** "Same five steps. The length changes." Five phases sit on a hairline. Price sits on the same line: web gets a lime point at week 1 ("$499 ₱19,999") and a range bar over 4–12 weeks ("$5,000–$20,000"); systems gets one range bar over 8–14 weeks. Prices come only from `proof.ts`, with the existing `data-market` swap for ₱/$.

**FAQ + related.** FAQ as in A. Related posts are "Read before your call": a ruled 3-up row where each post shows its real read time as lime dots (5 dots = "5 min read"). It is typographic, not cards.

**Close.** "Week 0 / starts here." in lime at about 10vw, the reply-in-one-day line, the caps line, CTA + next service, and the seven-service line.

**Motion.** Arrival: bars draw from W0 outward, staggered by length (900 ms). The meter fills per case. Reveals are as on the site. Reduced motion: everything snaps, and the ruler is a static SVG poster (same as `poster-art` elsewhere).

**Field fit.** Two new CPU formations in `formations.ts`:
- `runtime(rect, bars, span, band, fast)`: ticks, band, bars textured by sampling the existing case shot bins along a row band, and end nodes.
- `meter(rect, span, lit)`.

Sections opt in with `data-f="runtime"` / `data-f="meter"`, with the bars as data attributes generated from `cases.ts`. No pre-3D JS.

**Risks.**
- **Thin services.** Brand has one case (Cleen & Green 8 weeks). The ruler still works with the 4–6-week band plus one bar, but it looks sparse. SEO and the two new services are retainers, so their ruler switches its unit to months (setup month 1, results 6–12 months) and plots only our own site until there is client proof. Never plot a placeholder bar.
- **Duration as proof can backfire.** A 14-week bar on the web page can scare a 7-day buyer. The lime 7-day marker and the answer line carry that buyer first.
- **Five bars.** Systems could plot CrateOnScene 5 too (the SEO plan's table). The desktop ruler holds five bars at 28 vh; check the 1024 × 768 height.

### Why C
It is the only direction where the signature is the answer-first content itself. It answers the three questions every buyer asks before a call, and an AI overview can quote it, with numbers already in our data. It is ours alone, since it is our real projects at their real lengths, and it cannot sit on any other agency's site. It survives seven services with no new illustration per service. The phone composition is the strongest of the three: everything answer-first plus the signature in one screen.

Build it with A's dot → pixel resolve on the case screenshots in the proof chapters; that keeps the "dots become the work" moment the owner approved on the home page. B's before/after lines are worth keeping as the case copy format in C.

---

## Navigation for seven services (shown in `C-menu-1440.jpg`, `C-menu-390.jpg`)

**Proposal: expand the existing full-screen menu. No dropdown in the rail or the dock.**

- **Menu.** The Services row (04) gets a branch line of seven mono links, `04.1 Web design · 04.2 Branding · 04.3 SEO · 04.4 UI/UX · 04.5 Web apps · 04.6 Automations · 04.7 Social media`. The current page is lit, and a hairline lime-25 branch hangs off the row's node.
  - On desktop the line wraps to two rows under "Services". Hovering a sub-link swaps the menu's dot-word to the service name ("Web" in the board), the same effect the menu already has for page names.
  - On phones it is one 44 px row that swipes sideways with scroll-snap and a fade at the right edge. Seven items add one row of height and never more. Verify it on the ≤720 px-tall layout (README: 44 px rows there).
- **Rail.** "Services" stays one link to the `/services` hub. The rail is already at its width limit ("six links fit from 1180", `Header.astro`). A dropdown would add hover-intent, tap-to-open, focus-trap and ClientRouter re-binding inside the 12 KB pre-3D budget. That agrees with the SEO plan §4: the hub stays the pages' strongest internal referrer.
- **Dock.** The current item shows the service's short name and index ("Web apps 04.5"). "Web design 04.1" truncates in the 390 dock (see `A-390.jpg`), so on phones drop the index and keep the short name.
- **Footer.** The Services column lists all seven, with the current page lit.
- **On the page.** The seven-service line closes every page above the footer.

**Owner decisions this raises.**
1. The `/services` hub H1 "Five services. / One connected brand." is MUST-KEEP in the README, but there will be seven. The H1 needs a new line, and the hub's `pentagon` formation becomes a heptagon (`SERVICE_IDS` and the baked glyphs cover five).
2. The menu hint "05 SERVICES · 01 SYSTEM" in `Header.astro` becomes "07 SERVICES".

## Notes for the builder
- The `serviceFaq` answers are shared today. On the web page, "How long does a project take?" opens with brand timings. The per-service FAQ text should come from the SEO plan briefs, not `serviceFaq` as-is.
- Mock-only shortcuts that must not ship:
  - JS-rendered content (the site renders it in Astro, with the intro as real HTML).
  - The 2D canvas (the site uses the GPU field).
  - The `?s=` switch pill.
