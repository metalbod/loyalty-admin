import React from 'react';
import { render, screen } from '@testing-library/react';
import CampaignCard from '../CampaignCard.jsx';

jest.mock('../../common/Card.jsx', () => ({
  __esModule: true,
  default: ({ children, accent, className }) => (
    <div data-testid="card" data-accent={accent} className={className}>
      {children}
    </div>
  ),
}));

jest.mock('../../common/Badge.jsx', () => ({
  __esModule: true,
  default: ({ children, variant, className }) => (
    <div data-testid={`badge-${variant}`} className={className}>
      {children}
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  CalendarClock: () => null,
  Clock: () => null,
  TrendingDown: () => null,
  TrendingUp: () => null,
}));

jest.mock('../../../utils/dateUtils.js', () => ({
  formatDateTime: (date) => '2024-07-16 12:00 PM',
  formatRelativeToNow: (date) => 'in 5 days',
  getCampaignStatus: jest.fn(() => 'ACTIVE'),
}));

jest.mock('../../../utils/formatters.js', () => ({
  formatMultiplier: (val) => `${val}x`,
}));

jest.mock('../../../constants', () => ({
  CAMPAIGN_STATUS: {
    ACTIVE: 'ACTIVE',
    UPCOMING: 'UPCOMING',
    EXPIRED: 'EXPIRED',
  },
  CAMPAIGN_STATUS_STYLES: {
    ACTIVE: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    UPCOMING: 'bg-amber-50 border-amber-200 text-amber-700',
    EXPIRED: 'bg-slate-50 border-slate-200 text-slate-700',
  },
}));

const { getCampaignStatus } = require('../../../utils/dateUtils.js');

describe('CampaignCard', () => {
  const mockCampaign = {
    campaignId: 'camp-1',
    name: 'Summer Sale 2024',
    startTime: '2024-07-01T00:00:00Z',
    endTime: '2024-07-31T23:59:59Z',
    earnMultiplier: 2.0,
    burnDiscountMultiplier: 0.5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    getCampaignStatus.mockReturnValue('ACTIVE');
  });

  it('renders campaign card', () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('displays campaign name', () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByText('Summer Sale 2024')).toBeInTheDocument();
  });

  it('displays campaign status', () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
  });

  it('displays formatted start and end times', () => {
    const { container } = render(<CampaignCard campaign={mockCampaign} />);
    const text = container.textContent;
    expect(text).toContain('2024-07-16 12:00 PM');
  });

  it('displays relative time text', () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByText(/in 5 days/)).toBeInTheDocument();
  });

  it('displays earn and burn labels', () => {
    const { container } = render(<CampaignCard campaign={mockCampaign} />);
    const text = container.textContent;
    expect(text).toContain('Earn');
    expect(text).toContain('Burn discount');
  });

  it('renders card container', () => {
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('applies accent when campaign is effective for earn', () => {
    render(<CampaignCard campaign={mockCampaign} isEffectiveEarn={true} />);
    const card = screen.getByTestId('card');
    expect(card.getAttribute('data-accent')).toBe('true');
  });

  it('applies accent when campaign is effective for burn', () => {
    render(<CampaignCard campaign={mockCampaign} isEffectiveBurn={true} />);
    const card = screen.getByTestId('card');
    expect(card.getAttribute('data-accent')).toBe('true');
  });

  it('displays effective now badge for earn', () => {
    render(<CampaignCard campaign={mockCampaign} isEffectiveEarn={true} />);
    expect(screen.getByText('Effective now')).toBeInTheDocument();
  });

  it('displays effective now badge for burn', () => {
    render(<CampaignCard campaign={mockCampaign} isEffectiveBurn={true} />);
    expect(screen.getAllByText('Effective now').length).toBeGreaterThan(0);
  });

  it('displays two effective badges when both flags are true', () => {
    render(<CampaignCard campaign={mockCampaign} isEffectiveEarn={true} isEffectiveBurn={true} />);
    const badges = screen.getAllByText('Effective now');
    expect(badges.length).toBe(2);
  });

  it('hides effectiveness badges when flags are false', () => {
    render(<CampaignCard campaign={mockCampaign} isEffectiveEarn={false} isEffectiveBurn={false} />);
    expect(screen.queryByText('Effective now')).not.toBeInTheDocument();
  });

  it('handles different status types', () => {
    getCampaignStatus.mockReturnValue('UPCOMING');
    render(<CampaignCard campaign={mockCampaign} />);
    expect(screen.getByText('UPCOMING')).toBeInTheDocument();
  });
});
