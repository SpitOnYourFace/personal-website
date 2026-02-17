import en from './en.json';
import bg from './bg.json';

export type Lang = 'en' | 'bg';

const translations = { en, bg } as const;

/**
 * Get a nested translation value by dot-notation key.
 * Example: t('nav.about') returns { en: 'about', bg: 'за мен' }
 */
export function t(key: string): { en: string; bg: string } {
  const keys = key.split('.');
  let enVal: unknown = translations.en;
  let bgVal: unknown = translations.bg;

  for (const k of keys) {
    enVal = (enVal as Record<string, unknown>)?.[k];
    bgVal = (bgVal as Record<string, unknown>)?.[k];
  }

  return {
    en: typeof enVal === 'string' ? enVal : key,
    bg: typeof bgVal === 'string' ? bgVal : key,
  };
}

/**
 * Get a translation array (e.g., hero.roles).
 */
export function tArray(key: string): { en: string[]; bg: string[] } {
  const keys = key.split('.');
  let enVal: unknown = translations.en;
  let bgVal: unknown = translations.bg;

  for (const k of keys) {
    enVal = (enVal as Record<string, unknown>)?.[k];
    bgVal = (bgVal as Record<string, unknown>)?.[k];
  }

  return {
    en: Array.isArray(enVal) ? enVal : [],
    bg: Array.isArray(bgVal) ? bgVal : [],
  };
}
