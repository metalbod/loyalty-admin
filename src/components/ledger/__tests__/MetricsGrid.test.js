import React from 'react';
import { render, screen } from '@testing-library/react';
import MetricsGrid from '../MetricsGrid.jsx';

// Mock Card component
jest.mock('../../common/Card.jsx', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="card">{children}</div>,
}));

// Mock LoadingSpinner component
jest.mock('../../common/LoadingSpinner.jsx', () => ({
  __esModule: true,
  default: ({ label }) => <div data-testid="loading-spinner">{label}</div>,
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  CalendarClock: () => null,
  TrendingDown: () => null,
  TrendingUp: () => null,
  Wallet: () => null,
}));

describe('MetricsGrid', () => {
  const mockMetrics = {
    totalIssued: 50000,
    totalBurned: 25000,
    activeCampaigns: 3,
    totalWallets: 1500,
  };

  it('renders loading spinner when loading with no metrics', () => {
    render(<MetricsGrid isLoading={true} metrics={null} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.getByText('Loading metrics…')).toBeInTheDocument();
  });

  it('renders all four metric cards when metrics provided', () => {
    render(<MetricsGrid metrics={mockMetrics} isLoading={false} />);
    expect(screen.getByText('Points Issued')).toBeInTheDocument();
    expect(screen.getByText('Points Burned')).toBeInTheDocument();
    expect(screen.getByText('Active Campaigns')).toBeInTheDocument();
    expect(screen.getByText('Total Wallets')).toBeInTheDocument();
  });

  it('formats issued points with plus sign', () => {
    render(<MetricsGrid metrics={mockMetrics} />);
    expect(screen.getByText('+50,000')).toBeInTheDocument();
  });

  it('formats burned points with minus sign', () => {
    render(<MetricsGrid metrics={mockMetrics} />);
    expect(screen.getByText('-25,000')).toBeInTheDocument();
  });

  it('formats active campaigns with locale string', () => {
    render(<MetricsGrid metrics={mockMetrics} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('formats total wallets with locale string', () => {
    render(<MetricsGrid metrics={mockMetrics} />);
    expect(screen.getByText('1,500')).toBeInTheDocument();
  });

  it('renders all metric labels even with incomplete data', () => {
    const incompletMetrics = {
      totalIssued: 50000,
      // Missing other values
    };
    render(<MetricsGrid metrics={incompletMetrics} />);
    expect(screen.getByText('Points Issued')).toBeInTheDocument();
    expect(screen.getByText('Points Burned')).toBeInTheDocument();
    expect(screen.getByText('Active Campaigns')).toBeInTheDocument();
    expect(screen.getByText('Total Wallets')).toBeInTheDocument();
  });

  it('renders all metric cards when metrics is null but not loading', () => {
    render(<MetricsGrid metrics={null} isLoading={false} />);
    expect(screen.getByText('Points Issued')).toBeInTheDocument();
    expect(screen.getByText('Points Burned')).toBeInTheDocument();
    expect(screen.getByText('Active Campaigns')).toBeInTheDocument();
    expect(screen.getByText('Total Wallets')).toBeInTheDocument();
  });

  it('shows loading spinner when loading is true', () => {
    render(<MetricsGrid metrics={null} isLoading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders metrics grid container', () => {
    const { container } = render(<MetricsGrid metrics={mockMetrics} />);
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('handles zero values in metrics', () => {
    const zeroMetrics = {
      totalIssued: 0,
      totalBurned: 0,
      activeCampaigns: 0,
      totalWallets: 0,
    };
    render(<MetricsGrid metrics={zeroMetrics} />);
    expect(screen.getByText('+0')).toBeInTheDocument();
    expect(screen.getByText('-0')).toBeInTheDocument();
  });

  it('renders all cards in card components', () => {
    const { container } = render(<MetricsGrid metrics={mockMetrics} />);
    const cards = container.querySelectorAll('[data-testid="card"]');
    expect(cards.length).toBe(4); // 4 metric cards
  });
});
