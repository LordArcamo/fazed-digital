// Website quiz (/quiz): every word, point, area, band and fix in one file.
// Copy: copy/quiz.md (The Wordsmith, draft 2026-11-19). Plan: docs/marketing/quiz-lp-plan.md (owner decisions 19 Nov 2026).
// Rules from the copy: every score says "Based on your answers"; fix examples write "[your price]", never a currency
// amount (the geo script would rewrite it); never "5-star" or star glyphs (lint-dist). Prices come from proof.ts and
// offers.ts, cases from cases.ts. The page (Quiz.astro) serialises what the browser needs into one JSON block, so the
// engine (src/forms/quiz.ts) never imports this file and none of these imports reach the client bundle.
import { prices, stats } from './proof';
import { offerPrice, bfPrice } from './offers';
import { BLACK_FRIDAY } from './season';
import { FOUNDED, NAP } from './site';

/** The result email to the lead (copy/quiz.md §7) needs the owner's approval, a sending address and an email tool first.
 *  While false: nothing is emailed to the lead and the page never promises an emailed copy. The team alert always goes. */
export const QUIZ_RESULT_EMAIL = true; // owner: start it (2026-11-19). Sender info@ as "Lord at Fazed Digital" (src/lib/quiz-email.ts)

export type AreaId = 'first' | 'clarity' | 'trust' | 'persuasion' | 'ease';
export type BizId = 'trades' | 'health' | 'food' | 'pro' | 'retail' | 'other';
export type Path = 'site' | 'nosite';

export interface Option { v: string; label: string; pts?: number; coach?: string }
export interface Question {
  id: string;
  /** Q-number from copy/quiz.md (Q1–Q12, N1–N3) */
  n: string;
  /** choice = one tap advances · multi = tick all that apply, then "Done, next" */
  kind: 'choice' | 'multi';
  /** which branch shows it; unset = both */
  path?: Path;
  area?: AreaId;
  h: string;
  hint?: string;
  /** hint shown instead when Q1 = "It's being built" */
  hintBuilding?: string;
  options: Option[];
  /** multi only: the option that clears the others ("Nothing yet") */
  none?: string;
  /** multi only: points = number ticked, capped here */
  cap?: number;
}

/* ── Page ───────────────────────────────────────────────── */
export const page = {
  title: 'Website Quiz: Does Your Site Make People Call? | Fazed',
  description: '12 one-tap questions on how your website looks, reads and persuades. Get a free score in about 90 seconds, plus the 3 fixes that matter most.',
};

/* ── First screen (Direction B "Lime Room": the hero holds Q1, no Start gate) ── */
const founderProjects = stats[0]; // "120+ Projects by our founder" (owner-confirmed, proof.ts)
export const start = {
  h1: ['Does your website make people call?', 'Score it in 12 taps.'],
  meta: 'Free · About 90 seconds · No sign-up to see your score', // NEW (Direction B mock): recombines the copy's eyebrow + trust line 3
  trust: [
    `${founderProjects.value}${founderProjects.suffix} projects by our founder since ${FOUNDED}`,
    `A studio in ${NAP.city} · clients in the USA, Australia and the Philippines`,
  ],
  book: 'Rather talk? Book a 15-min call',
  resume: 'Continue where you left off',
  restart: 'Start over',
  noJs: 'This quiz needs JavaScript to add up your score. You can still book a free 15-minute call with Lord.',
};

/* ── Question chrome ────────────────────────────────────── */
// NEW strings from the Direction B mocks (docs/marketing/quiz-redesign/review.md): Wordsmith + owner to approve.
export const chrome = {
  of: 'of',
  back: 'Back',
  hint: (n: number) => `Press 1 to ${n}`, // NEW (mock), replaces "Press 1–5 to answer"
  multiNext: 'Done, next',
  adding: 'Adding up your answers…',
  aboutYou: 'About you', // NEW (mock): the progress label for Q1, Q2 and the no-website questions
  halfway: 'halfway there', // NEW (mock): milestone at the real halfway point
};

