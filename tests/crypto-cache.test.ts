import { describe, it, expect } from 'vitest';

// Re-implement cache logic for unit testing
class ApiCache<T> {
  private data: T | null = null;
  private timestamp = 0;

  constructor(private ttlMs: number) {}

  get(): T | null {
    if (this.data && Date.now() - this.timestamp < this.ttlMs) {
      return this.data;
    }
    return null;
  }

  set(data: T): void {
    this.data = data;
    this.timestamp = Date.now();
  }
}

describe('API cache', () => {
  it('returns null when empty', () => {
    const cache = new ApiCache<string>(60_000);
    expect(cache.get()).toBeNull();
  });

  it('returns cached data within TTL', () => {
    const cache = new ApiCache<string>(60_000);
    cache.set('test data');
    expect(cache.get()).toBe('test data');
  });

  it('returns null after TTL expires', async () => {
    const cache = new ApiCache<string>(1); // 1ms TTL
    cache.set('old data');
    await new Promise((r) => setTimeout(r, 10));
    expect(cache.get()).toBeNull();
  });

  it('overwrites previous data', () => {
    const cache = new ApiCache<string>(60_000);
    cache.set('first');
    cache.set('second');
    expect(cache.get()).toBe('second');
  });
});

describe('Number formatting', () => {
  function formatCompact(num: number): string {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString('en-US');
  }

  it('formats trillions', () => {
    expect(formatCompact(1.5e12)).toBe('1.50T');
  });

  it('formats billions', () => {
    expect(formatCompact(2.34e9)).toBe('2.34B');
  });

  it('formats millions', () => {
    expect(formatCompact(456e6)).toBe('456.00M');
  });

  it('passes through smaller numbers', () => {
    expect(formatCompact(1234)).toBe('1,234');
  });
});
