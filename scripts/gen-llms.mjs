// gen-llms.mjs — writes public/llms.txt (an AI-search index: services, cases, posts, pricing, contact).
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { caseIndex } = await import(join(ROOT, 'src/data/cases.ts'));
const { chapters } = await import(join(ROOT, 'src/data/services.ts'));
const { labShipped } = await import(join(ROOT, 'src/data/lab.ts'));
const posts = JSON.parse(readFileSync(join(ROOT, 'src/data/.generated/posts.json'), 'utf8'));
const S = 'https://www.fazeddigital.com';
const lines = [
  '# Fazed Digital',
  '',
  '> Web design, branding and SEO studio in Iligan City, Lanao del Norte, Philippines (est. 2022). Websites, brands and web apps for clients in the USA, Australia and the Philippines.',
  '',
  `- Contact: info@fazeddigital.com · +63 906 825 3451 · Mon–Fri 8:30am–5:00pm PHT · ${S}/contact`,
  '- 7-day website package: Starter $499 / Growth $899 / Pro $1,499 (PHP: ₱19,999 / ₱34,999 / ₱59,999). Delivery in 7 business days, or 20% off the project fee.',
  '- Custom websites and systems: typically $5,000–$20,000 depending on scope.',
  '',
  '## Services',
  ...chapters.map((c) => `- [${c.h2}](${S}/services#${c.id}): ${c.outcome}`),
  `- [7-day website (USD)](${S}/lp/7-day-website) · [Philippine pricing](${S}/lp/7-day-website/ph)`,
  `- [Web design in Iligan City](${S}/web-design-iligan-city): local studio in Iligan City 9200, Lanao del Norte; meets clients in person in Iligan and Cagayan de Oro; works in English, Bisaya and Tagalog.`,
  `- [Free 15-minute website check](${S}/audit): Google Meet call, 3 fixes for more calls and enquiries; no site needed.`,
  '',
  '## Case studies',
  ...caseIndex.map((c) => `- [${c.title}](${S}/work/${c.slug}): ${c.sector}, ${c.country}, ${c.year}. ${c.built}. ${c.resultHeadline}`),
  '',
  '## Fazed Lab',
  `- [Fazed Lab](${S}/lab): concept sites with fictional brands, clearly labelled; not client work.`,
  ...labShipped.map((i) => `  - ${i.brand} (concept site, fictional brand): ${i.url} · ${i.chips.join(', ')} · ${i.date}`),
  '',
  '## Guides',
  ...posts.map((p) => `- [${p.title}](${S}/blog/${p.slug}) (${p.category}, ${p.date})`),
  '',
];
writeFileSync(join(ROOT, 'public/llms.txt'), lines.join('\n'));
console.log('[llms] public/llms.txt', lines.length, 'lines');
