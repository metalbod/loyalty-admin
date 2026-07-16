import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InstitutionCard from '../InstitutionCard.jsx';

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
  default: ({ children, variant }) => (
    <div data-testid={`badge-${variant}`}>{children}</div>
  ),
}));

jest.mock('../../common/Button.jsx', () => ({
  __esModule: true,
  default: ({ children, variant, icon: Icon, fullWidth, isLoading, onClick }) => (
    <button data-testid={`button-${variant}`} disabled={isLoading} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  Ban: () => null,
  Building2: () => null,
  Palette: () => null,
  PencilLine: () => null,
  PlayCircle: () => null,
  ToggleLeft: () => null,
}));

jest.mock('../../../utils/dateUtils.js', () => ({
  formatDateTime: (date) => '2024-07-16 12:00 PM',
}));

describe('InstitutionCard', () => {
  const mockInstitution = {
    institutionId: 'inst-1',
    name: 'Acme Corporation',
    slug: 'acme-corp',
    status: 'ACTIVE',
    logoDataUrl: null,
    primaryColor: '#0066cc',
    adminEmail: 'admin@acme.com',
    createdAt: '2024-07-01T00:00:00Z',
  };

  const mockCallbacks = {
    onToggleStatus: jest.fn(),
    onEditBranding: jest.fn(),
    onEditDetails: jest.fn(),
    onEditFeatures: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders card container', () => {
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('displays institution name', () => {
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
  });

  it('displays institution slug', () => {
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    expect(screen.getByText('acme-corp')).toBeInTheDocument();
  });

  it('displays active status badge in emerald', () => {
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByTestId('badge-emerald')).toBeInTheDocument();
  });

  it('displays suspended status badge in rose', () => {
    const suspendedInstitution = { ...mockInstitution, status: 'SUSPENDED' };
    render(
      <InstitutionCard institution={suspendedInstitution} {...mockCallbacks} />
    );
    expect(screen.getByText('SUSPENDED')).toBeInTheDocument();
    expect(screen.getByTestId('badge-rose')).toBeInTheDocument();
  });

  it('displays creation date', () => {
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    expect(screen.getByText(/Created 2024-07-16/)).toBeInTheDocument();
  });

  it('includes primary color in rendering', () => {
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('renders edit button', () => {
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('renders branding button', () => {
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    expect(screen.getByText('Branding')).toBeInTheDocument();
  });

  it('renders features button', () => {
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders suspend button when active', () => {
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    expect(screen.getByText('Suspend')).toBeInTheDocument();
  });

  it('renders reactivate button when suspended', () => {
    const suspendedInstitution = { ...mockInstitution, status: 'SUSPENDED' };
    render(
      <InstitutionCard institution={suspendedInstitution} {...mockCallbacks} />
    );
    expect(screen.getByText('Reactivate')).toBeInTheDocument();
  });

  it('calls onEditDetails when edit button clicked', async () => {
    const user = userEvent.setup();
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    const editButton = screen.getByText('Edit');
    await user.click(editButton);
    expect(mockCallbacks.onEditDetails).toHaveBeenCalledWith(mockInstitution);
  });

  it('calls onEditBranding when branding button clicked', async () => {
    const user = userEvent.setup();
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    const brandingButton = screen.getByText('Branding');
    await user.click(brandingButton);
    expect(mockCallbacks.onEditBranding).toHaveBeenCalledWith(mockInstitution);
  });

  it('calls onEditFeatures when features button clicked', async () => {
    const user = userEvent.setup();
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    const featuresButton = screen.getByText('Features');
    await user.click(featuresButton);
    expect(mockCallbacks.onEditFeatures).toHaveBeenCalledWith(mockInstitution);
  });

  it('calls onToggleStatus with suspend status when active', async () => {
    const user = userEvent.setup();
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    const suspendButton = screen.getByText('Suspend');
    await user.click(suspendButton);
    expect(mockCallbacks.onToggleStatus).toHaveBeenCalledWith(mockInstitution, 'SUSPENDED');
  });

  it('calls onToggleStatus with active status when suspended', async () => {
    const user = userEvent.setup();
    const suspendedInstitution = { ...mockInstitution, status: 'SUSPENDED' };
    render(
      <InstitutionCard institution={suspendedInstitution} {...mockCallbacks} />
    );
    const reactivateButton = screen.getByText('Reactivate');
    await user.click(reactivateButton);
    expect(mockCallbacks.onToggleStatus).toHaveBeenCalledWith(suspendedInstitution, 'ACTIVE');
  });

  it('shows loading state on suspend button', () => {
    render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} isUpdating={true} />
    );
    const suspendButton = screen.getByText('Suspend');
    expect(suspendButton.disabled).toBe(true);
  });

  it('renders building icon when no logo', () => {
    const { container } = render(
      <InstitutionCard institution={mockInstitution} {...mockCallbacks} />
    );
    expect(container.querySelector('.bg-sky-50')).toBeInTheDocument();
  });
});
