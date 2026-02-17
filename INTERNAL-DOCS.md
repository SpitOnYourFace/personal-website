# Krasimir Kralev Portfolio — Internal Documentation

**Version:** 2.0.0
**Last updated:** February 2026
**URL:** https://krasimirkralev.com
**Repository:** https://github.com/SpitOnYourFace

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Astro 5.17.1 (SSR, Node.js standalone adapter) |
| Styling | Tailwind CSS 3.4 + CSS custom properties |
| Language | TypeScript |
| Fonts | Inter (UI), JetBrains Mono (code/hero text) |
| Runtime | Node.js (`node dist/server/entry.mjs`) |
| External APIs | CoinMarketCap (crypto prices), Iconify (skill icons) |

---

## Project Structure

```
src/
├── components/
│   ├── Hero.astro          # Landing section — starfield, particles, spotlight, typing effect
│   ├── Navbar.astro         # Sticky nav with theme toggle, language switcher, mobile menu
│   ├── About.astro          # Bio section with profile image
│   ├── Skills.astro         # Tech skills grid with Iconify icons
│   ├── Projects.astro       # Project showcase cards with flower animation
│   ├── CryptoTracker.astro  # Live BTC/ETH/ICP prices from CoinMarketCap
│   ├── Contact.astro        # Contact form with honeypot spam protection
│   ├── Footer.astro         # Footer with back-to-top button
│   └── ParallaxBackground.astro  # Sky/clouds/sun layer between hero and about
├── layouts/
│   └── BaseLayout.astro     # HTML shell — meta tags, OG, fonts, theme detection
├── pages/
│   ├── index.astro          # Main page — assembles all components, scroll handlers
│   ├── 404.astro            # Custom 404 page
│   └── api/
│       ├── contact.ts       # POST — form submission (logs only, no email service yet)
│       └── crypto.ts        # GET — CoinMarketCap proxy, 60s cache
├── styles/
│   └── global.css           # GPU hints, content-visibility, scroll progress bar
└── middleware.ts             # Rate limiting (30 req/60s), security headers, CSP
```

---

## Key Features

### Bilingual Support (EN/BG)
- CSS-based toggling via `data-lang` attribute on `<html>`
- Auto-detects browser language on first visit, saves to `localStorage`
- All visible text has both `data-lang="en"` and `data-lang="bg"` variants
- CSS rules: `html[data-lang="en"] [data-lang="bg"] { display: none !important; }`

### Dark/Light Theme
- CSS custom properties for all colors (`--color-surface`, `--color-primary`, `--color-accent`)
- `localStorage` persistence, system preference detection (`prefers-color-scheme`)
- Inline script in `<head>` prevents flash of wrong theme

### Hero Section (most complex component)
- **Starfield:** 36 CSS stars (20 small, 10 medium, 6 large) with staggered twinkle animations and glow
- **Particle system:** Canvas-based, 50 particles on desktop / 20 on mobile, pauses when off-screen via IntersectionObserver
- **Spotlight overlay:** Radial gradient following cursor, reveals hidden autobiography text. Default position off-screen (`-200%`)
- **Hidden text:** 6 autobiography blocks in JetBrains Mono, positioned in left/right columns with center-top university block. Fully invisible until cursor hover
- **Typing effect:** Types name character by character, then cycles through role titles (Web Developer, QA Specialist, Guitarist, Web3 Enthusiast)
- **Mobile:** Touch-and-hold to reveal text, only blocks 1 and 5 shown (centered)

### Section Transition
- 450px gradient overlay between hero and about section
- 13 color stops from transparent → sky colors → warm tones
- Negative margin (-180px) creates overlap for seamless blending

---

## Performance Optimizations Applied

| Optimization | Where | Impact |
|-------------|-------|--------|
| Font preloading + async swap | BaseLayout.astro | Eliminates render-blocking fonts |
| Iconify script `defer` | Skills.astro | Non-blocking icon loading |
| `will-change: transform` + `backface-visibility: hidden` | global.css, Projects.astro | GPU-accelerated animations |
| `content-visibility: auto` | global.css | Skips rendering offscreen sections |
| rAF-throttled scroll handlers | index.astro, Navbar.astro, Footer.astro | Prevents scroll jank (4 handlers) |
| `transform: scaleX()` for scroll progress | global.css + index.astro | Compositor-only (no layout/paint) |
| Squared distance checks | Hero.astro (particles) | Avoids `Math.sqrt` until needed |
| IntersectionObserver for particles | Hero.astro | Pauses animation when hero off-screen |
| `contain: layout style` on sky layer | index.astro | Limits paint scope |
| Reduced motion support | global.css | Respects `prefers-reduced-motion` |

---

## Security

