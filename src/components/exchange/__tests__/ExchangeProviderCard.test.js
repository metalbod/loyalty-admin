import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExchangeProviderCard from '../ExchangeProviderCard.jsx';

jest.mock('../../common/Card.jsx', () => ({
  __esModule: true,
  default: ({ children, className }) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
}));

jest.mock('../../common/Badge.jsx', () => ({
  __esModule: true,
  default: ({ children, variant }) => <div data-testid={`badge-${variant}`}>{children}</div>,
}));

jest.mock('../../common/Button.jsx', () => ({
  __esModule: true,
  default: ({ children, variant, icon: Icon, fullWidth, onClick }) => (
    <button data-testid="edit-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  Settings2: () => null,
}));

describe('ExchangeProviderCard', () => {
  const mockProvider = {
    providerId: 'prov-1',
    providerCode: 'SKYMILES',
    displayName: 'SkyMiles',
    inboundPointsPerExternalUnit: 10,
    outboundPointsPerExternalUnit: 12,
    active: true,
  };

  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders card container', () => {
    render(<ExchangeProviderCard provider={mockProvider} onEdit={mockOnEdit} />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('displays provider display name', () => {
    render(<ExchangeProviderCard provider={mockProvider} onEdit={mockOnEdit} />);
    expect(screen.getByText('SkyMiles')).toBeInTheDocument();
  });

  it('displays provider code', () => {
    render(<ExchangeProviderCard provider={mockProvider} onEdit={mockOnEdit} />);
    expect(screen.getByText(/Provider code: SKYMILES/)).toBeInTheDocument();
  });

  it('shows active badge when provider is active', () => {
    render(<ExchangeProviderCard provider={mockProvider} onEdit={mockOnEdit} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByTestId('badge-emerald')).toBeInTheDocument();
  });

  it('shows inactive badge when provider is not active', () => {
    const inactiveProvider = { ...mockProvider, active: false };
    render(<ExchangeProviderCard provider={inactiveProvider} onEdit={mockOnEdit} />);
    expect(screen.getByText('Inactive')).toBeInTheDocument();
    expect(screen.getByTestId('badge-slate')).toBeInTheDocument();
  });

  it('displays inbound rate with label', () => {
    render(<ExchangeProviderCard provider={mockProvider} onEdit={mockOnEdit} />);
    expect(screen.getByText(/Inbound \(customer → us\)/)).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('displays outbound rate with label', () => {
    render(<ExchangeProviderCard provider={mockProvider} onEdit={mockOnEdit} />);
    expect(screen.getByText(/Outbound \(us → customer\)/)).toBeInTheDocument();
  });

  it('displays unit label for rates', () => {
    const { container } = render(
      <ExchangeProviderCard provider={mockProvider} onEdit={mockOnEdit} />
    );
    expect(container.textContent).toContain('pts / unit');
  });

  it('shows disabled badge when rate is null', () => {
    const providerWithoutInbound = { ...mockProvider, inboundPointsPerExternalUnit: null };
    render(<ExchangeProviderCard provider={providerWithoutInbound} onEdit={mockOnEdit} />);
    const disabledBadges = screen.getAllByTestId('badge-slate');
    expect(disabledBadges.length).toBeGreaterThan(0);
  });

  it('renders edit button', () => {
    render(<ExchangeProviderCard provider={mockProvider} onEdit={mockOnEdit} />);
    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
  });

  it('calls onEdit with provider when edit button clicked', async () => {
    const user = userEvent.setup();
    render(<ExchangeProviderCard provider={mockProvider} onEdit={mockOnEdit} />);
    const editButton = screen.getByTestId('edit-button');
    await user.click(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(mockProvider);
  });

  it('displays edit button with correct text', () => {
    render(<ExchangeProviderCard provider={mockProvider} onEdit={mockOnEdit} />);
    expect(screen.getByText('Edit provider')).toBeInTheDocument();
  });

  it('handles string rates', () => {
    const stringRateProvider = {
      ...mockProvider,
      inboundPointsPerExternalUnit: '10.5',
      outboundPointsPerExternalUnit: '12.3',
    };
    render(<ExchangeProviderCard provider={stringRateProvider} onEdit={mockOnEdit} />);
    expect(screen.getByText('10.5')).toBeInTheDocument();
  });
});
