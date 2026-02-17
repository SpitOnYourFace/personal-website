import { describe, it, expect } from 'vitest';

// Extract validation logic for testing
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName(name: unknown): string | null {
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return 'Name is required (min 2 characters)';
  }
  return null;
}

function validateEmail(email: unknown): string | null {
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return 'A valid email is required';
  }
  return null;
}

function validateMessage(message: unknown): string | null {
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    return 'Message is required (min 10 characters)';
  }
  return null;
}

describe('Contact form validation', () => {
  describe('name validation', () => {
    it('rejects empty name', () => {
      expect(validateName('')).not.toBeNull();
    });

    it('rejects name shorter than 2 characters', () => {
      expect(validateName('A')).not.toBeNull();
    });

    it('rejects non-string name', () => {
      expect(validateName(123)).not.toBeNull();
      expect(validateName(null)).not.toBeNull();
      expect(validateName(undefined)).not.toBeNull();
    });

    it('accepts valid name', () => {
      expect(validateName('John')).toBeNull();
      expect(validateName('AB')).toBeNull();
    });

    it('trims whitespace when checking length', () => {
      expect(validateName('  A  ')).not.toBeNull();
      expect(validateName('  AB  ')).toBeNull();
    });
  });

  describe('email validation', () => {
    it('rejects empty email', () => {
      expect(validateEmail('')).not.toBeNull();
    });

    it('rejects invalid emails', () => {
      expect(validateEmail('notanemail')).not.toBeNull();
      expect(validateEmail('missing@domain')).not.toBeNull();
      expect(validateEmail('@nodomain.com')).not.toBeNull();
    });

    it('accepts valid emails', () => {
      expect(validateEmail('user@example.com')).toBeNull();
      expect(validateEmail('test@sub.domain.org')).toBeNull();
    });
  });

  describe('message validation', () => {
    it('rejects empty message', () => {
      expect(validateMessage('')).not.toBeNull();
    });

    it('rejects message shorter than 10 characters', () => {
      expect(validateMessage('Too short')).not.toBeNull();
    });

    it('accepts message with 10+ characters', () => {
      expect(validateMessage('This is a valid message')).toBeNull();
      expect(validateMessage('Exactly 10')).toBeNull();
    });
  });
});
