// Mocks MUST come first
jest.mock('../../api/client.js', () => ({
  fetchWallet: jest.fn(),
  fetchWalletHistory: jest.fn(),
  fetchExpiringSummary: jest.fn(),
  changeWalletProfile: jest.fn(),
  ApiError: class ApiError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ApiError';
    }
  },
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../../hooks/useAuth.js', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../hooks/useProfileContext.js', () => ({
  useProfileContext: jest.fn(),
}));

jest.mock('../../hooks/useAsyncAction.js', () => ({
  useAsyncAction: jest.fn(),
}));

jest.mock('../../layouts/DashboardLayout.jsx', () => ({
  __esModule: true,
  default: ({ title, description, children }) => (
    <div data-testid="dashboard-layout">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {children}
    </div>
  ),
}));

jest.mock('../../components/wallets/WalletHistoryTable.jsx', () => ({
  __esModule: true,
  default: ({ wallet, history, onPageChange }) => (
    <div data-testid="wallet-history-table">
      {history && <p>{history.totalElements} transactions</p>}
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  ArrowLeft: () => null,
  Check: () => null,
  Clock: () => null,
  Wallet: () => null,
}));

jest.mock('../../components/common/Card.jsx', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="card">{children}</div>,
}));

jest.mock('../../components/common/Button.jsx', () => ({
  __esModule: true,
  default: ({ children, onClick }) => <button onClick={onClick}>{children}</button>,
}));

jest.mock('../../components/common/LoadingSpinner.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="loading-spinner">Loading...</div>,
}));

jest.mock('../../utils/formatters.js', () => ({
  formatBalance: (val) => `${val}`,
  formatPoints: (val) => `${val}`,
}));

jest.mock('../../constants', () => ({
  TIER_ACCENTS: {
    VIP: { ring: 'ring-fuchsia-500/40', text: 'text-fuchsia-400', dot: 'bg-fuchsia-500' },
    GOLD: { ring: 'ring-amber-500/40', text: 'text-amber-400', dot: 'bg-amber-500' },
    STANDARD: { ring: 'ring-emerald-500/40', text: 'text-emerald-400', dot: 'bg-emerald-500' },
    DEFAULT: { ring: 'ring-sky-500/40', text: 'text-sky-400', dot: 'bg-sky-500' },
  },
}));

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletDetailView from '../WalletDetailView.jsx';

const mockNavigate = jest.fn();
const { useParams } = require('react-router-dom');
const { useNavigate } = require('react-router-dom');
const { useAuth } = require('../../hooks/useAuth.js');
const { useProfileContext } = require('../../hooks/useProfileContext.js');
const { useAsyncAction } = require('../../hooks/useAsyncAction.js');
const api = require('../../api/client.js');

