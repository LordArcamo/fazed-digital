---
copyStatus: draft
owner: The Wordsmith (conversion research)
scope: /lp/7-day-website (USD) and /lp/7-day-website/ph (PHP), rendered by src/components/Lp.astro + src/components/LpForm.astro + src/forms/lp.ts
date: 2026-11-02
inputs: src/components/Lp.astro, LpForm.astro, Header.astro (LP dock), src/forms/lp.ts, src/data/lp.ts, proof.ts, offers.ts, cases.ts, team.ts, site.ts, src/pages/api/lp-submit.ts, docs/conversion/lp-7day-conversion.md (already applied), live pages checked 2026-11-02 at 1440x900 and 390x844
---

# 7-Day Website LP: conversion evidence and scorecard

**What this is:** the research behind the next round of LP changes. Part 1 lists what the evidence says, rated by how much it can be trusted. Part 2 scores our live page against it. Part 3 ranks the fixes.

**Hard rules kept:** no fake testimonials or reviews, no countdown timers, no invented urgency or numbers. The only proof used below is real: 9 case studies (`cases.ts`), 120+ projects by our founder since 2022 (`proof.ts`), the 10 Fazed Lab concept sites (fictional brands, always labelled), the 7-day guarantee, and the 15 builds a month cap.

**How to read the evidence ratings**

| Rating | Means |
|---|---|
| **Strong** | Peer-reviewed study, meta-analysis, large controlled A/B test, or regulation. |
| **Moderate** | Large but correlational dataset, or repeated usability research from a credible lab (NN/g, Baymard, Stanford). |
| **Weak** | Single-site or vendor case studies, small samples, masked or unpublished methods. |
| **Folk wisdom** | Widely repeated, no primary source found. Treat as a hypothesis to test, not a rule. |

---

## 1. Findings (18)

### Attention and page structure

**F1. Most attention goes to the first two screens.**
Users spent 57% of viewing time above the fold and 74% in the first two screenfuls. The top half of the first screen got more than 65% of above-the-fold time. NN/g recommends keeping major calls to action above the fold.
- Evidence: **Strong.** Eyetracking, 120 participants, 130,000+ fixations, 2018.
- Source: https://www.nngroup.com/articles/scrolling-and-attention/

**F2. People scan. They read the start of headings and the left edge.**
Without formatting, readers fall into the F-pattern. The first two words of a heading or line carry the most weight. Fixes: front-load headings, bold key phrases, use bullets for lists and steps.
- Evidence: **Strong.** Repeated eyetracking studies, 2006 to 2017 (one later study had 47 participants), desktop and mobile.
- Source: https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/

**F3. Page length should match the decision, and the data on length points both ways.**
Across 41,000+ landing pages, word count correlated negatively with conversion (-18.6%), as did reading time (-19.4%). But controlled tests go both ways: CXL reports a shorter page lifting demo bookings, and Crazy Egg reporting a 30% lift from a much longer page. "High-consideration offers need long pages" is **folk wisdom** unless you test it. The defensible rule: every screen must answer a real objection, and nothing should repeat.
- Evidence: **Moderate** for the correlation (large but correlational, vendor data). **Weak/mixed** for any length rule.
- Sources: https://unbounce.com/conversion-benchmark-report/ ; https://cxl.com/long-form-or-short-form/ (403 on fetch; cited from search summary)

**F4. Simple words convert better.**
Pages written at a 5th to 7th grade level had an 11.1% median conversion rate, against 5.3% for professional-level writing. Difficult words (3+ syllables) correlated at -24.3%.
- Evidence: **Moderate.** 57M conversions, 41K pages, 464M visitors, 2024. Correlational, not a test.
- Source: https://unbounce.com/conversion-benchmark-report/

### Mobile

**F5. Most landing page traffic is mobile, and mobile converts worse.**
Mobile was 83% of visits in Unbounce's 2024 sample. Desktop converted 8% better on average.
- Evidence: **Moderate.** Same dataset as F4.
- Source: https://unbounce.com/conversion-benchmark-report/

