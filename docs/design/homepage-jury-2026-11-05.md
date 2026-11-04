# Homepage jury review, 5 November 2026

Reviewed live at https://www.fazeddigital.com/ with `?geo=intl` and `?geo=ph`, at 1440x900, 2000x890 and 390x844. Read-only: no code changed, no form submitted.

## Verdict

**Honorable Mention level, not SOTD. Weighted score 7.0.**

The dot field gives Fazed a real identity, and the build is faster and more accessible than most award sites. Three things hold it back: desktop shows almost no client work at rest, phones hit two visible defects, and the middle of the page repeats one dark template.

| Criterion | Weight | Score | Main reason |
|---|---|---|---|
| Design | 40% | 7.0 | Strong hero, flood and globe. Crushed type, a confused size scale, a repetitive middle, weak field nodes |
| Usability | 30% | 6.8 | Clear nav and very fast, but work hides behind hover, prices start 7,661px down, the page is long |
| Creativity | 20% | 7.6 | One field carrying the story is a real idea. Only about half its moments land |
| Content | 10% | 6.2 | Honest and specific, but no client voice, no measured results, one headline formula |
| **Weighted** | | **7.0** | 2.80 + 2.04 + 1.52 + 0.62 = 6.98 |

| Separate check | Result | Score | Evidence |
|---|---|---|---|
| Performance | PASS, one flag | 8.0 | Load is excellent. Desktop CLS is not, and the cause is the services pin |
| Mobile | **FAIL** | 6.0 | CTAs covered on first view, process path broken, 22.5 screens long. No overflow, fast |
| Accessibility | PASS | 8.5 | axe 0 violations at 1440 and 390, 70 tab stops all focused and on screen |
| Video-readiness | Good, not yet incredible | 7.5 | Hero burst, flood wipe and globe are great footage. Intro and work table are dead air |

My estimate after the P0 and P1 list: 7.6 to 7.8. Real client quotes and measured results would be needed to go further.

## What I saw and could not check

- **Live field, not posters.** Desktop ran tier T1 and the 390 touch emulation ran T2, both drawing the real dot field. The reduced-motion and no-JS runs showed posters. I did not record whether the backend was WebGPU or WebGL2.
- **Lighthouse: no number.** PageSpeed Insights returned 429 (daily quota used). I did not run local Lighthouse in the shared Chrome, because that number would not be trustworthy. The figures below come from direct browser measurement.
- **Mobile was emulated** on this Mac's GPU, so 60 fps says nothing about a real mid-range phone. I did not test iOS Safari or Android hardware.
- **Throttled figures are indicative only.** The slow-4G and 4x CPU run looks optimistic.
- **Not tested:** screen reader, form submission and validation, the real IP geo path (only `?geo=`), `?record` mode, real video capture. Video-readiness comes from stepped frames.
- **`inspo/research.md` does not exist.** I judged the site against the NETWORK brief in `README.md` and `PROJECT_OVERVIEW.md`.

## Top 3 genuinely great (keep these)

1. **The mark and its burst.** The dot mark, its pointer dent and the scrub where it explodes into the lattice are the best seconds on the site. Nothing else in this market looks like it.
2. **The lime flood.** A circle wipe into 201px "Live in 7 days." is a real change of pace after 6,900px of black, and it lands on the core offer.
3. **The engineering discipline.** 585 KB total, LCP 0.32s unthrottled, zero axe violations, complete no-JS content, a proper reduced-motion version, and a price swap that held up across prices, phones and links. Most award sites fail at least two of these.

## Section by section

| Section | Score | Verdict |
|---|---|---|
| Hero | 8.0 | Best asset, with crushed headline type |
| Intro | 5.5 | Weakest section: a louder second hero that says nothing new |
| Services | n/a | Being replaced. Effects on its neighbours are noted below |
| Work index | 6.0 | Real work reduced to a text table on desktop |
| Lab | 7.0 | Distinctive sheet with a visible handover bug |
| 7-day flood | 8.5 | Best scroll moment, but the prices are the smallest text in it |
| Process | 5.5 | Generic steps and splatty nodes. Broken on mobile |
| Connections | 8.0 | Best field moment after the hero. Results are unmeasured |
| People | 6.0 | Half the team has no photo, and rings run through the text |
| FAQ | 7.0 | Clean, but the price answer is closed by default |
| Contact | 7.0 | Solid form, oversized headline, node lands off stage |
| Footer | 7.5 | The dot FAZED wordmark is a strong close on desktop |

