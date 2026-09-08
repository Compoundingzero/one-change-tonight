import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

const isProduction = process.env.PUBLIC_DEPLOY_CONTEXT === 'production';
const site = isProduction ? process.env.PUBLIC_SITE_URL : undefined;

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [preact()],
  vite: {
    build: {
      cssCodeSplit: true,
      sourcemap: false,
    },
  },
});