**F6. Keep the primary action front and centre on mobile.**
Google's first mobile design principle, from 119 hour-long usability sessions with AnswerLab. Participants did best when primary actions sat in the main body of the page, not in menus.
- Evidence: **Moderate.** Large qualitative usability study, 2014. Archived but still cited.
- Source: https://business.google.com/uk/think/marketing-strategies/principles-mobile-site-design-delight-users-drive-conversions/

**F7. A sticky mobile CTA helps when the decision happens below the first button.**
Reported tests show mobile lifts (for example +20.4% at 95.1% probability to beat control on one homepage, +13.1% on a nonprofit page) but flat or negative results on desktop and tablet (-5%, -11% in the same nonprofit test). GoodUI lists a Sticky Call To Action pattern, but its results are behind a paywall.
- Evidence: **Weak.** Vendor and single-site tests.
- Sources: https://convertibles.dev/blogs/case-studies/homepage-sticky-cta-case-study ; https://www.nextafter.com/?p=16490 ; https://dev.goodui.org/patterns/41

**F8. Speed moves money, and the effect is measured.**
Vodafone ran a 50/50 A/B test on a paid-traffic landing page. Identical pages, one optimised. LCP improved 31% (8.3s to 5.7s). Sales rose 8%, lead-to-visit 15%. Separately, Google reports bounce probability rises 32% as mobile load time goes from 1s to 3s.
- Evidence: **Strong** for Vodafone (controlled A/B, about 34K visits a day per arm; significance not reported). **Moderate** for the Google figure (2017, method not public).
- Sources: https://web.dev/case-studies/vodafone ; https://www.thinkwithgoogle.com/data/page-load-time-statistics/

### Price, trust and proof

**F9. Show the price. It is the number one thing buyers look for.**
NN/g's B2B usability studies: business buyers name pricing as their top information need. When prices were hidden, participants left for competitors, and the first sites with clear prices made the shortlist. Hiding price reads as evasive.
- Evidence: **Moderate.** Repeated qualitative usability research.
- Source: https://www.nngroup.com/articles/show-price/

**F10. Trust has four parts: design quality, upfront disclosure, complete and current content, and connection to the rest of the web.**
"Upfront disclosure" means base costs, fees and guarantee terms before you ask for anything. "Complete" includes showing the people who do the work, not only the results. "Connected" means third-party reviews and profiles, which users trust more than testimonials on your own site. The study found these factors held across Western and Asian users.
- Evidence: **Moderate.** NN/g usability study, Singapore, 2016, small qualitative samples, consistent with Nielsen's 1999 factors.
- Source: https://www.nngroup.com/articles/trustworthy-design/

**F11. Show that a real organisation and real people stand behind the site.**
Stanford's guidelines: show a real organisation (address, photos), show trustworthy people (names, bios), make contact easy (phone, address, email), make claims easy to verify, and avoid errors. Typos, broken links and contradictions hurt credibility more than people expect.
- Evidence: **Moderate.** Three years of research with 4,500+ people, peer-reviewed CHI papers (1999 to 2002). Old, but the findings repeat in later NN/g work (F10).
- Source: https://credibility.stanford.edu/guidelines/index.html

**F12. Specific, checkable proof beats general claims.**
A named client, what was built, and something the reader can check (a live URL) are more credible than an anonymous result. This is Stanford guideline 1 ("make information easy to verify"). Practitioner writing on case studies agrees, but that part is **folk wisdom** with no controlled test behind it.
- Evidence: **Moderate** (Stanford). **Weak** for the practitioner layer.
- Sources: https://credibility.stanford.edu/guidelines/index.html ; https://cxl.com/blog/b2b-case-studies/

**F13. Guarantees raise purchase intent, most of all for services and unknown sellers.**
Two experiments: money-back guarantees raised purchase intent and willingness to pay a premium, through both reduced risk and a positive emotional response. The effect is smaller for sellers who are already highly credible, and stronger for experience goods (things you cannot judge before you buy, like a website build). GoodUI lists 5 tests of the pattern (results paywalled).
- Evidence: **Moderate to strong.** Peer-reviewed experiments (Journal of Retailing, 2011), plus later signalling studies.
- Sources: https://econpapers.repec.org/RePEc:eee:jouret:v:87:y:2011:i:4:p:462-478 ; https://goodui.org/patterns/103/