### Hero (all changes are suggestions for the owner)
- **Type:** at -.035em the letters touch. In a 2x crop "Built" fuses, "Iligan" reads as "lligan", and "Live worldwide." reads as one word.
- **Hierarchy:** the H1 is 93.6px but the intro H2 directly below it is 108px, so the page gets louder after the headline.
- **Message:** "Built in Iligan." tells a Utah contractor where you are, not what they get. The strongest offer, a 7-day site from $499, is absent.
- **Live mark vs poster:** the poster mark is cleaner than the live one. On phones the T2 mark goes ragged when it takes over from the poster.
- **Cue:** "Scroll · 01 / 09" does not match the phone dock's "01/07" or the 12 sections. At 2000x890 the cookie card clips it.

### Intro (rebuilt in 6a82ff6)
It restates the hero. City, countries and "since 2022" are already in the hero strip and deck. Across the page's main content "Philippines" appears 11 times, "Australia" 10, "Iligan" 7 and "2022" 5.

The Col 01-12 and "Pitch 24px" ruler is a designer's in-joke and the first thing a business owner sees after the hero. The "three questions" paragraph is then repeated by Process.

### Services (effects on neighbours only)
- **Layout shift:** `.svc-pin` registers about 1.0 on entering the pin and about 1.0 on leaving. That is 1.99 cumulative at 1440 and 1.91 at 2000, against 0.01 on mobile, which has no pin. Chrome's largest session window is about 1.0, and "good" is under 0.1. Vercel Speed Insights should confirm this in field data. A replacement should use CSS `position: sticky` or avoid pinning.
- **It carries the desktop imagery:** this is the only place desktop visitors see client work without hovering. If the new concept drops the screenshots, desktop has no visible work at all.
- **Length:** the pin takes 2,880px, 21% of the page at 1440.
- **Repetition on phones:** all five service images appear again in the work list straight after.

### Work index
- At rest on desktop it is a nine-row text table.
- The hover preview is 400x250, fixed to the middle of the viewport rather than its row. It covers the Year column for rows inside its slot (seen on rows 07 and 08, despite the code comment "never over live text") and fades out "What we built" on every row.
- Several previews are poor sales images: UGLQ is a login screen, QLD Law Group is a sparse app page.
- Phones show every screenshot, so the small screen currently sells better than the large one.
- The copy says "Open the live sites on your phone", but rows link to case pages, and 8Drive has no live link (`liveLabel: null`).
- `changed` in `cases.ts` already holds a one-line outcome per case and is not shown here.

### Lab
Confirmed bug: the flood takes the field when its top reaches 55% of the viewport, so the sheet disappears while the Lab is still on screen. In all five sampled positions at 1440 (flood top from 509 to 234) the ten captions sit under empty space.

Other notes:
- The reduced-motion posters look brighter and sharper than the live sheet, which runs at 0.6 dim.
- "10 of 10 shipped / Queued 00" reads as a finished progress meter.
- Fictional brands sit between the real work and the price. That order is worth questioning.

### 7-day flood
- $499 is 12px mono in an outlined pill, next to a 201.6px headline. The number that sells is the smallest thing in the section.
- The right half of the panel is empty at desktop widths.
- "launched in one week" contradicts the FAQ's "7 business days".
- With `?geo=ph`, "See peso pricing" sits beside a CTA that already goes to the same peso page.
- The dock's shadow looks dirty on lime.

### Process
- Four generic steps. The strongest line, that domain, hosting and logins are all in the client's name, is buried in body copy and a 12px eyebrow.
- Lime nodes read as mould splats beside the crisp hero mark.
- The path overshoots the container (x=95 against 108) and runs almost on top of the hairlines, so they read as a doubled line.
- Mobile bug: the path collapses into a scribble over "Pixels second." The cause is in the fix list.

