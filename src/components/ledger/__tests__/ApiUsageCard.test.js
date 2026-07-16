import React from 'react';
import { render, screen } from '@testing-library/react';
import ApiUsageCard from '../ApiUsageCard.jsx';

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

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Activity: () => null,
}));

describe('ApiUsageCard', () => {
  const mockMetrics = {
    institutionCreatedAt: '2024-01-15',
    apiCallsByMonth: [
      {
        yearMonth: '2024-01',
        get: 1000,
        post: 500,
        put: 200,
        delete: 100,
        total: 1800,
      },
      {
        yearMonth: '2024-02',
        get: 1200,
        post: 600,
        put: 250,
        delete: 120,
        total: 2170,
      },
    ],
    apiCallsAllTime: {
      get: 2200,
      post: 1100,
      put: 450,
      delete: 220,
      total: 3970,
    },
  };

  it('renders card header with title and subtitle', () => {
    render(<ApiUsageCard metrics={mockMetrics} />);
    expect(screen.getByText('API Usage')).toBeInTheDocument();
    expect(screen.getByText(/Billable calls/i)).toBeInTheDocument();
  });

  it('renders loading spinner when loading with no metrics', () => {
    render(<ApiUsageCard isLoading={true} metrics={null} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading API usage…')).toBeInTheDocument();
  });

  it('renders API usage table with month data', () => {
    const { container } = render(<ApiUsageCard metrics={mockMetrics} />);
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('displays month labels correctly formatted', () => {
    render(<ApiUsageCard metrics={mockMetrics} />);
    expect(screen.getByText('January 2024')).toBeInTheDocument();
    expect(screen.getByText('February 2024')).toBeInTheDocument();
  });

  it('displays GET/POST/PUT/DELETE columns', () => {
    render(<ApiUsageCard metrics={mockMetrics} />);
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
    expect(screen.getByText('PUT')).toBeInTheDocument();
    expect(screen.getByText('DELETE')).toBeInTheDocument();
  });

  it('displays total column', () => {
    render(<ApiUsageCard metrics={mockMetrics} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('formats API call numbers with locale string', () => {
    render(<ApiUsageCard metrics={mockMetrics} />);
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('1,200')).toBeInTheDocument();
  });

  it('displays all-time totals row', () => {
    const { container } = render(<ApiUsageCard metrics={mockMetrics} />);
    expect(container.textContent).toContain('All-time');
    expect(screen.getByText('2,200')).toBeInTheDocument();
  });

  it('includes institution created date in all-time row', () => {
    const { container } = render(<ApiUsageCard metrics={mockMetrics} />);
    expect(container.textContent).toContain('since');
    expect(container.textContent).toContain('2024');
  });

  it('renders empty state when no api calls by month', () => {
    const emptyMetrics = {
      institutionCreatedAt: '2024-01-15',
      apiCallsByMonth: [],
      apiCallsAllTime: null,
    };
    render(<ApiUsageCard metrics={emptyMetrics} isLoading={false} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No API usage yet')).toBeInTheDocument();
  });

  it('does not show empty state when loading', () => {
    const emptyMetrics = {
      institutionCreatedAt: '2024-01-15',
      apiCallsByMonth: [],
      apiCallsAllTime: null,
    };
    render(<ApiUsageCard metrics={emptyMetrics} isLoading={true} />);
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it('renders table with responsive layout', () => {
    const { container } = render(<ApiUsageCard metrics={mockMetrics} />);
    const table = container.querySelector('.overflow-x-auto');
    expect(table).toBeInTheDocument();
  });

  it('handles null metrics gracefully', () => {
    render(<ApiUsageCard metrics={null} isLoading={false} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('displays data for multiple months', () => {
    const { container } = render(<ApiUsageCard metrics={mockMetrics} />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBeGreaterThanOrEqual(2); // At least the two months + all-time row
  });
});
