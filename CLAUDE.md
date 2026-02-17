# Krasimir Kralev - Personal Portfolio Website

Astro + Tailwind personal portfolio with bilingual support (EN/BG), interactive hero effects, and live ICP crypto tracking.

## Quick Start

```bash
npm install
npm run dev        # Start dev server on http://localhost:3000
npm run build      # Build for production
npm run preview    # Preview production build
npm run start      # Run production server
npm test           # Run Vitest tests
npm run test:watch # Watch mode for tests
```

## Environment Variables

Required:
- `CMC_API_KEY` - CoinMarketCap API key for crypto data

Optional:
- `SENTRY_DSN` - Sentry error tracking (auto-enabled if present)

## Architecture

```
src/
├── pages/
│   ├── index.astro           # Main page (assembles all components)
│   └── api/crypto.ts         # Server-side CoinMarketCap proxy
├── components/
│   ├── Navbar.astro          # Fixed nav with language toggle
│   ├── Hero.astro            # Spotlight + particles + typing effect
│   ├── About.astro           # Bio section
│   ├── Projects.astro        # Portfolio projects
│   ├── CryptoTracker.astro   # Live ICP price widget
│   ├── Contact.astro         # Contact info + social links
│   ├── Footer.astro          # Copyright footer
│   └── Skills.astro          # Tech stack section
├── layouts/
│   └── BaseLayout.astro      # Root HTML shell + lang detection
├── i18n/                     # Internationalization configs
├── styles/
│   └── global.css            # Tailwind imports + base styles
├── middleware.ts             # Request handling logic
└── env.ts                    # Environment variable validation

public/
├── images/                   # Static assets (selfie.jpg, icp-logo.png)
├── favicon.svg
├── robots.txt
└── sitemap.xml
```

## Key Files

- `astro.config.mjs` - Node adapter (SSR for API), Tailwind, Sentry
- `tailwind.config.mjs` - Custom theme (colors, fonts, animations)
- `src/middleware.ts` - Request handling logic
- `src/env.ts` - Environment variable validation
- `DOCUMENTATION.md` - Comprehensive technical documentation (595 lines)

## Bilingual System (EN/BG)

**Flash-free language switching** using CSS + early script execution:

1. `BaseLayout.astro` runs inline `<script>` in `<head>` **before body renders**
2. Reads `localStorage('lang')` and sets `data-lang` on `<html>`
3. CSS rules hide opposite language:
   ```css
   html[data-lang="bg"] [data-lang="en"] { display: none !important; }
   html[data-lang="en"] [data-lang="bg"] { display: none !important; }
   ```
4. All translatable elements use dual spans:
   ```html
   <span data-lang="en">English Text</span>
   <span data-lang="bg">Български текст</span>
   ```
5. Language toggle updates DOM + localStorage instantly

**Why this pattern:** Prevents flash of wrong language on page load. The script runs before render, so users never see the wrong language.

## Hero Section Architecture

Three interactive layers (z-index stack):

1. **Code layer** (`z-0`) - 6 positioned `<pre>` blocks with autobiography text
2. **Spotlight overlay** (`z-1`) - CSS `radial-gradient` follows cursor/touch to reveal code
3. **Particle canvas** (`z-2`) - 50 animated particles with connection lines
4. **Content** (`z-10`) - Typing effect + subtitle + CTA

**Desktop interaction:**
- `mousemove` updates CSS custom properties `--mx` and `--my`
- Radial gradient spotlight reveals code beneath
- Hint beacon in top-left guides new visitors (fades when cursor enters)

**Mobile interaction:**
- `touchstart`/`touchmove` update spotlight position
- `touchend` moves spotlight off-screen (110%, 110%)

**Performance gotcha:** Particle system uses `requestAnimationFrame` loop that runs indefinitely, even when hero is off-screen. Future improvement: add `IntersectionObserver` to pause when not visible.

## Navbar Theme Switching

Navbar dynamically changes from **dark** (over hero) → **light** (past hero):

- Scroll listener checks if hero bottom edge is above 60px from viewport top
- Swaps multiple class sets:
  - Background: `bg-[#0a0a18]/80` ↔ `bg-white/80`
  - Text: `text-[#c8973e]` ↔ `text-primary`
  - Border: `border-[#c8973e]/20` ↔ `border-primary/10`
- Updates brand, links, mobile menu, and language buttons in one cycle
- Exposed via `window.__updateLangToggle()` (consider refactoring to `CustomEvent`)

## API Routes

### `/api/crypto`

Server-side proxy for CoinMarketCap API (keeps API key secret):

**Flow:**
1. Client fetches `/api/crypto`
2. Server reads `CMC_API_KEY` from environment
3. Authenticated request to CoinMarketCap for ICP/USD quote
4. Returns: name, symbol, price, 24h change, 7d change, market cap, volume
5. Returns 500 with error message on failure

**Error handling:**
- Missing API key → 500 "API key not configured"
- API request failure → 500 "Failed to fetch crypto data"
- Client-side catch → "Could not connect to server"

