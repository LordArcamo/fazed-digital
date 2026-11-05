// lint-chat.mjs — fails the build if the site chat's knowledge breaks a market or proof rule, or if a key reaches the browser.
//  · US block: no pesos. PH block: no USD package prices. Shared block: no money at all.
//  · Never in the prompt: Halde (#04), the private preview, Canadian clients, a printed [TBC.
//  · Static output: no API key, and with the key unset, no chat at all.
import { registerHooks } from 'node:module';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// the data files import each other without extensions (Vite resolves those; plain Node does not)
registerHooks({
  resolve(spec, ctx, next) {
    try { return next(spec, ctx); } catch (e) {
      if (spec.startsWith('.')) return next(`${spec}.ts`, ctx);
      throw e;
    }
  },
});

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { RULES, sharedKnowledge, marketKnowledge } = await import(join(ROOT, 'src/lib/chat/knowledge.ts'));
const { prices } = await import(join(ROOT, 'src/data/proof.ts'));

const errors = [];
const shared = sharedKnowledge(), ph = marketKnowledge('ph'), intl = marketKnowledge('intl');
const usdPackages = Object.values(prices.usd).map((p) => p.replace('/month', ''));
const has = (text, s) => new RegExp(`${s.replace(/[$,.]/g, '\\$&')}(?!,?\\d)`).test(text);

if (/[₱$]/.test(shared)) errors.push(`shared knowledge contains money: ${shared.match(/.{0,50}[₱$].{0,30}/)[0]}`);
if (/₱|pesos/i.test(intl)) errors.push('the international block mentions pesos');
for (const p of usdPackages) if (has(ph, p)) errors.push(`the PH block contains the USD package price ${p}`);
if (!ph.includes(prices.customRange) || !intl.includes(prices.customRange)) errors.push('the custom range is missing from a market block');
if (!ph.includes('+63 906 825 3451') || ph.includes('+1 302')) errors.push('the PH block has the wrong phone number');
if (!intl.includes('+1 302-405-2423') || intl.includes('+63')) errors.push('the international block has the wrong phone number');
for (const [name, text] of [['shared', shared], ['ph', ph], ['intl', intl], ['rules', RULES]]) {
  if (/halde|greenleaf/i.test(text)) errors.push(`${name}: private project mentioned`);
  if (/\[TBC/.test(text)) errors.push(`${name}: printed [TBC]`);
  if (/award-winning|Google Partner|5-star/i.test(text)) errors.push(`${name}: a never-claim item`);
}
if (/Canad/i.test(shared)) errors.push('shared knowledge mentions Canada as data: only the rules may, and only to say we have no Canadian clients');
if (!intl.includes('20% off') || !ph.includes('20% off')) errors.push('the guarantee is missing');

const dist = process.argv[2] || '.vercel/output/static';
if (existsSync(dist)) {
  const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
  const keyed = !!process.env.ANTHROPIC_API_KEY || (existsSync('.env') && /^ANTHROPIC_API_KEY=./m.test(readFileSync('.env', 'utf8')));
  for (const f of walk(dist).filter((x) => /\.(html|js|css|txt|json)$/.test(x))) {
    const s = readFileSync(f, 'utf8');
    if (/sk-ant-|ANTHROPIC_API_KEY/.test(s)) errors.push(`${f}: an API key or its name reached the browser`);
    if (!keyed && f.endsWith('.html') && s.includes('id="fz-chat"')) errors.push(`${f}: chat shipped with no key set`);
  }
}

if (errors.length) { console.error('[lint-chat] FAILED\n  ' + errors.join('\n  ')); process.exit(1); }
console.log(`[lint-chat] knowledge clean: ${Math.round((RULES.length + shared.length) / 1000)}k chars shared, ${Math.round(ph.length / 1000)}k PH, ${Math.round(intl.length / 1000)}k international`);