/* ── Questions (one per screen) ─────────────────────────── */
// Points 0–3. Ten questions are scored (Q3–Q12), two per area: each area 0–6, the total 0–30, shown as round(total / 30 × 100).
// `coach` = the micro-feedback line shown for about 1.5 s at the top of the next screen (copy/quiz.md §3).
export const questions: Question[] = [
  {
    id: 'has', n: 'Q1', kind: 'choice', h: 'Do you have a website?',
    options: [
      { v: 'yes', label: 'Yes' },
      { v: 'building', label: 'It’s being built', coach: 'Good timing. Fixing things before launch is the cheap way.' },
      { v: 'facebook', label: 'Only a Facebook page', coach: 'A good start. Next: a page you own.' },
      { v: 'no', label: 'No, not yet' },
    ],
  },
  {
    id: 'biz', n: 'Q2', kind: 'choice', h: 'What kind of business is it?',
    options: [
      { v: 'trades', label: 'Trades and home services' },
      { v: 'health', label: 'Health and wellness' },
      { v: 'food', label: 'Food and hospitality' },
      { v: 'pro', label: 'Professional services' },
      { v: 'retail', label: 'Retail and online shops' },
      { v: 'other', label: 'Something else' },
    ],
  },
  {
    id: 'first', n: 'Q3', kind: 'choice', path: 'site', area: 'first',
    h: 'In the first 5 seconds, would you trust this business with your money?',
    hint: 'Open your homepage on your phone. Look at it like a stranger would.',
    hintBuilding: 'Answer for whichever version you can open now: the old site or the new draft.',
    options: [
      { v: 'premium', label: 'Yes, it looks premium', pts: 3, coach: 'Strong start. That first look carries the rest.' },
      { v: 'okay', label: 'It looks okay', pts: 2 },
      { v: 'unsure', label: 'Not sure', pts: 1 },
      { v: 'dated', label: 'It looks dated or cheap', pts: 0, coach: 'Honest answer. Looks are the first proof people get.' },
    ],
  },
  {
    id: 'photos', n: 'Q4', kind: 'choice', path: 'site', area: 'trust',
    h: 'Are the photos your real work, team or place?',
    hint: 'Scroll the homepage once. Count the stock photos.',
    options: [
      { v: 'real', label: 'All real', pts: 3 },
      { v: 'mix', label: 'A mix of real and stock', pts: 2 },
      { v: 'stock', label: 'Mostly stock or template photos', pts: 1, coach: 'Stock photos say “template”. Your phone camera can beat them.' },
      { v: 'none', label: 'No photos at all', pts: 0 },
    ],
  },
  {
    id: 'brand', n: 'Q5', kind: 'choice', path: 'site', area: 'first',
    h: 'Does every page look like the same brand?',
    hint: 'Open 2 or 3 pages. Same colours, fonts and logo?',
    options: [
      { v: 'yes', label: 'Yes, every page', pts: 3 },
      { v: 'mostly', label: 'Mostly', pts: 2 },
      { v: 'messy', label: 'It’s all over the place', pts: 0, coach: 'Mixed styles feel like mixed quality. This one’s easy to fix.' },
    ],
  },
  {
    id: 'headline', n: 'Q6', kind: 'choice', path: 'site', area: 'clarity',
    h: 'Read only the big headline. Could a stranger tell what you do, who it’s for and where?',
    hint: 'Just the biggest words at the top. Nothing else.',
    options: [
      { v: 'three', label: 'All three', pts: 3, coach: 'That’s the hardest line on any site. Nice.' },
      { v: 'two', label: 'Two of them', pts: 2 },
      { v: 'one', label: 'One of them', pts: 1 },
      { v: 'slogan', label: 'No, it’s a slogan or “Welcome to…”', pts: 0, coach: 'Slogans make people guess. What, who, where: that’s the job.' },
    ],
  },
  {
    id: 'voice', n: 'Q7', kind: 'choice', path: 'site', area: 'clarity',
    h: 'Who does your homepage talk about more?',
    hint: 'Count the sentences that start with “We” or “Our”.',
    options: [
      { v: 'customer', label: 'The customer: their problem and the result', pts: 3 },
      { v: 'half', label: 'About half and half', pts: 2 },
      { v: 'us', label: 'Mostly us: “We are…”, “Our mission…”', pts: 0, coach: 'Flip it: their problem first, then you.' },
    ],
  },
  {
    id: 'proof', n: 'Q8', kind: 'multi', path: 'site', area: 'trust', none: 'nothing', cap: 3,
    h: 'Near the top, what proves you’re good? Tick all you have.',
    hint: 'Near the top means before the first big scroll.',
    options: [
      { v: 'reviews', label: 'Reviews with real names', pts: 1 },
      { v: 'rating', label: 'A star rating from Google or similar', pts: 1 },
      { v: 'results', label: 'Before-and-after photos or real results', pts: 1 },
      { v: 'logos', label: 'Client logos or “as seen in”', pts: 1 },
      { v: 'guarantee', label: 'A guarantee', pts: 1 },
      { v: 'nothing', label: 'Nothing yet', pts: 0, coach: 'No proof yet? Your happy customers are the fix.' },
    ],
  },
  {
    id: 'cta', n: 'Q9', kind: 'choice', path: 'site', area: 'persuasion',
    h: 'Is there one obvious next step, with a reason to take it now?',
    hint: 'Find the main button. Read what it says.',
    options: [
      { v: 'clear', label: 'One clear step, with a reason', pts: 3 },
      { v: 'noreason', label: 'A button, but no reason', pts: 2 },
      { v: 'many', label: 'Several buttons competing', pts: 1, coach: 'Too many choices and people stall. Pick one.' },
      { v: 'none', label: 'No clear next step', pts: 0 },
    ],
  },
  {
    id: 'price', n: 'Q10', kind: 'choice', path: 'site', area: 'persuasion',
    h: 'Can visitors see your prices, a “from” price or a range?',
    hint: 'Check your homepage and your main service page.',
    options: [
      { v: 'clear', label: 'Yes, clear prices or “from” prices', pts: 3 },
      { v: 'dig', label: 'Somewhere, if you dig', pts: 2 },
      { v: 'quote', label: 'Only “Contact us for a quote”', pts: 1 },
      { v: 'none', label: 'No mention of price at all', pts: 0, coach: 'No price means guessing. Even a “from” price helps.' },
    ],
  },
  {
    id: 'reach', n: 'Q11', kind: 'choice', path: 'site', area: 'ease',
    h: 'On your phone, can someone call, book or message you in one tap?',
    hint: 'Load your homepage on your phone. Don’t scroll.',
    options: [
      { v: 'yes', label: 'Yes, without scrolling', pts: 3 },
      { v: 'scroll', label: 'Only after scrolling', pts: 1 },
      { v: 'no', label: 'No, they have to copy a number or find a form', pts: 0, coach: 'If calling takes effort, some people won’t bother.' },
    ],
  },
  {
    id: 'find', n: 'Q12', kind: 'choice', path: 'site', area: 'ease',
    h: 'Can a visitor find what they came for in 2 taps or fewer?',
    hint: 'Try it: find your main service, then your contact page.',
    options: [
      { v: 'yes', label: 'Yes, every time', pts: 3 },
      { v: 'sometimes', label: 'Sometimes', pts: 2 },
      { v: 'lost', label: 'They’d get lost', pts: 0, coach: 'Lost visitors leave. A shorter menu helps.' },
    ],
  },

  /* No-website path: Q1 → Q2 → N1 → N2 → N3 → the starting plan. Nothing is scored. */
  {
    id: 'goal', n: 'N1', kind: 'choice', path: 'nosite', h: 'What should your website do first?',
    options: [
      { v: 'calls', label: 'Bring in calls and quote requests' },
      { v: 'bookings', label: 'Take bookings or orders' },
      { v: 'legit', label: 'Make you look legit when people check you out' },
      { v: 'shop', label: 'Sell products online' },
    ],
  },
  {
    id: 'who', n: 'N2', kind: 'choice', path: 'nosite', h: 'Who do you most want to reach?',
    options: [
      { v: 'local', label: 'Local customers near you' },
      { v: 'b2b', label: 'Other businesses' },
      { v: 'far', label: 'Customers in other cities or countries' },
      { v: 'walkin', label: 'Walk-ins and regulars' },
    ],
  },
  {
    id: 'when', n: 'N3', kind: 'choice', path: 'nosite', h: 'When do you want to be online?',
    options: [
      { v: 'asap', label: 'As soon as possible' },
      { v: 'soon', label: 'In the next 1–3 months' },
      { v: 'later', label: 'Later this year' },
      { v: 'browsing', label: 'Just looking for now' },
    ],
  },
];

