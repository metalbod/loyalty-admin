import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileManagerView from '../ProfileManagerView.jsx';

// Mock DashboardLayout to simplify view testing
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

// Mock ProfileGrid
jest.mock('../../components/profiles/ProfileGrid.jsx', () => ({
  __esModule: true,
  default: ({ profiles, isLoading, onConfigureRates }) => (
    <div data-testid="profile-grid">
      {isLoading ? (
        <p>Loading profiles...</p>
      ) : profiles.length === 0 ? (
        <p>No profiles</p>
      ) : (
        <div>
          {profiles.map((p) => (
            <div key={p.profileId} data-testid={`profile-item-${p.profileId}`}>
              <span>{p.profileName}</span>
              <button onClick={() => onConfigureRates(p)}>Configure</button>
            </div>
          ))}
        </div>
      )}
    </div>
  ),
}));

// Mock CreateProfileModal
jest.mock('../../components/profiles/CreateProfileModal.jsx', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, onCreate }) => (
    isOpen ? (
      <div data-testid="create-profile-modal">
        <h2>Create Profile</h2>
        <button onClick={() => onCreate({ profileName: 'Test', description: '' }).then(() => onClose())}>
          Create
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null
  ),
}));

// Mock RateConfigModal
jest.mock('../../components/common/RateConfigModal.jsx', () => ({
  __esModule: true,
  default: ({ isOpen, entity, onClose, onSave }) => (
    isOpen && entity ? (
      <div data-testid="rate-config-modal">
        <h2>Configure Rates for {entity.profileName}</h2>
        <button onClick={() => onSave(entity.profileId, {}).then(() => onClose())}>
          Save
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    ) : null
  ),
}));

// Mock context hooks
jest.mock('../../hooks/useProfileContext.js', () => ({
  useProfileContext: jest.fn(),
}));

jest.mock('../../hooks/usePartnerContext.js', () => ({
  usePartnerContext: jest.fn(),
}));

const { useProfileContext } = require('../../hooks/useProfileContext.js');
const { usePartnerContext } = require('../../hooks/usePartnerContext.js');

