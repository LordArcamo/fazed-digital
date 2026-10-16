/**
 * capture-cases.mjs — fresh full-page captures of the live client sites for the case plates
 * (user OK'd on 2026-10-16, answers #8). Headless, no logins. 06 (8Drive) is a private
 * intranet and is skipped. Output: src/assets/work/plates/NN-desktop.jpg + NN-mobile.jpg
 * Usage: node scripts/capture-cases.mjs [01 02 …]   (needs Google Chrome)
 */
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'src/assets/work/plates');
mkdirSync(OUT, { recursive: true });
const { cases } = await import(join(ROOT, 'src/data/cases.ts'));
const only = process.argv.slice(2);
const SKIP = new Set(['06']);
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true, args: ['--hide-scrollbars'] });
for (const c of cases.sort((a, b) => a.slug.localeCompare(b.slug))) {
  if (SKIP.has(c.slug) || (only.length && !only.includes(c.slug))) continue;
  for (const [kind, vp, maxH] of [['desktop', { width: 1440, height: 900, deviceScaleFactor: 1 }, 5200], ['mobile', { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, 3600]]) {
    const p = await b.newPage();
    try {
      await p.setViewport(vp);
      if (kind === 'desktop') await p.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36');
      if (kind === 'mobile') await p.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1');
      await p.goto(c.liveUrl, { waitUntil: 'networkidle2', timeout: 45000 });
      if (process.env.SETTLE) await new Promise((r) => setTimeout(r, +process.env.SETTLE));
      // dismiss newsletter/cookie modals (Esc + common close buttons) so the plate shows the site
      await p.keyboard.press('Escape').catch(() => {});
      await p.evaluate(() => document.querySelectorAll('.modal .close, .close-modal, [aria-label*="close" i], .newsletter-popup .close, .popup-close, .fancybox-close, button.close, .mfp-close').forEach((b) => b instanceof HTMLElement && b.offsetParent && b.click()));
      await new Promise((r) => setTimeout(r, 600));
      // trigger lazy content, then return to the top
      await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } scrollTo(0, 0); });
      await new Promise((r) => setTimeout(r, +(process.env.SETTLE || 1500)));
      const png = await p.screenshot({ fullPage: true, captureBeyondViewport: true });
      const img = sharp(png);
      const m = await img.metadata();
      const h = Math.min(m.height, Math.round(maxH * (vp.deviceScaleFactor || 1)));
      await sharp(png).extract({ left: 0, top: 0, width: m.width, height: h }).resize({ width: kind === 'desktop' ? 1440 : 780 }).jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, `${c.slug}-${kind}.jpg`));
      console.log('[capture]', c.slug, kind, `${m.width}×${h}`);
    } catch (e) { console.warn('[capture] FAILED', c.slug, kind, e.message.slice(0, 120)); }
    await p.close();
  }
}
await b.close();