/** Q1 answers that take the no-website path */
export const NO_SITE = ['no', 'facebook'];
/** coach line after Q8 when 3 or more are ticked, and after Q12 (any answer) */
export const coachExtra = { proofStrong: 'That’s real proof. Make sure it’s near the top.', last: 'That’s all 12. Adding it up…' };

/* ── The 5 areas ────────────────────────────────────────── */
export const areas: { id: AreaId; name: string }[] = [
  { id: 'first', name: 'First impression' },
  { id: 'clarity', name: 'Clarity' },
  { id: 'trust', name: 'Trust' },
  { id: 'persuasion', name: 'Persuasion' },
  { id: 'ease', name: 'Ease' },
];
/** Tie-break for the weakest areas: copy and proof are the quickest fixes to make */
export const AREA_PRIORITY: AreaId[] = ['clarity', 'trust', 'persuasion', 'ease', 'first'];
/** area bar labels, by area score 0–6 */
export const areaLevels = [{ min: 5, label: 'Strong' }, { min: 3, label: 'Okay' }, { min: 0, label: 'Needs work' }];

/* ── The fix library (copy/quiz.md §5) ──────────────────── */
// Which fix shows is decided in the engine from the area's lower-scoring question (rules in the copy, §5).
// `ex` = [before, after] per business type; "Something else" uses the Professional services example.
type Ex = Record<Exclude<BizId, 'other'>, [string, string]>;
export interface Fix { id: string; area: AreaId; problem: string; principleName: string; principle: string; ex: Ex; note?: string }
export const fixes: Fix[] = [
  {
    id: 'FI-1', area: 'first', problem: 'My site looks older than my business.', principleName: 'First impressions',
    principle: 'People judge the business by the site before they read a word. Make the first screen look as good as your work.',
    ex: {
      trades: ['A small logo, a clip-art banner and a wall of text', 'A full-width photo of a finished job, one headline and a “Get a free quote” button'],
      health: ['Three fonts, a stretched logo and a slider of stock smiles', 'One calm colour, a photo of your real treatment room and “Book an appointment” at the top'],
      food: ['An old theme with a link to a menu PDF', 'A big photo of your best dish, today’s hours and “Order” right under it'],
      pro: ['A dark-blue template with a handshake photo', 'A clean page with your real portrait, what you handle and “Book a call”'],
      retail: ['Five banners fighting for attention', 'One hero product, its price and “Shop now”'],
    },
  },
  {
    id: 'FI-2', area: 'first', problem: 'Every page looks like a different website.', principleName: 'Consistency',
    principle: 'When every page matches, the business feels organised. When pages clash, people wonder what else is messy.',
    ex: {
      trades: ['Green buttons on the homepage, orange on the quote page, an old logo in the footer', 'One button colour, one logo and one photo style on every page'],
      health: ['The booking page is a plugin with its own fonts and colours', 'Booking styled like the rest of the site, so it feels like the same clinic'],
      food: ['The menu page uses different fonts from the homepage', 'Menu, homepage and specials share one type style and colour set'],
      pro: ['Each service page built at a different time, in a different style', 'One layout for every service page: headline, who it’s for, how it works, next step'],
      retail: ['Product photos on white, grey and kitchen-bench backgrounds', 'One photo style and one product card layout across the shop'],
    },
  },
  {
    id: 'CL-1', area: 'clarity', problem: 'My headline is a slogan, not an answer.', principleName: 'Clarity',
    principle: 'Your headline has one job: say what you do, who it’s for and where. Clever can come second.',
    note: 'Only promise what you deliver: if you can’t inspect the same week, don’t say it.',
    ex: {
      trades: ['Welcome to our website', 'Roof repairs in Brisbane. Same-week inspections.'],
      health: ['Your journey to wellness starts here', 'Physiotherapy for back and sports injuries in Cebu City'],
      food: ['Passion on a plate', 'Wood-fired pizza in Austin. Order for pickup or delivery.'],
      pro: ['Excellence. Integrity. Results.', 'Bookkeeping and tax for small businesses in Queensland'],
      retail: ['Discover the difference', 'Handmade leather bags, shipped across the Philippines'],
    },
  },
  {
    id: 'CL-2', area: 'clarity', problem: 'My homepage talks about us, not them.', principleName: 'Customer first',
    principle: 'People arrive with a problem. Name it, show the result, then tell them who you are.',
    ex: {
      trades: ['We are a family-owned company established in 2005…', 'Burst pipe at 10pm? Call now and talk to a plumber, not a call centre.'],
      health: ['Our mission is to provide holistic care…', 'Sore back every morning? We find the cause, then give you a plan you can follow at home.'],
      food: ['We are passionate about good food…', 'Feeding 20 people on Saturday? Order party trays by Thursday.'],
      pro: ['Our firm has decades of combined experience…', 'Behind on your books? We’ll get you caught up before tax time.'],
      retail: ['We pride ourselves on quality…', 'A bag that still looks good after years of daily use.'],
    },
  },
  {
    id: 'TR-1', area: 'trust', problem: 'Visitors have to take my word for it.', principleName: 'Social proof',
    principle: 'People trust other customers more than they trust you. Put real proof near the top, with real names, and only with permission.',
    ex: {
      trades: ['No reviews anywhere', 'Three short Google reviews with first names and suburbs, next to photos of those jobs'],
      health: ['Reviews on a separate page nobody opens', 'Your Google rating and review count under the headline, plus one patient’s words (with consent)'],
      food: ['Nothing but the menu', 'Your rating and three recent reviews under the hero photo'],
      pro: ['“Trusted by many clients”', 'Named client quotes with role and company, plus logos of clients who agreed to be shown'],
      retail: ['No reviews on product pages', 'Reviews on every product page, with customer photos'],
    },
  },
  {
    id: 'TR-2', area: 'trust', problem: 'Stock photos make me look like everyone else.', principleName: 'Real photos',
    principle: 'Real photos prove you exist and show what people will actually get. A phone and good daylight beat a stock library.',
    ex: {
      trades: ['A smiling model in a spotless hard hat', 'Your crew on a real site, with the finished job'],
      health: ['A model with a stethoscope', 'You and your team in your own rooms'],
      food: ['Stock pasta on a white plate', 'Your dish, on your plates, shot by a window'],
      pro: ['A handshake over a city skyline', 'A portrait of you, and your team at work'],
      retail: ['The supplier’s catalogue photos', 'Your products in use, shot in good light'],
    },
  },
  {
    id: 'TR-3', area: 'trust', problem: 'Buying from me still feels risky.', principleName: 'Risk reversal',
    principle: 'Take some of the risk off the customer and they say yes sooner. Only promise what you will honour every time.',
    ex: {
      trades: ['Nothing about what happens if it goes wrong', '“If the repair doesn’t hold for 12 months, we come back free.”'],
      health: ['Straight to “Book now”', '“Not sure it’s right for you? Your first short assessment is free.”'],
      food: ['No word on problems', '“Order arrives cold? We remake it or refund it.”'],
      pro: ['Hourly rates, no cap', '“A fixed quote before we start. No surprise bills.”'],
      retail: ['Returns policy hidden in the footer', '“Free returns within 30 days” next to the Add to cart button'],
    },
  },
  {
    id: 'PE-1', area: 'persuasion', problem: 'Visitors don’t know what to do next.', principleName: 'One next step',
    principle: 'Give every page one main action, and say what happens when they tap it. More choices means more people who choose nothing.',
    ex: {
      trades: ['Contact us · Learn more · Our services · Follow us', 'One button on every page: “Get a free quote”'],
      health: ['“Click here”', '“Book your first visit”'],
      food: ['Menu · About · Gallery · Contact, all the same size', '“Order now” first, “Book a table” second'],
      pro: ['A form that ends in “Submit”', '“Book a free 15-minute call”'],
      retail: ['Four banners with four different offers', 'One button: “Shop the new range”'],
    },
  },
  {
    id: 'PE-2', area: 'persuasion', problem: 'My button gives no reason to click it today.', principleName: 'A reason to act',
    principle: 'Tell people what they get and why now. Use real reasons only: fake countdown timers cost trust.',
    note: 'Each “after” only works if it’s true for your business.',
    ex: {
      trades: ['Contact us', 'Get a free quote. We reply the same business day.'],
      health: ['Book now', 'Book now. See this week’s open times.'],
      food: ['Order', 'Order by 3pm for same-day pickup.'],
      pro: ['Get in touch', 'Book a free 15-minute call. Leave knowing your options.'],
      retail: ['Shop now', 'Order today, ships tomorrow.'],
    },
  },
  {
    id: 'PE-3', area: 'persuasion', problem: 'I don’t show prices, so people guess.', principleName: 'Price anchoring',
    principle: 'A “from” price or a range answers “can I afford this?” before people leave to check someone else. It also brings you better-fit enquiries.',
    ex: {
      trades: ['Call for a quote', 'Roof inspections from [your price]. Most repairs quoted on the spot.'],
      health: ['No prices anywhere', 'First visit [your price], 45 minutes. Follow-ups [your price].'],
      food: ['Catering: please enquire', 'Catering from [your price] per person, for groups of 20 or more'],
      pro: ['Fees on request', 'Fixed-fee tax returns from [your price]. Complex cases quoted after a free call.'],
      retail: ['Shipping cost appears only at checkout', 'Price and shipping shown on the product page'],
    },
  },
  {
    id: 'EA-1', area: 'ease', problem: 'Reaching me takes more than one tap.', principleName: 'One-tap contact',
    principle: 'On a phone, the call, book or message button should always be in reach. Every extra step loses someone.',
    ex: {
      trades: ['The phone number is part of an image in the footer', 'A “Call now” button that stays at the bottom of the screen'],
      health: ['The booking form is two pages deep', '“Book” and “Call” buttons pinned to the bottom of the screen'],
      food: ['The number is written on a photo', 'Tap to call, Directions and Order in the header'],
      pro: ['An email address you have to copy', 'Call, Email and Book a call, one tap each'],
      retail: ['Chat hidden at the bottom of the page', 'A “Message us” button on every page'],
    },
  },
  {
    id: 'EA-2', area: 'ease', problem: 'People get lost looking for the basics.', principleName: 'Clear paths',
    principle: 'Anything a customer comes for should be 2 taps away or fewer. Short menus with plain labels win.',
    ex: {
      trades: ['14 menu items', 'Services · Projects · Reviews · About · Get a quote'],
      health: ['Treatments buried under “About us”', 'Treatments · Prices · Book · Find us'],
      food: ['The menu is a PDF download', 'The menu as a page, plus hours and a map on the homepage'],
      pro: ['One services page with 20 links', '4 service groups, each one tap from the menu'],
      retail: ['Categories hidden behind a menu icon, no search', 'Main categories on show and a search bar at the top'],
    },
  },
];

