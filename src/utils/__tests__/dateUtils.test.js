import {
  formatDateTime,
  formatRelativeToNow,
  localInputToIso,
  isoToLocalInput,
  getCampaignStatus,
  resolveEffectiveCampaigns,
} from '../dateUtils.js';
import { CAMPAIGN_STATUS } from '../../constants/index.js';

describe('dateUtils', () => {
  describe('formatDateTime', () => {
    it('returns dash for null or undefined', () => {
      expect(formatDateTime(null)).toBe('—');
      expect(formatDateTime(undefined)).toBe('—');
    });

    it('returns dash for empty string', () => {
      expect(formatDateTime('')).toBe('—');
    });

    it('returns dash for invalid date string', () => {
      expect(formatDateTime('not-a-date')).toBe('—');
    });

    it('formats valid ISO string to locale string', () => {
      const isoString = '2026-07-16T10:30:00Z';
      const result = formatDateTime(isoString);
      // Result should contain year, abbreviated month, day, hour, minute
      expect(result).toMatch(/2026|Jul|16|10:30/);
    });

    it('handles different time zones', () => {
      const isoString = '2026-01-01T00:00:00Z';
      const result = formatDateTime(isoString);
      expect(result).toBeDefined();
      expect(result).not.toBe('—');
    });
  });

  describe('formatRelativeToNow', () => {
    it('returns dash for null or undefined', () => {
      expect(formatRelativeToNow(null)).toBe('—');
      expect(formatRelativeToNow(undefined)).toBe('—');
    });

    it('returns "just now" for current time', () => {
      const now = new Date().toISOString();
      const result = formatRelativeToNow(now);
      expect(result).toBe('just now');
    });

    it('formats minutes ago correctly', () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const result = formatRelativeToNow(fiveMinutesAgo);
      expect(result).toMatch(/\d+m ago/);
    });

    it('formats minutes from now correctly', () => {
      const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      const result = formatRelativeToNow(fiveMinutesFromNow);
      expect(result).toMatch(/\d+m from now/);
    });

    it('formats hours ago correctly', () => {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
      const result = formatRelativeToNow(twoHoursAgo);
      expect(result).toMatch(/\d+h ago/);
    });

    it('formats hours from now correctly', () => {
      const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
      const result = formatRelativeToNow(twoHoursFromNow);
      expect(result).toMatch(/\d+h from now/);
    });

    it('formats days ago correctly', () => {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      const result = formatRelativeToNow(threeDaysAgo);
      expect(result).toMatch(/\d+d ago/);
    });

    it('formats days from now correctly', () => {
      const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      const result = formatRelativeToNow(threeDaysFromNow);
      expect(result).toMatch(/\d+d from now/);
    });
  });

  describe('localInputToIso', () => {
    it('returns null for null or undefined', () => {
      expect(localInputToIso(null)).toBeNull();
      expect(localInputToIso(undefined)).toBeNull();
    });

    it('returns null for empty string', () => {
      expect(localInputToIso('')).toBeNull();
    });

    it('converts datetime-local format to ISO string', () => {
      const localValue = '2026-07-16T10:30';
      const result = localInputToIso(localValue);
      expect(result).toBeDefined();
      expect(result).toContain('T');
      expect(result).toContain('Z');
    });

    it('preserves date and time values', () => {
      const localValue = '2026-07-16T10:30';
      const result = localInputToIso(localValue);
      // Result should be an ISO string
      const date = new Date(result);
      expect(date.getFullYear()).toBe(2026);
      expect(date.getMonth()).toBe(6); // July is month 6
      expect(date.getDate()).toBe(16);
    });
  });

  describe('isoToLocalInput', () => {
    it('returns empty string for null or undefined', () => {
      expect(isoToLocalInput(null)).toBe('');
      expect(isoToLocalInput(undefined)).toBe('');
    });

    it('returns empty string for empty string', () => {
      expect(isoToLocalInput('')).toBe('');
    });

    it('converts ISO string to datetime-local format', () => {
      const isoString = '2026-07-16T10:30:00Z';
      const result = isoToLocalInput(isoString);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
    });

    it('formats date components with leading zeros', () => {
      const isoString = '2026-01-05T09:05:00Z';
      const result = isoToLocalInput(isoString);
      // Format should be YYYY-MM-DDTHH:MM with leading zeros
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      expect(result).toContain('01-05');
    });

    it('handles dates correctly', () => {
      const isoString = '2026-12-15T12:00:00Z';
      const result = isoToLocalInput(isoString);
      // Result should be in YYYY-MM-DDTHH:MM format
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
      expect(result).toContain('2026-12');
    });
  });

  describe('getCampaignStatus', () => {
    const now = new Date('2026-07-16T12:00:00Z');

    it('returns UPCOMING for future campaign', () => {
      const campaign = {
        startTime: '2026-08-01T00:00:00Z',
        endTime: '2026-08-31T23:59:59Z',
      };
      const result = getCampaignStatus(campaign, now);
      expect(result).toBe(CAMPAIGN_STATUS.UPCOMING);
    });

    it('returns EXPIRED for past campaign', () => {
      const campaign = {
        startTime: '2026-06-01T00:00:00Z',
        endTime: '2026-07-01T23:59:59Z',
      };
      const result = getCampaignStatus(campaign, now);
      expect(result).toBe(CAMPAIGN_STATUS.EXPIRED);
    });

    it('returns ACTIVE for current campaign', () => {
      const campaign = {
        startTime: '2026-07-01T00:00:00Z',
        endTime: '2026-08-01T23:59:59Z',
      };
      const result = getCampaignStatus(campaign, now);
      expect(result).toBe(CAMPAIGN_STATUS.ACTIVE);
    });

    it('uses current date when now parameter not provided', () => {
      const campaign = {
        startTime: new Date(Date.now() - 1000).toISOString(),
        endTime: new Date(Date.now() + 1000).toISOString(),
      };
      const result = getCampaignStatus(campaign);
      expect(result).toBe(CAMPAIGN_STATUS.ACTIVE);
    });

    it('handles campaign starting exactly at now', () => {
      const campaign = {
        startTime: now.toISOString(),
        endTime: '2026-08-01T23:59:59Z',
      };
      const result = getCampaignStatus(campaign, now);
      expect(result).toBe(CAMPAIGN_STATUS.ACTIVE);
    });

    it('handles campaign ending exactly at now', () => {
      const campaign = {
        startTime: '2026-06-01T00:00:00Z',
        endTime: now.toISOString(),
      };
      const result = getCampaignStatus(campaign, now);
      expect(result).toBe(CAMPAIGN_STATUS.ACTIVE);
    });
  });

  describe('resolveEffectiveCampaigns', () => {
    const now = new Date('2026-07-16T12:00:00Z');

    it('returns null campaigns when no active campaigns', () => {
      const campaigns = [
        {
          startTime: '2026-06-01T00:00:00Z',
          endTime: '2026-07-01T23:59:59Z',
        },
      ];
      const result = resolveEffectiveCampaigns(campaigns, now);
      expect(result.earnCampaign).toBeNull();
      expect(result.burnCampaign).toBeNull();
      expect(result.overlapping).toBe(false);
    });

    it('returns single active campaign for both earn and burn', () => {
      const campaigns = [
        {
          startTime: '2026-07-01T00:00:00Z',
          endTime: '2026-08-01T23:59:59Z',
          earnMultiplier: 1.5,
          burnDiscountMultiplier: 0.8,
        },
      ];
      const result = resolveEffectiveCampaigns(campaigns, now);
      expect(result.earnCampaign).toBeDefined();
      expect(result.burnCampaign).toBeDefined();
      expect(result.overlapping).toBe(false);
    });

    it('returns campaign with highest earn multiplier for earning', () => {
      const campaigns = [
        {
          startTime: '2026-07-01T00:00:00Z',
          endTime: '2026-08-01T23:59:59Z',
          earnMultiplier: 1.5,
          burnDiscountMultiplier: 0.8,
        },
        {
          startTime: '2026-07-01T00:00:00Z',
          endTime: '2026-08-01T23:59:59Z',
          earnMultiplier: 2.0,
          burnDiscountMultiplier: 0.7,
        },
      ];
      const result = resolveEffectiveCampaigns(campaigns, now);
      expect(result.earnCampaign.earnMultiplier).toBe(2.0);
    });

    it('returns campaign with lowest burn discount for redemption', () => {
      const campaigns = [
        {
          startTime: '2026-07-01T00:00:00Z',
          endTime: '2026-08-01T23:59:59Z',
          earnMultiplier: 1.5,
          burnDiscountMultiplier: 0.8,
        },
        {
          startTime: '2026-07-01T00:00:00Z',
          endTime: '2026-08-01T23:59:59Z',
          earnMultiplier: 1.2,
          burnDiscountMultiplier: 0.6,
        },
      ];
      const result = resolveEffectiveCampaigns(campaigns, now);
      expect(result.burnCampaign.burnDiscountMultiplier).toBe(0.6);
    });

    it('marks overlapping when multiple active campaigns', () => {
      const campaigns = [
        {
          startTime: '2026-07-01T00:00:00Z',
          endTime: '2026-08-01T23:59:59Z',
          earnMultiplier: 1.5,
          burnDiscountMultiplier: 0.8,
        },
        {
          startTime: '2026-07-01T00:00:00Z',
          endTime: '2026-08-01T23:59:59Z',
          earnMultiplier: 1.2,
          burnDiscountMultiplier: 0.7,
        },
      ];
      const result = resolveEffectiveCampaigns(campaigns, now);
      expect(result.overlapping).toBe(true);
    });

    it('filters out inactive campaigns', () => {
      const campaigns = [
        {
          startTime: '2026-06-01T00:00:00Z',
          endTime: '2026-07-01T23:59:59Z',
          earnMultiplier: 1.5,
          burnDiscountMultiplier: 0.8,
        },
        {
          startTime: '2026-07-01T00:00:00Z',
          endTime: '2026-08-01T23:59:59Z',
          earnMultiplier: 2.0,
          burnDiscountMultiplier: 0.7,
        },
      ];
      const result = resolveEffectiveCampaigns(campaigns, now);
      expect(result.earnCampaign.earnMultiplier).toBe(2.0);
    });

    it('handles empty campaigns array', () => {
      const result = resolveEffectiveCampaigns([], now);
      expect(result.earnCampaign).toBeNull();
      expect(result.burnCampaign).toBeNull();
      expect(result.overlapping).toBe(false);
    });

    it('can find different campaigns for earn vs burn', () => {
      const campaigns = [
        {
          startTime: '2026-07-01T00:00:00Z',
          endTime: '2026-08-01T23:59:59Z',
          earnMultiplier: 2.0,
          burnDiscountMultiplier: 0.9,
        },
        {
          startTime: '2026-07-01T00:00:00Z',
          endTime: '2026-08-01T23:59:59Z',
          earnMultiplier: 1.0,
          burnDiscountMultiplier: 0.5,
        },
      ];
      const result = resolveEffectiveCampaigns(campaigns, now);
      expect(result.earnCampaign.earnMultiplier).toBe(2.0);
      expect(result.burnCampaign.burnDiscountMultiplier).toBe(0.5);
      expect(result.earnCampaign).not.toBe(result.burnCampaign);
    });
  });
});
