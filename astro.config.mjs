import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  // hybrid: all pages are static by default, API routes are serverless
  output: 'hybrid',
  adapter: vercel({ functionPerRoute: false }),

  integrations: [
    react(),
    sitemap({
      // Keep paid/landing pages and storybook out of the organic index
      filter: (page) => !page.includes('/lp/') && !page.includes('/storybook/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
  site: 'https://fazeddigital.com',
  compressHTML: true,

  prefetch: {
    defaultStrategy: 'hover',
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/gsap')) return 'gsap';
            if (id.includes('node_modules/react-dom')) return 'react-dom';
            if (id.includes('node_modules/react/')) return 'react';
          },
        },
      },
    },
  },
});
