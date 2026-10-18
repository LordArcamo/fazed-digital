---
status: spec (no code changed)
owner: World-Class Web Designer
date: 2026-10-18
scope: 7-day LP questionnaire (/lp/7-day-website, /lp/7-day-website/ph) + ContactForm (/contact, home)
pairs-with: docs/forms-redesign/copy.md (all user-facing strings live there; this file never overrides copy)
---

# Lead forms: UX/UI directions

This spec covers the UX/UI and is ready to build. All copy, labels, validation messages and success text come from `copy.md`, cited as §n. This file decides layout, states, motion, accessibility and edge cases inside the existing NETWORK system. That system is `tokens.css` and `base.css`: #090909 / #F5F4F0 / #C9FF57 (+ #9FCC2E), with Clash Display, Plus Jakarta Sans and Space Mono. Radius 999 is used on buttons and chips only, and gray-500 is for hairlines only.

---

## 0. What the code does today (audit that drives the spec)

| # | Finding | Where | Why it matters |
|---|---|---|---|
| 1 | The LP form has 5 heavy steps: package cards, 5 fields, a pages picker, colours, links, a referral select, notes and a review. | `LpForm.astro`, `forms/lp.ts` | Paid mobile traffic drops out at Step 2. |
| 2 | `lp.ts` imports `captcha` from `contact.ts`, which pulls the whole contact module (1.8 KB gz in the last `dist/`) onto the LP. | `forms/lp.ts:2` | Wasted pre-3D bytes. Split `captcha` into its own file. |
| 3 | **The client blocks on reCAPTCHA.** If an ad blocker or a slow network stops `api.js` loading, `captcha()` rejects and both forms refuse to send. The server only *logs* the captcha result (`api/contact.ts` TODO; `lp-submit` never checks it). | `forms/lp.ts:70`, `forms/contact.ts:69` | **These are leads lost for no security gain.** Race the token against a 4 s timeout and send `captchaToken: ''` on failure. The server decides. |
| 4 | The contact button is never disabled while sending. Only the label changes, so a double tap or Enter sends twice. | `forms/contact.ts:67` | Duplicate leads and duplicate HubSpot rows. |
| 5 | Neither form has a honeypot. | both | Spam ends up in five inboxes (`lp-submit` `LEAD_TO`). |
| 6 | Input and tile borders use `--gray-700` on `--gray-900`/`--gray-800`, which gives **1.39:1 / 1.19:1**. That fails WCAG 1.4.11, which needs 3:1 for non-text UI boundaries. | `.f input`, `.lpf-opt span`, `.lpf-card-b` | Fields are hard to see on low-end phones in daylight. |
| 7 | The error colour `#FFB3A8` / `#FF8A7A` is hard-coded and not a token. | `ContactForm.astro:52–56`, `LpForm.astro:123` | Conflicts with the tokens-only rule. See Decision D1. |
| 8 | PH leads are emailed with USD labels, because `PACKAGE_LABELS` has USD prices only and the payload has no variant. | `api/lp-submit.ts` | The sales reply quotes the wrong currency. |
| 9 | `LpForm.astro` hard-codes the prices instead of importing `prices` from `proof.ts`. | `LpForm.astro:7` | Two sources of truth. |
| 10 | Found in passing: `.lp-work-more .mono { color: var(--gray-500) }` uses gray-500 as **text** ("or"). | `Lp.astro:246` | Breaks the CLAUDE.md rule. Use gray-400. |

Measured contrast (WCAG, computed from the token hex values; use these, not guesses):

| Foreground ↓ / background → | black #090909 | gray-900 #111 | gray-800 #1C1C1C | lime #C9FF57 |
|---|---|---|---|---|
| white #F5F4F0 | 18.1 | 17.2 | 15.5 | 1.06 ✗ |
| gray-300 #BCBCBC | 10.5 | 9.9 | 9.0 | ✗ |
| gray-400 #939393 (min text) | 6.5 | 6.2 | 5.6 | ✗ |
| gray-500 #676767 (**border only**) | 3.5 | 3.3 | 3.0 | n/a |
| lime #C9FF57 | 17.0 | 16.1 | 14.6 | n/a |
| black on lime / on lime-dark #9FCC2E | n/a | n/a | n/a | 17.0 / 10.6 |
| #FFB3A8 (current error) | 11.6 | 11.0 | 10.0 | n/a |

**Rule used throughout:** text is white, gray-200, gray-300 or gray-400 only. Interactive boundaries are at least gray-500, which is ≥3.0:1 on gray-800 and 3.3:1 on gray-900. Selected states use lime.

---

## 1. References (each link opened with WebFetch on 2026-10-18)

