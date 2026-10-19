// Proof: stats owner-confirmed 2026-10-19 (120+ projects; the rest derived from cases/team/site). Do not add new claims.
// Mirrors copy/proof.md sections A, B, C, E + copy/answers-2026-10-16.md.
import { YEARS } from './site';
import { countries } from './cases';
import { team } from './team';

// Owner-confirmed 2026-10-19: 120+ projects is real. Every other number is derived from the data files.
export const stats = [
  { value: '120', suffix: '+', label: 'Projects delivered', sub: 'Websites, brands and systems since 2022', show: true }, // owner-confirmed
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
  { value: '120+', label: 'Projects delivered' }, // owner-confirmed 2026-10-19
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
