# Krasimir Kralev - Personal Portfolio Website
## Complete Project Documentation & Analysis

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture & File Structure](#3-architecture--file-structure)
4. [Component Breakdown](#4-component-breakdown)
5. [Styling System](#5-styling-system)
6. [JavaScript Functionality](#6-javascript-functionality)
7. [API Integration](#7-api-integration)
8. [Bilingual System](#8-bilingual-system)
9. [How It All Works Together](#9-how-it-all-works-together)
10. [Areas to Improve](#10-areas-to-improve)
11. [Best Practices Audit](#11-best-practices-audit)
12. [Creative Suggestions for a Fresh, Robust Website](#12-creative-suggestions-for-a-fresh-robust-website)
13. [Implementation Priority Roadmap](#13-implementation-priority-roadmap)

---

## 1. Project Overview

This is a **single-page portfolio website** for Krasimir Kralev, a QA Specialist and Computer Science student. The site showcases his professional background, projects, interest in Web3/ICP, and contact information. It features bilingual support (English/Bulgarian), interactive visual effects, and a live cryptocurrency tracker.

### Key Characteristics
- **Single-page layout** with smooth scrolling between sections
- **Dark hero** transitioning to a **light body** theme
- **Interactive spotlight** effect revealing autobiography text
- **Particle system** animated background
- **Live ICP cryptocurrency** price tracking via CoinMarketCap API
- **Full bilingual support** (EN/BG) persisted in localStorage
- **Responsive design** for mobile and desktop

---

## 2. Technology Stack

| Technology | Version | Role |
|---|---|---|
| **Astro** | 5.3.0 | Framework & static site generation |
| **Node.js Adapter** | 9.1.3 | Server-side rendering (for API route) |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS framework |
| **TypeScript** | strict mode | Type safety |
| **Axios** | 1.13.5 | HTTP client for CoinMarketCap API |
| **Google Fonts** | - | Inter (body) + JetBrains Mono (code/mono) |

### Why Astro?
Astro is a great choice for this project because:
- **Zero client-side JS by default** - Ships HTML/CSS with JS only where explicitly needed
- **Component architecture** without requiring React/Vue/Svelte overhead
- **Built-in SSR** support for the crypto API endpoint
- **Fast builds** and excellent developer experience

---

## 3. Architecture & File Structure

```
Personal Website/
├── src/
│   ├── pages/
│   │   ├── index.astro              # Main (only) page - assembles all components
│   │   └── api/
│   │       └── crypto.ts            # Server-side API proxy for CoinMarketCap
│   ├── components/
│   │   ├── Navbar.astro             # Fixed navigation with language toggle
│   │   ├── Hero.astro               # Full-screen hero with spotlight + particles
│   │   ├── About.astro              # Bio section with profile photo
│   │   ├── Projects.astro           # Portfolio project cards
│   │   ├── CryptoTracker.astro      # Live ICP price widget
│   │   ├── Contact.astro            # Contact info & social links
│   │   └── Footer.astro             # Simple copyright footer
│   ├── layouts/
│   │   └── BaseLayout.astro         # Root HTML shell (head, fonts, lang detection)
│   └── styles/
│       └── global.css               # Tailwind imports + base styles
├── public/
│   └── images/
│       ├── selfie.jpg               # Profile photo
│       └── icp-logo.png             # ICP cryptocurrency logo
├── astro.config.mjs                 # Astro configuration (Node adapter, Tailwind)
├── tailwind.config.mjs              # Custom theme (colors, fonts, shadows, animations)
├── tsconfig.json                    # TypeScript strict config
├── package.json                     # Dependencies & scripts
├── .env                             # CoinMarketCap API key (CMC_API_KEY)
└── .gitignore                       # Ignores node_modules, dist, .astro, .env
```

### Data Flow

```
Browser Request
  → Astro renders index.astro
    → BaseLayout.astro provides HTML shell + lang detection
      → Components render in order: Navbar → Hero → About → Projects → CryptoTracker → Contact → Footer
        → Client-side JS hydrates interactions (spotlight, particles, typing, scroll reveals)
          → CryptoTracker fetches /api/crypto (server-side)
            → Server proxies to CoinMarketCap API
              → Response displayed in ICP card
```

---

## 4. Component Breakdown

### 4.1 BaseLayout.astro
**Purpose**: Root HTML template wrapping all content.

**What it does**:
- Sets `<html>` with `lang` and `data-lang` attributes
- Loads Google Fonts (Inter, JetBrains Mono) with `preconnect`
- Runs an **inline script before body** to detect stored language from `localStorage` — prevents a flash of wrong language
- Injects global CSS rules that hide `[data-lang="en"]` or `[data-lang="bg"]` elements based on current selection
- Applies base body styling via Tailwind classes

### 4.2 Navbar.astro
**Purpose**: Fixed top navigation bar with dual-theme support.

**Features**:
- Navigation links array defined in frontmatter (about, projects, crypto, contact)
- **Desktop**: horizontal menu + EN/BG language toggle buttons
- **Mobile**: hamburger button toggles a slide-down menu
- **Scroll-aware theme**: Dark/gold over the hero section, transitions to light/brown when scrolling past the hero
- Language toggle updates `data-lang` on `<html>`, persists to `localStorage`, and restyled all nav elements

**How the color swap works**:
1. On scroll, checks if hero's bottom edge is above 60px from viewport top
2. If yes → removes dark classes (`bg-[#0a0a18]/80`), adds light classes (`bg-white/80`)
3. Updates brand, links, mobile menu, and language buttons accordingly
4. Exposes `window.__updateLangToggle()` so the language toggle also respects the current theme

### 4.3 Hero.astro
**Purpose**: Full-screen intro section — the visual centerpiece of the site.

**Three layers**:
1. **Code Layer** (`z-0`): 6 positioned `<pre>` blocks with autobiography text in both languages
2. **Spotlight Overlay** (`z-1`): A `radial-gradient` that follows the cursor, revealing the code beneath
3. **Particle Canvas** (`z-2`): 50 floating particles with inter-connection lines
4. **Content** (`z-10`): Typing effect for "Krasimir Kralev", subtitle, and CTA

**Desktop interaction**: Mouse movement updates CSS custom properties `--mx` and `--my`, which move the radial gradient to reveal code blocks. A hint beacon in the top-left guides new visitors.

**Mobile interaction**: Touch-start/move reveals the spotlight; touch-end moves it off-screen (110%, 110%).

**Typing effect**: Characters appear one at a time (65ms interval). After completion, the subtitle and CTA fade in.

### 4.4 About.astro
**Purpose**: Professional bio and quick-action buttons.

**Content**: Profile photo, description of QA role at ResultsCX, CS studies, and guitar hobby in Slathe band.

**Interactive elements**:
- GitHub button with animated arrow on hover
- "Get in touch" CTA button with gradient background and glow

### 4.5 Projects.astro
**Purpose**: Showcase of portfolio projects.

**Projects displayed**:
1. **Slathe Band** — HTML/CSS/JS band website
2. **Barbershop Halil** — Node.js/Express full-stack booking system

**Card features**: Shadow elevation on hover, accent line that scales in from left, icon background expansion, technology tags that restyle on hover.

### 4.6 CryptoTracker.astro
**Purpose**: Live ICP (Internet Computer Protocol) price feed.

**States**: Loading spinner → Error message OR → ICP data card

**Data displayed**: Current price (USD), 24h change (green/red badge), market cap, 24h volume, 7d change.

**Client-side logic**: Fetches `/api/crypto`, formats numbers with compact notation (T/B/M), applies conditional styling.

### 4.7 Contact.astro
**Purpose**: Contact methods and social media links.

**Content**: Phone number (clickable `tel:` link), GitHub, Facebook, YouTube, Email icons.

**Hover effect**: Bottom-fill scale animation fills the circular icon with accent color, tooltip label appears below.

### 4.8 Footer.astro
**Purpose**: Simple copyright line.

---

## 5. Styling System

### Design Language
The site uses a **warm, earthy, elegant** palette:

| Token | Value | Usage |
|---|---|---|
| `surface` | `#faf8f5` | Main background |
| `surface-subtle` | `#f3efe9` | Alternating section backgrounds |
| `primary` | `#2c2416` | Main text (dark brown) |
| `primary-secondary` | `#7a6f60` | Secondary text |
| `primary-tertiary` | `#b0a898` | Muted text |
| `accent` | `#c8973e` | Gold accent — links, buttons, highlights |
| `accent-light` | `#fdf6ea` | Light accent background |

### Hero (Dark Theme)
The hero section breaks from the main palette with a deep navy (`#0c0c1d`) background and gold (`#c8973e`) accents, creating a dramatic contrast.

### Typography
- **Inter** — Clean sans-serif for all body text (weights: 300–700)
- **JetBrains Mono** — Monospace for code blocks, prices, and technical elements

### Responsive Strategy
- **Mobile-first** approach using Tailwind breakpoints
- `sm` (640px): Project grid shifts from 1 to 2 columns
- `md` (768px): Desktop navigation replaces hamburger menu; spotlight hint changes from touch to mouse
- Hero code blocks reposition and resize for mobile

### Animation Approach
- `transition-all duration-500` is the most common pattern
- Scroll reveals use `IntersectionObserver` with opacity + translateY
- The hero has custom CSS `@keyframes` for hint pulse, float, and text fade
- `animate-blink` for the typing cursor (defined in Tailwind config)

---

## 6. JavaScript Functionality

### 6.1 Scroll Reveal System (index.astro)
- Finds all `[data-reveal]` elements
- Adds initial hidden state (`opacity-0 translate-y-5`)
- `IntersectionObserver` at 15% threshold removes hidden classes and adds visible classes
- Elements are unobserved after revealing (one-time animation)

### 6.2 Hero Spotlight (Hero.astro)
- Desktop: `mousemove` on `#hero` updates `--mx` and `--my` CSS custom properties
- Mobile: `touchstart` and `touchmove` do the same; `touchend` sends spotlight off-screen
- Hint beacon fades out when cursor enters the top-left quadrant (< 25% X, < 35% Y)

### 6.3 Particle System (Hero.astro)
- Creates 50 particles with random position, velocity, and radius
- Each frame: moves particles, wraps at boundaries, draws dots
- Draws connecting lines between particles within 120px
- Draws stronger lines from particles near the mouse cursor (150px radius)
- Uses `requestAnimationFrame` for smooth 60fps rendering
- Resizes canvas on window resize

### 6.4 Typing Effect (Hero.astro)
- Starts after 600ms delay
- Appends one character of "Krasimir Kralev" every 65ms
- After completion, fades in subtitle and CTA via Tailwind class toggling

### 6.5 Language System (Navbar.astro + BaseLayout.astro)
- BaseLayout runs an inline script in `<head>` to read `localStorage('lang')` before render
- Sets `<html lang="..." data-lang="...">` immediately
- CSS rules hide opposite-language elements: `html[data-lang="bg"] [data-lang="en"] { display: none !important; }`
- Navbar provides toggle buttons that call `setLang()` → updates DOM, localStorage, and button styling

### 6.6 Navbar Scroll Color Swap (Navbar.astro)
- Passive scroll listener checks hero's bottom position
- Toggles between dark (over hero) and light (past hero) class sets
- Updates brand, links, mobile menu, language buttons in a single update cycle

### 6.7 Crypto Data Loader (CryptoTracker.astro)
- Fires on `DOMContentLoaded`
- Fetches `/api/crypto`, parses JSON
- Formats price with locale-specific decimals
- Formats large numbers: >=1T → "1.23T", >=1B → "1.23B", >=1M → "1.23M"
- Applies green/red styling based on positive/negative changes
- Error handling shows user-friendly messages

---

## 7. API Integration

### Server-Side Proxy: `/api/crypto`
**File**: `src/pages/api/crypto.ts`

**Why a proxy?** The CoinMarketCap API requires an API key. Calling it directly from the browser would expose the key. The server-side route keeps it secret.

**Flow**:
1. Client fetches `/api/crypto`
2. Server reads `CMC_API_KEY` from environment
3. Sends authenticated request to CoinMarketCap for ICP/USD quote
4. Extracts and returns: name, symbol, price, 24h change, 7d change, market cap, volume
5. Returns 500 with error message on failure

**Error Handling**:
- Missing API key → 500 with "API key not configured"
- API request failure → 500 with "Failed to fetch crypto data"
- Client-side catch → "Could not connect to server."

---

## 8. Bilingual System

### How It Works
The bilingual system uses a **CSS-driven, flash-free** approach:

1. **Before body renders**: An inline `<script>` in `<head>` reads `localStorage('lang')` and sets `data-lang` on `<html>`
2. **CSS rules** hide the opposite language: `html[data-lang="bg"] [data-lang="en"] { display: none !important; }`
3. **Every translatable element** has two sibling spans: `<span data-lang="en">English</span><span data-lang="bg">Bulgarian</span>`
4. **Toggle buttons** update `document.documentElement.dataset.lang`, `localStorage`, and button styling

### Coverage
- Navigation links
- Hero section (all 6 autobiography blocks + subtitle + CTA)
- About section (bio text + buttons)
- Projects section (titles, descriptions, "Visit" labels)
- Crypto tracker (all labels)
- Contact section (heading, social labels)
- Hero hints (both desktop and mobile)

---

## 9. How It All Works Together

### Page Load Sequence
1. Browser requests `/` → Astro SSR generates full HTML
2. **BaseLayout** renders `<head>` with fonts, meta tags, and language detection script
3. Language detection runs **before body paint** — sets correct `data-lang`, CSS hides wrong-language elements
4. Body renders with all components in order
5. **Navbar** mounts with dark theme (over hero)
6. **Hero** section begins:
   - Typing effect starts after 600ms
   - Particle system starts rendering
   - Spotlight overlay waits for mouse/touch input
7. **Scroll reveal** observer attaches to all `[data-reveal]` elements
8. **CryptoTracker** fires fetch to `/api/crypto` on `DOMContentLoaded`
9. As user scrolls:
   - Navbar theme swaps from dark → light
   - Sections with `[data-reveal]` animate into view
   - Crypto card appears when data loads

### User Interaction Model
- **Scrolling**: Triggers section reveals and navbar theme change
- **Hero mouse/touch**: Reveals autobiography text through spotlight
- **Language toggle**: Instantly swaps all visible text
- **Navigation links**: Smooth scroll to target section
- **Project cards**: Open external links in new tabs
- **Social icons**: Link to external profiles
- **Phone number**: Opens phone dialer

---

## 10. Areas to Improve

### 10.1 SEO & Meta Tags (HIGH PRIORITY)

**Current issues**:
- No `<link rel="canonical">` tag
- No Open Graph (`og:`) or Twitter Card meta tags — links shared on social media will look plain
- No `favicon` or `apple-touch-icon`
- The `<meta name="description">` is generic ("Krasimir Kralev - Web Developer")
- No structured data (JSON-LD) for rich search results
- Missing `robots.txt` and `sitemap.xml`

**Recommendation**: Add comprehensive meta tags, OG images, a favicon, and a sitemap for better discoverability.

### 10.2 Performance (MEDIUM PRIORITY)

**Current issues**:
- **Google Fonts loaded as render-blocking CSS** — The `<link>` tag blocks rendering until fonts download
- **No font fallback display strategy** — Should use `font-display: swap` (though Google Fonts does include it by default with `display=swap` parameter, which IS present)
- **Particle system runs indefinitely** — `requestAnimationFrame` never stops, even when the hero is not visible
- **No image optimization** — `selfie.jpg` and `icp-logo.png` are served as-is with no `width`/`height` attributes for layout stability
- **No lazy loading** for images below the fold
- **Axios imported for a single GET request** — Adds ~13KB (gzipped) to the server bundle when native `fetch` would work

**Recommendation**: Use Astro's `<Image>` component, stop the particle loop when hero is off-screen, replace axios with native `fetch`.

### 10.3 Accessibility (HIGH PRIORITY)

**Current issues**:
- **No skip navigation link** — Keyboard users must tab through the entire navbar to reach content
- **Hero spotlight has no keyboard alternative** — The autobiography text is only accessible via mouse/touch
- **`<pre>` blocks in hero are invisible by default** — Screen readers may or may not read content hidden behind the spotlight overlay
- **No `aria-live` regions** for dynamic content (crypto tracker loading states)
- **Language toggle buttons lack `aria-pressed`** state
- **Mobile menu toggle lacks `aria-expanded`** state
- **Color contrast**: Some muted text (e.g., `text-primary-tertiary` `#b0a898` on `#faf8f5`) may not meet WCAG AA 4.5:1 ratio
- **The `<canvas>` particle system has no accessible alternative**
- **No focus visible styling** — Tailwind removes default focus rings; custom ones aren't added

**Recommendation**: Add skip-nav, aria attributes, ensure color contrast, provide text alternatives for visual effects.

### 10.4 Code Quality (MEDIUM PRIORITY)

**Current issues**:
- **Inline color values** — Hardcoded hex values like `#0a0a18`, `#0c0c1d`, `#c8973e` appear throughout instead of using Tailwind theme tokens
- **`(window as any).__updateLangToggle`** — Using `window` as a global event bus is fragile; a custom event would be cleaner
- **Navbar scroll handler** is verbose — Toggling many classes manually is error-prone and hard to maintain
- **`catch (err: any)`** in the API route — Should use proper TypeScript error typing
- **No error boundaries** — If the crypto API fails, the spinner just stays hidden; no retry mechanism
- **SVG icons repeated inline** — The GitHub icon appears in both About.astro and Contact.astro as duplicated SVG markup
- **Copyright year hardcoded** as 2025 — Should be dynamic

**Recommendation**: Extract colors to Tailwind config, use custom events instead of window globals, create reusable SVG icon components.

### 10.5 Security (HIGH PRIORITY)

**Current issues**:
- **API key handling is good** (server-side proxy, .env, .gitignore) but there's **no rate limiting** on `/api/crypto` — anyone can spam the endpoint and exhaust the CoinMarketCap API quota
- **No Content Security Policy (CSP)** headers
- **No `X-Frame-Options`** or `X-Content-Type-Options` headers
- **External links have `rel="noopener noreferrer"`** which is correct

**Recommendation**: Add rate limiting, CSP headers, and security-related HTTP headers.

### 10.6 Mobile Experience (MEDIUM PRIORITY)

**Current issues**:
- **Hero code blocks may overlap** on very small screens (< 360px)
- **Spotlight on mobile** requires touch-and-hold which is not intuitive for all users
- **No mobile-specific CTA** — The "View my work" link is the same small text on both mobile and desktop
- **Contact phone number** is very large on mobile (`text-2xl`)

**Recommendation**: Test on various small devices, consider a different mobile hero experience.

### 10.7 Content & Copy (LOW PRIORITY)

**Current issues**:
- **Only 2 projects** — The portfolio section feels sparse
- **No resume/CV download** option
- **No skills/technologies section** — Only mentioned within project tags
- **No testimonials or endorsements**
- **No blog or writing section** to demonstrate thought leadership
- **GitHub username "SpitOnYourFace"** — While personal, this may not make the best impression on potential employers/clients

---

## 11. Best Practices Audit

### What's Done Well
| Area | Assessment |
|---|---|
| Component architecture | Clean separation of concerns with Astro components |
| Language persistence | Flash-free bilingual with `<head>` detection |
| Responsive design | Mobile-first approach with sensible breakpoints |
| External link security | `rel="noopener noreferrer"` on all external links |
| Passive event listeners | `{ passive: true }` on scroll and touch events |
| API key protection | Server-side proxy pattern keeps keys secret |
| TypeScript strict mode | Catches type errors at build time |
| Semantic HTML | Uses `<section>`, `<nav>`, `<footer>`, `<main>` (implicit) |
| Intersection Observer | Efficient scroll-reveal instead of scroll event polling |

### What Needs Attention
| Area | Issue | Priority |
|---|---|---|
| SEO | Missing OG tags, favicon, sitemap, structured data | HIGH |
| Accessibility | No skip-nav, missing ARIA attributes, contrast issues | HIGH |
| Security | No rate limiting, no CSP headers | HIGH |
| Performance | Infinite particle loop, no image optimization | MEDIUM |
| Code | Hardcoded colors, global window functions, duplicated SVGs | MEDIUM |
| Testing | No tests of any kind (unit, integration, e2e) | MEDIUM |
| Deployment | No CI/CD pipeline, no Lighthouse CI | LOW |
| Content | Only 2 projects, no skills section, no blog | LOW |

---

## 12. Creative Suggestions for a Fresh, Robust Website

### 12.1 Add a Dynamic Skills/Tech Stack Section
Create an interactive grid showing your technologies with proficiency indicators. Consider:
- **Animated skill cards** that flip to reveal experience details
- **Categorized** (Frontend, Backend, Tools, Learning) with filter buttons
- **Progress indicators** or experience timelines instead of generic bars
- Technologies: JavaScript, TypeScript, Node.js, Astro, Tailwind, Express, HTML/CSS, Git

### 12.2 Interactive Project Showcases
Instead of just linking to projects, elevate the Projects section:
- **Embedded screenshots/GIFs** showing each project in action
- **Before/after toggles** for design work
- **"View code" buttons** linking to GitHub repos
- **Case study format**: Problem → Approach → Result → What I learned
- **Project filtering** by technology tag

### 12.3 Timeline / Journey Section
Add a visual timeline of your professional and personal journey:
- Education milestones (university admission, key courses)
- Career milestones (joining ResultsCX, promotions)
- Project launches
- Band milestones (Slathe performances, releases)
- Use a vertical scrolling timeline with alternating left/right cards

### 12.4 Blog / Thoughts Section
Start a lightweight blog to demonstrate expertise:
- Short-form posts about QA best practices, Web3 insights, or coding adventures
- Can be powered by Astro's **Content Collections** (markdown files → auto-generated pages)
- Adds SEO value through indexed content
- Shows thought leadership to potential employers

### 12.5 Enhance the Hero Experience
The spotlight concept is creative. Push it further:
- **Smooth canvas-based spotlight** instead of CSS radial gradient for more control
- **Typed text that changes** — Cycle through roles: "Web Developer", "QA Specialist", "Guitarist", "Web3 Enthusiast"
- **Ambient sound toggle** — A subtle code-typing or electronic ambiance (muted by default)
- **3D parallax layers** on mouse movement for depth
- **Animated gradient background** that slowly shifts colors

### 12.6 Dark Mode Toggle
Currently the hero is dark and body is light. Add a full dark mode:
- Toggle button in the navbar (sun/moon icon)
- Tailwind's `dark:` variant for easy implementation
- Persist preference in localStorage
- Respects `prefers-color-scheme` system preference
- The dark theme could use your hero's dark navy + gold palette site-wide

### 12.7 Micro-interactions & Polish
- **Magnetic buttons** — Buttons that subtly pull toward the cursor
- **Smooth page transitions** between sections using `View Transitions API` (Astro supports this natively)
- **Cursor trail** or custom cursor on desktop
- **Scroll progress bar** at the top of the page
- **Back to top button** that appears after scrolling

### 12.8 Contact Form
Replace or supplement the phone number with a proper contact form:
- Name, email, message fields
- Server-side handling via Astro API route
- Use a service like Resend, SendGrid, or even email via SMTP
- Add form validation and honeypot spam protection
- Shows professionalism over "just a phone number"

### 12.9 Crypto Section Enhancement
Since you're passionate about ICP/Web3:
- **Mini price chart** (sparkline) using a lightweight charting library
- **Multiple tokens** — Show ICP alongside BTC and ETH for context
- **Auto-refresh** with a configurable interval (e.g., every 60 seconds)
- **24h price animation** — Number ticks up/down like a stock ticker
- **"Why ICP?"** — A short explanation card about why you track this specific token

### 12.10 Performance Optimization
- **View Transitions API** — Astro has first-class support for smooth page transitions
- **Prefetch links** — Add `<link rel="prefetch">` for faster navigation
- **Service Worker** — Enable offline access with a basic service worker
- **Image CDN** — Use Astro's `<Image>` component or a service like Cloudinary
- **Critical CSS** — Inline above-the-fold styles

### 12.11 Deployment & DevOps
- **Vercel or Netlify deployment** — Both offer free hosting with SSR support for Astro
- **GitHub Actions CI/CD** — Auto-deploy on push, run Lighthouse CI
- **Environment-based config** — Separate staging and production environments
- **Error monitoring** — Add Sentry for runtime error tracking

### 12.12 Easter Eggs & Personality
Make the site memorable:
- **Konami code** → Triggers a fun animation or reveals a hidden section
- **Console message** — A styled `console.log` with a hiring message
- **404 page** — A custom, creative 404 page (even if it's a SPA, good for direct URL access)
- **Guitar riff** — A tiny audio player in the footer playing a Slathe clip

---

## 13. Implementation Priority Roadmap

### Phase 1: Foundation Fixes (Week 1)
- [ ] Add favicon and apple-touch-icon
- [ ] Add Open Graph and Twitter Card meta tags
- [ ] Add `robots.txt` and `sitemap.xml`
- [ ] Replace hardcoded colors with Tailwind theme tokens
- [ ] Replace `axios` with native `fetch` in the API route
- [ ] Add `width`/`height` to images; use Astro's `<Image>` component
- [ ] Make copyright year dynamic
- [ ] Add rate limiting to `/api/crypto`

### Phase 2: Accessibility & SEO (Week 2)
- [ ] Add skip navigation link
- [ ] Add `aria-expanded` to mobile menu toggle
- [ ] Add `aria-pressed` to language toggle buttons
- [ ] Add `aria-live="polite"` to crypto tracker container
- [ ] Ensure all text meets WCAG AA contrast ratios
- [ ] Add visible focus styles for keyboard navigation
- [ ] Provide accessible alternative for hero autobiography text
- [ ] Add JSON-LD structured data (Person schema)

### Phase 3: Performance & Quality (Week 3)
- [ ] Stop particle animation when hero is off-screen
- [ ] Add lazy loading for below-fold images
- [ ] Extract reusable SVG icon components
- [ ] Replace `window.__updateLangToggle` with `CustomEvent`
- [ ] Add CSP and security headers
- [ ] Set up Lighthouse CI in GitHub Actions

### Phase 4: New Features (Week 4+)
- [ ] Add Skills/Tech Stack section
- [ ] Add project screenshots/GIFs
- [ ] Implement dark mode toggle
- [ ] Add contact form with server-side handling
- [ ] Enhance crypto tracker with sparkline chart
- [ ] Add scroll progress bar and back-to-top button
- [ ] Set up Astro Content Collections for future blog
- [ ] Add View Transitions for smooth section navigation

---

*Documentation generated on February 12, 2026*
*Analyzed by Claude Code — covering all 8 components, 1 API route, and 5 configuration files*