| # | Reference | Verified | Takeaway we use |
|---|---|---|---|
| 1 | GOV.UK Design System, *Question pages*: https://design-system.service.gov.uk/patterns/question-pages/ | ✓ | One thing per page. **The question is the heading/legend.** Every page has Back + heading + Continue. Mark "(optional)", never asterisks. |
| 2 | GOV.UK, *Recover from validation errors*: https://design-system.service.gov.uk/patterns/validation/ · *Button* (`data-prevent-double-click`): https://design-system.service.gov.uk/components/button/ | ✓ ✓ | Validate on Continue, not on blur. Keep the user's input. `novalidate`. Server-side validation is mandatory. Block the second click **and** guard against double submits on the server. |
| 3 | NN/g, *Wizards*: https://www.nngroup.com/articles/wizards/ | ✓ | Show how long it is and where you are. Explicit Back. Each step fits one screen without scrolling. Pre-fill what we already know (the package from the pricing button). |
| 4 | NN/g, *Website Forms Usability: Top 10*: https://www.nngroup.com/articles/web-form-design/ | ✓ | Cut fields that can be collected later (pages, colours and links move to Day 1). One column. Radios over dropdowns. Visible labels, not placeholders. At most 1–2 optional fields. |
| 5 | Baymard, *Mobile touch keyboards*: https://baymard.com/blog/mobile-touch-keyboards | ✓ (2013–15 data, still valid) | The right keyboard per field (`type`/`inputmode`). Turn off autocorrect and autocapitalise on email. Users made more typos on the wrong keyboard. |
| 6 | Baymard, *Inline validation*: https://baymard.com/blog/inline-form-validation · *Required vs optional*: https://baymard.com/blog/required-optional-form-fields | ✓ ✓ | No premature errors. Clear an error the moment the input becomes valid. Marking only optional fields led 32% of test users into a required-field error, so the required count must be obvious (we keep ≤3 required per screen and say so). |
| 7 | W3C WAI, *Multi-page forms*: https://www.w3.org/WAI/tutorials/forms/multi-page/ | ✓ | Put "Step n of N" in the heading or title. Use a `<progress>`-style indicator, with any automatic animation stoppable (WCAG 2.2.2). Flag optional steps. No time limits. |
| 8 | Tally, *Multi-step forms* (auto-jump): https://tally.so/multi-step-forms | ✓ | Auto-jump is **opt-in** and **only** on one-question pages with single-choice, dropdown or rating questions. Never on text or multi-select. We copy that exact rule. |
| 9 | Typeform (official, conversational surveys): https://www.typeform.com/surveys/ · staff answer on Enter and auto-advance: https://community.typeform.com/questions/3273 | ✓ ✓ (the help centre is not indexed; the community thread is staff-answered) | Single-choice answers auto-advance and you can always go back. **Enter always advances**, so a long-text field needs Shift+Enter (we avoid long text in the flow). The visible OK button stays for accessibility. |
| 10 | Venture Harbour, *Multi-step lead forms*: https://ventureharbour.com/multi-step-lead-forms-get-300-conversions/ · Giroux, Tharp & Wietelman, *Auto-advancement in mobile and web surveys*, Survey Practice 2019: https://www.surveypractice.org/article/6381 | ✓ ✓ | Ask easy, low-risk questions first and contact details **last**, after users have "skin in the game". Show progress. Use tappable tiles, not text fields. Keep the phone optional. (Practitioner case studies, not controlled research.) Peer-reviewed: auto-advance made no difference to breakoff on mobile, *reduced* missing answers on desktop, and was rated easier to use. |

