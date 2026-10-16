import { SITE_URL } from '../data/site';
export const crumbs = (items: [string, string][]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', '/'] as [string, string], ...items].map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE_URL + (path === '/' ? '/' : path) })),
});
export const faqPage = (faq: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
export const ORG_REF = { '@id': `${SITE_URL}/#organization` };