**Security note:** No rate limiting currently implemented. Add before production deployment.

## Scroll Reveal System

Uses `IntersectionObserver` for efficient scroll-triggered animations:

1. Finds all `[data-reveal]` elements on page load
2. Adds initial hidden state: `opacity-0 translate-y-5`
3. Observer watches at 15% threshold
4. On intersection: removes hidden classes, adds `opacity-100 translate-y-0 transition-all duration-500`
5. Elements unobserved after reveal (one-time animation)

**Why IntersectionObserver:** More performant than scroll event listeners. Passive observation with no layout thrashing.

## Design System

**Color palette** (warm, earthy, elegant):

| Token | Value | Usage |
|-------|-------|-------|
| `surface` | `#faf8f5` | Main background |
| `surface-subtle` | `#f3efe9` | Alternating section backgrounds |
| `primary` | `#2c2416` | Main text (dark brown) |
| `primary-secondary` | `#7a6f60` | Secondary text |
| `primary-tertiary` | `#b0a898` | Muted text |
| `accent` | `#c8973e` | Gold accent (links, buttons, highlights) |
| `accent-light` | `#fdf6ea` | Light accent background |

**Hero dark theme:** `#0c0c1d` background + `#c8973e` gold accents

**Typography:**
- **Inter** - Clean sans-serif for body text (weights: 300–700)
- **JetBrains Mono** - Monospace for code blocks, prices, technical elements

**Responsive breakpoints:**
- `sm`: 640px - Project grid 1→2 columns
- `md`: 768px - Desktop nav replaces hamburger, spotlight hint changes
- `lg`: 1024px - Wider layouts

**Animation patterns:**
- Standard transition: `transition-all duration-500`
- Hover effects: scale, shadow, color transitions
- Scroll reveals: opacity + translateY
- Custom animations in `tailwind.config.mjs`: `blink`, `float`, `fade-in`

## Code Style

**Tailwind patterns:**
- Prefer theme tokens from `tailwind.config.mjs` over hardcoded colors
- Mobile-first responsive design
- Use `group` for parent-child hover interactions
- Compose utilities for readability

**Astro patterns:**
- Frontmatter for component data/logic
- Client-side JS in `<script>` tags (auto-bundled)
- Use `client:` directives sparingly (currently none used)
- Components are `.astro` files, layouts in `src/layouts/`

**TypeScript:**
- Strict mode enabled
- Type all function parameters and returns
- Use interfaces for complex objects

## Testing

Uses Vitest for unit/integration tests:

```bash
npm test           # Run all tests once
npm run test:watch # Watch mode for development
```

Current test coverage: Basic setup, expand as needed.

## Deployment

Configured for **Node.js SSR** via `@astrojs/node` adapter:

1. Build: `npm run build` → outputs to `dist/`
2. Start: `npm run start` → runs `dist/server/entry.mjs`
3. Suitable for: Vercel, Netlify, Railway, or any Node.js host

**Environment:** Ensure `CMC_API_KEY` is set in production environment.

## Known Issues / TODOs

From DOCUMENTATION.md audit (see full details there):

**High priority:**
- Add rate limiting to `/api/crypto` endpoint
- Add skip navigation link for accessibility
- Add `aria-expanded` to mobile menu toggle
- Add `aria-pressed` to language toggle buttons
- Verify color contrast meets WCAG AA standards

**Medium priority:**
- Stop particle animation when hero is off-screen (performance)
- Replace `axios` with native `fetch` in API route (reduce bundle size)
- Extract hardcoded hex colors to Tailwind theme tokens
- Create reusable SVG icon components (GitHub icon duplicated)
- Replace `window.__updateLangToggle` with `CustomEvent`

**Low priority:**
- Add more projects to portfolio section
- Add resume/CV download option
- Consider blog section via Astro Content Collections
- Dynamic copyright year in Footer

## Non-Obvious Patterns

**Why server-side API proxy?**
CoinMarketCap API requires an API key. Client-side requests would expose the key in browser. Server-side route keeps it secret.

**Why inline script in `<head>`?**
Language detection must run before body renders to prevent flash. Astro's `<script>` tags are bundled and may load late, so we use inline script for immediate execution.

**Why passive scroll listeners?**
`{ passive: true }` on scroll/touch events prevents blocking the main thread, improving scroll performance.

**Why 6 separate code blocks in hero?**
Positioned independently for artistic layout. Each block reveals different autobiography text under the spotlight.

## Project Context

- **Owner:** Krasimir Kralev
- **Role:** QA Specialist @ ResultsCX, Computer Science student
- **Interests:** Web development, Web3/ICP, music (guitarist in Slathe band)
- **Design philosophy:** Warm earthy palette, dark hero → light body transition
- **Target audience:** Potential employers, collaborators, clients

## Additional Documentation

See `DOCUMENTATION.md` for comprehensive technical analysis (595 lines):
- Complete component breakdown
- JavaScript functionality deep-dive
- Design system details
- Best practices audit
- Creative suggestions and roadmap
