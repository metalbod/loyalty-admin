// Applies (or resets) the logged-in institution's brand color as CSS custom properties on
// the document root. Components that want to be "brand-aware" (rather than using the fixed
// semantic emerald used for success/active states) reference these via Tailwind's arbitrary
// value syntax, e.g. `bg-[var(--brand-10)]` - see Sidebar.jsx and Button.jsx.
const DEFAULT_BRAND_COLOR = '#10b981'; // emerald-500 - the dashboard's look before any
// institution has configured a custom color, and the fallback for a superadmin (who has no
// institution to brand).

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  return { r, g, b };
}

export function applyBrandTheme(primaryColor) {
  const color = /^#[0-9A-Fa-f]{6}$/.test(primaryColor || '') ? primaryColor : DEFAULT_BRAND_COLOR;
  const { r, g, b } = hexToRgb(color);
  const root = document.documentElement.style;
  root.setProperty('--brand', color);
  root.setProperty('--brand-10', `rgba(${r}, ${g}, ${b}, 0.1)`);
  root.setProperty('--brand-20', `rgba(${r}, ${g}, ${b}, 0.2)`);
  root.setProperty('--brand-40', `rgba(${r}, ${g}, ${b}, 0.4)`);
  root.setProperty('--brand-hover', `rgba(${r}, ${g}, ${b}, 0.85)`);
}

export function resetBrandTheme() {
  applyBrandTheme(null);
}
