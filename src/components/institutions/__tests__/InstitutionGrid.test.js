import React from 'react';
import { render, screen } from '@testing-library/react';
import InstitutionGrid from '../InstitutionGrid.jsx';

jest.mock('../InstitutionCard.jsx', () => ({
  __esModule: true,
  default: ({
    institution,
    onToggleStatus,
    onEditBranding,
    onEditDetails,
    onEditFeatures,
    isUpdating,
  }) => <div data-testid={`institution-card-${institution.institutionId}`}>{institution.name}</div>,
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
  Building2: () => null,
}));

describe('InstitutionGrid', () => {
  const mockInstitutions = [
    {
      institutionId: 'inst-1',
      name: 'Acme Corporation',
      slug: 'acme-corp',
      status: 'ACTIVE',
      createdAt: '2024-07-01T00:00:00Z',
    },
    {
      institutionId: 'inst-2',
      name: 'Beta Inc',
      slug: 'beta-inc',
      status: 'ACTIVE',
      createdAt: '2024-07-02T00:00:00Z',
    },
  ];

  const mockCallbacks = {
    onToggleStatus: jest.fn(),
    onEditBranding: jest.fn(),
    onEditDetails: jest.fn(),
    onEditFeatures: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading spinner when loading with no institutions', () => {
    render(<InstitutionGrid institutions={[]} isLoading={true} {...mockCallbacks} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders empty state when no institutions exist', () => {
    render(<InstitutionGrid institutions={[]} isLoading={false} {...mockCallbacks} />);
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('displays institution cards for each institution', () => {
    render(
      <InstitutionGrid institutions={mockInstitutions} isLoading={false} {...mockCallbacks} />
    );
    expect(screen.getByTestId('institution-card-inst-1')).toBeInTheDocument();
    expect(screen.getByTestId('institution-card-inst-2')).toBeInTheDocument();
  });

  it('displays institution names in cards', () => {
    render(
      <InstitutionGrid institutions={mockInstitutions} isLoading={false} {...mockCallbacks} />
    );
    expect(screen.getByText('Acme Corporation')).toBeInTheDocument();
    expect(screen.getByText('Beta Inc')).toBeInTheDocument();
  });

  it('renders grid layout', () => {
    const { container } = render(
      <InstitutionGrid institutions={mockInstitutions} isLoading={false} {...mockCallbacks} />
    );
    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
  });

  it('handles single institution', () => {
    render(
      <InstitutionGrid institutions={[mockInstitutions[0]]} isLoading={false} {...mockCallbacks} />
    );
    expect(screen.getByTestId('institution-card-inst-1')).toBeInTheDocument();
    expect(screen.queryByTestId('institution-card-inst-2')).not.toBeInTheDocument();
  });

  it('does not show loading spinner when not loading and has institutions', () => {
    render(
      <InstitutionGrid institutions={mockInstitutions} isLoading={false} {...mockCallbacks} />
    );
    expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
  });

  it('does not show empty state when institutions exist', () => {
    render(
      <InstitutionGrid institutions={mockInstitutions} isLoading={false} {...mockCallbacks} />
    );
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it('passes callbacks to institution cards', () => {
    render(
      <InstitutionGrid institutions={mockInstitutions} isLoading={false} {...mockCallbacks} />
    );
    expect(screen.getByTestId('institution-card-inst-1')).toBeInTheDocument();
    expect(screen.getByTestId('institution-card-inst-2')).toBeInTheDocument();
  });

  it('renders multiple institutions in grid', () => {
    const { container } = render(
      <InstitutionGrid institutions={mockInstitutions} isLoading={false} {...mockCallbacks} />
    );
    const cards = container.querySelectorAll('[data-testid^="institution-card-"]');
    expect(cards.length).toBe(2);
  });

  it('marks updating institution when updatingInstitutionId is set', () => {
    render(
      <InstitutionGrid
        institutions={mockInstitutions}
        isLoading={false}
        updatingInstitutionId="inst-1"
        {...mockCallbacks}
      />
    );
    expect(screen.getByTestId('institution-card-inst-1')).toBeInTheDocument();
  });

  it('applies responsive grid classes', () => {
    const { container } = render(
      <InstitutionGrid institutions={mockInstitutions} isLoading={false} {...mockCallbacks} />
    );
    const grid = container.querySelector('.grid');
    expect(grid.className).toContain('grid-cols-1');
    expect(grid.className).toContain('sm:grid-cols-2');
    expect(grid.className).toContain('lg:grid-cols-3');
  });
});
