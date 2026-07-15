// Form value conversion utilities for consistent handling across modals

export function toInputValue(value) {
  return value === null || value === undefined ? '' : String(value);
}

export function toRateOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  return Number(value);
}