**F14. Fake urgency is a known deceptive pattern, and struck-through prices must be real.**
A crawl of 11K shopping sites found 1,818 dark patterns, including deceptive countdown timers that reset or never expire. Under US FTC rules, a struck-through "former" price must be one the product was actually and openly offered at, in good faith. Real, fixed limits (a monthly cap, a set number of founding spots) are honest. Invented ones are not.
- Evidence: **Strong.** Peer-reviewed (ACM CSCW 2019) and federal regulation.
- Sources: https://arxiv.org/abs/1907.07032 ; https://www.law.cornell.edu/cfr/text/16/233.1

### Forms

**F15. Field count matters more than step count. Most flows need about 8 fields.**
Baymard's 2024 benchmark: the average checkout has 11.3 form fields, while most sites need only 8. The number of fields hurts usability far more than the number of steps. NN/g's form guidance agrees: cut any field you can collect later, keep optional fields to one or two and label them, and use labels, not placeholders.
- Evidence: **Strong** for e-commerce checkout (10+ years of testing). **Moderate** when applied to lead forms.
- Sources: https://baymard.com/blog/checkout-flow-average-form-fields ; https://www.nngroup.com/articles/web-form-design/

**F16. Phone fields cost leads. Optional phone is the safe middle.**
Reported tests of removing a phone field range from about 5% (an Unbounce estimate quoted second-hand) to large lifts on single sites (48%, 77%). HubSpot's analysis of 40,000+ landing pages found conversion slipped gradually as fields were added, with some field types worse than others.
- Evidence: **Weak.** Single-site tests, a second-hand vendor estimate, and an old HubSpot analysis whose figures conflict in secondary sources.
- Sources: https://vitaldesign.com/phone-number-form-field-case-study/ ; https://blog.hubspot.com/blog/tabid/6307/bid/6746/which-types-of-form-fields-lower-landing-page-conversions.aspx

**F17. Multi-step beats single-step for longer forms, sometimes. Progress bars only help if they feel fast.**
Multi-step vs single-step: vendor tests report wins (Instapage +21.4% on 25,500+ visits per arm), others find no difference. Call it **weak/mixed**. Progress indicators are better studied: a meta-analysis of 32 randomised experiments found constant-speed progress bars did not reduce drop-off, fast-to-slow ones reduced it, and slow-to-fast ones increased it. Separately, the "endowed progress" field experiment found that a 10-stamp card with 2 stamps pre-filled was completed by 34% of customers, against 19% for an 8-stamp card with none: same work, but it felt started. NN/g's wizard guidance: show the steps, mark completed ones, allow Back.
- Evidence: **Strong** for progress indicators and endowed progress (meta-analysis + field experiment). **Weak** for multi-step vs single-step.
- Sources: https://research.google/pubs/where-am-i-a-meta-analysis-of-experiments-on-the-effects-of-progress-indicators-for-web-surveys/ ; https://econpapers.repec.org/RePEc:oup:jconrs:v:32:y:2006:i:4:p:504-512 ; https://www.nngroup.com/articles/wizards/ ; https://zuko.io/blog/single-page-or-multi-step-form

**F18. Leads go cold within hours.**
An HBR audit of 2,241 US firms found that firms contacting a web lead within an hour were about 7 times more likely to qualify it than firms that waited longer, and most firms were far slower. The often-quoted "5 minutes, 21x" figures come from a separate MIT/InsideSales study, not HBR.
- Evidence: **Moderate.** Large audit, 2011. Exact multipliers vary by summary.
- Source: https://scholarsarchive.byu.edu/facpub/9711

### What is folk wisdom (no primary evidence found)

- "First-person CTAs ('Get **my**') always win." One-off tests only. Our label is already first person and honest. Leave it.
- "Three pricing tiers with a highlighted middle plan always win." Decoy and anchoring effects are real in lab research, but the pricing-page percentages people quote (for example "70 to 80% pick the recommended tier") trace to no study.
- "Offshore buyers fear time zones." No survey found that measures this for web design. The defensible version is F10 and F11: show the real people, the hours, the location and a way to reach them.
- "Multi-step forms get 300% more leads." Vendor headline. See F17.

