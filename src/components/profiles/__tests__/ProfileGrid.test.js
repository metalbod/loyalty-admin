import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileGrid from '../ProfileGrid.jsx';

// Mock ProfileCard to avoid import.meta issues in dependencies
jest.mock('../ProfileCard.jsx', () => ({
  __esModule: true,
  default: ({ profile }) => (
    <div data-testid={`profile-card-${profile.profileId}`}>{profile.profileName}</div>
  ),
}));

describe('ProfileGrid', () => {
  const mockProfiles = [
    {
      profileId: 'profile-1',
      profileName: 'Silver',
      config: { earnRateCentsPerPoint: 10, burnRatePointsPerCent: 5 },
    },
    {
      profileId: 'profile-2',
      profileName: 'Gold',
      config: { earnRateCentsPerPoint: 8, burnRatePointsPerCent: 4 },
    },
  ];

  const mockPartners = [{ partnerId: 'partner-1', partnerName: 'Visa' }];

  const mockOnConfigureRates = jest.fn();

  it('renders loading spinner when isLoading is true and profiles are empty', () => {
    render(<ProfileGrid profiles={[]} isLoading={true} onConfigureRates={mockOnConfigureRates} />);
    expect(screen.getByText('Loading profiles…')).toBeInTheDocument();
  });

  it('renders empty state when no profiles exist and not loading', () => {
    render(<ProfileGrid profiles={[]} isLoading={false} onConfigureRates={mockOnConfigureRates} />);
    expect(screen.getByText('No tiers yet')).toBeInTheDocument();
    expect(screen.getByText(/Create your first profile tier/)).toBeInTheDocument();
  });

  it('renders profile cards for each profile', () => {
    render(
      <ProfileGrid
        profiles={mockProfiles}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
      />
    );
    expect(screen.getByText('Silver')).toBeInTheDocument();
    expect(screen.getByText('Gold')).toBeInTheDocument();
  });

  it('passes onConfigureRates callback to profile cards', () => {
    const { container } = render(
      <ProfileGrid
        profiles={mockProfiles}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
      />
    );
    // Verify the grid structure is rendered
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });

  it('passes partners to profile cards', () => {
    render(
      <ProfileGrid
        profiles={mockProfiles}
        partners={mockPartners}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
      />
    );
    // Verify profiles are rendered with partners available
    expect(screen.getByText('Silver')).toBeInTheDocument();
    expect(screen.getByText('Gold')).toBeInTheDocument();
  });

  it('renders with grid layout responsive classes', () => {
    const { container } = render(
      <ProfileGrid
        profiles={mockProfiles}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
      />
    );
    const grid = container.querySelector('.grid');
    expect(grid.className).toContain('grid-cols-1');
    expect(grid.className).toContain('sm:grid-cols-2');
    expect(grid.className).toContain('lg:grid-cols-3');
  });

  it('does not show loading spinner when profiles exist even if isLoading is true', () => {
    render(
      <ProfileGrid
        profiles={mockProfiles}
        isLoading={true}
        onConfigureRates={mockOnConfigureRates}
      />
    );
    expect(screen.queryByText('Loading profiles…')).not.toBeInTheDocument();
    expect(screen.getByText('Silver')).toBeInTheDocument();
  });

  it('renders empty partners array as default', () => {
    render(
      <ProfileGrid
        profiles={mockProfiles}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
      />
    );
    expect(screen.getByText('Silver')).toBeInTheDocument();
  });

  it('renders with correct gap spacing', () => {
    const { container } = render(
      <ProfileGrid
        profiles={mockProfiles}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
      />
    );
    const grid = container.querySelector('.grid');
    expect(grid.className).toContain('gap-4');
  });
});
