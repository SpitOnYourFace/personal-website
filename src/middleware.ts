import { defineMiddleware } from 'astro:middleware';
import crypto from 'node:crypto';

const rateLimit = new Map<string, { count: number; resetTime: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

function getRateLimitKey(request: Request): string {
  return request.headers.get('x-forwarded-for')
    || request.headers.get('x-real-ip')
    || 'unknown';
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request } = context;

  // Generate CSP nonce for this request
  const nonce = crypto.randomBytes(16).toString('base64');
  context.locals.nonce = nonce;

  if (url.pathname.startsWith('/api/')) {
    const key = getRateLimitKey(request);
    const now = Date.now();
    const entry = rateLimit.get(key);

    if (entry && now < entry.resetTime) {
      entry.count++;
      if (entry.count > MAX_REQUESTS) {
        return new Response(JSON.stringify({ error: 'Too many requests' }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(Math.ceil((entry.resetTime - now) / 1000)),
          },
        });
      }
    } else {
      rateLimit.set(key, { count: 1, resetTime: now + WINDOW_MS });
    }

    if (rateLimit.size > 1000) {
      for (const [k, v] of rateLimit) {
        if (now > v.resetTime) rateLimit.delete(k);
      }
    }
  }

  const response = await next();

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'unsafe-inline' https://code.iconify.design`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      "connect-src 'self' https://api.iconify.design",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  return response;
});
