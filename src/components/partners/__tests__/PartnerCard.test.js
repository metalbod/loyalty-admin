import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PartnerCard from '../PartnerCard.jsx';

describe('PartnerCard', () => {
  const mockOnConfigureRates = jest.fn();
  const mockOnCreateServiceAccount = jest.fn();

  const mockPartner = {
    partnerId: 'partner-1',
    partnerName: 'Visa',
    description: 'Credit card partner',
    config: {
      earnRateCentsPerPoint: 12,
      burnRatePointsPerCent: 6,
      pointsValidityDays: 730,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders partner name', () => {
    render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('Visa')).toBeInTheDocument();
  });

  it('renders partner description', () => {
    render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('Credit card partner')).toBeInTheDocument();
  });

  it('renders default description when not provided', () => {
    const partnerWithoutDesc = { ...mockPartner, description: null };
    render(
      <PartnerCard
        partner={partnerWithoutDesc}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('No description provided.')).toBeInTheDocument();
  });

  it('renders earn rate override', () => {
    render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('Earn rate')).toBeInTheDocument();
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });

  it('renders burn rate override', () => {
    render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('Burn rate')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('renders points validity', () => {
    render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('Points validity')).toBeInTheDocument();
    expect(screen.getByText('730 days')).toBeInTheDocument();
  });

  it('shows override badge for rate overrides', () => {
    render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    const overrideBadges = screen.getAllByText('Override');
    expect(overrideBadges.length).toBeGreaterThan(0);
  });

  it('shows global fallback when no rate overrides', () => {
    const partnerNoOverrides = {
      ...mockPartner,
      config: {
        earnRateCentsPerPoint: null,
        burnRatePointsPerCent: null,
        pointsValidityDays: null,
      },
    };
    render(
      <PartnerCard
        partner={partnerNoOverrides}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    const fallbackBadges = screen.getAllByText('Global fallback');
    expect(fallbackBadges.length).toBeGreaterThan(0);
  });

  it('renders configure rates button', () => {
    render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('Configure rates')).toBeInTheDocument();
  });

  it('renders service account button', () => {
    render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('Service account')).toBeInTheDocument();
  });

  it('calls onConfigureRates when configure rates button clicked', async () => {
    const user = userEvent.setup();
    render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    const button = screen.getByText('Configure rates');
    await user.click(button);
    expect(mockOnConfigureRates).toHaveBeenCalledWith(mockPartner);
  });

  it('calls onCreateServiceAccount when service account button clicked', async () => {
    const user = userEvent.setup();
    render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    const button = screen.getByText('Service account');
    await user.click(button);
    expect(mockOnCreateServiceAccount).toHaveBeenCalledWith(mockPartner);
  });

  it('handles zero points validity days (never expires)', () => {
    const partnerNeverExpires = {
      ...mockPartner,
      config: {
        ...mockPartner.config,
        pointsValidityDays: 0,
      },
    };
    render(
      <PartnerCard
        partner={partnerNeverExpires}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText('Never expires')).toBeInTheDocument();
  });

  it('renders with indigo color scheme', () => {
    const { container } = render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    const card = container.querySelector('[class*="ring-indigo"]');
    expect(card).toBeInTheDocument();
  });

  it('renders indigo color dot indicator', () => {
    const { container } = render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    const dot = container.querySelector('[class*="bg-indigo"]');
    expect(dot).toBeInTheDocument();
  });

  it('renders partner name with indigo text color', () => {
    const { container } = render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    const heading = screen.getByText('Visa');
    expect(heading.className).toContain('text-indigo-600');
  });

  it('renders rate suffixes', () => {
    render(
      <PartnerCard
        partner={mockPartner}
        onConfigureRates={mockOnConfigureRates}
        onCreateServiceAccount={mockOnCreateServiceAccount}
      />,
    );
    expect(screen.getByText(/cents \/ point/)).toBeInTheDocument();
    expect(screen.getByText(/points \/ cent/)).toBeInTheDocument();
  });
});