### Connections
- The globe is excellent. The limb light and arcs look expensive, and the sticky scroll is well judged.
- The pins are unlabelled splats, so nobody can tell Iligan from Utah.
- At 2000x890 the headline runs to five lines at 128px in a 594px column.
- The stat values sit 10px out of line at all desktop widths (10078 against 10088 at 1440). The cause is in the fix list.
- "3", "4 yrs" and "4" are weak stats, and all of them have already been said.
- The reduced-motion globe is a plain dotted disc with no continents.

### People
- Two of four people have initials instead of photos, which reads as unfinished.
- The two photos have different backgrounds.
- Rings and lime clusters run through card text at 1440 and 2000, for example over "strategic and on brief" and "Head of Development".
- Each card is a tab stop that goes nowhere.

### FAQ
Clean, and only four questions. "How much does a website cost?" should be open by default, because it is the question visitors came for.

With `?geo=ph`, the third answer still says "Prices are in US dollars" while the rest shows pesos.

### Contact
- The form is good: clear labels, helpful hints, only three required fields.
- The headline is 389px tall in a 496px column at 1440.
- The desktop node sits 104px above the text column, in the gap below the FAQ. It was not visible in any of my 39 stepped desktop shots. Two targeted checks showed it unformed 1.8s after scrolling stopped, then formed at 2.9s with the DOM hidden. On phones it is lovely.
- "Brief" is agency language for a small business owner.
- The phone placeholder stays "+63 9XX XXX XXXX" for US visitors.

### Footer
- The dot wordmark, with its pointer bulge, is a strong desktop close.
- On phones the wordmark is a near-invisible outline.
- The statement above the columns is a third restatement of the intro.

### Lime cursor: keep it, but tune it
It costs no usability. The native cursor stays, and the effect hides on inputs and during keyboard use.

It earns its place wherever the field has a shape: the dent in the mark, the Lab frame edge, the footer wordmark. Over plain lattice it is a sunburst sitting in reading areas, visible in many stepped shots. It also never has a form to interact with there. Keep full strength on formed beats and roughly halve ray alpha and length on `work`, `flood`, FAQ and intro.

## Performance evidence

| Measure | Result |
|---|---|
| Total transfer, desktop | 585 KB in 43 requests (mobile before scrolling: 484 KB) |
| JavaScript | 266 KB, of which GL chunk 186.6 KB br and ScrollTrigger 45.2 KB br |
| TTFB, FCP, LCP unthrottled | 197ms, 316ms, 316ms |
| FCP, LCP on slow 4G with 4x CPU | 580ms, 580ms (indicative) |
| Long tasks | None on desktop, one of 51ms throttled |
| Frames during full scroll | p50 16.7ms, p99 16.8ms at all three sizes, on this Mac |
| Isolated stalls | 1 to 2 frames per walk, worst 267ms. Did not recur in a fast-flick test, so possibly screenshot capture |
| CLS on load | 0.0001 desktop, 0.0003 mobile |
| CLS over a full desktop scroll | 1.99 and 1.91, attributed to `.svc-pin` |

Budget notes:
- The GL chunk is 186.6 KB br against about 156 KB in the README.
- Non-motion, non-GL bundled scripts total about 15.8 KB br against the 12 KB gz pre-3D budget. That count is mine: it includes the contact form, prefetch and helpers, and excludes Vercel analytics.

## Accessibility evidence

- axe (WCAG 2 A/AA, 2.1, 2.2, best practice): 0 violations at 1440 and 390. 79 colour-contrast nodes came back "needs review" because of the dot background.
- Sampled text colours on #090909: gray-400 is 6.48:1, gray-300 is 10.48:1.
- Heading order is sound, landmarks are present, every image has alt text or a deliberate empty alt.
- Skip link works. 70 tab stops all had a 2px outline and scrolled into the viewport, including inside the pin.
- A fast flick to the bottom left no reveal content hidden. No-JS shows everything.
- Weak spots: 10 to 12px mono carries real information (roles, eyebrows, prices), and four `li tabindex="0"` cards do nothing. On phones, inline contact links are 29px tall.

## Proof and claims audit

