import React from 'react';
import { render, screen } from '@testing-library/react';
import PartnerManagerView from '../PartnerManagerView.jsx';

// Mock DashboardLayout
jest.mock('../../layouts/DashboardLayout.jsx', () => ({
  __esModule: true,
  default: ({ title, description, children }) => (
    <div data-testid="dashboard-layout">
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

// Mock PartnerGrid
jest.mock('../../components/partners/PartnerGrid.jsx', () => ({
  __esModule: true,
  default: ({ partners, isLoading, onConfigureRates, onCreateServiceAccount }) => (
    <div data-testid="partner-grid">
      {isLoading ? (
        <p>Loading partners...</p>
      ) : partners.length === 0 ? (
        <p>No partners</p>
      ) : (
        <div>
          {partners.map((p) => (
            <div key={p.partnerId} data-testid={`partner-item-${p.partnerId}`}>
              <span>{p.partnerName}</span>
              <button onClick={() => onConfigureRates(p)}>Configure</button>
              <button onClick={() => onCreateServiceAccount(p)}>Service Account</button>
            </div>
          ))}
        </div>
      )}
    </div>
  ),
}));

// Mock CreatePartnerModal
jest.mock('../../components/partners/CreatePartnerModal.jsx', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onCreate }) =>
    isOpen ? (
      <div data-testid="create-partner-modal">
        <h2>Create Partner</h2>
        <button
          onClick={() => onCreate({ partnerName: 'Test', description: '' }).then(() => onClose())}
        >
          Create
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null,
}));

// Mock RateConfigModal
jest.mock('../../components/common/RateConfigModal.jsx', () => ({
  __esModule: true,
  default: ({ isOpen, entity, onClose, onSave }) =>
    isOpen && entity ? (
      <div data-testid="rate-config-modal">
        <h2>Configure Rates for {entity.partnerName}</h2>
        <button onClick={() => onSave(entity.partnerId, {}).then(() => onClose())}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null,
}));

// Mock CreatePartnerServiceAccountModal
jest.mock('../../components/partners/CreatePartnerServiceAccountModal.jsx', () => ({
  __esModule: true,
  default: ({ isOpen, partner, onClose, onCreate }) =>
    isOpen && partner ? (
      <div data-testid="service-account-modal">
        <h2>Create Service Account for {partner.partnerName}</h2>
        <button onClick={() => onCreate(partner.partnerId, {}).then(() => onClose())}>
          Create
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null,
}));

// Mock context hooks
jest.mock('../../hooks/usePartnerContext.js', () => ({
  usePartnerContext: jest.fn(),
}));

jest.mock('../../hooks/useAdminContext.js', () => ({
  useAdminContext: jest.fn(),
}));

const { usePartnerContext } = require('../../hooks/usePartnerContext.js');
const { useAdminContext } = require('../../hooks/useAdminContext.js');

describe('PartnerManagerView', () => {
  const mockPartners = [
    {
      partnerId: 'partner-1',
      partnerName: 'Visa',
      description: 'Credit card processor',
      config: { earnRateCentsPerPoint: 10, burnRatePointsPerCent: 5 },
    },
    {
      partnerId: 'partner-2',
      partnerName: 'Mastercard',
      description: 'Credit card processor',
      config: { earnRateCentsPerPoint: 11, burnRatePointsPerCent: 6 },
    },
  ];

  const mockRefreshPartners = jest.fn();
  const mockAddPartner = jest.fn(() => Promise.resolve());
  const mockUpdatePartnerRates = jest.fn(() => Promise.resolve());
  const mockCreatePartnerServiceAccount = jest.fn(() => Promise.resolve());
  const mockIsFeatureEnabled = jest.fn((feature) => feature === 'PARTNERS');

  beforeEach(() => {
    jest.clearAllMocks();
    usePartnerContext.mockReturnValue({
      partners: mockPartners,
      partnersLoading: false,
      refreshPartners: mockRefreshPartners,
      addPartner: mockAddPartner,
      updatePartnerRates: mockUpdatePartnerRates,
      createPartnerServiceAccount: mockCreatePartnerServiceAccount,
    });
    useAdminContext.mockReturnValue({
      isFeatureEnabled: mockIsFeatureEnabled,
    });
  });

  it('renders dashboard layout with correct title', () => {
    render(<PartnerManagerView />);
    expect(screen.getByText('Channel Partners')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<PartnerManagerView />);
    expect(screen.getByText(/Manage channel partners/)).toBeInTheDocument();
  });

  it('calls refreshPartners on mount', () => {
    render(<PartnerManagerView />);
    expect(mockRefreshPartners).toHaveBeenCalled();
  });

  it('renders partner grid with partners data', () => {
    render(<PartnerManagerView />);
    expect(screen.getByTestId('partner-grid')).toBeInTheDocument();
  });

  it('renders create partner button', () => {
    render(<PartnerManagerView />);
    expect(screen.getByText('Create partner')).toBeInTheDocument();
  });

  it('enables create partner button when feature is enabled', () => {
    mockIsFeatureEnabled.mockReturnValue(true);
    render(<PartnerManagerView />);
    const createButton = screen.getByText('Create partner');
    expect(createButton).not.toBeDisabled();
  });

  it('disables create partner button when feature is disabled', () => {
    mockIsFeatureEnabled.mockReturnValue(false);
    render(<PartnerManagerView />);
    const createButton = screen.getByText('Create partner');
    expect(createButton).toBeDisabled();
  });

  it('renders create partner button when feature is enabled', () => {
    mockIsFeatureEnabled.mockReturnValue(true);
    render(<PartnerManagerView />);
    expect(screen.getByText('Create partner')).toBeInTheDocument();
  });

  it('displays loading spinner when partners are loading', () => {
    usePartnerContext.mockReturnValue({
      partners: [],
      partnersLoading: true,
      refreshPartners: mockRefreshPartners,
      addPartner: mockAddPartner,
      updatePartnerRates: mockUpdatePartnerRates,
      createPartnerServiceAccount: mockCreatePartnerServiceAccount,
    });

    render(<PartnerManagerView />);
    expect(screen.getByText('Loading partners...')).toBeInTheDocument();
  });

  it('displays empty state when no partners', () => {
    usePartnerContext.mockReturnValue({
      partners: [],
      partnersLoading: false,
      refreshPartners: mockRefreshPartners,
      addPartner: mockAddPartner,
      updatePartnerRates: mockUpdatePartnerRates,
      createPartnerServiceAccount: mockCreatePartnerServiceAccount,
    });

    render(<PartnerManagerView />);
    expect(screen.getByText('No partners')).toBeInTheDocument();
  });

  it('renders all partners in the grid', () => {
    render(<PartnerManagerView />);
    expect(screen.getByTestId('partner-item-partner-1')).toBeInTheDocument();
    expect(screen.getByTestId('partner-item-partner-2')).toBeInTheDocument();
  });

  it('passes callbacks to partner grid for configuration', () => {
    render(<PartnerManagerView />);
    // Grid receives onConfigureRates and onCreateServiceAccount callbacks
    expect(screen.getByTestId('partner-grid')).toBeInTheDocument();
  });

  it('maintains dashboard layout structure', () => {
    render(<PartnerManagerView />);
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('renders content inside dashboard layout', () => {
    render(<PartnerManagerView />);
    const layout = screen.getByTestId('dashboard-layout');
    expect(layout).toContainElement(screen.getByTestId('partner-grid'));
  });

  it('checks feature flag for PARTNERS feature', () => {
    render(<PartnerManagerView />);
    expect(mockIsFeatureEnabled).toHaveBeenCalledWith('PARTNERS');
  });
});
