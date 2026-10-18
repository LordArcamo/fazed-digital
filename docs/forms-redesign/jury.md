---
status: QA review (no source edited)
reviewer: Awwwards Jury + QA
date: 2026-10-18
build: commit 583ecb7 "Lead forms … (WIP, pre-QA)", dev server :4351
scope: LpForm.astro + forms/lp.ts (USD + PH), ContactForm.astro + forms/contact.ts, forms/captcha.ts, api/lp-submit.ts, api/contact.ts, lib/mail.ts, lib/hubspot.ts
evidence: docs/forms-redesign/jury/*.png (99 screenshots)
---

# Lead forms: jury report

## Verdict

**Honorable Mention level, but not shippable yet.** On desktop the takeover sheet with the live brief rail is the best form on the site. It is calm and typographic, and the "receipt" rail is a real idea. The engine is solid: tap, number keys and Enter all work, arrow keys never advance, Back keeps answers, resume works, and the duplicate guard holds. Two layout bugs block shipping. On desktop, the inline card sits in the wrong grid column. On mobile, the "Continue your brief" button overflows the page, so every phone visitor who answers Q1 gets a sideways-pannable page and a sheet that sits slightly off-screen. Both are one- or two-line CSS fixes.

## Scores

| Criterion | Score | Note |
|---|---|---|
| Design (40%) | **7.5** | The desktop sheet and rail are premium. The squeezed inline card and the collapsed mobile review let it down. |
| Usability (30%) | **6.8** | The core flow is excellent. Send is below the fold on 720p laptops, the first tap after an error misses, and the page jumps behind the modal. |
| Creativity (20%) | **7.8** | The brief-as-receipt rail, the CSS style specimens, the thumb-zone answers and the SIGNAL RECEIVED stamp. |
| Content (10%) | **8.3** | The copy matches copy.md almost line for line. The email labels and the mailto body still use old or raw values. |
| **Weighted Awwwards** | **7.4** | |
| Mobile | **FAIL → 6.0** | Fails until P0-2 is fixed. Thumb zone, 56px targets and full-screen sheet are right. |
| Accessibility | **PASS (with P1s) → 7.6** | Every text and state passes contrast. The fieldset/legend/h2 structure is right. Choice screens need a Continue button for AT users. |
| Performance | **CONDITIONAL → 6.5** | Eager LP form JS went from about 2.1 to 5.8 KB gz (spec: lazy, no growth). Lighthouse was not run (see "Not checked"). |
| Video-readiness | 7.5 | The desktop flow records beautifully. Fix P0-1 first, or the section shot shows the half-width card. |

## What's excellent (keep it)

1. **The input model is right everywhere.** A pointer tap advances (280ms; 450ms with reduced motion). Number keys 1–9 select and advance. Arrow keys only select (verified: two ArrowDowns kept `03 / 06` and selected "In 1–3 months"). Enter continues on every step. Enter in a text field moves to the next field, then sends. A double-tapped Send plus Enter produced **one POST** on the LP and on the contact form, and failed retries reuse the same `idem`.
2. **Resilience.** A server 500, a network abort and offline each keep the answers and show the right copy.md message. "Email it instead" builds a pre-filled mailto. After 8 s a "Still sending" note appears, `aria-busy` is set and the button is disabled. reCAPTCHA can no longer block a lead (4 s race in `captcha.ts`). The honeypot is off-screen, not `display:none`. Answers persist per variant (`fz-brief-v1-usd/php`) across close and reload, and resume lands on the first unanswered step ("Continue your brief · 4 of 7 answered").
3. **Semantics and contrast.** Each step is `fieldset > legend > h2[tabindex=-1]`. The sr-only "Question n of N:" is inside the h2, so the radio group's name includes the position. A polite status announces "{Option} selected.". Every visible text node in the sheet, the inline card and the contact form passes WCAG (lowest: 6.15:1 for gray-400 on gray-900). Tile and input borders are gray-500 on gray-800, which is 3.0:1. Every sheet control except the inline fine-print links is ≥44px. Reduced motion gives opacity-only transitions of .15s and `translate: none`. The pricing path recounts correctly (`01 / 06`, "Question 1 of 6"), and the "Growth · $899 selected · Change" chip reinserts Q1 as `01 / 07`.

---

## Fix list

### P0: blocks shipping

**P0-1 · Desktop: the inline start card is in the wrong grid column (and collapses to 233px after success)**
- **Where:** `src/components/Lp.astro:250` still targets the old form root: `.lp-form > :global(.lpf) { grid-column: 6 / span 7; }`. The new root is `.qf` (`LpForm.astro:23`), so it auto-places into the 5th column.
- **Evidence:** `jury/usd-d-10-card-default.png` (card 439px wide, "Not sure yet" breaks over 3 lines) and `jury/usd-d-08-card-after-success.png` (the success card is about 233px wide, 1 word per line).
- **Fix:** change the selector to `.lp-form > :global(.qf) { grid-column: 6 / span 7; }`.
- **Repro:** at 1440×900, open /lp/7-day-website and scroll to "Ready to go live in 7 days?".

**P0-2 · Mobile: the resume button overflows the page, so the sheet is offset and the page pans sideways**
- **Where:** `LpForm.astro:34` puts `.btn` (`base.css:64`, `white-space: nowrap`) around "Continue your brief · N of 7 answered →". The card stretches to the button's min-content width.
- **Measured:** `scrollWidth` 397–401 at 390px, and 401 at 320px. The overflow starts on the first answered question, because the button renders behind the open sheet. Once the layout viewport is wider than the device, the sheet's header is clipped about 14px at the top and a strip of page shows at the bottom (`jury/usd-m-03-business.png`, `usd-m-04-contact.png`, `ph-m-rm-03-business.png`, `w320_lp_7-day-website-card-resume.png`).
- **Fix:** in `LpForm.astro` `<style>`, add `.qf-resume .btn { white-space: normal; width: 100%; height: auto; min-height: 56px; padding-block: 12px; text-align: center; }`, or shorten the label on mobile ("Continue · 4 of 7").
- **Repro:** at 390×844 on a touch device, tap the hero CTA, tap any package, then read `document.documentElement.scrollWidth`.

### P1: holds back the score

**P1-1 · Every CTA scrolls the page to #get-started behind the modal, and focus returns to an off-screen opener**
- **Where:** `src/forms/lp.ts:415–424`. The delegated handler calls `preventDefault()`, but Lenis `anchors: true` (`src/motion/motion.ts:23`) listens on `window` and ignores `defaultPrevented` (`lenis.mjs` `onClick`).
- **Measured:** clicking the hero CTA moved scrollY from 0 to 6535. Clicking "Choose Starter" after a real wheel scroll moved it from 2040 to 6535. After Esc, focus is on the hero CTA at `top: -5969px`, so the next Tab jumps the page.
- **Fix:** add `ev.stopPropagation()` next to `ev.preventDefault()` at `lp.ts:422`, and in the `[data-start]` handler at `lp.ts:329–332`. The document listener runs before Lenis's window listener, so this stops the scroll.
- **Repro:** see `jury/close-return-hero.png`.

**P1-2 · Mobile Q7: the "review" is collapsed into a 33px scroll box**
- **Where:** `LpForm.astro:323`. `.brief[data-step='contact'] .brief-rail` is a flex child of `.brief-cols` and keeps `overflow-y: auto` from line 289, so it shrinks to 33px (`scrollHeight` 409).
- **Effect:** visitors see only the "YOUR 7-DAY BRIEF · USD" eyebrow over a hairline, with no rows and no Change buttons (`jury/probe-w390-contact.png`). The spec (§5, §6.3) requires the full brief above the fields. On the success screen it shows only the Package row (`usd-m-07-success.png`).
- **Fix:** add `flex: none; overflow: visible;` to that rule. Optionally hide the rail again on success, or keep it as the receipt in full.

**P1-3 · The first tap on Continue or Send after fixing an error misses**
- **Where:** the `lp.ts:272` change handler clears `errEl` when a field blurs. A 2-line error (such as the FB message or the PH phone message) collapses, so the button jumps up about 22px between touchstart and click.
- **Measured:** on PH at 390px, a bad FB link, then fix it, then tap Continue. The first tap only clears the error. The second tap advances.
- **Fix:** clear the message on `input`, so the shift happens while typing (Baymard, copy §4 "clear as soon as the visitor changes the field"). Also reserve the error height (`min-height: 2.8em`), or put the error above the fields.

**P1-4 · Desktop: Send is below the fold on 1280×720 and 1366×768 laptops**
- **Where:** `LpForm.astro:229`, where the dialog `height: min(760px, 100svh - 96px)` gives 624px. The `.brief-main` contact screen overflows by 208px, and Send sits at y=708 inside a 672px dialog with no scroll cue (`jury/size-1280x720-contact.png`). It is 148px short at 1024×768.
- **Fix:** add the spec §4 footer row. Make `.q-nav` sticky at the bottom of `.brief-main` on ≥1024 only (`position: sticky; bottom: 0; background: var(--gray-900); padding-block: 16px`), which is safe because the desktop has no virtual keyboard. Alternatively, reduce the `.brief-main` padding and the `.q-h` size at `max-height: 800px`.

**P1-5 · Choice screens have no Continue button, which strands assistive-tech and switch users**
- **Where:** `lp.ts:199` hides `[data-next]` on every choice screen except "Other". Advancing needs `click.detail > 0` (`lp.ts:261`), a number key, or a keydown Enter on a focused radio.
- **Risk:** in NVDA/JAWS browse mode and with some switch or voice tools, activating a radio sends a synthetic click (`detail 0`) and Enter never reaches the page. The selection is made, but nothing visible moves the user on.
- **Spec:** §4 Desktop wants a "footer row … Continue on the left".
- **Fix:** show `[data-next]` as `btn--ghost` on choice screens once a value is selected. Keep the auto-advance. Also change the hint to "Press 1–n or Enter".

**P1-6 · Leads can be lost silently on the server**
- **Where (LP):** `src/pages/api/lp-submit.ts:111` always returns `{ok:true}`, even when `mail === false` and HubSpot is not `'ok'`. The visitor sees success, the lead exists only in Vercel runtime logs (short retention), and the client's mailto fallback never appears.
- **Where (contact):** `src/pages/api/contact.ts:79` only fails on `unreachable && !emailed`, so a HubSpot `'rejected'` with a failed email also returns success.
- **Fix:** return 502 when `!mail && hs !== 'ok'` (LP) and when `!emailed && hs !== 'ok'` (contact). The client already maps 502 to "Your brief didn't send…" and shows "Email it instead".

**P1-7 · The pre-3D JS budget grew, against the spec's acceptance criterion**
- **Where:** `LpForm.astro:167–171` imports `../forms/lp` statically, so the whole engine loads eagerly on both LP pages.
- **Measured (rolldown, minified, gzip -9):** the new `lp.ts` is **5.8 KB gz**. The old `lp.ts` plus contact helpers was **2.1 KB gz**, so the eager JS grew by about 3.7 KB.
- **Spec:** §2.9 asks for a ≤0.6 KB shell plus a lazy engine ≤3.5 KB, and §6 says "LP pre-3D JS does not grow". CLAUDE.md caps pre-3D JS at 12 KB.
- **Fix:** split the engine. The shell binds CTAs, `[data-choose]` and the card, opens the dialog synchronously, and `import('../forms/lp')` on first intent (click, pointerdown, focusin, or an IO 100% rootMargin on `#get-started`). Then run `npm run build` and check the LP's pre-3D total against 12 KB.

**P1-8 · At 320px the Q5 style cards overflow off the sheet**
- **Where:** `LpForm.astro:320` `.q-opts--style { grid-template-columns: 1fr 1fr }`. "Professional" in Clash at `--fs-h3`, plus 20+44px padding, does not fit 2 columns in 288px. Bold and Playful are cut off (`jury/w320_lp_7-day-website-style.png`). The same happens at 390px with 200% text.
- **Fix:** use `grid-template-columns: repeat(auto-fit, minmax(min(100%, 9.5rem), 1fr))`. Alternatively, switch to `1fr` under 360px and drop `.qt--card .qt-b` right padding to 36px.

### P2: polish

1. **Q1 package cards have uneven heights.** On desktop Starter is 197px and Growth is 219px (`usd-d-01-q1.png`). Fix in `LpForm.astro:187`: make the `.qt` inside `.q-opts--cards` `display: grid`, and give `.qt-b` `height: 100%`. The same applies to the style cards.
2. **Mobile Q1 doesn't fit one screen.** The four 160px+ cards push "Not sure yet" below the fold, so the thumb-zone layout can't apply (`usd-m-01-q1.png`). On `<1024` hide `.qt-d` in Q1, or put the price on the name line.
3. **The resume prompt disappears when all 7 are answered but unsent** (`lp.ts:120` `r.hidden = !any || n >= 7`). After a failed send plus close, the card shows only the tiles again. Show "Your brief is ready · Review and send →" instead.
4. **Typing on arrival at a text step goes nowhere.** Focus is on the h2 (`lp.ts:207`). On `pointer:fine`, focus the first empty input instead. The fieldset legend still gives screen readers the question.
5. **Error UX on text steps.** Set `aria-invalid` and `aria-describedby` on the offending input, and move focus to it on failed Continue/Send (`lp.ts:217`, `lp.ts:339`). Today only the fieldset-level `role=alert` speaks.
6. **"Still sending. Your answers are saved."** is written into the error element, so it shows in error colour as `role=alert` (`lp.ts:355`). Put it in `.f-h` or under the button in gray-300.
7. **`info@fazeddigital.com` is plain text in every send-failure message.** This affects `lp.ts:29–30` and `contact.ts:26–29`, but copy §4 says "Render as a mailto link in every message". Use `innerHTML` with a fixed `<a class="link" href="mailto:…">`.
8. **The mailto fallback body uses raw keys and values** (`packageFrom: asked`, `goal: leads`, `styleVibe: minimal`) at `lp.ts:370`. Map them to the visible labels (`optLabel`) and drop `packageFrom` and `source`.
9. **The lead email uses old option wording.** `lp-submit.ts:18–24` `GOAL_LABELS`/`STYLE_LABELS` say "Get more leads & inquiries" and "Bold & Vibrant", but the visitor picked "Bring in more enquiries" and "Bold". Sync them with `LpForm.astro:17–19`.
10. **Wrong hint on Industry → Other.** It still reads "Press 1–9 to choose" next to Continue (`usd-d-13-other.png`). Switch it to "or press Enter ↵" once the text field shows (`lp.ts:201`).
11. **Number keys only work while focus is inside the `<form>`.** After clicking Back or ×, they do nothing (`lp.ts:292`). Bind the keydown on `sheet`.
12. **iOS VoiceOver fallback is missing.** On touch, the spec (§2.7) wants "{Option} selected. Question n of N." in the live region. Only "{Option} selected." is spoken (`lp.ts:275`).
13. **Page scroll isn't locked.** `html.brief-open` is added (`lp.ts:235`) but has no CSS, and on mobile `.brief-cols` (`LpForm.astro:315`) has no `overscroll-behavior: contain`. Add `html.brief-open { overflow: hidden }` and the overscroll rule.
14. **The inline success card stacks two eyebrows** ("YOUR 7-DAY BRIEF" over "BRIEF SENT"). Hide `.qf-eyebrow:first-child` on success (`lp.ts:402`).
15. **There is no no-JS path to a form.** The card tiles are `href="#get-started"` anchors to the same section, so without JS only the mailto line works. Either accept it and remove the claim from the spec, or add a `<noscript>` link to `/contact?service=7day`.
16. **The contact form keeps stale errors until resubmit.** The red border and text stay after a valid value is typed (`contact-d-03-tip.png`). Re-run `validate()` per field on `input` once a field has been marked invalid (`contact.ts`).
17. **The server never verifies captcha.** `lp-submit.ts` never verifies the token, and `contact.ts:45–57` only logs it, so spam protection is honeypot plus `[fast]` tag only. Add a soft score check (for example, tag `[low-score]` under 0.3) so the data is at least visible.
18. **HubSpot consent is hard-coded `consentToProcess: true`** (`hubspot.ts:28`) without any checkbox or consent text in either form. This is a business and legal call, so check it with the user. The visible fine print says "We'll only use your details to reply to you".
19. **The contact phone isn't sent as HubSpot's `phone` property.** It is only folded into the message (spec §7.1). Add `{ name: 'phone', value }` when present.

### Out of scope, found in passing

- At 320px the LP page already overflows by 13px before the form is involved. The cause is the status ticker span ("Closed · 15:46:27 PHT · Reply…"). `/contact` overflows by 31px (`.ct-ring.poster-art`).

---

## Test log (what was actually run)

| Check | Result |
|---|---|
| Happy path, USD and PH × 1440 and 390 (390 PH with reduced motion), hero CTA (Q1 asked, 7 steps) | ✅ 1 POST each, correct `variant`, PHP chip "Pro · ₱59,999", success copy per copy §5, "outside hours" line correct (Sunday) |
| Pricing button path (Q1 skipped, `01 / 06`, Change chip → `01 / 07`, Growth kept) | ✅ (but see P1-1) |
| Inline card tile → sheet at the next step | ✅ |
| "Other" industry: no auto-advance, focus goes to the text field, Continue appears, Enter continues, `industry: "Other: Dog grooming"` | ✅ (hint wording P2-10) |
| Back keeps answers (radio still checked, Other text kept) | ✅ |
| Arrow keys never advance; Space never advances; Enter advances; number key advances | ✅ |
| Validation messages (all copy §4 strings, PH phone rule, FB link rule, email typo "Did you mean jane@gmail.com?" with one-tap fix) | ✅ |
| Double-tap Send + Enter | ✅ 1 POST (LP and contact) |
| Esc and × close; reopen resumes; reload resumes; "Continue your brief · 4 of 7 answered" | ✅ (P0-2, P1-1, P2-3) |
| 500 / network abort / offline / slow 9.5 s | ✅ messages, mailto, busy state (P1-6, P2-6/7/8) |
| Focus: h2 on every step, success h2 on send, opener on close | ✅ (opener off-screen: P1-1) |
| Contrast (computed with alpha-composited backgrounds, every visible text node) | ✅ 0 failures in sheet, card and contact |
| Targets <44px | Only inline fine-print links (exempt under WCAG 2.5.8) |
| Desktop dialog sizes 1440×900 / 1280×720 / 1024×768; mobile full-screen 390 and 320 | ⚠️ P1-4, P1-8 |
| Console errors | None from our code. Only Google's report-only CSP `frame-ancestors` notice from reCAPTCHA (dev) and the stubbed 500/abort |
| Contact: grid order, phone error only when filled, 7-day tip toggle, 7 budget bands, success copy §7.4, no raw browser error text, honeypot field present, home page form has phone | ✅ (P2-16) |

**Safety:** every browser session stubbed `/api/lp-submit` and `/api/contact` with `{"ok":true}`, 500 or abort, and aborted `api.hsforms.com`, `api.resend.com` and smtp. No real lead was sent. Only one headless Chrome ran at a time.

**Not checked:**
- **Lighthouse.** It is not installed locally (it would need an npm download), and a run against the Vite dev server wouldn't give representative performance numbers. Run it once on `npm run build && npm run preview:lh` (port 4352) after the P0s.
- Real VoiceOver or TalkBack.
- Real iOS keyboard behaviour.
- Frame rate during the step transitions.