Also opened: Formbricks *Single select* docs (https://formbricks.com/docs/surveys/question-type/select-single). It confirms the title + optional description + radio list anatomy and the "Other" + free-text option, but documents no auto-advance. Not used beyond the anatomy. **Bot-blocked or empty:** escholarship.org (a next/back-button study) returned an empty page, so it is not cited.

**Synthesis:** one question per screen. The heading is the question. Auto-advance only on single-choice and only on pointer input. Enter = Continue. Contact details go last. The package is pre-filled when we know it. Progress is always visible. Validate on Continue. Disable while sending and dedupe on the server. Never let a third-party script block a lead.

---

## 2. Shared foundation (all three directions)

### 2.1 Flow (orchestrator's flow kept, with 3 refinements)
Package-first stays, because the most common entry is a pricing button, which skips Q1. That keeps the price anchor straight after the pricing table, and "Not sure yet" is the escape. I considered Goal-first and rejected it: it would recount the progress for the majority path and push the price question later, when it feels like a surprise.

| Step | Screen | Type | Auto-advance | Notes |
|---|---|---|---|---|
| Q1 | Package (copy §2 Q1) | 4 tiles (3 + "Not sure yet") | yes | **Removed from the sequence** when `[data-choose]` set it. Total becomes 6 and the count starts at 1/6. Q2 shows the chip "Growth · $899 selected · Change" (copy §2). "Change" inserts Q1 back in place and goes there. |
| Q2 | Industry | chips, single | yes, **except "Other"** | "Other" reveals one optional text field + Continue (copy §2 Q2). |
| Q3 | Goal | tiles, single | yes | |
| Q4 | Launch timeline | 4 tiles | yes | |
| Q5 | Style | 4 cards (2×2) | yes | |
| Q6 | Business name (+ PH Facebook page, + "Current website" if Q3 = `replace`) | text | no (Enter/Continue) | Refinement 1: conditional field instead of always asking. |
| Q7 | Contact: name, email, phone (optional), + collapsed "Add a note" | text | no | Refinement 2: on mobile this screen carries the **mini brief** (it replaces the old Review step). Refinement 3: email typo hint (§2.6). |

Not asked, captured automatically: `variant`, `source{utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid?, fbclid?, referrer, landing, firstSeen}`. Store these on the first LP page view in `sessionStorage['fz-src']` (first touch wins within the session) and attach them at submit.

### 2.2 Payload contract (API changes needed; spec only)
`POST /api/lp-submit` →
`{ variant:'usd'|'php', package:'starter'|'growth'|'pro'|'unsure', packageFrom:'pricing'|'asked', industry, industryOther, goal, timeline:'asap'|'month'|'quarter'|'exploring', styleVibe, businessName, facebookPage, currentWebsite, name, email, phone, notes, source:{…}, website:'' /*honeypot*/, t /*ms from open to send*/, idem /*crypto.randomUUID() per brief*/, captchaToken }`

Server:
- Label maps per `variant`, built from `proof.ts` `prices`. Add the `unsure` and timeline labels.
- Honeypot filled → return `{ok:true}` and send nothing.
- If `t` < 2500 ms → add a `[fast]` tag to the subject. Flag it, don't block.
- Same `idem` within 10 min → return ok and don't send again.
- Keep accepting the old keys (`pagesNeeded`, …) for one deploy, so cached pages still work.

### 2.3 Option tile (one component, three sizes)
Markup: a native `<input type="radio">` inside a `<label class="qt">`, inside a `<fieldset>` whose `<legend>` contains the question `<h2>`. No ARIA radio re-implementation.

| Size | Use | Min height | Padding | Content |
|---|---|---|---|---|
| `qt` (row) | goal, timeline | **56px** mobile / 64px ≥1024 | 0 20px | [key hint] label (Jakarta 500, 1.0625rem = `--fs-body`, white) · [node] |
| `qt--chip` | industry | **48px** | 0 18px, `border-radius: 999px` | label only, 1rem |
| `qt--card` | package, style | 112px (package) / 128px (style) | 20px | package: name (Clash 600, `--fs-h3`) + price (Clash 600, 2rem) + "for" line (gray-300) + detail (gray-400, .875rem) · style: a CSS-only mini-specimen 48px tall + title + descriptor |

Layout: one column of tiles with `gap: 8px` on mobile. At ≥768: rows stay one column (max-width 560px), chips flow in 2 columns, cards go 2×2.

**States** (no state relies on colour alone: the node and the outline add shape):

| State | Border | Background | Text | Node (11px circle, right edge) | Other |
|---|---|---|---|---|---|
| default | 1px `--gray-500` | `--gray-800` | white (15.5:1) | 1px `--gray-400` ring | |
| hover (`@media (hover:hover)`) | 1px `--gray-300` | `--gray-700` | white | ring white | `transition: background-color .2s, border-color .2s` |
| focus-visible (on the input → `+ .qt-b`) | unchanged | unchanged | | | `outline: 2px solid var(--lime); outline-offset: 3px` (system) |
| active (pressed) | | | | | `scale: .985` for 120ms `--ease-out` |
| **selected** (`:checked`) | 1px `--lime` + `box-shadow: inset 0 0 0 1px var(--lime)` | `--lime-06` | white | filled `--lime` + `box-shadow: 0 0 0 6px var(--lime-12)` (the `.lp-days li.lit` node, reused) | one "blink": background `--lime-12` → `--lime-06` over 240ms |
| disabled (during step change / sending) | `--gray-700` | `--gray-900` | **gray-400** (6.2:1, still legible) | ring gray-500 | `cursor: default`; set via `inert` on the step, not per input |
| error (Continue pressed with nothing chosen) | fieldset gets a 2px left rule in the error colour (D1) | | message under the legend | | `aria-invalid` on the first radio, `aria-describedby` → message |

**Key hints** (desktop, `@media (hover:hover) and (pointer:fine)` only, `aria-hidden="true"`): a 24×24 box, Space Mono 12px, gray-300 on a gray-500 border, showing 1–n. On selection the box fills lime with a black numeral. On touch they are hidden (copy §3).

**"Not sure yet" package tile:** same card, with a **dashed** 1px gray-500 border and no price. It must not look like a fourth plan.

**Style mini-specimens** (CSS only, palette only, no images, 48px tall):
- minimal: two 1px gray-400 lines + a 6px lime dot
- bold: one solid white block 60% wide + a lime bar
- corporate: a 3-column grid of gray-500 hairline boxes
- playful: three circles of different sizes, white, gray-300 and lime

They are decorative, so `aria-hidden`.

### 2.4 Text screens (Q6, Q7)
- Inputs: height **56px**, font-size 1.0625rem (≥16px, so iOS doesn't zoom), `--gray-800` background, 1px **`--gray-500`** border (fixes finding 6), radius 0. Focus: border lime + system outline. Labels: Space Mono 12px uppercase gray-300, above the field. Helper: .875rem gray-400.
- Attributes:
  - name: `autocomplete="name" autocapitalize="words" enterkeyhint="next"`
  - email: `type="email" inputmode="email" autocomplete="email" autocapitalize="off" spellcheck="false" enterkeyhint="next"`
  - phone: `type="tel" inputmode="tel" autocomplete="tel" enterkeyhint="send"`
  - business: `autocomplete="organization" autocapitalize="words" enterkeyhint="next"`
  - Facebook / current website: `inputmode="url" autocapitalize="off" spellcheck="false"`, no `type=url` (it rejects "facebook.com/x" without a scheme; we normalise instead).
- Enter in a field moves focus to the next field. Enter in the last field = Continue/Send. The note `<textarea>` is the only multi-line field: Enter = newline, and Send is the button.
- **The Continue button sits directly under the last field, in the flow.** It is never `position: sticky` at the bottom. The iOS keyboard can't cover it, and no `visualViewport` hacks are needed.

### 2.5 Progress
- A 2px track (`--gray-700`) spans the panel's full width under the header. The fill is a `--lime` element with `transform: scaleX(n/N)`, `transform-origin: left`, transition `.48s var(--ease-out)`.
- On the left of the header row: mono `03 / 07`, shown as `0n / 0N` (Space Mono 12px, gray-300; the current number white). It is `aria-hidden`, because the SR text is in the heading (§2.7).
- Endowed progress: the fill shows the *current* step (1/7 already lit on the first screen), not the count of answers. That is honest and still starts non-empty (Venture Harbour).
- No looping or automatic animation, so WCAG 2.2.2 is satisfied.

### 2.6 Validation and edge cases
| Case | Behaviour |
|---|---|
| Choice screen, Enter/Continue with nothing chosen | Message under the legend (copy §4). Focus stays on the heading, then moves to the first tile. No auto-scroll jump. |
| Text screen | Validate on Continue only (GOV.UK). Clear each message on `input` once valid (Baymard). Optional fields never error when blank. Phone: digits 7–15 after stripping `+ ()-.` spaces. PH: also accept `09XXXXXXXXX`. |
| Email typo | On Continue, if the domain is within edit distance 1 of `gmail.com, yahoo.com, outlook.com, hotmail.com, icloud.com, ymail.com`, show "Did you mean name@gmail.com?" as a text button that fixes it in one tap. This doesn't block sending. About 300 B of JS. |
| Pre-selected package | Q1 is removed and Q2 shows the "Change" chip. If the visitor taps a *different* pricing button later, the sheet reopens on the current step with the new package and the chip updated. Answers are kept. |
| Back | Always available from step 2 and in the header. It returns to the previous step **with its answer still selected**, and focus goes to that heading. A choice screen reached by Back does not auto-advance on re-render; it auto-advances only on a new tap. Tapping the *already-selected* tile advances again. |
| Double tap on a tile | The first selection starts the 280ms advance timer. During the timer and the transition, the step is `inert`, so later taps are ignored. A different tile tapped within the first 280ms **replaces** the choice and restarts the timer, because that is a correction, not a double tap. |
| Arrow keys in a radio group | They change the selection but **never** auto-advance. Only pointer input (`click` with `event.detail > 0`) or a number key 1–n auto-advances. Keyboard users press Enter. This is critical: without it, arrowing through options would skip questions. |
| Leaving mid-way | Answers persist in `sessionStorage['fz-brief-v1']` (cleared on success and when the tab closes). Reopening resumes at the first unanswered step. The inline card shows "Continue your brief · 4 of 7 answered". |
| Slow submit | Button disabled, label "Sending your brief…", `aria-busy="true"`, polite status. After **8 s** the helper says "Still sending. Your answers are saved." `AbortController` timeout at **20 s** → error state. |
| Failed submit | The error message (copy §4) goes in `role="alert"` above the button. The button is re-enabled with its label restored. Answers stay. A secondary link "Email it instead" opens `mailto:info@fazeddigital.com` with subject `7-day brief: {business}` and the answers as the body (URL-encoded). The brief is never lost. |
| reCAPTCHA blocked or slow | Don't show an error. `Promise.race([captcha(), timeout(4000)])` → send with `captchaToken: ''`. Show the copy §4 reCAPTCHA message only if the **server** returns 4xx `captcha`. Note for the Wordsmith: this narrows when that message appears. |
| Offline | `navigator.onLine === false` at Send → copy §4 "Offline" message, answers kept (this build keeps them, so the copy is allowed). |
| Honeypot | `<div class="hp" aria-hidden="true"><label>Leave this empty<input name="website" tabindex="-1" autocomplete="off"></label></div>`, positioned off-screen (`position:absolute; left:-10000px; width:1px; height:1px; overflow:hidden`), **not** `display:none`. |
| ClientRouter navigation while open | On `astro:before-swap`, close the sheet: restart Lenis, remove the `html.brief-open` class. Don't touch sessionStorage. |
| Success | See each direction. `__field?.signal()`. `dispatchEvent(new CustomEvent('fz:lead', {detail:{form:'lp', variant, package}}))` for analytics. GA only listens if consent was given (consent model unchanged). Clear `fz-brief-v1`. |

### 2.7 Keyboard and screen reader
- Each step is a `<fieldset>` whose `<legend>` holds `<h2 tabindex="-1" class="q-h">`, so the question is both the heading and the group label (GOV.UK). The visible text is the question only. A visually hidden prefix `<span class="sr-only">Question 3 of 7: </span>` sits inside the h2.
- **On step change:** hide the old step (`hidden` + `inert`), show the new one, then `h2.focus({preventScroll:true})`, after the enter transition starts and within the same frame as the reveal, so VoiceOver reads the new heading. A separate `role="status" aria-live="polite"` region speaks only transient messages: "{Option} selected." (copy §2), "Sending your brief…", "Still sending…". **It does not repeat the step**, which avoids double speech. On iOS VoiceOver, where focusing a `tabindex=-1` heading is sometimes silent, the status text "{Option} selected. Question 4 of 7." covers it. Use that combined string on touch only.
- Tab order per step: Back → tiles (one tab stop, arrows inside, native radio behaviour) → Continue. Esc closes the takeover (native `<dialog>` cancel) and returns focus to the CTA that opened it.
- Number keys 1–9 select and advance on choice screens. They are ignored when focus is in a text field or when a modifier key is held.
- `document.title` is not changed per step. It is a modal inside one page, and changing the title would pollute history in the ClientRouter.
- Targets: tiles ≥48px, header buttons 44×44, primary buttons 56px on mobile and 48px (`.btn`) on desktop. All meet the 44px rule.
- `forced-colors: active`: tile borders become `CanvasText`, selected = `Highlight` outline 2px, and the node uses `forced-color-adjust: none` with `background: Highlight`.

### 2.8 Motion (CSS only; JS only toggles classes)
| Moment | Spec | Reduced motion |
|---|---|---|
| Step out | `opacity 1→0`, `translate 0 → 0 -12px`, **180ms** `--ease-io` | opacity only, 120ms |
| Step in (forward) | `opacity 0→1`, `translate 0 16px → 0`, **360ms** `--ease-out`, 60ms delay | opacity only, 120ms |
| Step in (Back) | mirrored: from `0 -16px` | opacity only |
| Auto-advance delay | **280ms** after a pointer selection (enough to see the blink) | **450ms** (no slide, so the confirmation needs longer to read) |
| Selection blink | background lime-12 → lime-06, 240ms | none (static lime-06) |
| Progress fill | scaleX, 480ms `--ease-out` | 150ms (base.css clamps it) |

Use **transitions, not `@keyframes`**: `base.css` sets every animation under reduced motion to 0.001ms, which would skip states. Under `prefers-reduced-motion: reduce` set `translate: none` explicitly. `base.css` already clamps durations to .15s but would still move things.

### 2.9 JS architecture and budget (pre-3D ≤ 12 KB gz)
- `src/forms/captcha.ts`: `loadRecaptcha` + `captcha` moved out of `contact.ts` (~0.4 KB). Both forms import it.
- `src/forms/brief.ts`: the questionnaire engine, ≤ **3.5 KB gz**. No libraries, no gsap or three imports. Field effects use only `window.__field?.…` (optional chaining; absent on T0, reading pages and slow phones).
- The component `<script>` is a **≤ 0.6 KB shell**:
  - it binds `[href="#get-started"]`, `[data-choose]` and `.sd-go` clicks plus the inline card, using the `root.dataset.bound` guard and `init(); document.addEventListener('astro:page-load', init)`
  - it opens the dialog **synchronously** (the markup is server-rendered, so the sheet appears instantly)
  - it `import('../forms/brief')` on the first intent: CTA click, pointerdown or focusin in the card, or an IntersectionObserver with a 100% rootMargin on `#get-started`
  - Radios work natively before the engine arrives. On load the engine reads the current `:checked` state and continues.
- Lenis: `bus.lenis?.stop()` on open and `bus.lenis?.start()` on close. The dialog scroll container gets `data-lenis-prevent`. Import only `bus` (tiny), never `motion`.
- Expected LP pre-3D JS: about the same as today. The old `lp.ts` (1.9 KB) + `contact.ts` (1.8 KB) are replaced by a 0.6 KB shell + 0.4 KB captcha, eager; the engine is lazy.

---

## 3. Direction A: "Inline Console"

The questionnaire lives inside the existing `#get-started` card, one question at a time. There is no overlay. Every CTA scrolls there (Lenis `anchors: true`, as today).

**Desktop (≥1024)**
- The section grid is unchanged: side copy in cols 1–4, the card in cols 6–12 (`.lp-form > .lpf`).
- The card: `--gray-900`, 1px `--gray-700` outer border (decorative), padding `calc(var(--pitch) * 2)` = 48px, **`min-height: 600px`** fixed, so steps don't change the page height and shift the field anchors.
- Header row 44px: Back (44px ghost circle, "←") · `03 / 07` mono · nothing on the right. The progress track sits flush under the header, full card width.
- Question h2: `font-size: min(var(--fs-d2), 3rem)`, Clash 600, white, max 16ch. Helper: `--fs-body` gray-400, 8px below. Tiles start 32px below.
- Continue (choice screens: shown but secondary, `btn--ghost`; text screens: `btn--lime`) is left-aligned (GOV.UK) 32px under the content, with "or press Enter ↵" in mono gray-400 beside it.

**Mobile (<768)**
- The card is full container width (`--side` 16px gutters) with 20px padding and `min-height: calc(100svh - 160px)`.
- The side copy stacks *above* the card, as today. Recommend moving the pills *below* the card on mobile, so a CTA tap lands with the question in view: `scroll-margin-top: 16px` on the card, and the CTA links target `#brief` (the card) instead of the section heading.
- The LP dock already hides at `#get-started` (`nav.ts`), so no conflict.

**Transitions:** §2.8, inside the card. **Field tie-in:** on a pointer selection, `__field?.ripple(tileRect.left + tileRect.width/2, tileRect.top + tileRect.height/2, .35)` (the same amplitude as the controller's beat ripple). Desktop and pointer:fine only, never under reduced motion. On success, `__field?.signal()`.

**Success:** the card content is replaced: copy §5 headline (`t-d2`, focused) and body, the talk-sooner line with `tel:` and `mailto:` links, then two ghost buttons (copy §5 links).

**Why it converts:** zero modal risk, SEO and back-button behaviour stay trivial, and desktop users keep the persuasive side copy beside the question.
**Risks:** on mobile the visitor is still "on the page". The dock, the field, the scroll position and the virtual keyboard all compete. Scroll jumps when steps change height (contained by `min-height`, not removed). Every CTA tap is a long Lenis scroll before the first question. On phones this is the weakest option.

---

## 4. Direction B: "Focus Takeover"

Any CTA opens a native `<dialog>` (`showModal()`): one question at a time, nothing else on screen. The `#get-started` section keeps an inline **start card** (Q1 rendered as real tiles). Tapping any tile there opens the sheet at the next step. That card is also the no-JS and SEO surface.

Why `<dialog>`:
- the top layer sits above the dock (z 50) and the cookie banner (z 60) without z-index wars
- the background becomes inert for free
- Esc and the cancel event come built in
- Chrome on Android (120+) closes modal dialogs with the system back gesture through its close-watcher integration, so "Back closes the form" works without touching history. Leave history alone, because the ClientRouter owns it.

**Desktop (≥1024)**
- `dialog.brief`: `width: min(720px, calc(100vw - 2 * var(--side)))`, `height: min(760px, calc(100svh - 96px))`, centred, `--gray-900` with a 1px `--gray-700` border, radius 0, `box-shadow: var(--capsule-sh)`.
- `::backdrop { background: rgba(9, 9, 9, .82) }` (black at 82%). The dot field stays faintly visible around the panel, which is where the field ripple shows.
- Inner layout:
  - header 64px: Back (44px circle, ghost) · `03 / 07` · close (44px circle, white with a black ×, the `.menu-x` style)
  - progress track
  - scroll body with padding 48px
  - footer row 80px with Continue on the left, "or press Enter ↵", and on the right the mono price line "Growth · $899 · 7 business days", which appears once a package is known (it reminds them what they're buying)
- Question sizes as in A.

**Mobile (<1024)**
- The dialog is full-screen: `width: 100vw; height: 100dvh; max-width: none; max-height: none; margin: 0`, with padding `env(safe-area-inset-top) 0 env(safe-area-inset-bottom)`, background `--black` (true black, so the panel *is* the screen).
- Header 56px: Back 44px · `03 / 07` centred · close 44px. Then the track.
- Body padding `24px 16px`.
- **Thumb-zone layout:** the body is `display:flex; flex-direction:column`. The heading block sits at the top and the tile list has `margin-top: auto`, so on tall phones (≥760px) the answers sit in the lower half under the thumb. On short phones the list simply follows the heading (no overflow, because `margin-top:auto` collapses).
- Text screens (Q6, Q7) drop the auto margin so fields stay high above the keyboard. Continue/Send is in the flow under the last field (§2.4), full width, 56px, `btn--lime`.
- Below the button sit the fine print and the pills in one mono line: "No lock-in · Fixed price · 7 business days or 20% off" (existing pills, gray-400).

**Open/close (CSS only, `@starting-style` + `transition-behavior: allow-discrete`; browsers without it just appear):**
- mobile: `translate: 0 100% → 0`, 420ms `--ease-out`; backdrop fades over 240ms; close reverses at 260ms `--ease-io`
- desktop: `opacity 0→1; scale .98→1`, 320ms `--ease-out`
- reduced motion: opacity only, 150ms
- On open: `html.brief-open` and `bus.lenis?.stop()`. On close: restore both and return focus to the opener.

**Entry routing:**
- hero CTA / `.sd-go` / mid-band CTA → open at the first unanswered step
- `[data-choose]` → set the package, open at the first unanswered step after Q1, with the "Change" chip
- tapping a tile in the inline start card → record it, open at the next step

The `#get-started` hash link still works without JS, because it's a normal anchor.

**Field tie-in:** desktop only (on mobile the black sheet covers the canvas). Ripple at the selected tile centre with amplitude .35, and `signal()` on success, so the whole field pulses behind the sheet. Never under reduced motion. Never on T0.

**Success (in the sheet):**
- the progress fills to 100% and the header count becomes `SENT`
- body: copy §5 headline (h2, focused), body, the "get ready" line, the talk-sooner line
- a mono stamp, reusing the contact form's pattern: `SIGNAL RECEIVED · {date} · {time} PHT`
- buttons: `Close` (`btn--lime`, returns to the page and the inline card shows the same success state) and the copy §5 links as ghosts

**Why it converts:** paid mobile visitors get one decision per screen with nothing else to look at. The CTA tap feels instant, with no long scroll. Answers sit in the thumb zone. The commitment ladder (package, then details, then contact) runs without distraction. **Risks:** modal fatigue on desktop. iOS edge swipe-back leaves the page, but answers survive in sessionStorage and the inline card offers "Continue your brief". Needs the Lenis stop/start discipline.

---

## 5. Direction C: "Brief Builder" (split view)

The visitor watches their project brief assemble as they answer. Left: the question. Right: a live "YOUR 7-DAY BRIEF" sheet, typeset like a spec sheet, filling in line by line.

**Desktop (≥1024).** It runs either inline in `#get-started` (replacing the side copy) or inside the B dialog widened to `min(1040px, 100vw - 2*side)`.
- 12-column grid: the question pane spans 7 columns, a 1px `--gray-700` vertical rule, and the brief pane spans 5 columns.
- Brief pane:
  - padding 40px, background `--black`
  - heading: mono "YOUR 7-DAY BRIEF · {USD|PHP}" in lime
  - a `<dl>` with 7 rows (Package, Industry, Goal, Launch, Style, Business, Contact), each row 44px, mono labels (gray-400) and values in Jakarta 500 white
  - unanswered rows show "—" in gray-400 over a dashed gray-500 hairline
  - when a value lands, the row's hairline turns solid lime with `scaleX 0→1` over 360ms `--ease-out` (the `.link` highlighter language)
  - every answered row is a `<button>` ("Change goal: Bring in more enquiries") that jumps to that step
- Pane footer:
  - the price line "Growth · $899 · fixed"
  - the existing pills as a 2×2 mono grid
  - the cap line (`capsCopy.sevenDay`, unchanged and only if the user keeps it; copy §8 item 7)

**Mobile (<1024)**
- The brief pane collapses to a **brief strip**: one mono line under the progress track, 32px tall, gray-300, e.g. `GROWTH · FOOD & RESTAURANTS · ENQUIRIES`, with an ellipsis on overflow.
- It is a button: `aria-expanded`, opening the full `<dl>` as an inline disclosure (not a nested modal).
- On Q7 the full brief is shown above the fields as the review, with a "Change" per row. That replaces the old Step 5 at zero extra screens.

**Transitions:** §2.8, plus the row-fill line. Reduced motion: the value appears, with no line sweep.
**Field tie-in:** as in B. Optionally, `ripple` at the *brief row* position, so the "signal" travels from the tile to the brief. It is a 2-call flourish, desktop only.
**Success:** the brief pane stamps `SENT · {time} PHT` across its header in lime. The question pane shows the copy §5 success. The brief stays visible as a receipt.

**Why it converts:** the endowment/IKEA effect. Visitors see an artifact they made, so abandoning means throwing it away. It doubles as the review step, so the old Review screen is gone without losing the check. **Risks:** it is the most layout to build and test. On desktop it competes for attention with the question. On mobile it degrades to a strip, so most paid traffic gets little of the benefit. The brief is meaningless on Q1, so the pane needs a good empty state: show the 7 labels with dashes and a single line from copy.md, "Your answers build your brief here". **That empty-state string needs a Wordsmith line, so flag it.**

---

## 6. Recommendation: **B (Focus Takeover) as the shell, with C's brief as the desktop rail and the Q7 review. A's inline card is the entry, resume and no-JS surface.**

The three don't compete. They are one component with three layouts, built once.

1. **Most of the traffic is mobile paid traffic.** B is the only direction where a CTA tap goes straight to the first question in about 0.1 s, with no Lenis scroll, no dock, no field and no page behind it. The answers sit in the thumb zone. A leaves mobile visitors scrolling through a long page with a form somewhere on it.
2. **The pricing-button path is the high-intent path**, and B serves it best: tap "Choose Growth" and you are on "What kind of business is it?" with the "Growth · $899 selected · Change" chip, without losing your place on the page.
3. **C's brief solves the review problem.** We dropped the Review step to save a screen. On desktop the brief rail is a constant review. On mobile Q7 shows the compact brief above the fields, so no extra screen is needed. That gives the endowment effect at almost no extra JS (the same answer map, rendered twice).
4. **The inline A card stays**:
   - for visitors who scroll there without tapping a CTA (the tiles are real, and one tap opens the sheet)
   - for SEO and no-JS
   - as the "Continue your brief · 4 of 7" resume point after an accidental close or an iOS swipe-back
5. **The system fits:** a `<dialog>` in the top layer over the persistent dot field reads as "focus mode" in the NETWORK language. The field ripple and signal are optional extras on desktop only, and the brief stays inside the 3.5 KB engine budget.

**Build order:**
1. `captcha.ts` split + non-blocking captcha + honeypot + `idem` (a quick win for both forms, ship first)
2. the engine + B mobile
3. B desktop + the C rail
4. the inline start/resume card
5. the API label/variant changes (§2.2)

**Acceptance:**
- every choice step can be finished with a single tap
- arrow keys never advance
- Enter advances on every step
- VoiceOver (iOS) and TalkBack read the question on each step
- no text below 4.5:1, no boundary below 3:1
- LP pre-3D JS does not grow
- with the ad blocker on, a lead still arrives
- a double-tapped Send arrives once

---

## 7. Contact form fixes (`ContactForm.astro` + `forms/contact.ts` + `api/contact.ts`). Keep the layout.

Strings come from copy §7. Structure and behaviour:

### 7.1 Phone field (optional)
- **Grid order** (2 columns ≥768, so it fills today's empty cell next to Budget): `name | email` · `phone | company` · `service | budget` · `message (wide)`. On mobile, one column in the same order.
- Markup, following the existing pattern:

```html
<div class="f"><label for={`${id}-phone`}>Phone (optional)</label>
  <input id={`${id}-phone`} name="phone" type="tel" inputmode="tel" autocomplete="tel"
         enterkeyhint="next" aria-describedby={`${id}-phone-h ${id}-phone-e`} />
  <p class="f-h" id={`${id}-phone-h`}>…copy §7.2 helper…</p>
  <p class="f-e" id={`${id}-phone-e`} aria-live="polite"></p></div>
```

- Validate only if filled: 7–15 digits after stripping `+ ()-.` and spaces → error per copy §7.5. Add `phone` to `ContactPayload`, `serialise`, and the `for (const k of [...])` error loop (only when it has an error).
- API: accept `phone`; add a "Phone" row to the lead email; fold `Phone: …` into `fullMessage`; and send HubSpot's standard `phone` field.

### 7.2 Honeypot
Same markup as §2.6 (`name="website"`). It goes after the grid inside the form, before `.cf-foot`. Serialise it. The server returns `{ok:true}` and skips email and HubSpot when it is filled. The client behaves normally, so bots get a success.

### 7.3 Button disabled while sending + non-blocking captcha
- At the top of the submit handler: `if (sending) return;`. After validation passes, set `sending = true`, `btn.disabled = true`, `btn.setAttribute('aria-busy','true')`, pause the magnetic pull (e.g. `btn.dataset.magneticOff = '1'`, checked by the motion chunk), label "Sending…".
- `.btn--lime:disabled { background: var(--lime-dark); color: var(--black); cursor: progress; }` gives **10.6:1**, so it stays legible and still reads as "the button".
- Captcha: `Promise.race([captcha('contact'), timeout(4000)]).catch(() => '')`.
- `fetch` with an `AbortController`, 20 s timeout.
- Map a `TypeError` (network) to the copy §7.5 "Network failure" line. Never show raw `x.message` from the browser (copy.md builder note).
- `finally`: re-enable **only on the error path**. On success the form is hidden anyway.
- "Send another message" resets `sending` and the button.

### 7.4 Budget options with a lower band
Use copy §7.3 option A: `Under $1,500 / ₱60,000 · a 7-day website`, `$1,500–$3,000`, `$3,000–$5,000`, `$5,000–$10,000`, `$10,000–$20,000`, `$20,000+`, `Not sure yet`, with the "In USD…" helper.
- Build the 7-day reference from `proof.ts` `prices` so it can't drift.
- Values stay as the label strings (zero API change).
- When `service = 7day` is picked, show the copy §7.3 conditional tip under the select. It is a static `<p hidden>` toggled on `change`, about 80 B of JS, and `aria-live="polite"`.

### 7.5 Success state
- Delete `<p>Book a call (optional), or just reply by email. Either way works.</p>`.
- Insert the copy §7.4 talk line, rendered from `NAP` (`site.ts`): `<a class="link" href={`tel:${NAP.tel}`}>{NAP.phone}</a>`, `{NAP.hours}`.
- Move "Want to keep exploring…" from `.cf-ok-b` into its own `<p>` directly above `.cf-ok-links` (copy §7.4).
- Keep the `SIGNAL RECEIVED` stamp and `__field?.signal()`.

### 7.6 Small fixes in the same pass
- `.f input, .f select, .f textarea` border `--gray-700` → **`--gray-500`** (finding 6). Hover → `--gray-300`.
- Intro copy: copy §7.1 replaces "Four quick fields".
- Error colour: see D1.

---

## 8. Decisions for the user

| # | Decision | My recommendation |
|---|---|---|
| D1 | The error colour isn't a token (`#FFB3A8` is hard-coded and already live). | Add `--err: #FFB3A8;` to `tokens.css` (11.0:1 on gray-900). That formalises what already ships, with no new colour on screen. The fallback, if the palette must stay locked, is white error text with an "Error:" prefix and a 2px white left rule. Errors stay readable but stand out less. |
| D2 | Takeover on desktop too, or inline A on desktop? | Takeover everywhere, for one mental model. The C rail keeps the persuasive context on desktop. |
| D3 | Style mini-specimens (CSS drawings) or text-only style cards? | Specimens. They are cheap (CSS only), and a style question without visuals is guesswork. |
| D4 | The copy.md §8 items (texting the number, "Most popular", budget bands, dropping "How did you hear"). | These block launch copy, not the build. Build with placeholders gated on the answers. |
