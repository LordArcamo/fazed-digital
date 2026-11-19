---
page: /quiz
copyStatus: draft
author: The Wordsmith
date: 2026-11-19
plan: docs/marketing/quiz-lp-plan.md (owner decisions 19 Nov 2026)
voice: copy/voice-guide.md
data: src/data/quiz.ts (builder)
---

# /quiz: website quiz copy (draft for owner approval)

Every fact on this page comes from `src/data/proof.ts`, `offers.ts`, `lp.ts`, `cases.ts`, `service-nav.ts` and `site.ts`. Prices are never typed into the build: read them from `proof.ts` / `offerPrice()`. Open questions are marked **[TBC from client]** and listed in section 9. None of them may ship as printed text (`lint-dist` fails on a printed "[TBC").

Three rules the builder must keep:

1. **Every score says "Based on your answers".** The quiz measures what the owner tells us, not their site.
2. **No currency symbols in the fix examples.** Example prices are written as "[your price]". A bare "$99" or "$499" would be swapped to a peso price for PH visitors by the geo script in `Base.astro`.
3. **Never write "5-star" or star glyphs.** They are "never claim" items in `scripts/lint-dist.mjs`. Q8 says "a star rating".

---

## 1. The page

### Title and meta

| Field | Copy | Chars |
|---|---|---|
| `<title>` | Website Quiz: Does Your Site Make People Call? \| Fazed | 54 |
| Meta description | 12 one-tap questions on how your website looks, reads and persuades. Get a free score in about 90 seconds, plus the 3 fixes that matter most. | 141 |
| OG title | Does your website make people call? | 35 |
| OG description | Score your website in 12 taps. Free, about 90 seconds. | 54 |

Primary keyword: website quiz. Secondaries: website checklist for small business, is my website good, website review. The page is a landing page for ads, socials and outreach first; whether it is indexed is the SEO lead's call.

### Start screen

The first screen is the quiz start and almost nothing else.

**Eyebrow (mono):** Free website quiz · 12 taps · about 90 seconds

**H1 (two lines):**
> Does your website make people call?
> Score it in 12 taps.

(Line 2 in the `dim` style. Line 1 is 35 characters, line 2 is 20.)

**Subhead:**
> One-tap questions on how your site looks, reads and persuades. About 90 seconds. Your score is free at the end, and your 3 biggest fixes are one email away.

**Tip (small, above the button):**
> Open your website on your phone first. Most questions ask you to look at it.

**Start button:** Score my website →

**Under the button (mono, small):** No website yet? Start anyway. There’s a short path for you.

**Quiet secondary link:** Rather talk? Book a 15-min call
(Goes to the `BOOK` calendar, opens in a new tab: add the sr-only "(opens the booking calendar)".)

**Trust lines (3, small, under the start):**
1. 120+ projects by our founder since 2022
2. A studio in Iligan City · clients in the USA, Australia and the Philippines
3. No sign-up to see your score

