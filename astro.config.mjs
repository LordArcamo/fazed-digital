import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  // hybrid: all pages are static by default, API routes are serverless
  output: 'hybrid',
  adapter: vercel({ functionPerRoute: false }),

  integrations: [react()],
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
