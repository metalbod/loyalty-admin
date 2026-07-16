import React from 'react';
import { render, screen } from '@testing-library/react';
import LedgerTable from '../LedgerTable.jsx';

// Mock Card component
jest.mock('../../common/Card.jsx', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ title, subtitle }) => (
    <div data-testid="card-header">
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </div>
  ),
}));

// Mock Badge component
jest.mock('../../common/Badge.jsx', () => ({
  __esModule: true,
  default: ({ children, variant, icon: Icon }) => (
    <div data-testid={`badge-${variant}`}>
      {Icon && <span>Icon</span>}
      {children}
    </div>
  ),
}));

// Mock Pagination component
jest.mock('../../common/Pagination.jsx', () => ({
  __esModule: true,
  default: ({ page, totalPages, onPageChange }) => (
    <div data-testid="pagination">
      <p>
        Page {page + 1} of {totalPages}
      </p>
    </div>
  ),
}));

// Mock LoadingSpinner component
jest.mock('../../common/LoadingSpinner.jsx', () => ({
  __esModule: true,
  default: ({ label }) => <div data-testid="loading-spinner">{label}</div>,
}));

// Mock EmptyState component
jest.mock('../../common/EmptyState.jsx', () => ({
  __esModule: true,
  default: ({ title, description }) => (
    <div data-testid="empty-state">
      <p>{title}</p>
      <p>{description}</p>
    </div>
  ),
}));

// Mock ValuePreview component
jest.mock('../ValuePreview.jsx', () => ({
  __esModule: true,
  default: ({ oldValue, newValue }) => (
    <div data-testid="value-preview">
      {oldValue} → {newValue}
    </div>
  ),
}));

// Mock dateUtils
jest.mock('../../../utils/dateUtils.js', () => ({
  formatDateTime: (timestamp) => `${timestamp} 12:00 PM`,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  ArrowDownCircle: () => null,
  ArrowUpCircle: () => null,
  ShieldAlert: () => null,
  Sparkles: () => null,
}));

describe('LedgerTable', () => {
  const mockFeed = {
    content: [
      {
        id: 'txn-1',
        timestamp: '2024-07-16',
        source: 'TRANSACTION',
        action: 'EARN',
        targetEntity: 'user-123',
        status: 'SUCCESS',
        oldValue: 100,
        newValue: 150,
      },
      {
        id: 'txn-2',
        timestamp: '2024-07-15',
        source: 'ADMIN_ACTION',
        action: 'BURN',
        targetEntity: 'campaign-456',
        status: 'FAILED',
        oldValue: 200,
        newValue: 150,
      },
    ],
    page: 0,
    totalPages: 1,
    totalElements: 2,
  };

  it('renders card header with title and subtitle', () => {
    render(<LedgerTable feed={mockFeed} />);
    expect(screen.getByText('Live activity feed')).toBeInTheDocument();
    expect(screen.getByText(/merged and sorted/i)).toBeInTheDocument();
  });

  it('renders activity table with all columns', () => {
    const { container } = render(<LedgerTable feed={mockFeed} />);
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('displays table headers', () => {
    render(<LedgerTable feed={mockFeed} />);
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Source')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Target entity')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders transaction rows with data', () => {
    render(<LedgerTable feed={mockFeed} />);
    expect(screen.getByText(/2024-07-16/)).toBeInTheDocument();
    expect(screen.getByText(/2024-07-15/)).toBeInTheDocument();
  });

  it('displays action types as badges', () => {
    render(<LedgerTable feed={mockFeed} />);
    expect(screen.getByText('EARN')).toBeInTheDocument();
    expect(screen.getByText('BURN')).toBeInTheDocument();
  });

  it('displays source badges', () => {
    render(<LedgerTable feed={mockFeed} />);
    expect(screen.getAllByText(/Admin action|Transaction/).length).toBeGreaterThan(0);
  });

  it('displays status badges', () => {
    render(<LedgerTable feed={mockFeed} />);
    expect(screen.getByText('SUCCESS')).toBeInTheDocument();
    expect(screen.getByText('FAILED')).toBeInTheDocument();
  });

  it('renders target entity names', () => {
    render(<LedgerTable feed={mockFeed} />);
    expect(screen.getByText('user-123')).toBeInTheDocument();
    expect(screen.getByText('campaign-456')).toBeInTheDocument();
  });

  it('renders value previews for each row', () => {
    render(<LedgerTable feed={mockFeed} />);
    const previews = screen.getAllByTestId('value-preview');
    expect(previews.length).toBe(2);
  });

  it('renders loading spinner when loading', () => {
    const emptyFeed = { content: [], page: 0, totalPages: 1, totalElements: 0 };
    render(<LedgerTable feed={emptyFeed} isLoading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Refreshing feed…')).toBeInTheDocument();
  });

  it('renders empty state when no activity', () => {
    const emptyFeed = { content: [], page: 0, totalPages: 1, totalElements: 0 };
    render(<LedgerTable feed={emptyFeed} isLoading={false} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No activity yet')).toBeInTheDocument();
  });

  it('renders pagination when feed has data', () => {
    render(<LedgerTable feed={mockFeed} />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('does not render pagination when feed has no data', () => {
    const emptyFeed = { content: [], page: 0, totalPages: 1, totalElements: 0 };
    render(<LedgerTable feed={emptyFeed} />);
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('does not render pagination for null feed', () => {
    render(<LedgerTable feed={null} />);
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('renders table in responsive container', () => {
    const { container } = render(<LedgerTable feed={mockFeed} />);
    const scrollContainer = container.querySelector('.overflow-x-auto');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('handles null feed gracefully', () => {
    render(<LedgerTable feed={null} isLoading={false} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('displays multiple transaction rows', () => {
    const { container } = render(<LedgerTable feed={mockFeed} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
  });
});