### Middleware (`src/middleware.ts`)
- **Rate limiting:** 30 requests per 60 seconds per IP on `/api/*` routes
- **Map cleanup:** Evicts expired entries when map exceeds 1,000 keys
- **Headers applied to ALL responses:**
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Content-Security-Policy` — restricts scripts, styles, fonts, images, connections, frames

### Contact Form
- Honeypot field (`_honey`) — bots fill it, real users don't see it
- Server-side validation: name (min 2 chars), email (regex), message (min 10 chars)
- Currently **logs only** — no email delivery configured

### Crypto API
- API key stored in environment variable (`CMC_API_KEY`)
- Key validated before use
- 60-second cache header on responses

---

## Areas to Improve

### Resolved (February 2026)
- ~~Contact form email delivery~~ — **Resend integration** added (`src/pages/api/contact.ts`)
- ~~CoinMarketCap server-side caching~~ — **60s in-memory cache** in `crypto.ts`
- ~~Error monitoring~~ — **Sentry** integration via `@sentry/astro` (conditional on `SENTRY_DSN`)
- ~~Environment variable validation~~ — **`src/env.ts`** with `requireEnv()` / `optionalEnv()`
- ~~Accessibility gaps~~ — Canvas `role="img"`, keyboard-accessible `<details>` for hidden text
- ~~OG image format~~ — Converted to **1200x630 PNG** (`/images/og-image.png`)
- ~~CSP hardening~~ — **Nonce-based `script-src`** in middleware (nonce via `context.locals`)
- ~~Testing~~ — **Vitest** with 29 unit tests (validation, rate limiter, cache, i18n)
- ~~CI/CD pipeline~~ — **GitHub Actions** workflow (type-check, test, build, Lighthouse CI)
- ~~Typed i18n~~ — **Centralized JSON** files (`src/i18n/en.json`, `bg.json`) with `t()` helper

### Remaining
1. **Migrate components to i18n helper** — Components still use inline `data-lang` spans; gradually adopt `t()` from `src/i18n/index.ts`
2. **Rate limiter persistence** — In-memory `Map` doesn't survive restarts. Consider Redis for production
3. **CSP `unsafe-inline` for styles** — Tailwind inline styles require it; nonce-based styles not feasible
4. **Resend custom domain** — Currently uses `onboarding@resend.dev`; configure your domain for branded emails
5. **E2E tests** — Consider Playwright for full browser testing

---

## How It Was Built

### Architecture Decisions
- **Astro SSR** chosen for server-side API routes (contact form, crypto proxy) while keeping most pages static
- **No JS framework** (React/Vue/Svelte) — pure Astro components with vanilla TypeScript for interactivity
- **Tailwind CSS** for utility-first styling with CSS custom properties for theming
- **Single-page design** — all sections on `index.astro`, smooth-scroll navigation

### Design Philosophy
- Dark space theme transitioning to warm sky/earth tones as user scrolls
- Gold accent color (`#c8973e`) throughout — buttons, particles, stars, text highlights
- Hidden autobiography creates discovery moment — rewards exploration
- Bilingual from the ground up, not bolted on

### Component Interactions
```
BaseLayout.astro (HTML shell, theme/lang detection)
  └── index.astro (page assembly, scroll handlers, section transitions)
        ├── Navbar.astro (theme toggle, lang switch, mobile menu)
        ├── Hero.astro (stars, particles, spotlight, typing, hidden text)
        ├── ParallaxBackground.astro (sky/clouds/sun transition layer)
        ├── About.astro
        ├── Skills.astro (Iconify integration)
        ├── Projects.astro (flower animation)
        ├── CryptoTracker.astro → /api/crypto.ts → CoinMarketCap
        ├── Contact.astro → /api/contact.ts
        └── Footer.astro (back-to-top)
```

### Theme System
```css
:root {                          /* Light */
  --color-surface: 250 248 245;
  --color-primary: 44 36 22;
  --color-accent: 200 151 62;
}
.dark {                          /* Dark */
  --color-surface: 15 15 35;
  --color-primary: 237 233 225;
  --color-accent: 200 151 62;    /* same gold */
}
```

---

## Dev Commands

```bash
npm run dev              # Start dev server (add --host 127.0.0.1 for IPv4)
npm run build            # Production build
npm run preview          # Preview production build
npm run start            # Run production server (node dist/server/entry.mjs)
npm test                 # Run unit tests (vitest)
npm run test:watch       # Run tests in watch mode
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CMC_API_KEY` | Yes | CoinMarketCap API key for crypto prices |
| `RESEND_API_KEY` | No | Resend API key for contact form emails (falls back to console.log) |
| `SENTRY_DSN` | No | Sentry DSN for error monitoring (disabled if empty) |

---

*This document is for internal use only. Last reviewed: February 2026.*
