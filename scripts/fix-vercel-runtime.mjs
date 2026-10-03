// @astrojs/vercel 7.x only recognises Node 18/20 and falls back to the retired
// nodejs18.x runtime on newer Node versions. Rewrite it to the build's Node major.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const functionsDir = join(process.cwd(), '.vercel/output/functions');
const runtime = `nodejs${process.version.slice(1).split('.')[0]}.x`;

if (!existsSync(functionsDir)) {
  console.warn('⚠️  .vercel/output/functions not found — skipping runtime fix.');
  process.exit(0);
}

for (const dir of readdirSync(functionsDir)) {
  const configPath = join(functionsDir, dir, '.vc-config.json');
  if (!existsSync(configPath)) continue;
  const config = JSON.parse(readFileSync(configPath, 'utf-8'));
  if (typeof config.runtime !== 'string' || !config.runtime.startsWith('nodejs')) continue;
  config.runtime = runtime;
  writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`✅ fix-vercel-runtime: ${dir} → ${runtime}`);
}