/* ── Bands (copy/quiz.md §4) ────────────────────────────── */
// `next` = the secondary CTA; the primary is always "Book a 15-min call with Lord".
// "Holding back" → the 7-day page, not /audit (coordinator default 19 Nov: /audit books the same calendar as the main
// button). Copy §9 #6 is still open for the owner.
export type NextId = 'sevenday' | 'audit' | 'service' | 'seo';
export const bands: { id: string; min: number; name: string; h: string; summary: string; next: NextId }[] = [
  { id: 'good', min: 80, name: 'In good shape', h: 'Based on your answers, your site is in good shape.', summary: 'It looks right, reads clearly and makes the next step easy. The next question is whether enough of the right people see it.', next: 'seo' },
  { id: 'working', min: 60, name: 'Working, with room to grow', h: 'Based on your answers, your site works. It could work harder.', summary: 'It looks the part and people can reach you. A few weak spots are still costing you enquiries, and the 3 fixes below are the ones to make first.', next: 'service' },
  { id: 'holding', min: 40, name: 'Holding back', h: 'Based on your answers, your site is holding you back.', summary: 'The basics are there, but a few gaps make people hesitate at the moment they should reach out. The 3 fixes below are where we would start.', next: 'sevenday' },
  { id: 'leaking', min: 0, name: 'Leaking customers', h: 'Based on your answers, your site is leaking customers.', summary: 'The people who find you are getting reasons to leave before they call. The good news: these are the easiest leaks to see, and your 3 biggest fixes are below.', next: 'sevenday' },
];
export const buildingLine = 'Good timing: these are cheaper to fix before launch than after.';

