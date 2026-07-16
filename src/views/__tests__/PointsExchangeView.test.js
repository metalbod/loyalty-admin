import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PointsExchangeView from '../PointsExchangeView.jsx';

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
jest.mock('../../components/exchange/ExchangeProviderGrid.jsx', () => ({
  __esModule: true,
  default: ({ providers, isLoading }) => (
    <div data-testid="exchange-provider-grid">
      {isLoading ? 'Loading providers' : `Providers: ${providers?.length || 0}`}
    </div>
  ),
}));

jest.mock('../../components/exchange/CreateExchangeProviderModal.jsx', () => ({
  __esModule: true,
  default: ({ isOpen }) => (
    isOpen ? <div data-testid="create-provider-modal">Create Modal</div> : null
  ),
}));

jest.mock('../../components/exchange/EditExchangeProviderModal.jsx', () => ({
  __esModule: true,
  default: ({ isOpen }) => (
    isOpen ? <div data-testid="edit-provider-modal">Edit Modal</div> : null
  ),
}));

jest.mock('../../components/exchange/ExchangeRequestsTable.jsx', () => ({
  __esModule: true,
  default: ({ requests, isLoading }) => (
    <div data-testid="exchange-requests-table">
      {isLoading ? 'Loading requests' : `Requests: ${requests?.length || 0}`}
    </div>
  ),
}));

jest.mock('../../components/common/Button.jsx', () => ({
  __esModule: true,
  default: ({ children, onClick, icon: Icon }) => (
    <button onClick={onClick} data-testid="create-button">
      {Icon && <span>Icon</span>}
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  PlusCircle: () => null,
}));

// Mock useExchangeContext
jest.mock('../../hooks/useExchangeContext.js', () => ({
  useExchangeContext: jest.fn(),
}));

const { useExchangeContext } = require('../../hooks/useExchangeContext.js');

describe('PointsExchangeView', () => {
  const mockRefreshExchangeProviders = jest.fn();
  const mockLoadExchangeRequestsPage = jest.fn();
  const mockAddExchangeProvider = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useExchangeContext.mockReturnValue({
      exchangeProviders: [
        { id: 'provider-1', name: 'Provider A' },
        { id: 'provider-2', name: 'Provider B' },
      ],
      exchangeProvidersLoading: false,
      refreshExchangeProviders: mockRefreshExchangeProviders,
      addExchangeProvider: mockAddExchangeProvider,
      updateExchangeProviderConfig: jest.fn(),
      exchangeRequests: [
        { id: 'req-1', status: 'PENDING' },
        { id: 'req-2', status: 'COMPLETED' },
      ],
      exchangeRequestsLoading: false,
      loadExchangeRequestsPage: mockLoadExchangeRequestsPage,
    });
  });

  it('renders dashboard layout', () => {
    render(<PointsExchangeView />);
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('renders page title', () => {
    render(<PointsExchangeView />);
    expect(screen.getByText('Points Exchange')).toBeInTheDocument();
  });

  it('renders page description', () => {
    render(<PointsExchangeView />);
    expect(screen.getByText(/external loyalty provider/i)).toBeInTheDocument();
  });

  it('renders create provider button', () => {
    render(<PointsExchangeView />);
    expect(screen.getByTestId('create-button')).toBeInTheDocument();
  });

  it('renders exchange provider grid', () => {
    render(<PointsExchangeView />);
    expect(screen.getByTestId('exchange-provider-grid')).toBeInTheDocument();
  });

  it('renders exchange requests table', () => {
    render(<PointsExchangeView />);
    expect(screen.getByTestId('exchange-requests-table')).toBeInTheDocument();
  });

  it('refreshes exchange providers on mount', () => {
    render(<PointsExchangeView />);
    expect(mockRefreshExchangeProviders).toHaveBeenCalled();
  });

  it('loads first page of exchange requests on mount', () => {
    render(<PointsExchangeView />);
    expect(mockLoadExchangeRequestsPage).toHaveBeenCalledWith(0);
  });

  it('displays loading state for providers', () => {
    useExchangeContext.mockReturnValue({
      exchangeProviders: [],
      exchangeProvidersLoading: true,
      refreshExchangeProviders: mockRefreshExchangeProviders,
      addExchangeProvider: mockAddExchangeProvider,
      updateExchangeProviderConfig: jest.fn(),
      exchangeRequests: [],
      exchangeRequestsLoading: false,
      loadExchangeRequestsPage: mockLoadExchangeRequestsPage,
    });

    render(<PointsExchangeView />);
    expect(screen.getByText('Loading providers')).toBeInTheDocument();
  });

  it('displays loading state for requests', () => {
    useExchangeContext.mockReturnValue({
      exchangeProviders: [],
      exchangeProvidersLoading: false,
      refreshExchangeProviders: mockRefreshExchangeProviders,
      addExchangeProvider: mockAddExchangeProvider,
      updateExchangeProviderConfig: jest.fn(),
      exchangeRequests: [],
      exchangeRequestsLoading: true,
      loadExchangeRequestsPage: mockLoadExchangeRequestsPage,
    });

    render(<PointsExchangeView />);
    expect(screen.getByText('Loading requests')).toBeInTheDocument();
  });

  it('opens create modal when create button clicked', async () => {
    const user = userEvent.setup();
    render(<PointsExchangeView />);

    const button = screen.getByTestId('create-button');
    await user.click(button);

    expect(screen.getByTestId('create-provider-modal')).toBeInTheDocument();
  });

  it('passes providers to exchange provider grid', () => {
    render(<PointsExchangeView />);
    expect(screen.getByText(/Providers: 2/)).toBeInTheDocument();
  });

  it('passes requests to exchange requests table', () => {
    render(<PointsExchangeView />);
    expect(screen.getByText(/Requests: 2/)).toBeInTheDocument();
  });

  it('renders all components without errors', () => {
    render(<PointsExchangeView />);
    expect(screen.getByTestId('exchange-provider-grid')).toBeInTheDocument();
    expect(screen.getByTestId('exchange-requests-table')).toBeInTheDocument();
    expect(screen.getByTestId('create-button')).toBeInTheDocument();
  });

  it('renders with empty providers list', () => {
    useExchangeContext.mockReturnValue({
      exchangeProviders: [],
      exchangeProvidersLoading: false,
      refreshExchangeProviders: mockRefreshExchangeProviders,
      addExchangeProvider: mockAddExchangeProvider,
      updateExchangeProviderConfig: jest.fn(),
      exchangeRequests: [],
      exchangeRequestsLoading: false,
      loadExchangeRequestsPage: mockLoadExchangeRequestsPage,
    });

    render(<PointsExchangeView />);
    expect(screen.getByText(/Providers: 0/)).toBeInTheDocument();
  });
});