---

## 2. Scorecard: our live pages

Checked on 2026-11-02 at 1440x900 (desktop) and 390x844 (phone), both variants. Page length on a 390px phone: USD 14.3 screens, PH 16.3 screens. Estimated reading level of the page copy: Flesch-Kincaid grade 5.7, about 11 words per sentence.

| # | Finding | USD | PH | The specific element |
|---|---|---|---|---|
| F1 | First two screens | **Pass** | **Partial** | Desktop: H1, deck with price, CTA, risk note and trust bar all above the fold. Phone: CTA at 551 to 659px and risk note at 675 to 713px of an 844px screen. PH phone: the founding banner sits at 753 to 947px, so the best offer is cut in half by the fold. |
| F2 | Scannable | **Pass** | **Pass** | Headings front-loaded ("Real clients…", "One fixed price…"), process as numbered days, plan rows as bullets. Weakest heading: "Before you send your brief." (FAQ). |
| F3 | Every screen earns its place | **Partial** | **Partial** | Phone: proof section runs 3.5 screens (USD 2.8 to 6.3), mostly 4 stacked Lab images. First price card at screen 8.0 (USD) and about 9 (PH). Form at screen 13 (USD) and 14 (PH). |
| F4 | Plain words | **Pass** | **Pass** | FK grade about 5.7. Keep it there. |
| F5/F6 | Mobile CTA front and centre | **Pass** | **Pass** | Lime "Get my start date" is the first button on the phone screen. |
| F7 | Sticky mobile CTA | **Partial** | **Fail** | `#sd-lp` dock in `Header.astro` line 35 appears after the hero and hides at the form (works). But it says "Get started", not "Get my start date". On PH it says **"From ₱19,999"** while the hero, banner, plan card and form all say ₱14,999. |
| F8 | Speed | **Unverified** | **Unverified** | LCP element is the hero text (`p.lp-deck`), which is good. PageSpeed Insights quota was exhausted today, so no lab or field numbers. The page sells "under 2s". It has to prove it on itself first. |
| F9 | Price shown | **Pass** | **Pass** | Price in hero deck, trust bar, comparison table, plan cards, form tiles. "See pricing" jumps straight there. |
| F10a | Upfront disclosure | **Partial** | **Partial** | FAQ "Are the domain and hosting included?" says we can provide the domain and launch on the client's host, but never says who pays for the domain or hosting. Deposit size and when the balance is due are not stated anywhere. |
| F10b | Show the people | **Fail** | **Fail** | No founder name or photo anywhere on the LP. `team.ts` has Lord Arcamo's photo. The phone number appears only on the success screen, after the lead has already converted. |
| F10c | Connected to the web | **Fail** | **Fail** | No third-party profile or reviews. Expected: `LP_REVIEWS_REAL = false`. |
| F11 | Real organisation, no errors | **Partial** | **Fail** | Header shows a live PHT clock, "Open now" and "Reply in 1 business day" (good). PH: the price contradiction in the dock (F7) is exactly the kind of error Stanford #10 warns about. |
| F12 | Specific, checkable proof | **Fail** | **Fail** | The 3 real result cards name no client, show no image and have no live URL, and they are the three projects *least* like a 7-day site (a migration, a platform, a rebrand). Meanwhile the only screenshots on the page are of fictional Lab brands. `cases.ts` has a real 1-week build (Dotted Studios, live at dottedstudios.com) and a real small-business WordPress site (A Framing Company, Utah), both with images in `workImages`. |
| F13 | Guarantee | **Pass** | **Pass** | In the hero note, the lime band, FAQ #1 and the form pills. Conditions are disclosed. Missing: *how* the 20% is paid (taken off the final invoice? refunded if already paid?). |
| F14 | Honest scarcity | **Pass** | **Pass** | Real monthly cap, 5 founding spots, no timer, no live counter. ₱19,999 struck through is the real standing price. |
| F15 | Field count | **Partial** | **Partial** | 8 required inputs: package, industry, goal, timeline, style (5 taps) + business name, name, email (3 typed). "How should it feel?" is not needed to quote or schedule. It can be collected on Day 1. |
| F16 | Phone optional | **Pass** | **Pass** | Phone marked "(optional)" with a reason. |
| F17 | Progress feel | **Partial** | **Partial** | Tapping a package tile opens the sheet at "01 / 06". The package the visitor just chose is not counted as progress. Back button, step count, ETA and the brief rail are all present (good). |
| F18 | Speed to lead | **Partial** | **Partial** | Promise is "within one business day". `api/lp-submit.ts` emails only the team (`to: LEAD_TO`). The lead gets no instant email of their own. A US lead sent on Friday evening waits until Monday PHT with nothing in their inbox. |

