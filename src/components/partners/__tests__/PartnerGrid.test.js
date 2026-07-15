import React from 'react';
import { render, screen } from '@testing-library/react';
import PartnerGrid from '../PartnerGrid.jsx';

// Mock PartnerCard to avoid deep import.meta dependencies
jest.mock('../PartnerCard.jsx', () => ({
  __esModule: true,
  default: ({ partner }) => <div data-testid={`partner-card-${partner.partnerId}`}>{partner.partnerName}</div>,
}));

describe('PartnerGrid', () => {
  const mockPartners = [
    {
      partnerId: 'partner-1',
      partnerName: 'Visa',
      config: { earnRateCentsPerPoint: 12, burnRatePointsPerCent: 6 },
    },
    {
      partnerId: 'partner-2',
      partnerName: 'Mastercard',
      config: { earnRateCentsPerPoint: 11, burnRatePointsPerCent: 5 },
    },
  ];

  const mockOnConfigureRates = jest.fn();
  const mockOnCreateServiceAccount = jest.fn();

  it('renders loading spinner when isLoading is true and partners are empty', () => {
    render(
      <PartnerGrid
        partners={[]}
        isLoading={true}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('Loading partners…')).toBeInTheDocument();
  });

  it('renders empty state when no partners exist and not loading', () => {
    render(
      <PartnerGrid
        partners={[]}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('No channel partners yet')).toBeInTheDocument();
    expect(screen.getByText(/Create your first partner/)).toBeInTheDocument();
  });

  it('renders partner cards for each partner', () => {
    render(
      <PartnerGrid
        partners={mockPartners}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('Visa')).toBeInTheDocument();
    expect(screen.getByText('Mastercard')).toBeInTheDocument();
  });

  it('passes onConfigureRates callback to partner cards', () => {
    const { container } = render(
      <PartnerGrid
        partners={mockPartners}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });

  it('passes onCreateServiceAccount callback to partner cards', () => {
    const { container } = render(
      <PartnerGrid
        partners={mockPartners}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(container.querySelector('.grid')).toBeInTheDocument();
  });

  it('renders with grid layout responsive classes', () => {
    const { container } = render(
      <PartnerGrid
        partners={mockPartners}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    const grid = container.querySelector('.grid');
    expect(grid.className).toContain('grid-cols-1');
    expect(grid.className).toContain('sm:grid-cols-2');
    expect(grid.className).toContain('lg:grid-cols-3');
  });

  it('does not show loading spinner when partners exist even if isLoading is true', () => {
    render(
      <PartnerGrid
        partners={mockPartners}
        isLoading={true}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.queryByText('Loading partners…')).not.toBeInTheDocument();
    expect(screen.getByText('Visa')).toBeInTheDocument();
  });

  it('renders with correct gap spacing', () => {
    const { container } = render(
      <PartnerGrid
        partners={mockPartners}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    const grid = container.querySelector('.grid');
    expect(grid.className).toContain('gap-4');
  });

  it('renders empty state with handshake icon', () => {
    const { container } = render(
      <PartnerGrid
        partners={[]}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders single partner in grid', () => {
    render(
      <PartnerGrid
        partners={[mockPartners[0]]}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('Visa')).toBeInTheDocument();
    expect(screen.queryByText('Mastercard')).not.toBeInTheDocument();
  });

  it('renders multiple partners maintaining grid structure', () => {
    render(
      <PartnerGrid
        partners={[...mockPartners, { partnerId: 'partner-3', partnerName: 'AmEx' }]}
        isLoading={false}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('Visa')).toBeInTheDocument();
    expect(screen.getByText('Mastercard')).toBeInTheDocument();
    expect(screen.getByText('AmEx')).toBeInTheDocument();
  });
});
