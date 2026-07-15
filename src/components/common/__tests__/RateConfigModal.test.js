import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RateConfigModal from '../RateConfigModal.jsx';

describe('RateConfigModal', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();

  const mockEntity = {
    profileId: 'profile-1',
    profileName: 'Gold',
    config: {
      earnRateCentsPerPoint: 10,
      burnRatePointsPerCent: 5,
      pointsValidityDays: 365,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when entity is not provided', () => {
    const { container } = render(
      <RateConfigModal isOpen={true} entity={null} onClose={mockOnClose} onSave={mockOnSave} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders when entity and isOpen are provided', () => {
    render(
      <RateConfigModal
        isOpen={true}
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByText(/Configure rates/)).toBeInTheDocument();
  });

  it('displays entity name in title', () => {
    render(
      <RateConfigModal
        isOpen={true}
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByText('Configure rates — Gold')).toBeInTheDocument();
  });

  it('renders form inputs for earn rate, burn rate, and validity days', () => {
    render(
      <RateConfigModal
        isOpen={true}
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByLabelText(/Earn rate/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Burn rate/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Points validity/)).toBeInTheDocument();
  });

  it('populates form with entity config values', () => {
    render(
      <RateConfigModal
        isOpen={true}
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByLabelText(/Earn rate/)).toHaveValue(10);
    expect(screen.getByLabelText(/Burn rate/)).toHaveValue(5);
    expect(screen.getByLabelText(/Points validity/)).toHaveValue(365);
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <RateConfigModal
        isOpen={true}
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('validates that rates must be positive', async () => {
    const user = userEvent.setup();
    render(
      <RateConfigModal
        isOpen={true}
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const earnRateInput = screen.getByLabelText(/Earn rate/);
    await user.clear(earnRateInput);
    await user.type(earnRateInput, '-5');

    const submitButton = screen.getByText('Save rates');
    await user.click(submitButton);

    expect(screen.getByText('Rates must be positive integers when provided.')).toBeInTheDocument();
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('validates that validity days must not be negative', async () => {
    const user = userEvent.setup();
    render(
      <RateConfigModal
        isOpen={true}
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const validityInput = screen.getByLabelText(/Points validity/);
    await user.clear(validityInput);
    await user.type(validityInput, '-1');

    const submitButton = screen.getByText('Save rates');
    await user.click(submitButton);

    expect(screen.getByText('Points validity must not be negative.')).toBeInTheDocument();
  });

  it('handles partner entityType with partner subtitle', () => {
    const partnerEntity = { ...mockEntity, partnerId: 'partner-1', partnerName: 'Visa' };
    render(
      <RateConfigModal
        isOpen={true}
        entity={partnerEntity}
        entityType="partner"
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByText(/This rate replaces the wallet/)).toBeInTheDocument();
  });

  it('handles profile entityType with profile subtitle', () => {
    render(
      <RateConfigModal
        isOpen={true}
        entity={mockEntity}
        entityType="profile"
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByText(/Leave a field blank to fall back/)).toBeInTheDocument();
  });

  it('allows empty values for optional fields', async () => {
    const user = userEvent.setup();
    const onSaveMock = jest.fn(() => Promise.resolve());

    render(
      <RateConfigModal
        isOpen={true}
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={onSaveMock}
      />
    );

    const earnRateInput = screen.getByLabelText(/Earn rate/);
    await user.clear(earnRateInput);

    const submitButton = screen.getByText('Save rates');
    await user.click(submitButton);

    expect(onSaveMock).toHaveBeenCalled();
  });

  it('displays custom subtitle when provided', () => {
    render(
      <RateConfigModal
        isOpen={true}
        entity={mockEntity}
        onClose={mockOnClose}
        onSave={mockOnSave}
        subtitle="Custom subtitle text"
      />
    );
    expect(screen.getByText('Custom subtitle text')).toBeInTheDocument();
  });
});