/* ── Secondary CTAs ─────────────────────────────────────── */
// The 7-day price: US/AU see the USD starter, PH sees offerPrice() (the founding rate while FOUNDING_PH.on). The engine
// picks one by market, so a single price is printed (the copy's "$499 (₱…)" pair is for the static geo swap).
const starter = { usd: prices.usd.starter, php: offerPrice('php', 'starter').price };
// Black Friday (src/data/season.ts): shown only while html.bf is on. Half the standard price, never stacked on the founding rate.
const sale = (m: 'usd' | 'php') => ({
  starter: { was: prices[m].starter, now: bfPrice(m, 'starter') },
  growth: { was: prices[m].growth, now: bfPrice(m, 'growth') },
  pro: { was: prices[m].pro, now: bfPrice(m, 'pro') },
});
export const blackFriday = {
  k: `Black Friday · ${BLACK_FRIDAY.dates}`,
  h: '7-day websites are 50% off.',
  from: 'Starter',
  cta: 'See the sale prices',
  nextH: 'A new site at half price.',
  body: (now: string, was: string) => `A new custom site, live in 7 business days or 20% off the project fee if we miss it on our side. Black Friday price from ${now} instead of ${was}, when you send your brief by ${BLACK_FRIDAY.ends}.`,
  prices: { usd: sale('usd'), php: sale('php') },
  ends: `The sale price ends ${BLACK_FRIDAY.ends}.`,
  hash: '#black-friday',
};
export const nextSteps = {
  sevenday: {
    h: 'Starting over may be faster.',
    body: (p: string) => `A new custom site, live in 7 business days or 20% off if we miss it on our side. From ${p}.`,
    price: starter,
    cta: 'See the 7-day website',
    href: { usd: '/lp/7-day-website', php: '/lp/7-day-website/ph' },
  },
  audit: { h: 'Not sure yet?', body: 'See what we check on the free 15-minute call, and what you leave with.', cta: 'What happens on the free check', href: '/audit' },
  service: {
    // band 3: the service page for their weakest area
    branding: { h: 'Make it one brand.', body: 'A logo, colours, type and guidelines that make every page look like the same business.', cta: 'Make every page one brand', href: '/services/branding' },
    web: { h: 'Fix it in the design.', body: 'Custom design, no templates, built around what makes your customers call.', cta: 'See how we design and build websites', href: '/services/web-design' },
  },
  seo: { h: 'Ready to be found?', body: 'SEO and AI search, with a plain-English report every month.', cta: 'See our SEO service', href: '/services/seo' },
};