(Sources: `stats[0]` and `lpTrust` in `proof.ts`; `countries` from `cases.ts`; `FOUNDED` and `NAP.city` in `site.ts`. Line 3 is how the quiz works, per the owner's gate decision.)

### Question screen chrome

- Progress: **3 of 12** (no-website path: **3 of 5**).
- Back: **Back**
- Keyboard hint (desktop only, mono): Press 1–5 to answer
- Q8 (multi-select) button: **Done, next →**
- Hint style: the "look at your homepage" hint sits under the question in the mono style, prefixed with an eye or arrow icon, not a word.

### The "adding up" screen (under a second, after Q12)

> Adding up your answers…

---

## 2. The questions

Answers are one tap each and auto-advance, except Q8. Points are 0–3. Ten questions are scored (Q3–Q12), two per area, so each area scores 0–6 and the total is 0–30.

| Area | Key | Questions |
|---|---|---|
| First impression | `first` | Q3, Q5 |
| Clarity | `clarity` | Q6, Q7 |
| Trust | `trust` | Q4, Q8 |
| Persuasion | `persuasion` | Q9, Q10 |
| Ease | `ease` | Q11, Q12 |

### Q1. Do you have a website? (routing, not scored)

| Answer | Goes to |
|---|---|
| Yes | Q2, then the main path |
| It’s being built | Q2, then the main path (Q3 shows the "being built" hint below) |
| Only a Facebook page | Q2, then the no-website path (N1–N3) |
| No, not yet | Q2, then the no-website path (N1–N3) |

### Q2. What kind of business is it? (personalises the fixes, not scored)

- Trades and home services (`trades`)
- Health and wellness (`health`)
- Food and hospitality (`food`)
- Professional services (`pro`)
- Retail and online shops (`retail`)
- Something else (`other`, uses the `pro` examples)

### Q3. In the first 5 seconds, would you trust this business with your money?
Area: First impression.
Hint: Open your homepage on your phone. Look at it like a stranger would.
Hint if Q1 = "It’s being built": Answer for whichever version you can open now: the old site or the new draft.

| Answer | Points |
|---|---|
| Yes, it looks premium | 3 |
| It looks okay | 2 |
| Not sure | 1 |
| It looks dated or cheap | 0 |

### Q4. Are the photos your real work, team or place?
Area: Trust.
Hint: Scroll the homepage once. Count the stock photos.

| Answer | Points |
|---|---|
| All real | 3 |
| A mix of real and stock | 2 |
| Mostly stock or template photos | 1 |
| No photos at all | 0 |

### Q5. Does every page look like the same brand?
Area: First impression.
Hint: Open 2 or 3 pages. Same colours, fonts and logo?

| Answer | Points |
|---|---|
| Yes, every page | 3 |
| Mostly | 2 |
| It’s all over the place | 0 |

### Q6. Read only the big headline. Could a stranger tell what you do, who it’s for and where?
Area: Clarity.
Hint: Just the biggest words at the top. Nothing else.

| Answer | Points |
|---|---|
| All three | 3 |
| Two of them | 2 |
| One of them | 1 |
| No, it’s a slogan or “Welcome to…” | 0 |

### Q7. Who does your homepage talk about more?
Area: Clarity.
Hint: Count the sentences that start with “We” or “Our”.

| Answer | Points |
|---|---|
| The customer: their problem and the result | 3 |
| About half and half | 2 |
| Mostly us: “We are…”, “Our mission…” | 0 |

### Q8. Near the top, what proves you’re good? Tick all you have.
Area: Trust. **Multi-select.** Button: Done, next →
Hint: Near the top means before the first big scroll.

| Answer | Points |
|---|---|
| Reviews with real names | +1 |
| A star rating from Google or similar | +1 |
| Before-and-after photos or real results | +1 |
| Client logos or “as seen in” | +1 |
| A guarantee | +1 |
| Nothing yet | 0 (clears the others) |

Score = number ticked, capped at 3.

### Q9. Is there one obvious next step, with a reason to take it now?
Area: Persuasion.
Hint: Find the main button. Read what it says.

| Answer | Points |
|---|---|
| One clear step, with a reason | 3 |
| A button, but no reason | 2 |
| Several buttons competing | 1 |
| No clear next step | 0 |

### Q10. Can visitors see your prices, a “from” price or a range?
Area: Persuasion.
Hint: Check your homepage and your main service page.

| Answer | Points |
|---|---|
| Yes, clear prices or “from” prices | 3 |
| Somewhere, if you dig | 2 |
| Only “Contact us for a quote” | 1 |
| No mention of price at all | 0 |

### Q11. On your phone, can someone call, book or message you in one tap?
Area: Ease.
Hint: Load your homepage on your phone. Don’t scroll.

| Answer | Points |
|---|---|
| Yes, without scrolling | 3 |
| Only after scrolling | 1 |
| No, they have to copy a number or find a form | 0 |

### Q12. Can a visitor find what they came for in 2 taps or fewer?
Area: Ease.
Hint: Try it: find your main service, then your contact page.

| Answer | Points |
|---|---|
| Yes, every time | 3 |
| Sometimes | 2 |
| They’d get lost | 0 |

### The no-website path (Q1 = "No, not yet" or "Only a Facebook page")

Q1 → Q2 → N1 → N2 → N3 → the starting-plan result. Five taps. Nothing is scored.

**N1. What should your website do first?**
- Bring in calls and quote requests (`calls`)
- Take bookings or orders (`bookings`)
- Make you look legit when people check you out (`legit`)
- Sell products online (`shop`)

**N2. Who do you most want to reach?**
- Local customers near you (`local`)
- Other businesses (`b2b`)
- Customers in other cities or countries (`far`)
- Walk-ins and regulars (`walkin`)

**N3. When do you want to be online?**
- As soon as possible (`asap`)
- In the next 1–3 months (`soon`)
- Later this year (`later`)
- Just looking for now (`browsing`)

---

## 3. Micro-feedback lines

A short line from the "coach" that shows for about 1.5 seconds at the top of the next question, then fades. It never blocks a tap. Only the answers below trigger one, so it appears on roughly every third screen.

| After | Line |
|---|---|
| Q1: It’s being built | Good timing. Fixing things before launch is the cheap way. |
| Q1: Only a Facebook page | A good start. Next: a page you own. |
| Q3: Yes, it looks premium | Strong start. That first look carries the rest. |
| Q3: It looks dated or cheap | Honest answer. Looks are the first proof people get. |
| Q4: Mostly stock or template photos | Stock photos say “template”. Your phone camera can beat them. |
| Q5: It’s all over the place | Mixed styles feel like mixed quality. This one’s easy to fix. |
| Q6: All three | That’s the hardest line on any site. Nice. |
| Q6: No, it’s a slogan | Slogans make people guess. What, who, where: that’s the job. |
| Q7: Mostly us | Flip it: their problem first, then you. |
| Q8: Nothing yet | No proof yet? Your happy customers are the fix. |
| Q8: 3 or more ticked | That’s real proof. Make sure it’s near the top. |
| Q9: Several buttons competing | Too many choices and people stall. Pick one. |
| Q10: No mention of price at all | No price means guessing. Even a “from” price helps. |
| Q11: No | If calling takes effort, some people won’t bother. |
| Q12: They’d get lost | Lost visitors leave. A shorter menu helps. |
| Q12 (any answer) | That’s all 12. Adding it up… |

---

## 4. Scoring bands and result copy

**Score shown:** `round(total / 30 × 100)`, as **Based on your answers: 54/100**.

**Area bars:** each area 0–6, labelled **Needs work** (0–2), **Okay** (3–4) or **Strong** (5–6).

**The 3 weakest areas:** sort the five areas by score, lowest first. Break ties in this order: Clarity, Trust, Persuasion, Ease, First impression (copy and proof are the quickest fixes to make). Skip any area that scores 6/6. Within each area, show the fix tied to the lower-scoring question (section 5 says which).

### Result screen chrome

- Score label (mono): **Based on your answers**
- Fixes heading: **Your 3 biggest fixes**
- Free view: each fix shows its area and its problem line. The before-and-after and the principle sit behind the email gate.
- Proof heading: **Work for businesses like yours** (2–3 cases, see the table below)
- Under the primary CTA (mono, small): Free · 15 minutes on Google Meet · We go through your 3 fixes with you
- Retake: **Retake the quiz**
- Share: **Send this quiz to your web person** (share text: “Score your website in 12 taps: www.fazeddigital.com/quiz”)
- Footnote (small): Your score is based on your answers, not a scan of your site. On a call we look at the real thing.

### Band 1: Leaking customers (0–39)

**Headline:** Based on your answers, your site is leaking customers.
**Summary:** The people who find you are getting reasons to leave before they call. The good news: these are the easiest leaks to see, and your 3 biggest fixes are below.
**Primary CTA:** Book a 15-min call with Lord
**Secondary CTA:** the 7-day website.
> **Starting over may be faster.** A new custom site, live in 7 business days or 20% off if we miss it on our side. From $499 (₱19,999).
> Button: See the 7-day website → (`/lp/7-day-website`; PH market: `/lp/7-day-website/ph`)

### Band 2: Holding back (40–59)

**Headline:** Based on your answers, your site is holding you back.
**Summary:** The basics are there, but a few gaps make people hesitate at the moment they should reach out. The 3 fixes below are where we would start.
**Primary CTA:** Book a 15-min call with Lord
**Secondary CTA:** /audit.
> **Not sure yet?** See what we check on the free 15-minute call, and what you leave with.
> Link: What happens on the free check → (`/audit`)

### Band 3: Working, with room to grow (60–79)

**Headline:** Based on your answers, your site works. It could work harder.
**Summary:** It looks the part and people can reach you. A few weak spots are still costing you enquiries, and the 3 fixes below are the ones to make first.
**Primary CTA:** Book a 15-min call with Lord
**Secondary CTA:** the service page for their weakest area.
- First impression, when Q5 scored lowest → **Make every page one brand →** (`/services/branding`)
- Every other case → **See how we design and build websites →** (`/services/web-design`)

### Band 4: In good shape (80–100)

**Headline:** Based on your answers, your site is in good shape.
**Summary:** It looks right, reads clearly and makes the next step easy. The next question is whether enough of the right people see it.
**Primary CTA:** Book a 15-min call with Lord
**Secondary CTA:** /services/seo.
> **Ready to be found?** SEO and AI search, with a plain-English report every month.
> Link: See our SEO service → (`/services/seo`)

(If an owner scores 30/30, the fixes block reads: **Nothing to fix on these 5 checks.** The next step is getting found. The SEO link stays.)

### "Being built" line (Q1 = It’s being built, any band)
Shown under the summary: **Good timing: these are cheaper to fix before launch than after.**

### Price rule for the 7-day lines

Write the starter price as `${prices.usd.starter} (${offerPrice('php','starter').price})`. While `FOUNDING_PH.on` is true, PH visitors see the founding rate (₱14,999) and everyone else sees $499. The geo swap in `Base.astro` reads the "$499 (₱…)" pattern, so keep both prices in one text node.

### Proof by business type (from `cases.ts`, link `/work/<slug>`, line = `CASE_EXTRA[slug].changed`)

| Business type | Cases |
|---|---|
| Trades and home services | 01 A Framing Company (Utah), 02 Cleen & Green (Philippines) |
| Health and wellness | 05 Canwell (Australia), 02 Cleen & Green |
| Food and hospitality | No matching case yet. Show 02 Cleen & Green and 01 A Framing Company under the heading **Work for local service businesses**, never "businesses like yours". |
| Professional services | 08 QLD Law Group (Queensland), 09 Dotted Studios (Iligan City) |
| Retail and online shops | 04 The Telecom Shop (Australia), 02 Cleen & Green |
| Something else | 03 CrateOnScene (USA), 06 8Drive (Philippines) |

No testimonials while `LP_REVIEWS_REAL` is false.

### The no-website result (starting plan, no score)

**Headline:** No website yet? Here’s your starting plan.
**Summary:** There’s nothing to score yet, so here is what we would build first, based on your answers. A new custom site can go live in 7 business days.

**The plan card:**

| N1 answer | Recommended | Line |
|---|---|---|
| Bring in calls and quote requests | Starter, from $499 (₱19,999) | 5 custom-designed pages and a contact form, set up so people can call or ask for a quote in one tap. |
| Bring in calls, and N2 = other cities or countries | Growth, $899 (₱34,999) | 8 pages, a blog and advanced on-page SEO, for customers who find you by searching. |
| Take bookings or orders | Call first | Booking systems are scoped separately, so we’ll price yours on the call. |
| Make you look legit | Starter, from $499 (₱19,999) | 5 custom-designed pages that answer “are they real?” in seconds: what you do, real photos, how to reach you. |
| Sell products online | Pro, $1,499 (₱59,999) | E-commerce ready, 10+ custom pages. Bigger catalogues or custom checkouts are scoped on the call. |

(Package contents from `lpPlans` in `lp.ts`. Starter uses `offerPrice()` as above.)

**Fixed line under the card:** Live in 7 business days or 20% off if we miss it on our side. You send everything on Day 1 and your feedback within 24 hours. You own the domain, the site and the content.

**Facebook-only line (Q1 = Only a Facebook page), PH market:** Share your Facebook page on Day 1 and we’ll pull your photos and details from it.
(US/AU market: hide until the owner confirms it applies outside the Philippines. **[TBC from client]**)

**Timeline line (N3):**
- As soon as possible: We take on 15 seven-day builds a month, max. (`capsCopy.sevenDay`)
- In the next 1–3 months: Book a call now and we’ll pencil in a start date that suits you.
- Later this year / Just looking: No rush. Keep this plan, and book a call when you’re ready.

**Primary CTA:** Book a 15-min call with Lord
**Secondary CTA:** See the 7-day website →

---

## 5. The fix library

Twelve fixes, 2–3 per area. Each has the problem in the owner’s words, a before-and-after for each business type, and the principle in plain English. Examples are labelled **Example** on screen: they show the idea for the reader’s own business and are not claims about Fazed or any client. "Something else" uses the Professional services example.

### First impression

**FI-1 · Shown when Q3 is the lower score in this area**
**Problem:** “My site looks older than my business.”
**Principle: first impressions.** People judge the business by the site before they read a word. Make the first screen look as good as your work.

| Type | Before | After |
|---|---|---|
| Trades | A small logo, a clip-art banner and a wall of text | A full-width photo of a finished job, one headline and a “Get a free quote” button |
| Health | Three fonts, a stretched logo and a slider of stock smiles | One calm colour, a photo of your real treatment room and “Book an appointment” at the top |
| Food | An old theme with a link to a menu PDF | A big photo of your best dish, today’s hours and “Order” right under it |
| Professional | A dark-blue template with a handshake photo | A clean page with your real portrait, what you handle and “Book a call” |
| Retail | Five banners fighting for attention | One hero product, its price and “Shop now” |

**FI-2 · Shown when Q5 is the lower score**
**Problem:** “Every page looks like a different website.”
**Principle: consistency.** When every page matches, the business feels organised. When pages clash, people wonder what else is messy.

| Type | Before | After |
|---|---|---|
| Trades | Green buttons on the homepage, orange on the quote page, an old logo in the footer | One button colour, one logo and one photo style on every page |
| Health | The booking page is a plugin with its own fonts and colours | Booking styled like the rest of the site, so it feels like the same clinic |
| Food | The menu page uses different fonts from the homepage | Menu, homepage and specials share one type style and colour set |
| Professional | Each service page built at a different time, in a different style | One layout for every service page: headline, who it’s for, how it works, next step |
| Retail | Product photos on white, grey and kitchen-bench backgrounds | One photo style and one product card layout across the shop |

### Clarity

**CL-1 · Shown when Q6 is the lower score**
**Problem:** “My headline is a slogan, not an answer.”
**Principle: clarity.** Your headline has one job: say what you do, who it’s for and where. Clever can come second.

| Type | Before | After |
|---|---|---|
| Trades | Welcome to our website | Roof repairs in Brisbane. Same-week inspections. |
| Health | Your journey to wellness starts here | Physiotherapy for back and sports injuries in Cebu City |
| Food | Passion on a plate | Wood-fired pizza in Austin. Order for pickup or delivery. |
| Professional | Excellence. Integrity. Results. | Bookkeeping and tax for small businesses in Queensland |
| Retail | Discover the difference | Handmade leather bags, shipped across the Philippines |

(Only promise what you deliver: if you can’t inspect the same week, don’t say it.)

**CL-2 · Shown when Q7 is the lower score**
**Problem:** “My homepage talks about us, not them.”
**Principle: customer first.** People arrive with a problem. Name it, show the result, then tell them who you are.

| Type | Before | After |
|---|---|---|
| Trades | We are a family-owned company established in 2005… | Burst pipe at 10pm? Call now and talk to a plumber, not a call centre. |
| Health | Our mission is to provide holistic care… | Sore back every morning? We find the cause, then give you a plan you can follow at home. |
| Food | We are passionate about good food… | Feeding 20 people on Saturday? Order party trays by Thursday. |
| Professional | Our firm has decades of combined experience… | Behind on your books? We’ll get you caught up before tax time. |
| Retail | We pride ourselves on quality… | A bag that still looks good after years of daily use. |

### Trust

**TR-1 · Shown when Q8 scored 0–1**
**Problem:** “Visitors have to take my word for it.”
**Principle: social proof.** People trust other customers more than they trust you. Put real proof near the top, with real names, and only with permission.

| Type | Before | After |
|---|---|---|
| Trades | No reviews anywhere | Three short Google reviews with first names and suburbs, next to photos of those jobs |
| Health | Reviews on a separate page nobody opens | Your Google rating and review count under the headline, plus one patient’s words (with consent) |
| Food | Nothing but the menu | Your rating and three recent reviews under the hero photo |
| Professional | “Trusted by many clients” | Named client quotes with role and company, plus logos of clients who agreed to be shown |
| Retail | No reviews on product pages | Reviews on every product page, with customer photos |

**TR-2 · Shown when Q4 is the lower score**
**Problem:** “Stock photos make me look like everyone else.”
**Principle: real photos.** Real photos prove you exist and show what people will actually get. A phone and good daylight beat a stock library.

| Type | Before | After |
|---|---|---|
| Trades | A smiling model in a spotless hard hat | Your crew on a real site, with the finished job |
| Health | A model with a stethoscope | You and your team in your own rooms |
| Food | Stock pasta on a white plate | Your dish, on your plates, shot by a window |
| Professional | A handshake over a city skyline | A portrait of you, and your team at work |
| Retail | The supplier’s catalogue photos | Your products in use, shot in good light |

**TR-3 · Shown when Q8 scored 2–3 and "A guarantee" was not ticked**
**Problem:** “Buying from me still feels risky.”
**Principle: risk reversal.** Take some of the risk off the customer and they say yes sooner. Only promise what you will honour every time.

| Type | Before | After |
|---|---|---|
| Trades | Nothing about what happens if it goes wrong | “If the repair doesn’t hold for 12 months, we come back free.” |
| Health | Straight to “Book now” | “Not sure it’s right for you? Your first short assessment is free.” |
| Food | No word on problems | “Order arrives cold? We remake it or refund it.” |
| Professional | Hourly rates, no cap | “A fixed quote before we start. No surprise bills.” |
| Retail | Returns policy hidden in the footer | “Free returns within 30 days” next to the Add to cart button |

### Persuasion

**PE-1 · Shown when Q9 = "Several buttons competing" or "No clear next step"**
**Problem:** “Visitors don’t know what to do next.”
**Principle: one next step.** Give every page one main action, and say what happens when they tap it. More choices means more people who choose nothing.

| Type | Before | After |
|---|---|---|
| Trades | Contact us · Learn more · Our services · Follow us | One button on every page: “Get a free quote” |
| Health | “Click here” | “Book your first visit” |
| Food | Menu · About · Gallery · Contact, all the same size | “Order now” first, “Book a table” second |
| Professional | A form that ends in “Submit” | “Book a free 15-minute call” |
| Retail | Four banners with four different offers | One button: “Shop the new range” |

**PE-2 · Shown when Q9 = "A button, but no reason"**
**Problem:** “My button gives no reason to click it today.”
**Principle: a reason to act.** Tell people what they get and why now. Use real reasons only: fake countdown timers cost trust.

| Type | Before | After |
|---|---|---|
| Trades | Contact us | Get a free quote. We reply the same business day. |
| Health | Book now | Book now. See this week’s open times. |
| Food | Order | Order by 3pm for same-day pickup. |
| Professional | Get in touch | Book a free 15-minute call. Leave knowing your options. |
| Retail | Shop now | Order today, ships tomorrow. |

(Each “after” only works if it’s true for your business.)

**PE-3 · Shown when Q10 is the lower score**
**Problem:** “I don’t show prices, so people guess.”
**Principle: price anchoring.** A “from” price or a range answers “can I afford this?” before people leave to check someone else. It also brings you better-fit enquiries.

| Type | Before | After |
|---|---|---|
| Trades | Call for a quote | Roof inspections from [your price]. Most repairs quoted on the spot. |
| Health | No prices anywhere | First visit [your price], 45 minutes. Follow-ups [your price]. |
| Food | Catering: please enquire | Catering from [your price] per person, for groups of 20 or more |
| Professional | Fees on request | Fixed-fee tax returns from [your price]. Complex cases quoted after a free call. |
| Retail | Shipping cost appears only at checkout | Price and shipping shown on the product page |

### Ease

**EA-1 · Shown when Q11 is the lower score**
**Problem:** “Reaching me takes more than one tap.”
**Principle: one-tap contact.** On a phone, the call, book or message button should always be in reach. Every extra step loses someone.

| Type | Before | After |
|---|---|---|
| Trades | The phone number is part of an image in the footer | A “Call now” button that stays at the bottom of the screen |
| Health | The booking form is two pages deep | “Book” and “Call” buttons pinned to the bottom of the screen |
| Food | The number is written on a photo | Tap to call, Directions and Order in the header |
| Professional | An email address you have to copy | Call, Email and Book a call, one tap each |
| Retail | Chat hidden at the bottom of the page | A “Message us” button on every page |

**EA-2 · Shown when Q12 is the lower score**
**Problem:** “People get lost looking for the basics.”
**Principle: clear paths.** Anything a customer comes for should be 2 taps away or fewer. Short menus with plain labels win.

| Type | Before | After |
|---|---|---|
| Trades | 14 menu items | Services · Projects · Reviews · About · Get a quote |
| Health | Treatments buried under “About us” | Treatments · Prices · Book · Find us |
| Food | The menu is a PDF download | The menu as a page, plus hours and a map on the homepage |
| Professional | One services page with 20 links | 4 service groups, each one tap from the menu |
| Retail | Categories hidden behind a menu icon, no search | Main categories on show and a search bar at the top |

**Fix picking, when both questions in an area tie:** show the first fix listed for that area (FI-1, CL-1, TR-1, PE-1, EA-1). For Trust, TR-3 replaces TR-1 when Q8 scored 2–3 without a guarantee and Q4 scored 3.

---

## 6. The email gate

Shown on the result screen, over the blurred before-and-after examples.

**Line above the fields:**
> Get your 3 fixes with before-and-after examples for {business type}. Where should we send them?

(`{business type}` in lower case, e.g. "trades and home services". For "Something else": "your business".)

**Fields:**
- First name
- Email
- Website address (optional), placeholder: yourbusiness.com

**Button:** Show my 3 fixes →
**Under the button (small):** We’ll email you a copy too.

**Privacy line:**
> We’ll use your details to send your result and reply to you. We never sell your data. [Our privacy policy](/privacy)
(Add the existing reCAPTCHA line from `LpForm.astro` if the form uses reCAPTCHA. Whether we send any follow-up after the result email is **[TBC from client]**; if yes, add "and follow up once" here.)

**Errors:**
- First name empty: Add your first name so we know who to send it to.
- Email invalid: That email doesn’t look right. Check it and try again.
- Send failed: Something went wrong on our side. Try again, or book a call and we’ll go through your result live.

### Success state

> **Done, {first name}.** Your 3 fixes are below, and a copy is on its way to {email}.

Then the unlocked fixes, then:

> **Want help with them?** Book a free 15-minute call. We’ll open your site together and go through your 3 fixes.
> Button: **Book a 15-min call with Lord →** (opens the booking calendar)
> Small: Didn’t get the email? Check your spam folder.

---

## 7. The result email (DRAFT, owner to approve before it sends)

**From:** Lord at Fazed Digital <**[TBC from client]** sending address>
**Reply-to:** info@fazeddigital.com

### Version A: website path

**Subject:** {first_name}, your website score: {score}/100
(Subject length with a 10-character name and a 2-digit score: 38 characters.)

**Preview text:** Your 3 fixes, with examples for {business_type}. Based on your answers.

**Body:**

> Hi {first_name},
>
> Thanks for taking the Fazed website quiz. Here’s your result.
>
> **Based on your answers, your site scores {score}/100: {band}.**
>
> {band_summary}
>
> **Your 3 fixes**
>
> **1. {area_1}: {problem_1}**
> Example before: {before_1}
> Example after: {after_1}
> Why it works: {principle_1}
>
> **2. {area_2}: {problem_2}**
> Example before: {before_2}
> Example after: {after_2}
> Why it works: {principle_2}
>
> **3. {area_3}: {problem_3}**
> Example before: {before_3}
> Example after: {after_3}
> Why it works: {principle_3}
>
> **Want help with them?**
> Book a free 15-minute call with me on Google Meet. We’ll open your site together, go through these 3 fixes and work out which one to do first. You leave with the fixes, whether you hire us or not.
>
> [Book a 15-min call with Lord]
>
> {secondary_block}
>
> Lord Arcamo
> Founder, Fazed Digital
> Iligan City, Philippines · {phone}
> www.fazeddigital.com
>
> P.S. Your score is based on your answers, not a scan of your site. On the call we look at the real thing.

**{secondary_block} by band** (plain text, prices by market, no geo script in email):
- Leaking customers: Starting over may be faster. Our 7-day website is a new custom site, live in 7 business days or 20% off if we miss it on our side. From {starter_price}. [See the 7-day website]
- Holding back: Not sure yet? Here’s what we check on the free call: [www.fazeddigital.com/audit]
- Working, with room to grow: [See how we design and build websites] (or the branding link, as on the result page)
- In good shape: Your site does its job. If you want more of the right people to see it: [See our SEO service]

**Merge values:**
- `{starter_price}`: US/AU = `prices.usd.starter` ($499); PH = `offerPrice('php','starter').price` (₱14,999 while the founding rate is on, else ₱19,999).
- `{phone}`: PH = +63 906 825 3451; US/AU = +1 302-405-2423 (`NAP`).
- `{business_type}`: lower case, as in the gate.

**Footer (small):**
> You’re getting this because you asked for your quiz result on fazeddigital.com. Fazed Digital, Iligan City, Lanao del Norte 9200, Philippines. [Unsubscribe]

### Version B: no-website path

**Subject:** {first_name}, your starting plan for a website
**Preview text:** What we’d build first, and how fast it can go live.

> Hi {first_name},
>
> Thanks for taking the Fazed website quiz. You don’t have a website yet, so there’s nothing to score. Here’s the starting plan we put together from your answers.
>
> **What we’d build first:** {package_name}, {package_price}
> {package_line}
>
> It goes live in 7 business days, or you get 20% off if we miss it on our side. You send everything on Day 1 and your feedback within 24 hours. You own the domain, the site and the content.
>
> {timeline_line}
>
> **Want to talk it through?** Book a free 15-minute call with me. Tell me about the business and I’ll tell you exactly what the site needs.
>
> [Book a 15-min call with Lord]
>
> Or see the packages first: [See the 7-day website]
>
> Lord Arcamo
> Founder, Fazed Digital
> Iligan City, Philippines · {phone}
> www.fazeddigital.com

(Same footer. `{package_*}` and `{timeline_line}` come from the section 4 tables. "Take bookings or orders" uses: **What we’d build first:** a site with bookings, scoped on a call. Booking systems are priced separately, so we’ll quote yours once we know how you take bookings today.)

---

## 8. Alt text and accessibility notes

- Lord’s photo on the Book button: “Lord Arcamo, founder of Fazed Digital”.
- Case thumbnails: reuse `CASE_EXTRA[slug].alt`.
- Answer tiles are buttons with the full answer as their name. Q8 tiles are checkboxes (`aria-pressed` or real inputs).
- The micro-feedback line is a polite live region, so screen readers hear it without losing focus.
- The score: “Based on your answers, your website scores 54 out of 100: Holding back.”

---

## 9. For the owner to confirm ([TBC from client])

1. **Quiz name.** Still open. Recommended: "Website Quiz" in titles and menus, with the H1 doing the selling. "What’s your website costing you?" implies a money figure we can’t measure.
2. **Sending address** for the result email (info@ or a lord@ address) and the email tool.
3. **Follow-ups.** Does anything follow the result email? The privacy line and the email footer change if yes.
4. **Facebook pull outside PH.** The PH FAQ says we pull photos and details from a client’s Facebook page. Does that apply to US and AU clients too?
5. **Copywriting.** The 7-day FAQ says the client provides the text. The fixes teach copy, so owners will ask "will you write it?" on the call. What is the answer, and is there a price?
6. **Holding back → /audit.** `/audit` books the same calendar as the primary CTA. Keep it as a "what happens on the call" explainer, or swap this band to the 7-day website?
7. **Food and hospitality proof.** There is no matching case. Approve showing local service cases under "Work for local service businesses".
8. **Privacy policy.** It lists contact form data. Add a line for quiz answers and scores.
