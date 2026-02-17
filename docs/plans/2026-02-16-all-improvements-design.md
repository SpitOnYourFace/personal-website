# All Improvements Design

**Date:** 2026-02-16
**Scope:** 10 improvement areas for krasimirkralev.com

## Decisions

| Area | Choice |
|------|--------|
| Email service | Resend |
| Deployment | Vercel |
| Testing | Vitest (unit tests) |
| Error monitoring | Sentry |
| i18n | JSON translation files |

## 1. Contact Form Email Delivery (Resend)

- Install `resend` package
- Add `RESEND_API_KEY` env var
- Update `src/pages/api/contact.ts` to send email via Resend
- Send to personal address with form data; auto-reply to submitter
- Keep existing honeypot + validation

## 2. Server-Side Crypto API Caching

- Module-level cache variable in `src/pages/api/crypto.ts`
- 60s TTL, return cached data if fresh
- Reduces API calls from 1/min/visitor to 1/min total

## 3. Sentry Error Monitoring

- Install `@sentry/astro`
- Add `SENTRY_DSN` env var
- Configure as Astro integration in `astro.config.mjs`

## 4. Environment Variable Validation

- Create `src/env.ts` with validation for required vars
- Import in API routes that need specific vars
- Clear error messages on missing vars

## 5. Accessibility Fixes

- `role="img"` + `aria-label` on particle canvas
- Screen-reader text for spotlight autobiography
- Keyboard-accessible alternative for hidden content

## 6. OG Image Format

- Convert `og-image.svg` to 1200x630 PNG
- Update meta tags in `BaseLayout.astro`

## 7. CSP Hardening

- Nonce-based script CSP in middleware
- Keep `unsafe-inline` for styles (Tailwind requirement)

## 8. Unit Tests (Vitest)

- Install `vitest`
- Test: API routes, middleware, utility functions
- Add `test` script to `package.json`

## 9. CI/CD Pipeline (GitHub Actions)

- Workflow: lint, type-check, test, build
- Lighthouse CI on PRs
- Vercel handles deploy via Git integration

## 10. Centralized i18n (JSON)

- `src/i18n/en.json` and `src/i18n/bg.json`
- `src/i18n/index.ts` helper with `t('key')` function
- Refactor components from dual spans to translation keys
