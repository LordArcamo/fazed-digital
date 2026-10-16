// copy/home.md HOME-03 (node blocks). Full chapters for /services live in copy/services.md.
export const services = [
  { id: 'web', n: '01', title: 'Web design & development', line: 'Fast, mobile-first sites you can update yourself, built to bring in enquiries.', scope: ['Custom design', 'WordPress / Astro', 'Core Web Vitals', 'CMS handover'], proof: { label: 'CASE 01 →', name: 'A Framing Company', href: '/work/01' } },
  { id: 'brand', n: '02', title: 'Brand identity', line: 'Logos, colour, type and guidelines that make a good business look as good as it is.', scope: ['Logo system', 'Colour + type', 'Guidelines', 'Templates'], proof: { label: 'CASE 02 →', name: 'Cleen & Green', href: '/work/02' } },
  { id: 'seo', n: '03', title: 'SEO marketing', line: 'Get found by the people already searching for what you sell, locally or worldwide.', scope: ['Technical audit', 'Keywords', 'On-page', 'GA4 + Search Console'], proof: { label: 'READ THE GUIDES →', name: 'SEO guides', href: '/blog' } },
  { id: 'product', n: '04', title: 'Product design', line: 'Research, flows and UI for apps and platforms people actually finish using.', scope: ['UX research', 'Wireframes', 'Figma UI', 'Design systems'], proof: { label: 'CASE 03 →', name: 'CrateOnScene', href: '/work/03' } },
  { id: 'systems', n: '05', title: 'Custom systems', line: 'Booking, membership and admin tools built around how your team really works.', scope: ['Web apps', 'Portals', 'APIs', 'Automation'], proof: { label: 'CASE 06 →', name: '8Drive', href: '/work/06' } },
] as const;
