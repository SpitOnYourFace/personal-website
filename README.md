# Krasimir Kralev — Personal Portfolio

A personal portfolio website built with Astro, Tailwind CSS, and TypeScript. Features a layered parallax design with themed sections (space, sky, forest, pond), bilingual support (English/Bulgarian), dark/light mode, and live cryptocurrency tracking.

**Live:** [krasimirkralev.com](https://krasimirkralev.com)

## Tech Stack

- **Framework:** [Astro 5](https://astro.build/) with ViewTransitions
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/) + custom CSS properties
- **Deployment:** [Vercel](https://vercel.com/) (SSR via `@astrojs/vercel`)
- **Monitoring:** [Sentry](https://sentry.io/) (optional, via `SENTRY_DSN` env var)
- **Testing:** [Vitest](https://vitest.dev/)

## Features

- **Parallax layers** — Space, sky, forest, and pond sections with decorative SVG elements (stars, clouds, trees, lily pads, frogs)
- **Dark/light mode** — Auto-detects based on Bulgaria timezone (19:00-07:00 = dark), with manual toggle and animated celestial arc transition
- **Bilingual** — English/Bulgarian with auto-detection from browser language
- **Live crypto tracker** — BTC, ETH, ICP prices via server-side API proxy (`/api/crypto`)
- **Responsive** — Mobile-first design with separate mobile SVG variants
- **Accessible** — Skip navigation, ARIA labels, `prefers-reduced-motion` support, semantic HTML
- **Performance** — `content-visibility: auto`, lazy loading, WebP images, font preloading

## Project Structure

```
src/
  components/
    About.astro         # About section with selfie + bio
    Contact.astro       # Command Center contact layout
    CryptoTracker.astro # Live crypto price cards
    Footer.astro        # Site footer
    Hero.astro          # Hero with particle canvas, starfield, spotlight
    Navbar.astro        # Floating pill navbar with theme toggle
    ParallaxBackground.astro
    Projects.astro      # Project showcase cards
    Skills.astro        # Skills grid
  layouts/
    BaseLayout.astro    # HTML head, meta tags, JSON-LD, theme/lang scripts
  pages/
    index.astro         # Main page (all sections + parallax layers)
    404.astro           # Custom 404 page
    api/crypto.ts       # CoinMarketCap proxy endpoint
  styles/
    global.css          # CSS custom properties, theme colors, utilities
public/
  images/               # Optimized WebP images, logos, favicon
```

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Required for crypto tracker
CMC_API_KEY=your_coinmarketcap_api_key

# Optional — enables Sentry error tracking
SENTRY_DSN=your_sentry_dsn
```

## Deployment

The site deploys to Vercel automatically on push to `master`. Security headers are configured in `vercel.json`.

## License

All rights reserved.