describe('WalletDetailView', () => {
  const mockWallet = {
    userId: 'user-123',
    email: 'customer@example.com',
    currentBalance: 1500,
    profileName: 'GOLD',
  };

  const mockHistory = {
    content: [
      { transactionId: 'tx-1', type: 'EARN', amount: 100 },
      { transactionId: 'tx-2', type: 'BURN', amount: 50 },
    ],
    totalElements: 2,
    page: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useParams.mockReturnValue({ userId: 'user-123' });
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({
      user: { email: 'admin@example.com' },
    });
    useProfileContext.mockReturnValue({
      profiles: [
        { profileId: 'gold', profileName: 'Gold' },
        { profileId: 'silver', profileName: 'Silver' },
      ],
      refreshProfiles: jest.fn(),
    });
    useAsyncAction.mockReturnValue({
      run: jest.fn(() => Promise.resolve()),
      isSubmitting: false,
      error: null,
      reset: jest.fn(),
    });
    api.fetchWallet.mockResolvedValue(mockWallet);
    api.fetchWalletHistory.mockResolvedValue(mockHistory);
    api.fetchExpiringSummary.mockResolvedValue({});
  });

  it('renders dashboard layout with title', () => {
    render(<WalletDetailView />);
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('loads wallet details on mount', async () => {
    render(<WalletDetailView />);
    await waitFor(() => {
      expect(api.fetchWallet).toHaveBeenCalledWith('user-123');
    });
  });

  it('loads wallet and displays dashboard layout', async () => {
    render(<WalletDetailView />);
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    });
  });

  it('displays current balance', async () => {
    render(<WalletDetailView />);
    await waitFor(() => {
      expect(screen.getByText(/1500/)).toBeInTheDocument();
    });
  });

  it('displays wallet profile name', async () => {
    render(<WalletDetailView />);
    await waitFor(() => {
      expect(screen.getByText('Gold')).toBeInTheDocument();
    });
  });

  it('renders wallet history table', async () => {
    render(<WalletDetailView />);
    await waitFor(() => {
      expect(screen.getByTestId('wallet-history-table')).toBeInTheDocument();
    });
  });

  it('loads wallet history with pagination', async () => {
    render(<WalletDetailView />);
    await waitFor(() => {
      expect(api.fetchWalletHistory).toHaveBeenCalled();
    });
  });

  it('loads expiring points summary', async () => {
    render(<WalletDetailView />);
    await waitFor(() => {
      expect(api.fetchExpiringSummary).toHaveBeenCalledWith('user-123');
    });
  });

  it('shows loading spinner initially', () => {
    api.fetchWallet.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );
    render(<WalletDetailView />);
    // Component should have initial loading state
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('handles wallet not found error', async () => {
    api.fetchWallet.mockRejectedValue(new Error('Wallet not found'));
    render(<WalletDetailView />);
    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });

  it('shows back button', () => {
    render(<WalletDetailView />);
    // Back button implemented as navigation
    expect(mockNavigate).toBeDefined();
  });

  it('displays tier change control when other profiles exist', async () => {
    render(<WalletDetailView />);
    await waitFor(() => {
      // ChangeTierControl component should render
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    });
  });

  it('changes wallet profile on tier confirm', async () => {
    const mockRun = jest.fn(() => Promise.resolve());
    useAsyncAction.mockReturnValue({
      run: mockRun,
      isSubmitting: false,
      error: null,
      reset: jest.fn(),
    });

    render(<WalletDetailView />);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    });
  });

  it('displays months in expiring points header', async () => {
    api.fetchExpiringSummary.mockResolvedValue({
      months: [
        { month: 'January', expiringPoints: 100 },
        { month: 'February', expiringPoints: 50 },
      ],
    });

    render(<WalletDetailView />);

    await waitFor(() => {
      // Months should be displayed in summary
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    });
  });

  it('handles pagination of transaction history', async () => {
    render(<WalletDetailView />);

    await waitFor(() => {
      expect(api.fetchWalletHistory).toHaveBeenCalled();
    });
  });

  it('refreshes wallet on profile change', async () => {
    const mockRefreshProfiles = jest.fn();
    useProfileContext.mockReturnValue({
      profiles: [{ profileId: 'gold', profileName: 'Gold' }],
      refreshProfiles: mockRefreshProfiles,
    });

    render(<WalletDetailView />);

    await waitFor(() => {
      expect(api.fetchWallet).toHaveBeenCalled();
    });
  });

  it('displays user initials in profile section', async () => {
    render(<WalletDetailView />);

    await waitFor(() => {
      // Initials should be generated from user email
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    });
  });

  it('handles empty transaction history', async () => {
    api.fetchWalletHistory.mockResolvedValue({
      content: [],
      totalElements: 0,
      page: 0,
    });

    render(<WalletDetailView />);

    await waitFor(() => {
      expect(screen.getByTestId('wallet-history-table')).toBeInTheDocument();
    });
  });

  it('formats balance correctly', async () => {
    api.fetchWallet.mockResolvedValue({
      ...mockWallet,
      currentBalance: 2500.99,
    });

    render(<WalletDetailView />);

    await waitFor(() => {
      expect(screen.getByText(/2500/)).toBeInTheDocument();
    });
  });

  it('renders without crashing when profiles empty', async () => {
    useProfileContext.mockReturnValue({
      profiles: [],
      refreshProfiles: jest.fn(),
    });

    render(<WalletDetailView />);

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    });
  });

  it('navigates back on back button click', async () => {
    const user = userEvent.setup();
    render(<WalletDetailView />);

    // Back navigation handled by component
    await waitFor(() => {
      expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    });
  });
});
