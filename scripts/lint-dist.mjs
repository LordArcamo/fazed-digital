// lint-dist.mjs — post-build checks on the static output. Fails the build on:
//  · apex https://fazeddigital.com URLs (canonical host is www) outside blog post content
//  · a printed "[TBC" marker (copy placeholders must never ship)
//  · "Never claim" items from copy/proof.md §G (awards, ratings, review schema…)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const root = process.argv[2] || '.vercel/output/static';
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(root).filter((f) => /\.(html|xml|txt)$/.test(f));
const errors = [];
const NEVER_SCHEMA = [/AggregateRating/i, /"@type":"Review"/];
// wording checks skip blog posts: their editorial content may discuss reviews or ratings generally
const NEVER_COPY = [/award-winning/i, /Google Partner/i, /★★★/, /\b5-star\b/i];
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  const apex = s.match(/https?:\/\/fazeddigital\.com[^"'\s<)]*/g);
  if (apex) errors.push(`${f}: ${apex.length} apex URL(s), e.g. ${apex[0]}`);
  if (/\[TBC/.test(s)) errors.push(`${f}: contains a printed [TBC] marker`);
  for (const re of [...NEVER_SCHEMA, ...(f.includes('/blog/') ? [] : NEVER_COPY)]) if (re.test(s)) errors.push(`${f}: "never claim" match ${re}`);
}
if (errors.length) { console.error('[lint-dist] FAILED\n  ' + errors.slice(0, 40).join('\n  ')); process.exit(1); }
console.log(`[lint-dist] ${files.length} files clean (www host only, no [TBC], no never-claim items)`);
