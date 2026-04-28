/**
 * fix-storybook.mjs
 *
 * Storybook v10 injects <link rel="modulepreload"> tags before any managerHead
 * content, so the <base href="/storybook/"> tag ends up AFTER the preload links.
 * Browsers process preloads during HTML parsing — before seeing the base tag —
 * so they resolve "./sb-manager/..." relative to root and 404.
 *
 * This script moves the <base> tag to the very first thing inside <head>
 * so all relative URLs resolve correctly.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const indexPath = resolve(__dirname, '../public/storybook/index.html');

if (!existsSync(indexPath)) {
  console.warn('⚠️  public/storybook/index.html not found — skipping fix.');
  process.exit(0);
}

let html = readFileSync(indexPath, 'utf-8');

// Remove every existing <base href="/storybook/"> (however many were injected)
html = html.replace(/<base href="\/storybook\/" \/>\n?/g, '');

// Insert a single <base> tag as the very first child of <head>
html = html.replace('<head>', '<head>\n    <base href="/storybook/" />');

writeFileSync(indexPath, html);
console.log('✅ fix-storybook: <base href="/storybook/"> moved to top of <head>');