/* ── Result + gate copy (copy/quiz.md §4, §6) ───────────── */
export const result = {
  label: 'Your website score',
  of: '/100',
  areasH: 'Your 5 areas',
  fixesH: 'Your 3 biggest fixes',
  fixesSub: 'Free: the problem in each of your weakest areas. Your email adds the before-and-after for your business and why it works.',
  noFixesH: 'Nothing to fix on these 5 checks.',
  noFixesSub: 'The next step is getting found.',
  example: 'Example',
  before: 'Before',
  after: 'After',
  why: 'Why it works',
  lockLine: (biz: string) => `Example for ${biz}, unlocks with your email`, // NEW (mock)
  lockedSr: 'Locked until you add your email.',
  gateChip: 'Unlock your 3 fixes', // NEW (mock)
  gateAdd: '+ Add your website (optional)', // NEW (mock)
  gateNamePh: 'Your first name', // NEW (mock)
  gateEmailPh: 'you@yourbusiness.com', // NEW (mock)
  jump: 'See your 3 biggest fixes', // NEW (mock, phones)
  fixesSubDone: (biz: string) => `Each one with a before-and-after for ${biz}, and why it works.`, // NEW (mock)
  gateLine: (biz: string) => `Get your 3 fixes with before-and-after examples for ${biz}.${QUIZ_RESULT_EMAIL ? ' Where should we send them?' : ''}`,
  gateName: 'First name',
  gateEmail: 'Email',
  gateSite: 'Website address (optional)',
  gateSitePh: 'yourbusiness.com',
  gateCta: 'Show my 3 fixes',
  gateUnder: QUIZ_RESULT_EMAIL ? 'We’ll email you a copy too.' : '',
  gateSending: 'One moment…',
  privacy: QUIZ_RESULT_EMAIL ? 'We’ll use your details to send your result and reply to you. We never sell your data.' : 'We’ll use your details to reply to you. We never sell your data.',
  doneH: (name: string, email: string) => (QUIZ_RESULT_EMAIL ? `Done, ${name}. Your 3 fixes are below, and a copy is on its way to ${email}.` : `Done, ${name}. Your 3 fixes are below.`),
  helpH: 'Want help with them?',
  helpBody: 'Book a free 15-minute call. We’ll open your site together and go through your 3 fixes.',
  spam: QUIZ_RESULT_EMAIL ? 'Didn’t get the email? Check your spam folder.' : '',
  book: {
    rail: 'Talk it through with Lord', // NEW (mock, desktop rail)
    inline: 'Rather talk it through?', // NEW (mock, phones)
    cta: 'Book a 15-min call with Lord',
    facts: ['Free', '15 minutes on Google Meet', 'We go through your 3 fixes with you'], // the copy's "under the CTA" line, as a list
    factsNoSite: ['Free', '15 minutes on Google Meet'],
    alt: 'Lord Arcamo, founder of Fazed Digital',
  },
  casesH: { match: 'Work for businesses like yours', local: 'Work for local service businesses', any: 'Recent work' },
  share: 'Send this quiz to your web person',
  shareText: 'Score your website in 12 taps:',
  shared: 'Link copied',
  retake: 'Retake the quiz',
  footnote: 'Your score is based on your answers, not a scan of your site. On a call we look at the real thing.',
};
/** "{business type}" in the gate line, lower case (copy §6) */
export const bizPhrase: Record<BizId, string> = { trades: 'trades and home services', health: 'health and wellness', food: 'food and hospitality', pro: 'professional services', retail: 'retail and online shops', other: 'your business' };

