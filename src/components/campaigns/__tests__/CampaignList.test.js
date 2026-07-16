import React from 'react';
import { render, screen } from '@testing-library/react';
import CampaignList from '../CampaignList.jsx';

jest.mock('../CampaignCard.jsx', () => ({
  __esModule: true,
  default: ({ campaign, isEffectiveEarn, isEffectiveBurn }) => (
    <div
      data-testid={`campaign-card-${campaign.campaignId}`}
      data-effective-earn={isEffectiveEarn}
      data-effective-burn={isEffectiveBurn}
    >
      {campaign.name}
    </div>
  ),
}));

jest.mock('../../common/Card.jsx', () => ({
  __esModule: true,
  default: ({ children, accent, className }) => (
    <div data-testid="card" data-accent={accent} className={className}>
      {children}
    </div>
  ),
}));

jest.mock('../../common/LoadingSpinner.jsx', () => ({
  __esModule: true,
  default: ({ label }) => <div data-testid="loading-spinner">{label}</div>,
}));

jest.mock('../../common/EmptyState.jsx', () => ({
  __esModule: true,
  default: ({ title, description, icon: Icon }) => (
    <div data-testid="empty-state">
      <p>{title}</p>
      <p>{description}</p>
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  CalendarX2: () => null,
  Layers3: () => null,
}));

jest.mock('../../../utils/formatters.js', () => ({
  formatMultiplier: (val) => `${val}x`,
}));

jest.mock('../../../utils/dateUtils.js', () => ({
  resolveEffectiveCampaigns: jest.fn((campaigns) => ({
    earnCampaign: campaigns[0],
    burnCampaign: campaigns[0],
    overlapping: false,
  })),
}));

const { resolveEffectiveCampaigns } = require('../../../utils/dateUtils.js');

describe('CampaignList', () => {
  const mockCampaigns = [
    {
      campaignId: 'camp-1',
      name: 'Summer Sale',
      startTime: '2024-07-01T00:00:00Z',
      endTime: '2024-07-31T23:59:59Z',
      earnMultiplier: 2.0,
      burnDiscountMultiplier: 0.5,
    },
    {
      campaignId: 'camp-2',
      name: 'Back to School',
      startTime: '2024-08-01T00:00:00Z',
      endTime: '2024-08-31T23:59:59Z',
      earnMultiplier: 1.5,
      burnDiscountMultiplier: 0.7,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    resolveEffectiveCampaigns.mockReturnValue({
      earnCampaign: mockCampaigns[0],
      burnCampaign: mockCampaigns[0],
      overlapping: false,
    });
  });

  it('renders loading spinner when loading with no campaigns', () => {
    render(<CampaignList campaigns={[]} isLoading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders empty state when no campaigns exist', () => {
    render(<CampaignList campaigns={[]} isLoading={false} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('renders campaign cards for each campaign', () => {
    render(<CampaignList campaigns={mockCampaigns} />);
    expect(screen.getByTestId('campaign-card-camp-1')).toBeInTheDocument();
    expect(screen.getByTestId('campaign-card-camp-2')).toBeInTheDocument();
  });

  it('displays campaign names in cards', () => {
    render(<CampaignList campaigns={mockCampaigns} />);
    expect(screen.getByText('Summer Sale')).toBeInTheDocument();
    expect(screen.getByText('Back to School')).toBeInTheDocument();
  });

  it('displays effective rates section when campaigns exist', () => {
    render(<CampaignList campaigns={mockCampaigns} />);
    expect(screen.getByText(/Effective rates/i)).toBeInTheDocument();
  });

  it('marks effective earn campaign', () => {
    render(<CampaignList campaigns={mockCampaigns} />);
    const effectiveCard = screen.getByTestId('campaign-card-camp-1');
    expect(effectiveCard.getAttribute('data-effective-earn')).toBe('true');
  });

  it('does not show effective rates when no campaigns are effective', () => {
    resolveEffectiveCampaigns.mockReturnValue({
      earnCampaign: null,
      burnCampaign: null,
      overlapping: false,
    });
    render(<CampaignList campaigns={mockCampaigns} />);
    expect(screen.queryByText(/Effective rates/i)).not.toBeInTheDocument();
  });

  it('shows reference to campaign driving rates', () => {
    resolveEffectiveCampaigns.mockReturnValue({
      earnCampaign: mockCampaigns[0],
      burnCampaign: mockCampaigns[0],
      overlapping: true,
    });
    render(<CampaignList campaigns={mockCampaigns} />);
    const content = screen.getByTestId('card').textContent;
    expect(content).toMatch(/Summer Sale|Driven by/i);
  });

  it('shows different campaigns when they drive different rates', () => {
    resolveEffectiveCampaigns.mockReturnValue({
      earnCampaign: mockCampaigns[0],
      burnCampaign: mockCampaigns[1],
      overlapping: true,
    });
    render(<CampaignList campaigns={mockCampaigns} />);
    const content = screen.getByTestId('card').textContent;
    expect(content).toMatch(/Summer Sale|Back to School/i);
  });

  it('renders campaign grid', () => {
    const { container } = render(<CampaignList campaigns={mockCampaigns} />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('handles single campaign', () => {
    render(<CampaignList campaigns={[mockCampaigns[0]]} />);
    expect(screen.getByTestId('campaign-card-camp-1')).toBeInTheDocument();
    expect(screen.queryByTestId('campaign-card-camp-2')).not.toBeInTheDocument();
  });

  it('applies accent styling to effective rates card', () => {
    render(<CampaignList campaigns={mockCampaigns} />);
    const cards = screen.getAllByTestId('card');
    const accentCard = cards.find(c => c.getAttribute('data-accent') === 'true');
    expect(accentCard).toBeDefined();
  });
});