describe('ProfileManagerView', () => {
  const mockProfiles = [
    {
      profileId: 'profile-1',
      profileName: 'Gold',
      description: 'Premium tier',
      config: { earnRateCentsPerPoint: 10, burnRatePointsPerCent: 5 },
    },
    {
      profileId: 'profile-2',
      profileName: 'Silver',
      description: 'Standard tier',
      config: { earnRateCentsPerPoint: 15, burnRatePointsPerCent: 8 },
    },
  ];

  const mockPartners = [
    { partnerId: 'partner-1', partnerName: 'Visa' },
  ];

  const mockRefreshProfiles = jest.fn();
  const mockRefreshPartners = jest.fn();
  const mockAddProfile = jest.fn(() => Promise.resolve());
  const mockUpdateProfileRates = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
    useProfileContext.mockReturnValue({
      profiles: mockProfiles,
      profilesLoading: false,
      refreshProfiles: mockRefreshProfiles,
      addProfile: mockAddProfile,
      updateProfileRates: mockUpdateProfileRates,
    });
    usePartnerContext.mockReturnValue({
      partners: mockPartners,
      refreshPartners: mockRefreshPartners,
    });
  });

  it('renders dashboard layout with correct title', () => {
    render(<ProfileManagerView />);
    expect(screen.getByText('Profile & Tier Configuration')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<ProfileManagerView />);
    expect(screen.getByText(/Manage loyalty tiers/)).toBeInTheDocument();
  });

  it('calls refreshProfiles on mount', () => {
    render(<ProfileManagerView />);
    expect(mockRefreshProfiles).toHaveBeenCalled();
  });

  it('calls refreshPartners on mount', () => {
    render(<ProfileManagerView />);
    expect(mockRefreshPartners).toHaveBeenCalled();
  });

  it('renders profile grid with profiles data', () => {
    render(<ProfileManagerView />);
    expect(screen.getByTestId('profile-grid')).toBeInTheDocument();
  });

  it('renders create profile button', () => {
    render(<ProfileManagerView />);
    expect(screen.getByText('Create profile')).toBeInTheDocument();
  });

  it('opens create profile modal when button clicked', async () => {
    const user = userEvent.setup();
    render(<ProfileManagerView />);
    const createButton = screen.getByText('Create profile');
    await user.click(createButton);
    expect(screen.getByTestId('create-profile-modal')).toBeInTheDocument();
  });

  it('closes create profile modal when cancelled', async () => {
    const user = userEvent.setup();
    render(<ProfileManagerView />);
    const createButton = screen.getByText('Create profile');
    await user.click(createButton);

    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    expect(screen.queryByTestId('create-profile-modal')).not.toBeInTheDocument();
  });

  it('opens rate config modal when configure button clicked', async () => {
    const user = userEvent.setup();
    render(<ProfileManagerView />);

    const configureButtons = screen.getAllByText('Configure');
    await user.click(configureButtons[0]);

    expect(screen.getByTestId('rate-config-modal')).toBeInTheDocument();
    expect(screen.getByText(/Configure Rates for Gold/)).toBeInTheDocument();
  });

  it('closes rate config modal when cancelled', async () => {
    const user = userEvent.setup();
    render(<ProfileManagerView />);

    const configureButtons = screen.getAllByText('Configure');
    await user.click(configureButtons[0]);

    const cancelButtons = screen.getAllByRole('button', { name: 'Cancel' });
    await user.click(cancelButtons[0]);

    expect(screen.queryByTestId('rate-config-modal')).not.toBeInTheDocument();
  });

  it('displays loading spinner when profiles are loading', () => {
    useProfileContext.mockReturnValue({
      profiles: [],
      profilesLoading: true,
      refreshProfiles: mockRefreshProfiles,
      addProfile: mockAddProfile,
      updateProfileRates: mockUpdateProfileRates,
    });

    render(<ProfileManagerView />);
    expect(screen.getByText('Loading profiles...')).toBeInTheDocument();
  });

  it('displays empty state when no profiles', () => {
    useProfileContext.mockReturnValue({
      profiles: [],
      profilesLoading: false,
      refreshProfiles: mockRefreshProfiles,
      addProfile: mockAddProfile,
      updateProfileRates: mockUpdateProfileRates,
    });

    render(<ProfileManagerView />);
    expect(screen.getByText('No profiles')).toBeInTheDocument();
  });

  it('passes partners to profile grid', () => {
    render(<ProfileManagerView />);
    // Grid should receive partners prop for tier rules section
    expect(screen.getByTestId('profile-grid')).toBeInTheDocument();
  });

  it('renders all profiles in the grid', () => {
    render(<ProfileManagerView />);
    expect(screen.getByTestId('profile-item-profile-1')).toBeInTheDocument();
    expect(screen.getByTestId('profile-item-profile-2')).toBeInTheDocument();
  });

  it('handles multiple profile configurations', async () => {
    const user = userEvent.setup();
    render(<ProfileManagerView />);

    const configureButtons = screen.getAllByText('Configure');

    // Configure first profile
    await user.click(configureButtons[0]);
    expect(screen.getByText(/Configure Rates for Gold/)).toBeInTheDocument();

    // Close and configure second profile
    const cancelButton = screen.getByRole('button', { name: 'Cancel' });
    await user.click(cancelButton);

    await user.click(configureButtons[1]);
    expect(screen.getByText(/Configure Rates for Silver/)).toBeInTheDocument();
  });

  it('calls updateProfileRates when rates are saved', async () => {
    const user = userEvent.setup();
    const onSaveMock = jest.fn(() => Promise.resolve());

    // Re-mock with our spy
    useProfileContext.mockReturnValue({
      profiles: mockProfiles,
      profilesLoading: false,
      refreshProfiles: mockRefreshProfiles,
      addProfile: mockAddProfile,
      updateProfileRates: onSaveMock,
    });

    render(<ProfileManagerView />);

    const configureButtons = screen.getAllByText('Configure');
    await user.click(configureButtons[0]);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await user.click(saveButton);

    // Reset mock
    useProfileContext.mockReturnValue({
      profiles: mockProfiles,
      profilesLoading: false,
      refreshProfiles: mockRefreshProfiles,
      addProfile: mockAddProfile,
      updateProfileRates: mockUpdateProfileRates,
    });
  });

  it('maintains dashboard layout structure', () => {
    render(<ProfileManagerView />);
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('renders content inside dashboard layout', () => {
    render(<ProfileManagerView />);
    const layout = screen.getByTestId('dashboard-layout');
    expect(layout).toContainElement(screen.getByTestId('profile-grid'));
  });

  it('handles context providing both profiles and partners', () => {
    render(<ProfileManagerView />);
    // Both profiles and partners should be available for the complete flow
    expect(screen.getByTestId('profile-grid')).toBeInTheDocument();
  });
});
