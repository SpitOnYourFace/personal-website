import { describe, it, expect, beforeEach } from 'vitest';

// Re-implement rate limiter logic for unit testing
class RateLimiter {
  private map = new Map<string, { count: number; resetTime: number }>();
  constructor(
    private windowMs: number,
    private maxRequests: number,
  ) {}

  check(key: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const entry = this.map.get(key);

    if (entry && now < entry.resetTime) {
      entry.count++;
      if (entry.count > this.maxRequests) {
        return {
          allowed: false,
          retryAfter: Math.ceil((entry.resetTime - now) / 1000),
        };
      }
      return { allowed: true };
    }

    this.map.set(key, { count: 1, resetTime: now + this.windowMs });
    return { allowed: true };
  }

  get size() {
    return this.map.size;
  }
}

describe('Rate limiter', () => {
  let limiter: RateLimiter;

  beforeEach(() => {
    limiter = new RateLimiter(60_000, 30);
  });

  it('allows requests within the limit', () => {
    for (let i = 0; i < 30; i++) {
      expect(limiter.check('127.0.0.1').allowed).toBe(true);
    }
  });

  it('blocks requests exceeding the limit', () => {
    for (let i = 0; i < 30; i++) {
      limiter.check('127.0.0.1');
    }
    const result = limiter.check('127.0.0.1');
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  it('tracks different IPs independently', () => {
    for (let i = 0; i < 30; i++) {
      limiter.check('10.0.0.1');
    }
    expect(limiter.check('10.0.0.1').allowed).toBe(false);
    expect(limiter.check('10.0.0.2').allowed).toBe(true);
  });

  it('resets after window expires', () => {
    const shortLimiter = new RateLimiter(1, 1); // 1ms window
    shortLimiter.check('127.0.0.1');
    // Wait for window to expire
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(shortLimiter.check('127.0.0.1').allowed).toBe(true);
        resolve();
      }, 10);
    });
  });
});
