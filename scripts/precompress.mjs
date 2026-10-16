// Local-preview only: write .br/.gz siblings so `sirv --brotli --gzip` mirrors Vercel's
// compressed delivery for Lighthouse. Not part of the Vercel build.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { brotliCompressSync, gzipSync, constants } from 'node:zlib';
const root = process.argv[2] || '.vercel/output/static';
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
let n = 0;
for (const f of walk(root)) {
  if (!/\.(html|js|css|svg|xml|txt|json|bin|webmanifest)$/.test(f)) continue;
  const b = readFileSync(f);
  writeFileSync(f + '.br', brotliCompressSync(b, { params: { [constants.BROTLI_PARAM_QUALITY]: 11 } }));
  writeFileSync(f + '.gz', gzipSync(b, { level: 9 }));
  n++;
}
console.log('[precompress]', n, 'files');
