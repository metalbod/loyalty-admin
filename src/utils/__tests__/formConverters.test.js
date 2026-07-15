import { toInputValue, toRateOrNull } from '../formConverters.js';

describe('formConverters', () => {
  describe('toInputValue', () => {
    it('converts null to empty string', () => {
      expect(toInputValue(null)).toBe('');
    });

    it('converts undefined to empty string', () => {
      expect(toInputValue(undefined)).toBe('');
    });

    it('converts numbers to strings', () => {
      expect(toInputValue(42)).toBe('42');
    });

    it('converts zero to "0"', () => {
      expect(toInputValue(0)).toBe('0');
    });

    it('converts decimal numbers to strings with decimals', () => {
      expect(toInputValue(3.14)).toBe('3.14');
    });

    it('handles strings already', () => {
      expect(toInputValue('hello')).toBe('hello');
    });
  });

  describe('toRateOrNull', () => {
    it('converts empty string to null', () => {
      expect(toRateOrNull('')).toBe(null);
    });

    it('converts null to null', () => {
      expect(toRateOrNull(null)).toBe(null);
    });

    it('converts undefined to null', () => {
      expect(toRateOrNull(undefined)).toBe(null);
    });

    it('converts string numbers to numbers', () => {
      expect(toRateOrNull('42')).toBe(42);
    });

    it('converts numeric zero to 0', () => {
      expect(toRateOrNull(0)).toBe(0);
    });

    it('converts string "0" to 0', () => {
      expect(toRateOrNull('0')).toBe(0);
    });

    it('converts decimal strings to decimal numbers', () => {
      expect(toRateOrNull('3.14')).toBe(3.14);
    });

    it('handles negative numbers', () => {
      expect(toRateOrNull('-5')).toBe(-5);
    });

    it('converts invalid strings to NaN', () => {
      expect(isNaN(toRateOrNull('abc'))).toBe(true);
    });
  });
});
