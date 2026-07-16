import React from 'react';
import { render, screen } from '@testing-library/react';
import LiveTransactionsView from '../LiveTransactionsView.jsx';

// Mock DashboardLayout
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

// Mock child components
jest.mock('../../components/ledger/MetricsGrid.jsx', () => ({
  __esModule: true,
  default: ({ metrics, isLoading }) => (
    <div data-testid="metrics-grid">{isLoading ? 'Loading' : 'Metrics'}</div>
  ),
}));

jest.mock('../../components/ledger/ApiUsageCard.jsx', () => ({
  __esModule: true,
  default: ({ metrics, isLoading }) => (
    <div data-testid="api-usage-card">{isLoading ? 'Loading' : 'Usage'}</div>
  ),
}));

jest.mock('../../components/ledger/LedgerTable.jsx', () => ({
  __esModule: true,
  default: ({ feed, isLoading, onPageChange }) => (
    <div data-testid="ledger-table">{isLoading ? 'Loading' : 'Ledger'}</div>
  ),
}));

// Mock useAdminContext
jest.mock('../../hooks/useAdminContext.js', () => ({
  useAdminContext: jest.fn(),
}));

const { useAdminContext } = require('../../hooks/useAdminContext.js');

describe('LiveTransactionsView', () => {
  const mockRefreshMetrics = jest.fn();
  const mockLoadActivityPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAdminContext.mockReturnValue({
      metrics: { totalTransactions: 1500, totalVolume: 50000 },
      metricsLoading: false,
      refreshMetrics: mockRefreshMetrics,
      activityFeed: {
        content: [{ id: 'tx-1', action: 'EARN' }],
        totalElements: 1,
      },
      activityFeedLoading: false,
      loadActivityPage: mockLoadActivityPage,
    });
  });

  it('renders dashboard layout', () => {
    render(<LiveTransactionsView />);
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('renders page title', () => {
    render(<LiveTransactionsView />);
    expect(screen.getByText('Live Transactions & Ledger')).toBeInTheDocument();
  });

  it('renders page description', () => {
    render(<LiveTransactionsView />);
    expect(screen.getByText(/Real-time snapshot of point movement/i)).toBeInTheDocument();
  });

  it('renders metrics grid', () => {
    render(<LiveTransactionsView />);
    expect(screen.getByTestId('metrics-grid')).toBeInTheDocument();
  });

  it('renders API usage card', () => {
    render(<LiveTransactionsView />);
    expect(screen.getByTestId('api-usage-card')).toBeInTheDocument();
  });

  it('renders ledger table', () => {
    render(<LiveTransactionsView />);
    expect(screen.getByTestId('ledger-table')).toBeInTheDocument();
  });

  it('refreshes metrics on mount', () => {
    render(<LiveTransactionsView />);
    expect(mockRefreshMetrics).toHaveBeenCalled();
  });

  it('loads first page of activity on mount', () => {
    render(<LiveTransactionsView />);
    expect(mockLoadActivityPage).toHaveBeenCalledWith(0);
  });

  it('displays loading state for metrics', () => {
    useAdminContext.mockReturnValue({
      metrics: null,
      metricsLoading: true,
      refreshMetrics: mockRefreshMetrics,
      activityFeed: { content: [] },
      activityFeedLoading: false,
      loadActivityPage: mockLoadActivityPage,
    });

    render(<LiveTransactionsView />);
    expect(screen.getByTestId('metrics-grid')).toBeInTheDocument();
  });

  it('displays loading state for activity feed', () => {
    useAdminContext.mockReturnValue({
      metrics: { totalTransactions: 0 },
      metricsLoading: false,
      refreshMetrics: mockRefreshMetrics,
      activityFeed: null,
      activityFeedLoading: true,
      loadActivityPage: mockLoadActivityPage,
    });

    render(<LiveTransactionsView />);
    expect(screen.getByTestId('ledger-table')).toBeInTheDocument();
  });

  it('passes metrics to grid component', () => {
    render(<LiveTransactionsView />);
    expect(screen.getByTestId('metrics-grid')).toBeInTheDocument();
  });

  it('passes activity feed to ledger table', () => {
    render(<LiveTransactionsView />);
    expect(screen.getByTestId('ledger-table')).toBeInTheDocument();
  });

  it('passes page change handler to ledger table', () => {
    render(<LiveTransactionsView />);
    expect(mockLoadActivityPage).toHaveBeenCalled();
  });

  it('renders all components without errors', () => {
    render(<LiveTransactionsView />);
    expect(screen.getByTestId('metrics-grid')).toBeInTheDocument();
    expect(screen.getByTestId('api-usage-card')).toBeInTheDocument();
    expect(screen.getByTestId('ledger-table')).toBeInTheDocument();
  });
});
