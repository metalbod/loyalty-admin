import React from 'react';
import { render, screen } from '@testing-library/react';
import ExchangeRequestsTable from '../ExchangeRequestsTable.jsx';

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

jest.mock('../../common/Badge.jsx', () => ({
  __esModule: true,
  default: ({ children, variant, icon: Icon }) => (
    <div data-testid={`badge-${variant}`}>{children}</div>
  ),
}));

jest.mock('../../common/Pagination.jsx', () => ({
  __esModule: true,
  default: ({ page, totalPages, onPageChange, isLoading }) => (
    <div data-testid="pagination">{page + 1} / {totalPages}</div>
  ),
}));

jest.mock('../../common/LoadingSpinner.jsx', () => ({
  __esModule: true,
  default: ({ label }) => <div data-testid="loading-spinner">{label}</div>,
}));

jest.mock('../../common/EmptyState.jsx', () => ({
  __esModule: true,
  default: ({ title, description, icon: Icon }) => (
    <div data-testid="empty-state">
      <p>{title}</p>
      <p>{description}</p>
    </div>
  ),
}));

jest.mock('lucide-react', () => ({
  ArrowDownCircle: () => null,
  ArrowUpCircle: () => null,
  ListChecks: () => null,
}));

jest.mock('../../../utils/dateUtils.js', () => ({
  formatDateTime: (date) => '2024-07-16 12:00 PM',
}));

describe('ExchangeRequestsTable', () => {
  const mockRequests = {
    content: [
      {
        requestId: 'req-1',
        userId: 12345,
        direction: 'IN',
        externalUnits: 100,
        points: 1000,
        status: 'SETTLED',
        createdAt: '2024-07-16T12:00:00Z',
        externalRefId: 'ext-ref-1',
        failureReason: null,
      },
      {
        requestId: 'req-2',
        userId: 12346,
        direction: 'OUT',
        externalUnits: 50,
        points: 600,
        status: 'PENDING',
        createdAt: '2024-07-16T11:30:00Z',
        externalRefId: 'ext-ref-2',
        failureReason: null,
      },
      {
        requestId: 'req-3',
        userId: 12347,
        direction: 'IN',
        externalUnits: 75,
        points: 750,
        status: 'FAILED',
        createdAt: '2024-07-16T11:00:00Z',
        externalRefId: null,
        failureReason: 'Insufficient balance',
      },
    ],
    page: {
      number: 0,
      totalPages: 3,
      totalElements: 75,
    },
  };

  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders card container', () => {
    render(<ExchangeRequestsTable requests={mockRequests} onPageChange={mockOnPageChange} />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('displays table header with title', () => {
    render(<ExchangeRequestsTable requests={mockRequests} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('Exchange requests')).toBeInTheDocument();
  });

  it('renders table element', () => {
    const { container } = render(
      <ExchangeRequestsTable requests={mockRequests} onPageChange={mockOnPageChange} />
    );
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('displays table column headers', () => {
    render(<ExchangeRequestsTable requests={mockRequests} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('Created')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('Direction')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders table rows for each request', () => {
    const { container } = render(
      <ExchangeRequestsTable requests={mockRequests} onPageChange={mockOnPageChange} />
    );
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });

  it('displays request data in rows', () => {
    render(<ExchangeRequestsTable requests={mockRequests} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('#12345')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('600')).toBeInTheDocument();
  });

  it('displays direction badges', () => {
    render(<ExchangeRequestsTable requests={mockRequests} onPageChange={mockOnPageChange} />);
    const skyBadges = screen.getAllByTestId('badge-sky');
    const fuchsiaBadges = screen.getAllByTestId('badge-fuchsia');
    expect(skyBadges.length).toBeGreaterThan(0);
    expect(fuchsiaBadges.length).toBeGreaterThan(0);
  });

  it('displays status badges', () => {
    render(<ExchangeRequestsTable requests={mockRequests} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('SETTLED')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByText('FAILED')).toBeInTheDocument();
  });

  it('displays external reference ID for successful requests', () => {
    render(<ExchangeRequestsTable requests={mockRequests} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('ext-ref-1')).toBeInTheDocument();
  });

  it('displays failure reason for failed requests', () => {
    render(<ExchangeRequestsTable requests={mockRequests} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('Insufficient balance')).toBeInTheDocument();
  });

  it('renders pagination component', () => {
    render(<ExchangeRequestsTable requests={mockRequests} onPageChange={mockOnPageChange} />);
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('renders loading spinner when loading', () => {
    render(
      <ExchangeRequestsTable
        requests={mockRequests}
        isLoading={true}
        onPageChange={mockOnPageChange}
      />
    );
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders empty state when no requests', () => {
    render(
      <ExchangeRequestsTable
        requests={{ content: [], page: { number: 0, totalPages: 1, totalElements: 0 } }}
        isLoading={false}
        onPageChange={mockOnPageChange}
      />
    );
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('does not render pagination when no requests', () => {
    render(
      <ExchangeRequestsTable
        requests={{ content: [], page: { number: 0, totalPages: 1, totalElements: 0 } }}
        isLoading={false}
        onPageChange={mockOnPageChange}
      />
    );
    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument();
  });

  it('handles null requests prop', () => {
    render(
      <ExchangeRequestsTable requests={null} isLoading={false} onPageChange={mockOnPageChange} />
    );
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('displays formatted datetime', () => {
    render(<ExchangeRequestsTable requests={mockRequests} onPageChange={mockOnPageChange} />);
    expect(screen.getAllByText('2024-07-16 12:00 PM').length).toBeGreaterThan(0);
  });

  it('renders responsive table container', () => {
    const { container } = render(
      <ExchangeRequestsTable requests={mockRequests} onPageChange={mockOnPageChange} />
    );
    const tableContainer = container.querySelector('.overflow-x-auto');
    expect(tableContainer).toBeInTheDocument();
  });
});