| Claim | Status |
|---|---|
| 120+ projects by our founder, 3 countries, 4 yrs, 4 people, 9 cases, 3 custom projects a month | OK, from `proof.ts`, `cases.ts` and `team.ts` |
| Zero data loss, 5 weeks, new revenue stream | In `proof.ts` |
| Most case studies are USA and Australia | True: 6 of 9 |
| **"launched in one week" against "7 business days"** | **Contradiction.** 7 business days is at least 9 calendar days, and the 20% guarantee depends on the definition |
| **"a site that converts better"** | **Unsupported.** In `proof.ts` but no figure, and `CASE_METRICS_REAL = false` |
| "The new store is faster" | No figure, softer risk |
| "20% off", "4 to 12+ weeks", "8-14 weeks", "one business day" | Outside `proof.ts` (`home.ts`, `index.astro`, `lp.ts`). Confirm, or move into `proof.ts` |
| "Open the live sites" | Overstated: 8Drive has no live link |

Client screenshots: the A Framing Company shot shows "1+ Years in the industry" beside "the last decade", and Cleen & Green shows "191+" and "188+". These look like counters captured mid-animation. Recapture them.

## Fix list

### P0: visibly broken

**P0-1. Mobile hero: cookie banner covers both CTAs**
- Where: `src/components/CookieBanner.astro:20`, `src/boot/cookies.ts`.
- Wrong: on every first phone visit the banner top is at 723 while the CTAs span 700 to 748, so both are cut through. The dock is also hidden while the banner shows. A 200px scroll brings the CTAs clear, but the banner stays.
- Change: GA4 loads only after consent, so nothing needs the banner on first paint. Show it after the first scroll or about 4 seconds. This leaves the hero layout untouched and also clears the cue at 2000x890. It changes the first hero view, so the owner should approve it.

**P0-2. Mobile process: path collapses over the headline**
- Where: `src/field/controller.ts:153`, `src/field/formations.ts:289`.
- Wrong: `height: 60` is passed even when `vertical` is true, so a 721px column gets a 60px path. Confirmed at 1x and 2x.
- Change: use `r.height` and `r.top` on non-desktop. Keep the curve in a narrow left rail, because the current control points swing from -20% to +50% of the width and would cross the text. Give `.step` a small left padding on phones. Check at 390.

**P0-3. Lab: sheet vanishes while its captions are on screen**
- Where: `src/field/controller.ts:344`.
- Wrong: every section takes the beat at `top 55%`, so `flood` takes it while most of the Lab is still showing.
- Change: add a per-section start, for example `data-fstart="top 12%"` on `#flood`, so `slate` holds until the Lab has left. Check at 1440 and 2000x890.

### P1: holding back the score

**P1-1. Desktop work is invisible at rest (biggest single lift)**
- Where: `src/components/WorkIndex.astro`, `index.astro:109-117`.
- Change: show three large featured cases with real images, each with its `changed` outcome line, then keep the table for the rest. The images already exist as `w-thumb`. Choose strong shots, not the UGLQ login. Coordinate with the services replacement so desktop keeps visible work either way.

**P1-2. Fix "one week" against "7 business days" (owner decision)**
- Where: `index.astro:146`, `src/data/home.ts:6`.
- Change: pick one definition and use it everywhere the offer appears, including the headline, LP and guarantee.

**P1-3. Intro: stop competing with the hero**
- Where: `index.astro:66-78`, `:287`.
- Change: bring the H2 down to about `--fs-d2` (60px), keeping the words for SEO. Remove the ruler labels or make them mean something. Replace the facts list with things not yet said, such as the 120+ stat and the ownership promise.

**P1-4. Open up headline tracking and set a clear type scale**
- Where: `.hero-h` at `index.astro:255` (suggestion for the owner) and the display classes.
- Change: try -.02em with about .06em word spacing. Check the second line still clears the mark, which has 55px at 1440. Keep the H1 at or above every H2 except the flood.

**P1-5. Flood: make prices the second-biggest thing**
- Where: `index.astro:150-152`.
- Change: use the empty right half for three price blocks in display type, each with one line on what's included. Prices come from `proof.ts`, contents from `lp.ts`.

**P1-6. Replace the splats with crisp nodes**
- Where: `formations.ts:300` (`cluster`), `controller.ts:455`.
- Change: `slate` already eases curl to 1.5 so its frames read as drawn lines. Do the same for `path4`, `rings` and globe pins. Tune the clusters into tight dot discs or rings. This is tuning, not removal.

**P1-7. People: finish the team and clear the text**
- Where: `index.astro:204-211`, `src/data/team.ts`.
- Change: owner to supply the two missing portraits, in one consistent treatment for all four. Move the rings into the empty left area or behind the card gaps so they stop crossing text.

