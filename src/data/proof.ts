// UNVERIFIED: user will revise. Do not add new claims.
// Mirrors copy/proof.md sections A, B, C, E + copy/answers-2026-10-16.md.
import { YEARS } from './site';

export const stats = [
  { value: '120', suffix: '+', label: 'Projects delivered', sub: 'Across 14 industries', show: true }, // [TBC-21] S1 USER-REVISE-LATER
  { value: '98', suffix: '%', label: 'Client satisfaction', sub: 'Based on project reviews', show: true }, // S2 USER-REVISE-LATER
  { value: String(YEARS), suffix: ' yrs', label: 'In business', sub: 'Iligan City-based since 2022', show: true }, // S4 VERIFIED, computed
  { value: '4', suffix: 'x', label: 'Avg ROI uplift', sub: 'On SEO & web projects', show: true }, // S3 USER-REVISE-LATER
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

// LP trust bar (S5–S7 USER-REVISE-LATER; [TBC-21] 12+ vs 120+ conflict left as the user decided)
export const lpTrust = [
  { value: '12+', label: 'Websites delivered' },
  { value: '100%', label: 'On-time delivery' },
  { value: '7x', label: 'Faster than industry avg' },
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
