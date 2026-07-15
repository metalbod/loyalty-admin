import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileCard from '../ProfileCard.jsx';

// Mock TierRulesSection to avoid import.meta issues
jest.mock('../TierRulesSection.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="tier-rules-section">Tier Rules</div>,
}));

describe('ProfileCard', () => {
  const mockOnConfigureRates = jest.fn();

  const mockProfile = {
    profileId: 'profile-1',
    profileName: 'Gold',
    description: 'Premium tier members',
    memberCount: 245,
    config: {
      earnRateCentsPerPoint: 10,
      burnRatePointsPerCent: 5,
      pointsValidityDays: 365,
    },
  };

  const mockProfiles = [
    { profileId: 'profile-1', profileName: 'Gold' },
    { profileId: 'profile-2', profileName: 'Silver' },
  ];

  const mockPartners = [
    { partnerId: 'partner-1', partnerName: 'Visa' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders profile name', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    expect(screen.getByText('Gold')).toBeInTheDocument();
  });

  it('renders member count', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    expect(screen.getByText('245')).toBeInTheDocument();
  });

  it('renders profile description', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    expect(screen.getByText('Premium tier members')).toBeInTheDocument();
  });

  it('renders default description when not provided', () => {
    const profileWithoutDesc = { ...mockProfile, description: null };
    render(
      <ProfileCard
        profile={profileWithoutDesc}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    expect(screen.getByText('No description provided.')).toBeInTheDocument();
  });

  it('renders earn rate', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    expect(screen.getByText('Earn rate')).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it('renders burn rate', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    expect(screen.getByText('Burn rate')).toBeInTheDocument();
    expect(screen.getAllByText('5')[0]).toBeInTheDocument();
  });

  it('renders points validity', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    expect(screen.getByText('Points validity')).toBeInTheDocument();
    expect(screen.getByText('365 days')).toBeInTheDocument();
  });

  it('shows override badge when rate override exists', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    const overrideBadges = screen.getAllByText('Override');
    expect(overrideBadges.length).toBeGreaterThan(0);
  });

  it('shows global fallback badge when no override', () => {
    const profileWithoutOverrides = {
      ...mockProfile,
      config: {
        earnRateCentsPerPoint: null,
        burnRatePointsPerCent: null,
        pointsValidityDays: null,
      },
    };
    render(
      <ProfileCard
        profile={profileWithoutOverrides}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    const fallbackBadges = screen.getAllByText('Global fallback');
    expect(fallbackBadges.length).toBeGreaterThan(0);
  });

  it('renders configure rates button', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    expect(screen.getByText('Configure rates')).toBeInTheDocument();
  });

  it('calls onConfigureRates when button clicked', async () => {
    const user = userEvent.setup();
    render(
      <ProfileCard
        profile={mockProfile}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    const button = screen.getByText('Configure rates');
    await user.click(button);
    expect(mockOnConfigureRates).toHaveBeenCalledWith(mockProfile);
  });

  it('renders tier rules section', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    expect(screen.getByTestId('tier-rules-section')).toBeInTheDocument();
  });

  it('handles zero points validity days', () => {
    const profileNeverExpires = {
      ...mockProfile,
      config: {
        ...mockProfile.config,
        pointsValidityDays: 0,
      },
    };
    render(
      <ProfileCard
        profile={profileNeverExpires}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    expect(screen.getByText('Never expires')).toBeInTheDocument();
  });

  it('renders with accent styling based on profile name', () => {
    const { container } = render(
      <ProfileCard
        profile={mockProfile}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    const card = container.querySelector('[class*="ring-"]');
    expect(card).toBeInTheDocument();
  });

  it('renders member count icon', () => {
    const { container } = render(
      <ProfileCard
        profile={mockProfile}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders rate suffix correctly', () => {
    render(
      <ProfileCard
        profile={mockProfile}
        profiles={mockProfiles}
        partners={mockPartners}
        onConfigureRates={mockOnConfigureRates}
      />,
    );
    expect(screen.getByText(/cents \/ point/)).toBeInTheDocument();
    expect(screen.getByText(/points \/ cent/)).toBeInTheDocument();
  });
});
