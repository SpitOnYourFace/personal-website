import { describe, it, expect } from 'vitest';
import { t, tArray } from '../src/i18n/index';

describe('i18n helper', () => {
  describe('t()', () => {
    it('returns translations for a simple key', () => {
      const result = t('nav.about');
      expect(result.en).toBe('about');
      expect(result.bg).toBe('за мен');
    });

    it('returns translations for nested keys', () => {
      const result = t('contact.send');
      expect(result.en).toBe('Send message');
      expect(result.bg).toBe('Изпрати');
    });

    it('returns the key itself for missing translations', () => {
      const result = t('nonexistent.key');
      expect(result.en).toBe('nonexistent.key');
      expect(result.bg).toBe('nonexistent.key');
    });

    it('returns correct skip nav text', () => {
      const result = t('skipNav');
      expect(result.en).toBe('Skip to content');
      expect(result.bg).toBe('Към съдържанието');
    });
  });

  describe('tArray()', () => {
    it('returns translation arrays', () => {
      const result = tArray('hero.roles');
      expect(result.en).toContain('Web Developer');
      expect(result.bg).toContain('Уеб Разработчик');
      expect(result.en.length).toBe(4);
      expect(result.bg.length).toBe(4);
    });

    it('returns empty arrays for missing keys', () => {
      const result = tArray('nonexistent.key');
      expect(result.en).toEqual([]);
      expect(result.bg).toEqual([]);
    });
  });
});