---

## 3. Top 10 fixes

Ranked by **evidence strength x expected impact x (1 / effort)**. Each one says the file, the element and the exact change. None adds a number, review or deadline that isn't already real.

### 1. Show real, named, checkable work, starting with the one real 1-week build (F11, F12, F10)
**Evidence:** Moderate. **Impact:** High (this is the "can they actually do it?" moment). **Effort:** Low to medium.

**Where:** `Lp.astro`, `.lp-reviews` fallback block (the `results.map` list), plus a new `lpCases` list in `proof.ts` built from `cases.ts`.

**Change:** Swap the three anonymous result cards for three named cases with their screenshot from `workImages` (`'09'`, `'01'`, `'02'`) and the live domain as plain text or a new-tab link (same treatment as the Lab tiles, so the LP stays open).

| Tag (mono) | H3 | Body |
|---|---|---|
| Philippines · Web design + CMS | Dotted Studios. Live one week after the build started. | A branding studio in Iligan City. We built the site from their own Figma design and launched it at dottedstudios.com in October 2026. |
| USA · Web design + WordPress | A Framing Company. A contractor site built around their projects. | A Utah framing contractor whose old site had no portfolio. We built a WordPress site around their completed builds, and their team updates it without touching code. |
| Philippines · Brand + WordPress | Cleen & Green. A premium brand and a site built to convert. | A full rebrand for a Philippine cleaning company, plus a franchise page that opened a channel they couldn’t use before. |

**Intro paragraph, replace with:**
> Our founder has delivered 120+ websites, brands and systems since 2022. Dotted Studios went live one week after the build started. The other two were longer custom builds, made by the same team you’ll work with.

Keep the Telecom Shop and CrateOnScene as a single mono line under the cards: `Also: The Telecom Shop (AU, store migration) · CrateOnScene (USA, platform in 5 weeks)`.

