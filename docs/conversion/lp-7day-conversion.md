---
copyStatus: draft
owner: The Wordsmith (conversion copy)
scope: /lp/7-day-website (USD) and /lp/7-day-website/ph (PHP), both rendered by src/components/Lp.astro
sources: src/components/Lp.astro, src/data/lp.ts, src/data/proof.ts, src/data/offers.ts, src/data/cases.ts, src/data/site.ts, src/data/team.ts, src/components/LpForm.astro (read only), docs/forms-redesign/copy.md
date: 2026-11-02
---

# 7-Day Website LP: conversion audit and replacements

**The page's one job:** get the visitor to send the 7-day brief.
**The one promise:** a custom website, live in 7 business days, at a fixed price you can see.
**The one CTA:** `Get my start date`. This is the form's own submit label (LpForm.astro line 139), so every button on the page now says what the click actually does.

Line numbers refer to the working tree of `src/components/Lp.astro` on 2026-11-02 (the version with the `FOUNDING_PH` import from `offers.ts`).

**Spelling:** use British on both variants (colour, optimised, enquiries). That is the site's existing convention (docs/forms-redesign/copy.md).
**No em dashes.** En dashes appear only in ranges that are already on the site (Day 2–3, Mon–Fri).

**Already applied:** the FAQ copy in `src/data/lp.ts` (change #7). Its exports and call signature are unchanged, and it renders on both pages and in the FAQPage JSON-LD. Nothing else on the site was edited.

---

## 1. Top 10 changes, ranked by expected impact

### #1 Hero subhead: make the promise exact and lead with the outcome

**Why:** The H1 says "7 days". The guarantee, FAQ and form all say "7 business days". A buyer who first learns about "business days" in the fine print reads it as a bait and switch. The current deck also opens with what *we* do instead of what the buyer *gets*.

**Keep the H1** (line 55). `Your website, live in 7 days.` matches the meta titles and the ads, and that match is worth more than any rewrite. Fix the precision in the deck, directly under it.

**Line 56, current (USD):**
> We design, build and launch professional websites for small businesses: fully custom, mobile-ready and set up for Google. **From $499, fixed price. You own everything.**

**Replace (USD):**
> A custom website that makes your business look established, works on every phone and is set up for Google. Designed, built and launched in 7 business days. **Fixed price from $499. You own everything.**

**Line 56, current (PH):**
> We design, build and launch professional websites for Philippine businesses: fully custom, mobile-ready and set up for Google. **From ₱19,999, fixed price. Pay via GCash, Maya or bank.**

**Replace (PH):**
> A custom website for your Philippine business that looks established, works on every phone and is set up for Google. Designed, built and launched in 7 business days. **Fixed price from {st.price}. Pay via GCash, Maya or bank.**

(`st` is defined in #3. While the founding rate is on, the deck reads "from ₱14,999", so it matches the banner.)

**Line 54, eyebrow (optional, low effort):**
- USD current: `Fast-track website · Fixed price · USD` → replace with `Small business websites · Fixed price in USD`
- PH: keep as is.

---

### #2 Hero CTA: say what the click does, and put the risk reversal right under it

**Why:** "Get my 7-day website" promises the end result, but the click opens a brief. "Get my start date" is honest, asks for less and matches the form's submit button. Right now the hero has no risk reversal near the button. All three reassurances below are already on the site: in the LpForm `reassure` list, the guarantee and `NAP.hours`.

**Line 58, current:**
```astro
<a class="btn btn--lime" href="#get-started" data-magnetic>Get my 7-day website <span class="arrow" aria-hidden="true">→</span></a><a class="btn btn--ghost" href="#pricing">See pricing</a>
```
**Replace:**
```astro
<a class="btn btn--lime" href="#get-started" data-magnetic>Get my start date <span class="arrow" aria-hidden="true">→</span></a><a class="btn btn--ghost" href="#pricing">See pricing</a>
```
**Add directly after the `.lp-cta` div (new line):**
```astro
<p class="mono lp-cta-note">No payment now · Reply within one business day · 7 business days or 20% off</p>
```
**CSS (add):** `.lp-cta-note { color: var(--gray-300); font-size: .75rem; }` (gray-300 because gray-500 is for hairlines only).

**Use the same label on every other primary button:**
- Line 145 (mid band): `Get my 7-day website` → `Get my start date`
- Line 161 (after the Lab tiles): `Get my 7-day website` → `Get my start date`

---

### #3 PH: show the founding rate everywhere the price appears, and keep the CTA above the fold

**Why:** This is the biggest trust leak on the PH page. The banner says ₱14,999. The hero deck (line 56), the trust bar (line 62), the comparison table (line 27) and the Starter pricing card (line 21) all say ₱19,999. The form card already shows ₱14,999 with ₱19,999 struck through. So the best offer is missing at the exact moment the buyer decides (the pricing cards), and the page contradicts itself. Also, on a 390px phone the banner sits *above* the CTA and pushes the CTA below the fold.

**Frontmatter, line 8, current:** `import { FOUNDING_PH } from '../data/offers';`
**Replace:** `import { FOUNDING_PH, offerPrice } from '../data/offers';`

**Add after line 19 (`const P = ...`):**
```ts
const st = offerPrice(variant, 'starter'); // { price, founding }: ₱14,999 while FOUNDING_PH.on, else the standard price
```

**Line 21 (Starter plan), current:** `{ id: 'starter', name: 'Starter', price: P.starter, for: 'New businesses getting online', rows: [...] },`
**Replace:**
```ts
{ id: 'starter', name: 'Starter', price: st.price, was: st.founding ? P.starter : '', tag: st.founding ? `Founding rate · ${FOUNDING_PH.spots} spots` : '', for: st.founding ? `New businesses getting online. Founding rate for our first ${FOUNDING_PH.spots} clients, secured with a deposit.` : 'New businesses getting online', rows: [/* unchanged */] },
```

**Lines 96–98, plan card markup, current:**
```astro
{p.popular && <p class="mono plan-pop">Most popular</p>}
<h3 class="t-h3">{p.name}</h3>
<p class="plan-price">{p.price}</p>
```
**Replace:**
```astro
{p.tag ? <p class="mono plan-pop">{p.tag}</p> : p.popular && <p class="mono plan-pop">Most popular</p>}
<h3 class="t-h3">{p.name}</h3>
<p class="plan-price">{p.price}{p.was && <s class="plan-was"> {p.was}</s>}</p>
```
**CSS (add):** `.plan-was { font-size: .4em; color: var(--gray-400); margin-left: .4em; }`
Also give the founding card the lime border: `class:list={['plan', { 'plan--pop': p.popular || p.tag }]}` on line 95. If both Starter and Growth end up lime, keep only the founding card lime on PH.

**Line 62, trust bar, current:** `<div><dt class="mono">Starting price</dt><dd>{P.starter}</dd></div>`
**Replace:** `<div><dt class="mono">{st.founding ? 'Founding rate' : 'Starting price'}</dt><dd>{st.price}</dd></div>`

**Line 27, comparison row:** `` `Fixed price from ${P.starter}` `` → `` `Fixed price from ${st.price}, listed below` `` (see #9).

**Line 57, banner. Move it below the `.lp-cta` div and the new `.lp-cta-note`, then replace the copy.**

Current:
> **Founding client rate** / **Starter ₱14,999** (standard ₱19,999) · 5 founding spots, secured with a deposit. In exchange, we ask for an honest review and permission to feature your build. Extra pages and care plans at the standard rate.

Replace:
```astro
{php && FOUNDING && <p class="lp-founding" role="note"><strong class="mono">Founding client rate · {FOUNDING_PH.spots} spots</strong><br /><b>Starter {FOUNDING_PH.price}</b> <span class="dim">instead of {FOUNDING_PH.standard}</span>. For our first {FOUNDING_PH.spots} clients, secured with a deposit. In return, we ask for an honest review and permission to feature your build. Extra pages and care plans are at the standard rate.</p>}
```
This keeps the scarcity honest: a fixed number of spots, no countdown, no "only X left" and no deadline. Turning `FOUNDING_PH.on` off removes every mention at once.

**CSS nit, lines 271–272:** the fallback `#c6f432` is not a palette colour. Use `var(--lime)` with no fallback.

---

### #4 Section order: show *how* 7 days is possible before asking for money, and cut the repeats

**Why:** "7 days" is the claim visitors doubt most, but the process that makes it believable sits *below* pricing and results (lines 130–134). The guarantee (136–139) and the mid CTA (141–147) are two separate sections, so the risk reversal never sits next to a price. "Speed meets quality" (149–152) repeats the hero and the comparison table ("Live in 7 days", "Fixed price") and adds about one phone screen of scroll for no new information.

The new order is in section 2. In short:
- Move the process up to sit right after the hero (and after the PH Facebook block).
- Put proof next.
- Merge the guarantee into the lime band and place it straight after pricing.
- Delete the "Speed meets quality" section (lines 40–45 and 149–152). Its two unique points are already covered: "Ready for Google" by the process Day 4–5 copy ("set up for search"), and "Mobile-first" by the new hero deck ("works on every phone").
- Fold the PH payment chips (109–115) into the pricing section.

**Process copy edits (lines 131–133):**
- Line 131 eyebrow: `How it works · 7 days · 5 steps` → `How it works · 7 business days · 5 steps`
- Line 132 H2: `From brief to live in 7 days.` → `From brief to live in 7 business days.`
- Add after the `</ol>` on line 133:
```astro
<p class="lp-note">Day 1 is your kickoff day, once we have your brief, logo, photos and text. Every day here is a business day, Monday to Friday.</p>
```

---

### #5 The 7-day promise becomes the risk reversal next to the price

**Why:** A guarantee works hardest when it sits right where the buyer feels the risk: just after they see the price. Today it is a heading and a paragraph with no button, two sections away from pricing.

**Delete** lines 136–139 (`.lp-guar`) and replace lines 141–147 (`.lp-mid`) with the block below. Place it straight after the pricing section (see section 2).

Current (lines 137–138 and 143–145):
> The 7-day promise / We’ll launch your site in 7 business days, as long as we have your content and assets on Day 1 and your feedback within 24 hours at each review. If we miss the deadline on our side, you get 20% off the project fee.
> Ready? Let’s get you live in 7 days. / No commitment until you approve the quote. / Get my 7-day website →

Replace:
```astro
<section class="lp-mid on-lime" aria-labelledby="g-h">
  <div class="container lp-mid-in">
    <p class="mono">The 7-day promise</p>
    <h2 id="g-h" class="t-d2">Live in 7 business days, or 20% off.</h2>
    <p>Send your content and assets on Day 1 and your feedback within 24 hours at each review. If we miss the deadline on our side, you get 20% off the project fee.</p>
    <a class="btn btn--black" href="#get-started">Get my start date <span class="arrow" aria-hidden="true">→</span></a>
    <p>No payment now. No commitment until you approve the quote.</p>
  </div>
</section>
```
Then delete `const guarantee` (line 46), or keep it and render `{guarantee}` in place of the paragraph. `.lp-guar` can come out of the CSS list on line 216.

---

### #6 Pricing: make the choice easy and put honest scarcity at the decision

**Why:** Three plans and no way out of "which one?" is the classic stall. The form already has a "Not sure yet" option and says "You can change your package later" (LpForm line 36), but the pricing section never says so. The monthly cap is real and honest scarcity, but it only appears at the very bottom of the page.

**Line 91 H2, current:** `Pick a package. <span class="dim">We handle the rest.</span>`
**Replace:** `One fixed price. <span class="dim">Everything listed.</span>`

**Add after the H2 (new line, both variants):**
```astro
<p>Every package launches in 7 business days. Not sure which fits? Pick “Not sure yet” in the brief and we’ll suggest one. You can change your package later.</p>
```

**Line 92 (PH), current:** `All prices in Philippine peso. Pay via GCash, Maya or bank transfer.`
**Replace** it, and fold in the chips from lines 109–115 (then delete that section):
```astro
{php && <><p>All prices in Philippine peso. Pay the way you already do:</p><ul class="lp-chips">{['GCash', 'Maya', 'BPI', 'Metrobank', 'Wise'].map((x) => <li class="chip">{x}</li>)}</ul></>}
```

**Add directly under the `</ul>` of `.lp-plans` (line 104), before the custom note:**
```astro
<p class="lp-note mono">{capsCopy.sevenDay}</p>
```
(This renders "We take on 15 seven-day builds a month, max." The number comes from proof.ts. Do not add a live counter.)

**"Most popular" badge (line 22, `popular: true`): OWNER CHECK.** "Most popular" is a claim about sales data. If it is not backed by real orders, change the label on line 96 to `Our pick for most businesses`, which is an opinion and fact-safe. LpForm.astro uses the same label (lines 39 and 70). Tell the form engineer so both change together.

**Line 105, current:** `Need something custom? <a ...>Email us</a> and we’ll scope it together. No commitment.`
Keep it, but it must come after the cap line. It is the only exit link in the pricing block.

---

### #7 FAQ: strongest objections first, plus the three missing ones (APPLIED in src/data/lp.ts)

**Why:** The two biggest unspoken objections on a $499 offer are "why so cheap, what's the catch?" and, for US and AU buyers, "who am I dealing with, and where?". Neither was answered. "What happens after I send it?" is the last fear before someone presses Send. Ownership and the guarantee were already there. They are now ordered by how much each objection blocks a sale.

What changed (all facts are taken from proof.ts, offers.ts, site.ts, the Lp.astro process and guarantee, or the LpForm reassure list):

| # | Question | Change |
|---|---|---|
| 1 | Is the 7-day delivery actually guaranteed? | Rewritten: the two conditions first, then the 20% off. Same facts. |
| 2 | Why does it cost less than a typical agency? | **New.** Fixed scope, a set process, no hourly rates. The USD version adds "a small studio based in Iligan City, Philippines, working with clients in the USA and Australia". |
| 3 | What happens after I send the brief? | **New.** Reply within one business day (`NAP.hours`), confirmed start date, no payment now, no commitment until the quote is approved. |
| 4 | What do I need to provide? | The PH version adds the Facebook page shortcut (already promised in the form-side copy, line 174). |
| 5 | What if I’m not happy with the design? | Rewritten around the process: mockups on Day 2–3 before anything is built, revision rounds per plan, staging link on Day 6. Removed "Our live portfolio shows the standard…" because the LP links to no portfolio. |
| 6 | Who will I be working with? | **New, USD only.** Small team, led by the founder, a direct line, hours with UTC+8. |
| 7 | Will I own the website? | Unchanged. |
| 8 | Payment | PH adds "Founding client rate spots are secured with a deposit." This shows only while `FOUNDING_PH.on`. |
| 9–11 | Extra pages, maintenance, platform | Unchanged copy. Prices now read from `prices` in proof.ts instead of being hard-coded, so they can't drift. |
| PH | In person / outside Iligan | Unchanged. |

**Line 165 H2 (optional):** `Common questions.` → `Before you send your brief.` This frames the FAQ as the last step before the form directly below it.

---

### #8 Proof: frame the real work honestly, put it before pricing, and merge it with the Lab tiles

**Why:** The results section (117–128) is titled "Real clients. Real results." but sits under three bigger custom projects (a migration, a platform, a rebrand). A sharp buyer will notice those aren't 7-day builds. Saying so plainly *builds* trust. The Lab tiles (154–162) are fiction-labelled concept work and sit five sections away from the real work. Putting both together makes one "who's building my site" argument.

**Lines 124–125, current:**
> Client results / Real clients. *Real results.*

**Replace:**
```astro
<p class="mono">Client work · {countries.join(' · ')}</p>
<h2 id="rv-h" class="t-d2">Real clients. <span class="dim">Real projects.</span></h2>
<p>Our founder has delivered 120+ websites, brands and systems since 2022. These three were bigger custom builds, not 7-day sites. Your 7-day site is made by the same team with the same care.</p>
```
(`countries` from `../data/cases` renders "USA · Philippines · Australia". The 120+ wording matches proof.ts `stats[0]`: projects by our founder, delivered since 2022. Keep "by our founder". Do not change it to "we".)

Then render the results list (line 126, unchanged). After it, render the Lab block (lines 155–161) inside the same section, with its H2 demoted to an H3 `And what we build for fun.` Keep the existing Lab intro on line 157 word for word. It already labels the brands as fictional.

**Line 161, current:** `Like what you see? <a ...>Get my 7-day website →</a>` → `Like what you see? <a ...>Get my start date →</a>`

When `LP_REVIEWS_REAL` flips to true, move the testimonials block so it sits directly above pricing, or inside the form side (#10). Reviews do the most work right next to a decision.

---

### #9 Comparison table: drop the unsourced competitor numbers and keep the contrast

**Why:** "6–10 week delivery", "$3,000–$15,000+" and "₱150,000–₱500,000+" are claims about other businesses, and nothing in src/data backs them. One sceptical visitor who knows a cheaper agency stops believing the rest of the page. The contrast still works without the numbers.

**Lines 25–32, current → replace:**

| Typical agency (current) | Typical agency (replace) | Fazed (current) | Fazed (replace) |
|---|---|---|---|
| 6–10 week delivery | Launch dates measured in weeks or months | Live in 7 days | Live in 7 business days |
| ₱150,000–₱500,000+ / $3,000–$15,000+ minimum budget | Price on request, after a sales call | Fixed price from {P.starter} | Fixed price from {st.price}, listed below |
| Hourly rates and surprise invoices | unchanged | One flat fee. No surprises. | unchanged |
| Vague revision process | unchanged | 2, 3 or unlimited revision rounds, agreed upfront | unchanged |
| Multiple hand-offs and delays | unchanged | One team, a direct line | One small team, a direct line |
| Lock-in contracts | unchanged | You own it all. No lock-in. | unchanged |

If the owner has a real source for the ranges, keep them. That is OWNER CHECK #2.

**Line 81 H2:** keep `Why not just hire a regular agency?` **Line 82:** keep.

---

### #10 Form side: the last screen before Send

**Why:** This is where the decision happens. The H2 asks a yes/no question ("Ready to go live in 7 days?") when it could state what the visitor gets in return for a minute of their time. "No payment now" is the strongest reassurance on the site, but it only appears inside the form, never beside it. The PH founding rate isn't mentioned here at all.

**Lines 171–175, current:**
> We take on 15 seven-day builds a month, max.
> Ready to go live *in 7 days?*
> A few quick questions, mostly one tap each. We’ll reply within one business day with a confirmed start date. No commitment until you approve.
> ✓ No lock-in contracts · ✓ Fixed price, no surprises · ✓ 7 business days or 20% off · ✓ You own your site

**Replace:**
```astro
<p class="mono lp-cap">{capsCopy.sevenDay}</p>
{php && FOUNDING && <p class="mono lp-cap">Founding rate: Starter {FOUNDING_PH.price} for our first {FOUNDING_PH.spots} clients.</p>}
<h2 id="gs-h" class="t-d2">Get your start date <span class="dim">in one business day.</span></h2>
<p>A few quick questions, mostly one tap each. A real person replies within one business day, Monday to Friday, with your confirmed start date. No payment now, and no commitment until you approve the quote.</p>
```
Line 174 (PH Facebook line): keep.
**Line 175 pills:** `['No payment now', 'Fixed price, no surprises', '7 business days or 20% off', 'You own your site. No lock-in.']`

---

### Also worth doing (lower impact)

- **Sticky mobile CTA.** Below 768px, add a slim bottom bar after the hero scrolls out: `Get my start date →` plus `No payment now`. Hide it while `#get-started` is in view. Build it as a CSS sticky bar with an IntersectionObserver in the component script. Follow the house rule: guard with `dataset.bound`, run init immediately and on `astro:page-load`, and never import gsap.
- **PH meta (ph.astro line 19).** While the founding rate is on, the description could end with "Founding rate ₱14,999 for the first 5 clients." Keep the title on the standard price, since the founding rate is temporary.
- **Lab tile links** (line 159) open live concept sites in a new tab. That's fine, because the LP stays open. Keep `target="_blank"`.

---

## 2. Proposed section order

| # | Section | Source lines now | Its one job |
|---|---|---|---|
| 1 | Hero: H1, deck (#1), CTA + risk note (#2), PH founding banner (#3), days line, trust bar | 52–65 | Promise, price, first click |
| 2 | PH only: "Your Facebook page is rented" | 67–78 | Answer "I already have Facebook" |
| 3 | How it works, 7 business days, 5 steps (#4) | 130–134 | Make "7 days" believable |
| 4 | Proof: real client work + Lab concept sites (#8) | 117–128 + 154–162 | "Can these people do it?" |
| 5 | Agency comparison (#9) | 80–87 | Reframe the price |
| 6 | Pricing, with PH payments folded in, cap line, "Not sure yet" (#6) | 89–107 + 109–115 | The decision |
| 7 | Lime band: 7-day promise + CTA (#5) | 136–147 (merged) | Remove the risk at the price |
| 8 | FAQ (#7) | 164–167 | Answer the last objections |
| 9 | Form (#10) | 169–178 | Send |
| cut | "Speed meets quality" | 149–152 | Repeats sections 1, 3 and 5 |

A primary CTA appears in sections 1, 4 (after the tiles), 6 (each plan) and 7, then the form. That's one every one or two phone screens, and they all use the same label.

---

## 3. OWNER CHECK: confirm before using

1. **"Most popular" on Growth** (Lp.astro line 22 and LpForm.astro). Is it based on real orders? If not, use "Our pick for most businesses".
2. **Competitor ranges** "6–10 week delivery", "$3,000–$15,000+", "₱150,000–₱500,000+" (line 27). Is there a source? If not, use the #9 replacements, which are the recommended default.
3. **"Performance optimised (under 2s load)"** on Pro (line 23). Is this a promise you can keep on every Pro build, whatever the client's photos and hosting?
4. **Hosting and domain costs.** Day 7 says "We connect the domain, set up hosting" (line 38), but nothing on the page says who pays for hosting or the domain, or whether they're included. It's a common question. Answer it in the FAQ once confirmed. I did not add an answer.
5. **Payment schedule for standard (non-founding) builds.** Deposit amount, when it's due, and whether it's refundable. The page currently says only "No payment now" and "No commitment until you approve the quote". Confirm both stay true for the brief stage.
6. **Founding deposit.** The amount, and whether it's refundable if the client backs out before kickoff. Don't publish either until you decide.
7. **Cleen & Green result** in proof.ts: "a site that converts better". There's no metric behind it (`CASE_METRICS_REAL = false`). Confirm the client would agree, or reword it to "a site built to convert".
8. **"Unlimited revisions" (Pro) inside a 7-business-day window.** Confirm you're comfortable with the word, or add "within the 7-day schedule" to the plan row.
9. **USD FAQ "Who will I be working with?"** says "led by our founder" and gives your hours with UTC+8. Confirm US and AU clients get replies inside `NAP.hours` (Mon–Fri 8:30am–5:00pm PHT). It is already in lp.ts.
10. **H1 "7 days" vs "7 business days".** I kept "7 days" in the H1 to match the ads and meta titles, with "7 business days" in the line directly under it. If any ad promises "7 days" with no qualifier, add "business" to the ad copy too.

No new numbers, reviews, ratings, logos, awards or deadlines were introduced. Every figure renders from `proof.ts`, `offers.ts`, `cases.ts` or `site.ts`.


## Owner answers (2026-11-02)
- Domain: we can provide it. Hosting: the client's preferred host. Applied as a new FAQ + Day 7 copy.
- Under 2s load: confirmed, it's what we do. Pro row kept.
- Deposit: refundable. Worded as 'refunded if you change your mind before work starts' to match /terms (non-refundable once work has commenced). Amount not published.
- Still open: 'Unlimited revisions' on Pro within the 7-day window; 'Our pick' badge is an opinion (fine).
