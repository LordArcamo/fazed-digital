---
copyStatus: draft
owner: The Wordsmith (conversion copy)
scope: 7-day LP questionnaire (USD + PH) and the site contact form
sources: src/components/Lp.astro, src/components/LpForm.astro, src/forms/lp.ts, src/data/lp.ts, src/data/proof.ts, src/data/site.ts, src/pages/api/lp-submit.ts, src/components/ContactForm.astro, src/forms/contact.ts, src/pages/contact.astro, src/pages/privacy.astro
---

# Lead forms: copy

Every promise in this file is already on the live site. The source is cited next to each one. Anything I could not verify is listed in section 8.

**Variant key:** **USD** = `/lp/7-day-website` · **PH** = `/lp/7-day-website/ph`. Where the two cells differ, both are given. Where only one line is shown, it applies to both.

**Spelling:** follow the site's existing convention (British: colour, enquiries, optimised), on both variants.

---

## 0. Voice rules for this form

1. **Talk like a person across the counter.** Use "What's your business called?", not "Business name\*".
2. **Keep it short.** Headlines are 8 words or fewer. Helper lines are 14 words or fewer. Write one idea per sentence.
3. **Every question says why it helps them**, never why it helps us.
4. **Promise only what the page already promises**: a reply within one business day, a confirmed start date, no commitment until they approve the quote, a fixed price, and the 7-day launch with its conditions.
5. **Don't use hype or pressure.** That means no exclamation marks, no "spots left" and no "hurry". Don't use the words amazing, unlock or elevate.
6. **Optional means optional.** Say it in the label, and never show an error for a blank optional field.

---

## 1. The section around the form (`Lp.astro` → `.lp-form-side`)

The current side copy says "Add it in Step 2". That step no longer exists, so it must change.

| Element | USD | PH |
|---|---|---|
| Cap line (unchanged, from `proof.ts`) | We take on 15 seven-day builds a month, max. | same |
| H2 (unchanged) | Ready to go live *in 7 days?* | same |
| Body (replaces line 164) | A few quick questions, mostly one tap each. We'll reply within one business day with a confirmed start date. No commitment until you approve. | same |
| PH extra (replaces line 165) | n/a | Have a Facebook page? Add it near the end and we'll pull your photos and details from it to save you time. |
| Pills (unchanged) | No lock-in contracts · Fixed price, no surprises · 7 business days or 20% off · You own your site | same |

**Optional eyebrow inside the form card** (mono): USD `Your 7-day brief` · PH `Your 7-day brief · Peso pricing`

---

## 2. Screens

### Step label rules

- **Visible label:** `{n} / {total}`, for example `1 / 7`.
- **Total:** 7 screens. When a pricing button already chose the package (Q1 is skipped), the total is **6**. Recount, so the visitor never sees "2 / 7" on their first screen.
- **Screen-reader text:** `Question {n} of {total}`.
- **Auto-advance announcement** (polite live region, after a tap): `{Option} selected.` Then move focus to the next headline.

---

### Q1 · Package (skipped when a pricing button chose one)

| | USD | PH |
|---|---|---|
| Step | 1 / 7 | 1 / 7 |
| Headline | Which package fits? | same |
| Helper | Every package is fixed price, with 7-day delivery. | Fixed peso prices. Pay via GCash, Maya or bank. |

**Option cards.** The prices are from `proof.ts`. The "for" lines and the detail lines are from the `plans` array in `Lp.astro`.

| value | Name | Price USD | Price PH | "For" line | Detail line (small) | Badge |
|---|---|---|---|---|---|---|
| `starter` | Starter | $499 | ₱19,999 | New businesses getting online | 5 pages · 2 revision rounds | none |
| `growth` | Growth | $899 | ₱34,999 | Growing small businesses | 8 pages · blog + CMS · 3 revision rounds | Most popular |
| `pro` | Pro | $1,499 | ₱59,999 | Businesses ready to scale | 10+ pages · e-commerce ready · unlimited revisions | none |
| `unsure` | Not sure yet | n/a | n/a | Help me choose | We'll suggest one when we reply. | none |