/* ── The no-website result: the starting plan (copy/quiz.md §4) ── */
const plan = (variant: 'usd' | 'php') => {
  const P = variant === 'php' ? prices.php : prices.usd;
  const st = variant === 'php' ? offerPrice('php', 'starter').price : P.starter;
  return {
    starter: { name: 'Starter', price: `from ${st}` },
    growth: { name: 'Growth', price: P.growth },
    pro: { name: 'Pro', price: P.pro },
  };
};
export const nosite = {
  label: 'No website yet',
  h: 'No website yet? Here’s your starting plan.',
  summary: 'There’s nothing to score yet, so here is what we would build first, based on your answers. A new custom site can go live in 7 business days.',
  planH: 'What we’d build first',
  answersH: 'Your answers',
  prices: { usd: plan('usd'), php: plan('php') },
  // N1 → package + line. `calls` with N2 = far → Growth.
  picks: {
    calls: { pkg: 'starter', line: '5 custom-designed pages and a contact form, set up so people can call or ask for a quote in one tap.' },
    callsFar: { pkg: 'growth', line: '8 pages, a blog and advanced on-page SEO, for customers who find you by searching.' },
    bookings: { pkg: '', name: 'Call first', line: 'Booking systems are scoped separately, so we’ll price yours on the call.' },
    legit: { pkg: 'starter', line: '5 custom-designed pages that answer “are they real?” in seconds: what you do, real photos, how to reach you.' },
    shop: { pkg: 'pro', line: 'E-commerce ready, 10+ custom pages. Bigger catalogues or custom checkouts are scoped on the call.' },
  } as Record<string, { pkg: string; name?: string; line: string }>,
  fixed: 'Live in 7 business days or 20% off if we miss it on our side. You send everything on Day 1 and your feedback within 24 hours. You own the domain, the site and the content.',
  // PH market only until the owner confirms the Facebook pull applies outside the Philippines (copy §9 #4)
  facebookPH: 'Share your Facebook page on Day 1 and we’ll pull your photos and details from it.',
  timeline: {
    asap: 'We take on 15 seven-day builds a month, max.',
    soon: 'Book a call now and we’ll pencil in a start date that suits you.',
    later: 'No rush. Keep this plan, and book a call when you’re ready.',
    browsing: 'No rush. Keep this plan, and book a call when you’re ready.',
  } as Record<string, string>,
};

