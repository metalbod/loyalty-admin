export function formatPoints(value) {
  const n = Number(value) || 0;
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toLocaleString()} pts`;
}

export function formatCents(cents) {
  const n = Number(cents) || 0;
  return `RM ${(n / 100).toFixed(2)}`;
}

export function formatMultiplier(value) {
  if (value === null || value === undefined || value === '') return '—';
  return `${Number(value).toFixed(2)}x`;
}

export function formatRate(value, suffix) {
  if (value === null || value === undefined || value === '') return null;
  return `${value} ${suffix}`;
}

export function truncate(text, maxLength = 60) {
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

export function initials(name) {
  if (!name) return '?';
  return name
    .split(/[\s_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}
