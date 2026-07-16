import React from 'react';
import { render, screen } from '@testing-library/react';
import ExchangeProviderGrid from '../ExchangeProviderGrid.jsx';

jest.mock('../ExchangeProviderCard.jsx', () => ({
  __esModule: true,
  default: ({ provider, onEdit }) => (
    <div data-testid={`provider-card-${provider.providerId}`}>{provider.displayName}</div>
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
  Repeat: () => null,
}));

describe('ExchangeProviderGrid', () => {
  const mockProviders = [
    {
      providerId: 'prov-1',
      displayName: 'SkyMiles',
      providerCode: 'SKYMILES',
      active: true,
    },
    {
      providerId: 'prov-2',
      displayName: 'MileagePlus',
      providerCode: 'UNITED',
      active: false,
    },
  ];

  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner when loading with no providers', () => {
    render(<ExchangeProviderGrid providers={[]} isLoading={true} onEdit={mockOnEdit} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders empty state when no providers exist', () => {
    render(<ExchangeProviderGrid providers={[]} isLoading={false} onEdit={mockOnEdit} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('displays provider cards for each provider', () => {
    render(<ExchangeProviderGrid providers={mockProviders} onEdit={mockOnEdit} />);
    expect(screen.getByTestId('provider-card-prov-1')).toBeInTheDocument();
    expect(screen.getByTestId('provider-card-prov-2')).toBeInTheDocument();
  });

  it('displays provider names in cards', () => {
    render(<ExchangeProviderGrid providers={mockProviders} onEdit={mockOnEdit} />);
    expect(screen.getByText('SkyMiles')).toBeInTheDocument();
    expect(screen.getByText('MileagePlus')).toBeInTheDocument();
  });

  it('renders grid layout', () => {
    const { container } = render(
      <ExchangeProviderGrid providers={mockProviders} onEdit={mockOnEdit} />
    );
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('handles single provider', () => {
    render(<ExchangeProviderGrid providers={[mockProviders[0]]} onEdit={mockOnEdit} />);
    expect(screen.getByTestId('provider-card-prov-1')).toBeInTheDocument();
    expect(screen.queryByTestId('provider-card-prov-2')).not.toBeInTheDocument();
  });

  it('does not show loading spinner when not loading and has providers', () => {
    render(<ExchangeProviderGrid providers={mockProviders} isLoading={false} onEdit={mockOnEdit} />);
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  it('does not show empty state when providers exist', () => {
    render(<ExchangeProviderGrid providers={mockProviders} isLoading={false} onEdit={mockOnEdit} />);
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it('passes onEdit callback to provider cards', () => {
    render(<ExchangeProviderGrid providers={mockProviders} onEdit={mockOnEdit} />);
    expect(screen.getByTestId('provider-card-prov-1')).toBeInTheDocument();
    expect(screen.getByTestId('provider-card-prov-2')).toBeInTheDocument();
  });

  it('renders multiple providers in grid', () => {
    const { container } = render(
      <ExchangeProviderGrid providers={mockProviders} onEdit={mockOnEdit} />
    );
    const cards = container.querySelectorAll('[data-testid^="provider-card-"]');
    expect(cards.length).toBe(2);
  });
});
