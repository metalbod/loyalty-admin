import {
  formatPoints,
  formatBalance,
  formatCents,
  formatMultiplier,
  formatRate,
  truncate,
  initials,
} from '../formatters.js';

describe('formatters', () => {
  describe('formatPoints', () => {
    it('formats positive numbers with + prefix', () => {
      expect(formatPoints(100)).toBe('+100 pts');
    });

    it('formats negative numbers with - prefix', () => {
      expect(formatPoints(-50)).toBe('-50 pts');
    });

    it('formats zero without prefix', () => {
      expect(formatPoints(0)).toBe('0 pts');
    });

    it('handles null/undefined as 0', () => {
      expect(formatPoints(null)).toBe('0 pts');
      expect(formatPoints(undefined)).toBe('0 pts');
    });

    it('formats large numbers with locale separators', () => {
      expect(formatPoints(10000)).toContain('10');
      expect(formatPoints(10000)).toContain('pts');
    });

    it('converts strings to numbers', () => {
      expect(formatPoints('42')).toBe('+42 pts');
    });
  });

  describe('formatBalance', () => {
    it('formats positive numbers without + prefix', () => {
      expect(formatBalance(100)).toBe('100 pts');
    });

    it('formats negative numbers with - prefix', () => {
      expect(formatBalance(-50)).toBe('-50 pts');
    });

    it('formats zero', () => {
      expect(formatBalance(0)).toBe('0 pts');
    });

    it('handles null/undefined as 0', () => {
      expect(formatBalance(null)).toBe('0 pts');
      expect(formatBalance(undefined)).toBe('0 pts');
    });
  });

  describe('formatCents', () => {
    it('converts cents to RM currency format', () => {
      expect(formatCents(100)).toBe('RM 1.00');
    });

    it('handles zero cents', () => {
      expect(formatCents(0)).toBe('RM 0.00');
    });

    it('formats small amounts', () => {
      expect(formatCents(1)).toBe('RM 0.01');
    });

    it('handles large amounts', () => {
      expect(formatCents(50000)).toBe('RM 500.00');
    });

    it('handles null/undefined as 0', () => {
      expect(formatCents(null)).toBe('RM 0.00');
      expect(formatCents(undefined)).toBe('RM 0.00');
    });
  });

  describe('formatMultiplier', () => {
    it('formats numbers to 2 decimal places with x suffix', () => {
      expect(formatMultiplier(1.5)).toBe('1.50x');
    });

    it('formats whole numbers with .00x', () => {
      expect(formatMultiplier(2)).toBe('2.00x');
    });

    it('returns — for null', () => {
      expect(formatMultiplier(null)).toBe('—');
    });

    it('returns — for undefined', () => {
      expect(formatMultiplier(undefined)).toBe('—');
    });

    it('returns — for empty string', () => {
      expect(formatMultiplier('')).toBe('—');
    });

    it('converts string numbers', () => {
      expect(formatMultiplier('2.5')).toBe('2.50x');
    });
  });

  describe('formatRate', () => {
    it('formats value with suffix', () => {
      expect(formatRate(5, 'pts/cent')).toBe('5 pts/cent');
    });

    it('returns null for null value', () => {
      expect(formatRate(null, 'pts/cent')).toBe(null);
    });

    it('returns null for undefined value', () => {
      expect(formatRate(undefined, 'pts/cent')).toBe(null);
    });

    it('returns null for empty string', () => {
      expect(formatRate('', 'pts/cent')).toBe(null);
    });

    it('handles zero value', () => {
      expect(formatRate(0, 'days')).toBe('0 days');
    });
  });

  describe('truncate', () => {
    it('returns text shorter than maxLength unchanged', () => {
      expect(truncate('hello')).toBe('hello');
    });

    it('truncates text longer than maxLength with ellipsis', () => {
      const long = 'a'.repeat(70);
      const result = truncate(long);
      expect(result).toHaveLength(60); // 59 chars + 1 ellipsis
      expect(result).toMatch(/…$/);
    });

    it('uses default maxLength of 60', () => {
      const text = 'a'.repeat(65);
      const result = truncate(text);
      expect(result).toHaveLength(60);
    });

    it('respects custom maxLength', () => {
      const text = 'a'.repeat(50);
      const result = truncate(text, 20);
      expect(result).toHaveLength(20);
      expect(result).toMatch(/…$/);
    });

    it('returns empty string for null/undefined', () => {
      expect(truncate(null)).toBe('');
      expect(truncate(undefined)).toBe('');
    });
  });

  describe('initials', () => {
    it('extracts initials from single word', () => {
      expect(initials('John')).toBe('J');
    });

    it('extracts initials from multiple words', () => {
      expect(initials('John Doe')).toBe('JD');
    });

    it('handles underscores as delimiters', () => {
      expect(initials('john_doe')).toBe('JD');
    });

    it('handles hyphens as delimiters', () => {
      expect(initials('john-doe')).toBe('JD');
    });

    it('extracts only first two initials', () => {
      expect(initials('John Paul George Ringo')).toBe('JP');
    });

    it('returns ? for null/undefined', () => {
      expect(initials(null)).toBe('?');
      expect(initials(undefined)).toBe('?');
    });

    it('returns ? for empty string', () => {
      expect(initials('')).toBe('?');
    });

    it('capitalizes lowercase letters', () => {
      expect(initials('jane doe')).toBe('JD');
    });

    it('handles mixed case', () => {
      expect(initials('JoHn DoE')).toBe('JD');
    });
  });
});
