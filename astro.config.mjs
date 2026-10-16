import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import { threeSlim } from './src/field/three-plugin.mjs';

const SITE = 'https://www.fazeddigital.com';

export default defineConfig({
  site: SITE,
  adapter: vercel(),
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/storybook/') && !page.includes('/_styleguide') && !page.includes('/_formations') && !page.includes('/404'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        // canonical = no trailing slash except "/"
        const u = new URL(item.url);
        if (u.pathname !== '/' && u.pathname.endsWith('/')) u.pathname = u.pathname.slice(0, -1);
        item.url = u.toString();
        return item;
      },
    }),
  ],
  compressHTML: true,
  build: { inlineStylesheets: 'always' },
  devToolbar: { enabled: false },
  prefetch: { defaultStrategy: 'hover' },
  vite: {
    plugins: [threeSlim()],
    build: { target: 'es2022', chunkSizeWarningLimit: 800, sourcemap: !!process.env.MAP },
    server: { port: 4351, strictPort: true },
    // three is resolved to src-level modules by threeSlim; pre-bundling would duplicate the TSL core
    optimizeDeps: { exclude: ['three'] },
  },
});