**When Q1 was skipped**, show a small chip at the top of the next screen: `{Name} · {price} selected` plus a text button `Change`. Examples: `Growth · $899 selected`, `Growth · ₱34,999 selected`.

---

### Q2 · Industry

| | Copy |
|---|---|
| Step | 2 / 7 |
| Headline | What kind of business is it? |
| Helper | Pick the closest match. |

**Chips (10).** The label is also the value, because the email shows the value as plain text.

| # | USD | PH |
|---|---|---|
| 1 | Food & restaurants | Food & catering |
| 2 | Retail & shops | Retail & shops |
| 3 | Beauty & salon | Beauty & salon |
| 4 | Health & wellness | Health & wellness |
| 5 | Professional services | Professional services |
| 6 | Real estate | Real estate |
| 7 | Construction & trades | Construction & trades |
| 8 | Education & training | Education & training |
| 9 | Online store | Online store |
| 10 | Other | Other |

**"Other" reveals an optional field.** When it appears, don't auto-advance; show Continue instead.

- **Label:** What do you do? (optional)
- **Placeholder:** USD `e.g. Dog grooming` · PH `e.g. Printing shop`

---

### Q3 · Main goal

| | Copy |
|---|---|
| Step | 3 / 7 |
| Headline | What should the site do for you? |
| Helper | Pick the one that matters most. |

**Chips (6).** The values are unchanged from `src/forms/lp.ts`.

| value | Label |
|---|---|
| `leads` | Bring in more enquiries |
| `sell` | Sell online |
| `credibility` | Look more established |
| `replace` | Replace my old website |
| `launch` | Launch a new business |
| `other` | Something else |

---

### Q4 · Launch timeline (new)

| | Copy |
|---|---|
| Step | 4 / 7 |
| Headline | When do you want to launch? |
| Helper | A rough idea is fine. It helps us plan your start date. |

| value | Label |
|---|---|
| `asap` | As soon as possible |
| `month` | Within a month |
| `quarter` | In 1–3 months |
| `exploring` | Just exploring for now |

---

### Q5 · Style

| | Copy |
|---|---|
| Step | 5 / 7 |
| Headline | How should it feel? |
| Helper | Pick the closest. We'll go over the details on Day 1. |

**Cards (4).** The values are unchanged.

| value | Title | Descriptor (3–5 words) |
|---|---|---|
| `minimal` | Minimal | Clean, calm, lots of space |
| `bold` | Bold | Strong colour, high energy |
| `corporate` | Professional | Polished, formal, trustworthy |
| `playful` | Playful | Friendly, bright, approachable |

The current labels also work if the Designer prefers them: "Minimal & clean", "Bold & vibrant", "Corporate & professional", "Playful & fun".

---

### Q6 · Business name (+ PH Facebook page)

| | USD | PH |
|---|---|---|
| Step | 6 / 7 | 6 / 7 |
| Headline | What's your business called? | same |
| Helper | A working name is fine. | same |
| Input label | Business name | Business name |
| Placeholder | e.g. Sunrise Coffee Co. | e.g. Santos Bakeshop |

**PH only: second field**

| | Copy |
|---|---|
| Label | Facebook page (optional) |
| Placeholder | facebook.com/santosbakeshop |
| Helper | We'll pull your photos and details from it to save you time. |

**Both variants, shown only when Q3 = `replace`**

| | Copy |
|---|---|
| Label | Current website (optional) |
| Placeholder | yourbusiness.com |
| Helper | So we can see what to keep and what to fix. |

---

### Q7 · Contact → Send

| | USD | PH |
|---|---|---|
| Step | 7 / 7 | 7 / 7 |
| Headline | Where do we send your start date? | same |
| Helper | We reply within one business day, Monday to Friday. | same |

**Fields**

