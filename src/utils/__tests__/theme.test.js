import { applyBrandTheme, resetBrandTheme } from '../theme.js';

describe('theme.js utilities', () => {
  beforeEach(() => {
    // Clear all CSS custom properties before each test
    document.documentElement.style.cssText = '';
  });

  describe('applyBrandTheme', () => {
    it('applies brand color with valid hex code', () => {
      applyBrandTheme('#0066cc');

      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#0066cc');
      expect(document.documentElement.style.getPropertyValue('--brand-10')).toBe('rgba(0, 102, 204, 0.1)');
      expect(document.documentElement.style.getPropertyValue('--brand-20')).toBe('rgba(0, 102, 204, 0.2)');
      expect(document.documentElement.style.getPropertyValue('--brand-40')).toBe('rgba(0, 102, 204, 0.4)');
      expect(document.documentElement.style.getPropertyValue('--brand-hover')).toBe('rgba(0, 102, 204, 0.85)');
    });

    it('uses default color for invalid hex code', () => {
      applyBrandTheme('invalid-color');

      // Default is #10b981 (emerald-500)
      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#10b981');
      expect(document.documentElement.style.getPropertyValue('--brand-10')).toBe('rgba(16, 185, 129, 0.1)');
    });

    it('uses default color for null color', () => {
      applyBrandTheme(null);

      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#10b981');
    });

    it('uses default color for undefined color', () => {
      applyBrandTheme(undefined);

      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#10b981');
    });

    it('uses default color for empty string', () => {
      applyBrandTheme('');

      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#10b981');
    });

    it('handles uppercase hex colors', () => {
      applyBrandTheme('#FF0000');

      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#FF0000');
      expect(document.documentElement.style.getPropertyValue('--brand-10')).toBe('rgba(255, 0, 0, 0.1)');
    });

    it('handles mixed case hex colors', () => {
      applyBrandTheme('#Aa00Bb');

      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#Aa00Bb');
      expect(document.documentElement.style.getPropertyValue('--brand-10')).toBe('rgba(170, 0, 187, 0.1)');
    });

    it('rejects hex codes with invalid characters', () => {
      applyBrandTheme('#00000Z');

      // Should fall back to default
      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#10b981');
    });

    it('rejects hex codes with too few characters', () => {
      applyBrandTheme('#000');

      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#10b981');
    });

    it('rejects hex codes with too many characters', () => {
      applyBrandTheme('#0000000');

      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#10b981');
    });

    it('rejects hex codes without hash symbol', () => {
      applyBrandTheme('000000');

      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#10b981');
    });

    it('sets all opacity variants correctly', () => {
      applyBrandTheme('#ff00ff');

      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#ff00ff');
      expect(document.documentElement.style.getPropertyValue('--brand-10')).toBe('rgba(255, 0, 255, 0.1)');
      expect(document.documentElement.style.getPropertyValue('--brand-20')).toBe('rgba(255, 0, 255, 0.2)');
      expect(document.documentElement.style.getPropertyValue('--brand-40')).toBe('rgba(255, 0, 255, 0.4)');
      expect(document.documentElement.style.getPropertyValue('--brand-hover')).toBe('rgba(255, 0, 255, 0.85)');
    });

    it('correctly converts colors with various values', () => {
      const testCases = [
        { color: '#000000', r: 0, g: 0, b: 0 },
        { color: '#ffffff', r: 255, g: 255, b: 255 },
        { color: '#ff0000', r: 255, g: 0, b: 0 },
        { color: '#00ff00', r: 0, g: 255, b: 0 },
        { color: '#0000ff', r: 0, g: 0, b: 255 },
        { color: '#808080', r: 128, g: 128, b: 128 },
      ];

      testCases.forEach(({ color, r, g, b }) => {
        applyBrandTheme(color);
        expect(document.documentElement.style.getPropertyValue('--brand-10')).toBe(
          `rgba(${r}, ${g}, ${b}, 0.1)`
        );
      });
    });
  });

  describe('resetBrandTheme', () => {
    it('resets theme to default color', () => {
      // First apply a custom color
      applyBrandTheme('#0066cc');
      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#0066cc');

      // Then reset
      resetBrandTheme();

      // Should be back to default
      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#10b981');
      expect(document.documentElement.style.getPropertyValue('--brand-10')).toBe('rgba(16, 185, 129, 0.1)');
    });

    it('resets all opacity variants to default', () => {
      applyBrandTheme('#ff0000');
      resetBrandTheme();

      expect(document.documentElement.style.getPropertyValue('--brand-10')).toBe('rgba(16, 185, 129, 0.1)');
      expect(document.documentElement.style.getPropertyValue('--brand-20')).toBe('rgba(16, 185, 129, 0.2)');
      expect(document.documentElement.style.getPropertyValue('--brand-40')).toBe('rgba(16, 185, 129, 0.4)');
      expect(document.documentElement.style.getPropertyValue('--brand-hover')).toBe('rgba(16, 185, 129, 0.85)');
    });
  });

  describe('integration', () => {
    it('can switch between multiple brand colors', () => {
      applyBrandTheme('#0066cc');
      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#0066cc');

      applyBrandTheme('#ff0000');
      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#ff0000');

      applyBrandTheme('#00ff00');
      expect(document.documentElement.style.getPropertyValue('--brand')).toBe('#00ff00');
    });

    it('maintains CSS custom properties across resets', () => {
      applyBrandTheme('#0066cc');
      const customProps = {
        brand: document.documentElement.style.getPropertyValue('--brand'),
        brandHover: document.documentElement.style.getPropertyValue('--brand-hover'),
      };

      resetBrandTheme();
      applyBrandTheme('#0066cc');

      expect(document.documentElement.style.getPropertyValue('--brand')).toBe(customProps.brand);
      expect(document.documentElement.style.getPropertyValue('--brand-hover')).toBe(customProps.brandHover);
    });
  });
});
