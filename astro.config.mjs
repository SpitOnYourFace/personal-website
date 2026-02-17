import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import node from '@astrojs/node';
import sentry from '@sentry/astro';

export default defineConfig({
  adapter: node({ mode: 'standalone' }),
  integrations: [
    tailwind(),
    ...(process.env.SENTRY_DSN
      ? [sentry({ dsn: process.env.SENTRY_DSN })]
      : []),
  ],
  server: { port: 3000 },
});