/* ── Case studies by business type (real cases from cases.ts, copy §4) ── */
// heading: match = "businesses like yours" · local = "local service businesses" (no food client yet) · any = "Recent work"
export const casesByBiz: Record<BizId, { slugs: string[]; heading: 'match' | 'local' | 'any' }> = {
  trades: { slugs: ['01', '02'], heading: 'match' },
  health: { slugs: ['05', '02'], heading: 'match' },
  food: { slugs: ['02', '01'], heading: 'local' },
  pro: { slugs: ['08', '09'], heading: 'match' },
  retail: { slugs: ['04', '02'], heading: 'match' },
  other: { slugs: ['03', '06'], heading: 'any' },
};

/* ── Errors (copy §6) ───────────────────────────────────── */
export const msg = {
  pick: 'Pick one to keep going.',
  multi: 'Tick at least one, or “Nothing yet”.',
  name: 'Add your first name so we know who to send it to.',
  emailBlank: 'Add your email so we know where to send your fixes.',
  emailBad: 'That email doesn’t look right. Check it and try again.',
  site: 'That link doesn’t look right. Check it, or leave it blank.',
  network: 'Something went wrong on our side. Try again, or book a call and we’ll go through your result live.',
  offline: 'You’re offline. Reconnect, then tap the button again.',
};
