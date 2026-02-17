import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import vercel from '@astrojs/vercel';
import sentry from '@sentry/astro';

export default defineConfig({
  adapter: vercel(),
  integrations: [
    tailwind(),
    ...(process.env.SENTRY_DSN
      ? [sentry({ dsn: process.env.SENTRY_DSN })]
      : []),
  ],
});