| Field | Label | Placeholder USD | Placeholder PH | Helper |
|---|---|---|---|---|
| name (required) | Your name | e.g. Jane Smith | e.g. Maria Santos | none |
| email (required) | Email | you@yourbusiness.com | maria.santos@gmail.com | Your start date and what we need for Day 1 go here. |
| phone (optional) | Phone (optional) | +1 555 000 0000 | +63 9XX XXX XXXX | USD: Add it if you'd rather confirm your start date by phone. · PH: Add it if you'd rather confirm your start date by call or text. |

**Optional note.** Show a collapsed text button so the screen stays short. It replaces the dropped pages picker, brand colours and inspiration links.

| | Copy |
|---|---|
| Toggle | + Add a note (optional) |
| Label | Anything else we should know? |
| Placeholder | Pages you need, a launch deadline, sites you like… |

**Under the Send button:** No commitment until you approve the quote. (Source: `Lp.astro` line 135.)

---

## 3. Buttons and hints

| Element | Copy |
|---|---|
| Continue (text screens and "Other") | Continue → |
| Back | ← Back |
| Send (Q7) | Send my 7-day brief → |
| Sending state (button disabled) | Sending your brief… |
| Change a pre-selected package | Change |
| Keyboard hint, text screens (desktop only, `aria-hidden`) | or press Enter ↵ |
| Keyboard hint, choice screens (desktop only, `aria-hidden`) | Press 1–{n} to choose |
| Skip an optional field | No separate Skip button. Continue works with the field blank. |

On touch devices, hide the keyboard hints.

---

## 4. Validation messages

These show inline under the field, one message per field. Clear the message as soon as the visitor changes the field. Never show an error for a blank optional field.

| Field / case | Message |
|---|---|
| Package (Continue pressed with nothing chosen) | Pick a package, or tap "Not sure yet". |
| Industry | Pick the closest match, or tap Other. |
| Goal | Pick the one that matters most. |
| Timeline | Pick a rough timeline. It doesn't lock you in. |
| Style | Pick the closest feel. We'll fine-tune it on Day 1. |
| Business name, blank | Add your business name. A working name is fine. |
| Facebook page, not a Facebook link (PH) | That doesn't look like a Facebook link. Check it, or leave it blank. |
| Current website, not a link | That link doesn't look right. Check it, or leave it blank. |
| Name, blank | Add your name so we know who we're replying to. |
| Email, blank | Add your email. That's where your start date goes. |
| Email, invalid | That email doesn't look right. Check for typos? |
| Phone, invalid (USD) | That number looks incomplete. Check it, or leave it blank. |
| Phone, invalid (PH) | Use a mobile number like 09XX XXX XXXX, or leave it blank. |

**Send failures**

| Case | Message |
|---|---|
| Network or server failure | Your brief didn't send. That's on us. Try again, or email it to info@fazeddigital.com. |
| reCAPTCHA failed to load or verify | We couldn't confirm you're human. Refresh the page and try again, or email info@fazeddigital.com. |
| Offline (`navigator.onLine === false`) | You're offline. Your answers are still here. Reconnect, then tap Send again. Only use this message if the build really keeps the answers on screen. |

Render `info@fazeddigital.com` as a `mailto:` link in every message.

---

## 5. Success screen

**Headline (unchanged):** Brief received. You're in the queue.

**Body (default):**

> Thanks, {firstName}. We'll email {email} within one business day with your confirmed start date and what we need for Day 1.
>
> No commitment until you approve the quote.

The promise is verified in three places: `src/forms/lp.ts` line 76, `Lp.astro` line 164 and `Lp.astro` line 135.

**Body variants.** If more than one condition is true, use the first one that matches.

| Condition | Replace the first paragraph with |
|---|---|
| Q4 = `exploring` | Thanks, {firstName}. We'll email {email} within one business day with next steps. No pressure. |
| Q1 = `unsure` | Thanks, {firstName}. We'll email {email} within one business day with the package we'd suggest, a confirmed start date and what we need for Day 1. |

