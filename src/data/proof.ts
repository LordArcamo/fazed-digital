// Proof: stats owner-confirmed 2026-10-19 (120+ projects; the rest derived from cases/team/site). Do not add new claims.
// Mirrors copy/proof.md sections A, B, C, E + copy/answers-2026-10-16.md.
import { YEARS } from './site';
import { countries } from './cases';
import { team } from './team';

// Owner-confirmed 2026-10-19: 120+ projects is real. Every other number is derived from the data files.
export const stats = [
  { value: '120', suffix: '+', label: 'Projects by our founder', sub: 'Websites, brands and systems delivered since 2022', show: true }, // owner-confirmed; founder's track record (user, 2026-11-01)
  { value: String(countries.length), suffix: '', label: 'Countries', sub: 'USA, Australia and the Philippines', show: true }, // from cases.ts
  { value: String(YEARS), suffix: ' yrs', label: 'In business', sub: 'Iligan City-based since 2022', show: true }, // computed
  { value: String(team.length), suffix: '', label: 'People', sub: 'One small team, a direct line', show: true }, // from team.ts
];

// Home "Connections" results (copy/home.md HOME-07, from the old TestimonialsSection)
export const results = [
  { tag: 'Australia · E-commerce', statement: 'Magento to PrestaShop. Zero data loss.', body: 'Full catalogue, customers and order history moved without disrupting sales. The new store is faster, and the team runs it without a developer.', link: { label: 'Read the Telecom Shop case', href: '/work/04' } },
  { tag: 'USA · Platform', statement: 'Idea to live platform in 5 weeks.', body: 'An installable web app for drivers, organisers, businesses and spectators from day one. No app store required.', link: { label: 'Read the CrateOnScene case', href: '/work/03' } },
  { tag: 'Philippines · Brand + web', statement: 'A rebrand that opened a new revenue stream.', body: 'A premium eco brand, a site that converts better, and a franchise section that opened a growth channel they couldn’t use before.', link: { label: 'Read the Cleen & Green case', href: '/work/02' } },
];

// LP reviews: NOT REAL YET (answers #4). Rendered as marked placeholders while false.
export const LP_REVIEWS_REAL = false;
export const lpTestimonials: { quote: string; name: string; role: string }[] = []; // drop real, approved quotes here, then flip the flag

// LP trust bar: owner confirmed 120+ projects (2026-10-19); the unverified 12+ / 100% on-time / 7x figures were removed
export const lpTrust = [
  { value: '120+', label: 'Projects by our founder' }, // owner-confirmed 2026-10-19; reworded as the founder's track record (user, 2026-11-01)
  { value: String(countries.length), label: 'Countries served' },
  { value: 'Since 2022', label: 'Iligan City studio' },
];

// Case metrics: none real yet (answers #16). Placeholders render while false.
export const CASE_METRICS_REAL = false;

export const prices = {
  usd: { starter: '$499', growth: '$899', pro: '$1,499', page: '$79', care: '$99/month' },
  php: { starter: '₱19,999', growth: '₱34,999', pro: '₱59,999', page: '₱2,500', care: '₱3,500/month' },
  customRange: '$5,000–$20,000', // answers #6 (includes custom systems)
};

// Monthly caps (answers follow-up, TBC-07). No live "spots left" counter.
export const caps = { sevenDayPerMonth: 15, customPerMonth: 3 };
export const capsCopy = {
  sevenDay: 'We take on 15 seven-day builds a month, max.',
  custom: 'We take on 3 custom projects a month.',
};

// Automations and social media management (owner, 10 Nov 2026: docs/seo/pages/service-pages.md "Owner pricing decisions").
// No clients yet in either service, so nothing here is a result. Read by /services/automations, /services/social-media-management,
// the /services hub and the chat's market blocks.
// Render a pair as "$899 (₱29,999)" in one text node: the geo swap in Base.astro reads that pattern, while a bare "$899"
// would be mapped to the 7-day Growth peso price. Kept apart from `prices.usd`, which lint-chat treats as the package list.
export const AUTOMATION_CLIENTS_REAL = false; // flip when the first automation client is live and approved to show
export const automationPrices = [
  { id: 'check', name: 'Free automation check', usd: 'Free', php: 'Free', includes: 'A 15-minute call, booked through /contact?service=automations' },
  { id: 'single', name: 'Single automation', usd: '$299', php: '₱9,999', includes: 'One workflow, live in 5 business days, 14 days of fixes' },
  { id: 'pack', name: 'Automation pack', usd: '$899', php: '₱29,999', includes: 'Up to 3 connected workflows, walkthrough video and written steps, 30 days of fixes' },
  { id: 'custom', name: 'Custom automation', usd: 'from $2,500', php: 'quoted', includes: 'Custom code, AI agents, systems with no ready-made link' },
  { id: 'care', name: 'Automation care', usd: '$99/month', php: '₱3,500/month', includes: 'Monitoring, and fixes when a tool changes' },
] as const;
export const automationTerms = {
  tools: ['n8n', 'Zapier', 'Make', 'HubSpot', 'custom code'],
  // Nothing is asked in return: the owner's 10 Nov note said "for a testimonial", but the 6 Nov rule in offers.ts (no
  // discount may be tied to a review) wins; resolved by the coordinator in copy/service-pages/automations.md §15.
  founding: { on: true, off: '20%', spots: 3, line: '20% off for our first 3 automation clients. Nothing is asked in return.' },
  subscriptions: 'Tool subscriptions are in the client’s own name.',
};

export const SOCIAL_CLIENTS_REAL = false;
export const socialPrices = [
  { id: 'starter', name: 'Starter', usd: '$399/month', php: '₱14,999/month', recommended: false, includes: 'Up to 3 platforms, 12 designed posts a month, captions, scheduling, monthly report' },
  { id: 'growth', name: 'Growth', usd: '$799/month', php: '₱29,999/month', recommended: true, includes: 'Up to 5 platforms, 20 posts including 4 short videos, stories, replies to comments and DMs on business days, monthly report and call' },
  { id: 'pro', name: 'Pro', usd: '$1,499/month', php: '₱49,999/month', recommended: false, includes: 'All the client’s platforms, 30 posts including 8 short videos, ads management (ad spend paid by the client), content calendar' },
] as const;
export const socialTerms = {
  minimum: '3-month minimum, then month to month with 30 days’ notice.',
  // Nothing is asked in return (offers.ts 6 Nov rule; copy/service-pages/social-media-management.md §7)
  founding: { on: true, off: '20%', spots: 3, months: 3, line: '20% off the first 3 months of any plan for our first 3 clients. Nothing is asked in return.' },
};

// Work with no published price (owner, 10 Nov 2026). One line each, so the pages and the chat say the same thing.
export const quotedCopy = {
  brand: 'Quoted per project', // owner: brand work is quoted per project, with no "from" price
  seoRetainer: 'Quoted per project', // TBC owner: a starting monthly price, if one is ever published (brief TBC-3)
  designOnly: 'Quoted per project', // TBC owner: design-only UI/UX price and typical timeline (brief TBC-7)
};