**P1-8. Two-column headlines on wide windows**
- Where: `#conn-h` and `#ct-h`, `--fs-d1` in `src/styles/tokens.css`.
- Wrong: the size grows with viewport width while the container stops at 1340px, which gives 5 lines at 2000.
- Change: cap `#conn-h` at about 6.75rem and `#ct-h` at about 5.5rem, or widen the contact column. Check both at 1440 and 2000.

**P1-9. Unsupported result claims**
- Where: `src/data/proof.ts` `results`.
- Change: owner to supply a real figure for Cleen & Green and The Telecom Shop, or reword "converts better" to something provable.

**P1-10. Copy: break the formula and add a client voice**
- Where: `index.astro` headings, `proof.ts`.
- Wrong: 7 of 11 section headlines use the same two-beat pattern, such as "Our lab. Your next site." and "Four people. No hand-offs." All sit on the same mono eyebrow.
- Change: rewrite three or four, starting with the intro and process. Add two or three real, approved client quotes. There are none on the page today, and this is the biggest content gain available. Nothing should be invented.

**P1-11. Phone page length**
- Where: `WorkIndex.astro` `.w-thumb`.
- Wrong: 18,981px, or 22.5 screens. Services and work alone take 6,544px.
- Change: keep thumbnails for the first three cases on phones and use text rows for the rest. That saves roughly 1,400px. Have the services replacement avoid repeating the same images.

**P1-12. Show the offer earlier and pick one primary CTA (owner decision)**
- Wrong: the first price is 7,661px down at 1440. The hero pushes "Start a project" while the dock and footer push "7 days".
- Change: decide which funnel leads. A small "7-day sites from $499" line in the hero is a suggestion for the owner.

**P1-13. Contact node on desktop**
- Where: `index.astro:457`.
- Change: move the anchor into the empty area beside the headline, so it is on stage when the form is. Check why it takes over 1.8 seconds to form.

### P2: polish

| Where | What's wrong | Change |
|---|---|---|
| `index.astro:425` | Stat values 10px out of line | Add `align-content: start` to `.stat` |
| `src/components/Faq.astro` | Price answer closed | Open the first item by default |
| `WorkIndex.astro` `.wprev` | Preview covers Year, fades "What we built" on every row | Move the slot right of Year, or fade the Year column too |
| `ContactForm.astro:16` | "+63" placeholder for intl visitors | Include placeholders in the market swap |
| `ContactForm.astro:6`, swap in `Base.astro` | PH sees ₱ then $ ranges | Add peso ranges, or label the list as USD only |
| `home.ts:7`, `home.ts:5` | PH sees "Prices are in US dollars" and a $ custom range | Add a market variant |
| `index.astro:156` | PH sees a redundant peso link | Hide it when `data-geo="ph"` |
| `--capsule-sh` in `tokens.css` | Dock shadow dims text and looks dirty on lime | Reduce the spread, and lighten it over `#flood` |
| Dock CTA | "7 DAYS" means little out of context | Use "7-day site" if it fits |
| `index.astro:60`, dock | 01/09, 01/07 and 12 sections disagree | Use one count or drop it |
| `index.astro:177` | Reduced-motion globe has no continents | Bake a real poster from the land bitmask |
| `images.ts` assets | Screenshots look mid-count | Recapture |
| Footer, phones | Wordmark near invisible | Raise its contrast |
| `index.astro:206` | Four dead tab stops | Link to the profiles, or remove `tabindex` and keep hover |
| `--section` spacing | 216 to 255px of near-black between sections leaves stranded eyebrows | Trim where no field moment fills the gap |
| Eyebrows, phones | Wrapped lines start with "·" | Hide the separator at the wrap |
| Cursor rays | Noise on lattice beats | Halve alpha and length there |
| GL chunk, pre-3D scripts | Over stated figures | Update the README or trim |

## Video-readiness notes

Best 30 seconds: hold the mark for 3 seconds, dent it with the pointer, scrub the burst, cut past the intro and table, Lab sheet, flood wipe, globe with arcs, then the footer wordmark. Clear the cookie banner first. P0-3, P1-1 and P1-6 are the fixes that would change the footage most.