Notes: "a site built to convert" replaces "converts better", which has no metric behind it (`CASE_METRICS_REAL = false`, prior audit OWNER CHECK #7). Don't use A Framing Company's "uptick in enquiries" line: it is unquantified. Lab tiles stay, still labelled as fictional, after the real work.

### 2. Fix the PH price contradiction in the sticky dock, and match its label (F7, F11, F14)
**Evidence:** Moderate. **Impact:** High on PH (it contradicts the main offer on every scroll). **Effort:** Very low.

**Where:** `src/components/Header.astro` line 35 to 36.

**Current:** `From {lp === 'php' ? '₱19,999' : '$499'}` and `Get started →`
**Change:** import `offerPrice` from `../data/offers` and render `offerPrice(lp, 'starter').price`. While the founding rate is on, prefix it: `Founding rate ₱14,999`. Change `Get started` to `Get my start date`. Then every button and price on the page says the same thing.

### 3. Put a real person on the page, with a way to reach them before they convert (F10b, F11)
**Evidence:** Moderate. **Impact:** Medium to high, mostly for USD/AU buyers judging an overseas studio. **Effort:** Low.

**Where:** `Lp.astro`, inside `.lp-form-side`, directly above the `.lp-pills` list (both variants). Photo from `team.ts` (`lord`, `/images/team/lord.jpeg`). Phone and hours from `NAP`.

**Copy:**
> **Lord Arcamo, Founder.** You’ll work with me and our small team in Iligan City, Philippines. We’re online {NAP.hours}{usd: ' (UTC+8)'}. Rather talk first? Call or text {NAP.phone}.

Alt text: "Lord Arcamo, founder of Fazed Digital". OWNER CHECK: confirm you want the phone number on the LP before submit (it is already on the success screen and in the site NAP).

### 4. Count the package as step one done (F17)
**Evidence:** Strong. **Impact:** Medium. **Effort:** Very low.

**Where:** `src/forms/lp.ts`, `render()`, around line 211 (`const n = cur + 1, total = list.length`).

**Change:** when the package was picked from a tile or a plan card (the screen is skipped), count it: show `02 / 07` on the first sheet screen instead of `01 / 06`, fill the bar to 2/7, and tick "Package" in the rail. Same work for the visitor. It just starts with visible progress. Keep the ETA as is.

### 5. Say who pays for what, before the form (F10a, F9)
**Evidence:** Moderate. **Impact:** Medium to high (it answers "what's the catch?" on a $499 offer). **Effort:** Low, but needs owner answers.

**Where:** `src/data/lp.ts`, FAQ "Are the domain and hosting included?", and a new `lp-note` line in `Lp.astro` `.lp-price`, under the cap line.

**FAQ answer, replace with (fill the TBCs):**
> Your domain: we can register it for you. [TBC: included for the first year / billed at cost.] Hosting: you choose the host and pay them directly, in your own account, so you always own it. We set it up and launch on it.

**New pricing note:**
> Not in the package price: your hosting plan (paid to your host) [TBC: and domain renewals]. Payment: [TBC]% deposit once you approve the quote, the rest at launch [TBC].

Do not publish the deposit size or schedule until the owner confirms them.

### 6. Make the guarantee mechanics concrete (F13)
**Evidence:** Moderate to strong. **Impact:** Medium. **Effort:** Very low, needs one owner answer.

**Where:** `Lp.astro` `.lp-mid` paragraph and FAQ #1 in `lp.ts`.

**Add one sentence after "…you get 20% off the project fee.":**
> [TBC] We take it off your final invoice. If you’ve already paid in full, we refund it.

A guarantee lowers risk only if the buyer can picture getting it.

### 7. Shorten the phone scroll to the price (F1, F3, F5)
**Evidence:** Moderate. **Impact:** Medium (83% of LP traffic is mobile, per F5). **Effort:** Low (markup + CSS only, no effect switched off).

**Where:** `Lp.astro` `.lp-work` and the `.lp-tiles` CSS at `max-width: 599px`.

**Change:** on phones, show 2 Lab tiles in a 2-up grid with smaller images (or one horizontal scroll row) instead of 4 stacked full-width tiles. This cuts roughly 1.5 to 2 screens and brings the first price card from screen 8 up to about screen 6. On PH, also move `.lp-founding` above the `.lp-cta-note` line only if it then fits within 844px. Otherwise leave it.

### 8. Send the lead an instant confirmation email (F18)
**Evidence:** Moderate. **Impact:** Medium (keeps the lead warm across the time zone and the weekend). **Effort:** Medium.

**Where:** `src/pages/api/lp-submit.ts`. It currently sends only to `LEAD_TO`.

**Change:** after a successful submit, also send the visitor a plain email:
> Subject: Your 7-day brief is in, {first name}
> Body: a copy of their answers, "A real person replies by {next business day} with your confirmed start date", the Day 1 checklist (logo, photos, text), and the founder's name and phone.

No promise beyond what the page already makes.

### 9. Drop "How should it feel?" from the pre-quote form (F15)
**Evidence:** Strong for field count in checkouts, moderate for lead forms. **Impact:** Low to medium. **Effort:** Low (`LpForm.astro` style fieldset, `lp.ts` FIELDS/validation/lead email, HubSpot mapping).

**Change:** remove the style screen. Ask it on Day 1 in the kickoff brief instead. The form goes from 7 screens to 6 (5 after a tile tap), and the card line "6 quick questions" becomes "5 quick questions". OWNER CHECK: confirm nobody uses the style answer to quote or schedule.

### 10. Get connected to the rest of the web, and prove the speed claim on the page itself (F10c, F8)
**Evidence:** Moderate (reviews) and strong (speed). **Impact:** Medium, growing over time. **Effort:** Low per step.

- **Reviews:** ask each founding client for their review on the Google Business Profile, not only on our site (third-party reviews carry more trust). When at least one real review exists, add a mono line under the trust bar linking to it, then flip `LP_REVIEWS_REAL`. No star ratings or counts until they are real.
- **Speed:** run PageSpeed Insights (mobile) on both LPs once the quota resets, and check CrUX field data. The page sells "under 2s load". If either LP misses that on mobile, fix the LP before the next ad spend. Tune the GL field's load, don't switch it off (house rule). Do not print a speed figure on the page unless it is measured.

---

## OWNER CHECK

1. Phone number visible on the LP before submit (fix 3).
2. Domain: included or at cost? Hosting: confirm the client pays the host directly (fix 5).
3. Deposit percentage and when the balance is due, for standard builds (fix 5).
4. How the 20% is paid: off the final invoice, refund if paid in full? (fix 6)
5. Is the "style" answer used before Day 1? (fix 9)
6. Is there a Google Business Profile or another third-party profile with real reviews to link? (fix 10)

## Sources

- NN/g, Scrolling and Attention: https://www.nngroup.com/articles/scrolling-and-attention/
- NN/g, F-Shaped Pattern: https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- NN/g, Trustworthiness in Web Design: https://www.nngroup.com/articles/trustworthy-design/
- NN/g, Show Price: https://www.nngroup.com/articles/show-price/
- NN/g, Website Forms Usability: https://www.nngroup.com/articles/web-form-design/
- NN/g, Wizards: https://www.nngroup.com/articles/wizards/
- Baymard, Checkout form fields 2024: https://baymard.com/blog/checkout-flow-average-form-fields
- Unbounce, Conversion Benchmark Report 2024: https://unbounce.com/conversion-benchmark-report/
- Google/AnswerLab, Principles of Mobile Site Design: https://business.google.com/uk/think/marketing-strategies/principles-mobile-site-design-delight-users-drive-conversions/
- Think with Google, page load statistics: https://www.thinkwithgoogle.com/data/page-load-time-statistics/
- web.dev, Vodafone case study: https://web.dev/case-studies/vodafone
- Stanford Web Credibility Guidelines: https://credibility.stanford.edu/guidelines/index.html
- Suwelack, Hogreve, Hoyer 2011, Money-back guarantees: https://econpapers.repec.org/RePEc:eee:jouret:v:87:y:2011:i:4:p:462-478
- Nunes and Drèze 2006, Endowed Progress Effect: https://econpapers.repec.org/RePEc:oup:jconrs:v:32:y:2006:i:4:p:504-512
- Villar, Callegaro, Yang 2013, Progress indicator meta-analysis: https://research.google/pubs/where-am-i-a-meta-analysis-of-experiments-on-the-effects-of-progress-indicators-for-web-surveys/
- Mathur et al. 2019, Dark Patterns at Scale: https://arxiv.org/abs/1907.07032
- FTC 16 CFR 233.1, Former price comparisons: https://www.law.cornell.edu/cfr/text/16/233.1
- Oldroyd, McElheran, Elkington 2011, The Short Life of Online Sales Leads (HBR): https://scholarsarchive.byu.edu/facpub/9711
- HubSpot (Zarrella), form fields: https://blog.hubspot.com/blog/tabid/6307/bid/6746/which-types-of-form-fields-lower-landing-page-conversions.aspx
- GoodUI patterns (results paywalled): https://goodui.org/patterns/103/ , https://dev.goodui.org/patterns/41 , https://goodui.org/patterns/3
- Vendor tests (weak): https://convertibles.dev/blogs/case-studies/homepage-sticky-cta-case-study , https://www.nextafter.com/?p=16490 , https://vitaldesign.com/phone-number-form-field-case-study/ , https://zuko.io/blog/single-page-or-multi-step-form , https://cxl.com/long-form-or-short-form/ , https://cxl.com/blog/b2b-case-studies/
