import { CAMPAIGN_STATUS } from '../constants';

/**
 * Formats an ISO timestamp for compact display in tables/cards.
 */
export function formatDateTime(isoString) {
  if (!isoString) return '—';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeToNow(isoString) {
  if (!isoString) return '—';
  const target = new Date(isoString).getTime();
  const diffMs = target - Date.now();
  const diffMinutes = Math.round(diffMs / 60000);
  const abs = Math.abs(diffMinutes);

  if (abs < 1) return 'just now';
  if (abs < 60) return `${abs}m ${diffMinutes < 0 ? 'ago' : 'from now'}`;
  const diffHours = Math.round(abs / 60);
  if (diffHours < 24) return `${diffHours}h ${diffMinutes < 0 ? 'ago' : 'from now'}`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ${diffMinutes < 0 ? 'ago' : 'from now'}`;
}

/**
 * Converts a native datetime-local input value to an ISO string, and back.
 */
export function localInputToIso(localValue) {
  if (!localValue) return null;
  return new Date(localValue).toISOString();
}

export function isoToLocalInput(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Mirrors the backend's status derivation: a campaign is ACTIVE when now falls within
 * [startTime, endTime], UPCOMING when it starts in the future, otherwise EXPIRED.
 */
export function getCampaignStatus(campaign, now = new Date()) {
  const start = new Date(campaign.startTime);
  const end = new Date(campaign.endTime);
  if (now < start) return CAMPAIGN_STATUS.UPCOMING;
  if (now > end) return CAMPAIGN_STATUS.EXPIRED;
  return CAMPAIGN_STATUS.ACTIVE;
}

/**
 * Mirrors the backend's CampaignSelector: among all currently ACTIVE campaigns, the one with
 * the highest earn_multiplier applies to earning, and the one with the lowest
 * burn_discount_multiplier (fewest points required) applies to redemption. These can be two
 * different campaigns if their windows overlap.
 */
export function resolveEffectiveCampaigns(campaigns, now = new Date()) {
  const active = campaigns.filter((c) => getCampaignStatus(c, now) === CAMPAIGN_STATUS.ACTIVE);
  if (active.length === 0) {
    return { earnCampaign: null, burnCampaign: null, overlapping: false };
  }
  const earnCampaign = active.reduce(
    (best, c) => (!best || c.earnMultiplier > best.earnMultiplier ? c : best),
    null
  );
  const burnCampaign = active.reduce(
    (best, c) => (!best || c.burnDiscountMultiplier < best.burnDiscountMultiplier ? c : best),
    null
  );
  return { earnCampaign, burnCampaign, overlapping: active.length > 1 };
}
