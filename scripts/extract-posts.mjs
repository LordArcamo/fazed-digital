/**
 * extract-posts.mjs — the blog data contract test.
 * The nightly routine appends posts to the two `const posts = [` arrays in
 * src/pages/blog/index.astro and src/pages/blog/[slug].astro. This script parses both
 * arrays (text between `const posts = [` and its matching `];`, evaluated in a vm
 * sandbox), checks every entry has every field, and writes src/data/.generated/posts.json
 * for OG images, llms.txt, category hubs and related posts. Any missing field FAILS the build.
 * Usage: node scripts/extract-posts.mjs [indexFile] [slugFile]
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [idxFile = join(ROOT, 'src/pages/blog/index.astro'), slugFile = join(ROOT, 'src/pages/blog/[slug].astro')] = process.argv.slice(2);

function extract(file) {
  const src = readFileSync(file, 'utf8');
  const start = src.indexOf('const posts = [');
  if (start < 0) throw new Error(`${file}: "const posts = [" not found`);
  // walk to the matching bracket, skipping strings / template literals / comments
  let i = src.indexOf('[', start), depth = 0, q = null, esc = false;
  for (; i < src.length; i++) {
    const ch = src[i], nx = src[i + 1];
    if (q) {
      if (esc) { esc = false; continue; }
      if (ch === '\\') { esc = true; continue; }
      if (q === '//' && ch === '\n') q = null;
      else if (q === '/*' && ch === '*' && nx === '/') { q = null; i++; }
      else if (ch === q) q = null;
      continue;
    }
    if (ch === '/' && nx === '/') { q = '//'; i++; continue; }
    if (ch === '/' && nx === '*') { q = '/*'; i++; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { q = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) break; }
  }
  const literal = src.slice(src.indexOf('[', start), i + 1);
  return vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 2000 });
}

const fail = (m) => { console.error(`\n[extract-posts] BLOG CONTRACT BROKEN: ${m}\n`); process.exit(1); };
const need = {
  index: ['slug', 'title', 'excerpt', 'category', 'date', 'readTime', 'author', 'image', 'featured'],
  post: ['slug', 'title', 'category', 'date', 'readTime', 'author', 'authorRole', 'authorPhoto', 'image', 'excerpt', 'content'],
};
let index, posts;
try { index = extract(idxFile); posts = extract(slugFile); } catch (e) { fail(e.message); }
for (const [name, arr, fields] of [['index.astro', index, need.index], ['[slug].astro', posts, need.post]]) {
  if (!Array.isArray(arr) || !arr.length) fail(`${name}: posts is not a non-empty array`);
  arr.forEach((p, k) => {
    for (const f of fields) if (p[f] === undefined || p[f] === null || (f !== 'featured' && f !== 'authorPhoto' && String(p[f]).trim() === '')) fail(`${name} entry ${k} (${p.slug ?? '?'}) is missing "${f}"`);
    if (isNaN(new Date(p.date))) fail(`${name} entry ${k} (${p.slug}) has an unparseable date "${p.date}"`);
  });
}
const bySlug = new Map(posts.map((p) => [p.slug, p]));
for (const p of index) if (!bySlug.has(p.slug)) fail(`index.astro lists "${p.slug}" but [slug].astro has no such post`);
const out = index.map((p) => {
  const full = bySlug.get(p.slug);
  return { slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category, date: p.date, iso: new Date(p.date).toISOString(), readTime: p.readTime, author: p.author, authorRole: full.authorRole, h2: [...full.content.matchAll(/<h2[^>]*>(.*?)<\/h2>/g)].map((m) => m[1].replace(/<[^>]+>/g, '')) };
}).sort((a, b) => +new Date(b.date) - +new Date(a.date));
const long = out.filter((p) => p.excerpt.length > 155).length;
mkdirSync(join(ROOT, 'src/data/.generated'), { recursive: true });
writeFileSync(join(ROOT, 'src/data/.generated/posts.json'), JSON.stringify(out, null, 1));
console.log(`[extract-posts] ${out.length} posts OK (${long} excerpts > 155 chars: tell the routine "excerpt ≤ 155")`);
