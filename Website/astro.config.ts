import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './src/config';

// `site` comes from one place, src/config.ts, so a custom domain is a one-line change.
export default defineConfig({
  site: SITE_URL,
  output: 'static',
  build: { format: 'directory' },
  compressHTML: true,
  integrations: [
    sitemap({
      // Print pages are noindex, so keep them out of the sitemap too.
      filter: (page) => !/\/print(-answers)?\/?$/.test(page),
    }),
  ],
});