**"Get ready" line** (all variants). Source: `lp.ts` FAQ "What do I need to provide".

> To save time, start gathering your logo, photos and the text you want on the site.

**PH extra** (only if a Facebook page was entered):

> We'll pull your photos and details from your Facebook page, so there's less to send.

**Talk-sooner line.** Make the number a `tel:+639068253451` link and the email a `mailto:` link.

> Questions before then? Call or text +63 906 825 3451 (Mon–Fri, 8:30am–5:00pm PHT), or email info@fazeddigital.com.

**Out-of-hours line** (optional; show it if sent outside Mon–Fri 8:30–17:00 PHT). Source: `contact.astro` line 40.

> Sent outside our hours? It'll be first in the queue the next working morning.

**Links:** `See the work` (/work) · `Explore the Fazed Lab` (/lab)

---

## 6. Fine print

Show this on the Q7 screen near Send. Google requires a visible notice when the reCAPTCHA badge is hidden, so it must not be hidden behind a later step. It can also sit in the form footer on every screen.

> Protected by reCAPTCHA. Google's [Privacy Policy](https://policies.google.com/privacy) and [Terms](https://policies.google.com/terms) apply. We'll only use your details to reply to you. [Our privacy policy](/privacy) · Prefer email? [info@fazeddigital.com](mailto:info@fazeddigital.com)

Keep the existing `<span class="sr-only"> (opens in a new tab)</span>` on both Google links.

---

## 7. Contact form fixes (`ContactForm.astro`, `src/forms/contact.ts`)

### 7.1 Intro line (replaces "Four quick fields…", which is wrong: the form has 6)

> Only your name, email and message are required. The rest helps us reply better.

### 7.2 New optional phone field (place it after Email)

| | Copy |
|---|---|
| Label | Phone (optional) |
| Placeholder | +63 9XX XXX XXXX |
| Helper | Include your country code. Add it if you'd rather talk than email. |
| Error (only if a value is entered and it's invalid) | That number looks incomplete. Check it, or leave it blank. |

The privacy policy already lists "phone number" under contact form data (`privacy.astro` line 11), so no policy change is needed.

### 7.3 Budget options

| | Copy |
|---|---|
| Label (unchanged) | Rough budget (optional) |
| Helper | In USD. Paying in pesos? Pick the closest, or say so in your message. |

**Options:**

1. Under $1,500 · fits a 7-day website
2. $1,500–$3,000
3. $3,000–$5,000
4. $5,000–$10,000
5. $10,000–$20,000
6. $20,000+
7. Not sure yet

**Why these bands:**

- Option 1 covers all three 7-day packages ($499–$1,499).
- Options 4 and 5 cover the published custom range of $5,000–$20,000 (`proof.ts` `customRange`, and the contact FAQ).

**How to show PHP, without inventing prices.** The only real peso prices are the 7-day packages (₱19,999–₱59,999), extra pages (₱2,500) and maintenance (₱3,500/month). There is no published peso price for custom work, so **don't convert the other bands into pesos.** Exchange rates move, and a converted figure would read as a quote. Options:

- **A (recommended):** keep the USD bands with the helper above. Change option 1 to `Under $1,500 / ₱60,000 · a 7-day website`. This is safe because every 7-day peso price sits under ₱60,000.
- **B:** when the visitor arrives from a PH page (`?cur=php` or the referrer), swap option 1 to `₱19,999–₱59,999 · a 7-day website` and keep the other bands in USD with the same helper.

**Conditional tip** (show it under the "What do you need?" select when `7day` is chosen):

> Tip: the 7-day page has fixed prices and a quicker form. [See USD pricing](/lp/7-day-website) · [See peso pricing](/lp/7-day-website/ph)

### 7.4 Success screen (replaces the dead "Book a call (optional)…" line)

There is no booking link, so the line must not promise one.

| Order | Copy |
|---|---|
| Headline (unchanged) | Brief received. |
| Body | Thanks, {firstName}. We'll reply to {email} within one business day, Monday to Friday. |
| Talk line (new; `tel:` and `mailto:` links) | Prefer to talk? Call or text +63 906 825 3451, Mon–Fri, 8:30am–5:00pm PHT. Or just reply to our email. |
| Lead-in to the links | Want to keep exploring in the meantime? |
| Links (unchanged) | See the work · Read our guides · Send another message |

This moves "Want to keep exploring…" out of the body so it sits directly above the links.

### 7.5 Error messages

| Case | Message |
|---|---|
| Name, blank | Please add your name. |
| Email, blank | Please add your email so we can reply. |
| Email, invalid | That email doesn't look right. Check for typos? |
| Message, blank | Tell us a little about the project. One sentence is fine. |
| Phone, invalid (only if entered) | That number looks incomplete. Check it, or leave it blank. |
| Summary, 1 field | One field needs attention. It's highlighted below. |
| Summary, 2+ fields | A few fields need attention. They're highlighted below. |
| 429 rate limit | You've sent a few messages in a row. Give it a minute, then try again. |
| Server error | Something went wrong on our side, so your message didn't send. Try again, or email us at info@fazeddigital.com. |
| Network failure | Your message didn't send. Check your connection and try again, or email info@fazeddigital.com. |
| reCAPTCHA | We couldn't confirm you're human. Refresh the page and try again, or email info@fazeddigital.com. |
| Sending state | Sending… |

---

## 8. Needs user confirmation

1. **Texting the studio number.** The copy says "Call or text +63 906 825 3451" (LP success, LP PH phone helper, contact success). Nothing on the site says texts are welcome. Confirm texts are OK. Should Viber or WhatsApp be named too?
2. **Phone follow-up.** The phone helper says the visitor can "confirm your start date by phone". Confirm the team will call or text leads who leave a number. If not, use: "Optional. Only if you'd rather talk than email."
3. **"We'll suggest one when we reply"** (Q1 "Not sure yet", and the success variant). This is a new, small promise. Confirm the reply will recommend a package.
4. **"Most popular" on Growth.** This is carried over from the live page and form. Nothing in `proof.ts` backs it. Confirm it's true, or drop the badge.
5. **Budget bands.** Confirm the new "Under $1,500" band and the new "$20,000+" band. Also pick PHP handling A or B (§7.3).
6. **Dropped "How did you hear about us?"** Confirm it's fine to rely on UTM tags from the ads instead.
7. **15-a-month cap line.** It stays where it is. `proof.ts` marks it UNVERIFIED, and I did not reuse it inside the form.
8. **Placeholder business names** (Sunrise Coffee Co., Santos Bakeshop, facebook.com/santosbakeshop). These are made-up examples. Do a quick check that none is a real Iligan business you'd rather not name.
9. **The "Offline" message** (§4) promises the answers stay on screen. Only ship it if the build really does that.

### Notes for the builder (not copy, found while checking labels)

- **PH leads are labelled in dollars.** `src/pages/api/lp-submit.ts` `PACKAGE_LABELS` contains USD prices only, so a PH lead arrives as "Growth ($899)". The payload carries no variant.
  - Send `variant` with the payload, and add PHP labels.
  - Add `unsure`: "Not sure, help me choose".
  - Add the timeline labels: As soon as possible / Within a month / In 1–3 months / Just exploring for now.
  - Add `facebookPage` and `currentWebsite` as their own email rows. Today they are folded into `notes`.
- **The contact form's API has no phone field.** `src/pages/api/contact.ts` accepts only name, email, service, message, company and budget. The new phone field needs adding there and to the email.
- **Network errors show raw browser text.** In `src/forms/contact.ts` line 82, a failed `fetch` throws a `TypeError` with a message such as "Failed to fetch". That message gets shown to the visitor verbatim. Map it to the "Network failure" line in §7.5.
- **`Lp.astro` line 165** says "Add it in Step 2". Replace it with the line in §1.
