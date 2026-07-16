import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InstitutionManagerView from '../InstitutionManagerView.jsx';

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
jest.mock('../../components/institutions/InstitutionGrid.jsx', () => ({
  __esModule: true,
  default: ({ institutions, isLoading }) => (
    <div data-testid="institution-grid">
      {isLoading ? 'Loading institutions' : `Institutions: ${institutions?.length || 0}`}
    </div>
  ),
}));

jest.mock('../../components/institutions/CreateInstitutionModal.jsx', () => ({
  __esModule: true,
  default: ({ isOpen }) =>
    isOpen ? <div data-testid="create-institution-modal">Create Modal</div> : null,
}));

jest.mock('../../components/institutions/EditBrandingModal.jsx', () => ({
  __esModule: true,
  default: ({ isOpen }) =>
    isOpen ? <div data-testid="edit-branding-modal">Branding Modal</div> : null,
}));

jest.mock('../../components/institutions/EditInstitutionModal.jsx', () => ({
  __esModule: true,
  default: ({ isOpen }) =>
    isOpen ? <div data-testid="edit-institution-modal">Details Modal</div> : null,
}));

jest.mock('../../components/institutions/FeatureFlagsModal.jsx', () => ({
  __esModule: true,
  default: ({ isOpen }) =>
    isOpen ? <div data-testid="feature-flags-modal">Features Modal</div> : null,
}));

jest.mock('../../components/common/Button.jsx', () => ({
  __esModule: true,
  default: ({ children, onClick }) => (
    <button onClick={onClick} data-testid="create-button">
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  PlusCircle: () => null,
}));

// Mock API client
jest.mock('../../api/client.js', () => ({
  fetchInstitutions: jest.fn(),
  createInstitution: jest.fn(),
  updateInstitutionBranding: jest.fn(),
  updateInstitutionDetails: jest.fn(),
  updateInstitutionFeatureFlags: jest.fn(),
}));

// Mock useAuth
jest.mock('../../hooks/useAuth.js', () => ({
  useAuth: jest.fn(),
}));

const api = require('../../api/client.js');
const { useAuth } = require('../../hooks/useAuth.js');

describe('InstitutionManagerView', () => {
  const mockInstitutions = [
    { institutionId: 'inst-1', name: 'Bank A' },
    { institutionId: 'inst-2', name: 'Bank B' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: { email: 'admin@example.com' },
    });
    api.fetchInstitutions.mockResolvedValue(mockInstitutions);
    api.createInstitution.mockResolvedValue({ institutionId: 'inst-3', name: 'Bank C' });
    api.updateInstitutionBranding.mockResolvedValue(mockInstitutions[0]);
    api.updateInstitutionDetails.mockResolvedValue(mockInstitutions[0]);
    api.updateInstitutionFeatureFlags.mockResolvedValue(mockInstitutions[0]);
  });

  it('renders dashboard layout', () => {
    render(<InstitutionManagerView />);
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('renders page title', () => {
    render(<InstitutionManagerView />);
    expect(screen.getByText('Institutions')).toBeInTheDocument();
  });

  it('renders page description', () => {
    render(<InstitutionManagerView />);
    expect(screen.getByText(/Create and manage the institutions/i)).toBeInTheDocument();
  });

  it('renders create institution button', () => {
    render(<InstitutionManagerView />);
    expect(screen.getByTestId('create-button')).toBeInTheDocument();
  });

  it('renders institution grid', () => {
    render(<InstitutionManagerView />);
    expect(screen.getByTestId('institution-grid')).toBeInTheDocument();
  });

  it('loads institutions on mount', () => {
    render(<InstitutionManagerView />);
    expect(api.fetchInstitutions).toHaveBeenCalled();
  });

  it('displays institution count', async () => {
    render(<InstitutionManagerView />);
    await waitFor(() => {
      expect(screen.getByText(/Institutions: 2/)).toBeInTheDocument();
    });
  });

  it('opens create modal when button clicked', async () => {
    const user = userEvent.setup();
    render(<InstitutionManagerView />);

    const button = screen.getByTestId('create-button');
    await user.click(button);

    expect(screen.getByTestId('create-institution-modal')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    api.fetchInstitutions.mockImplementation(() => new Promise(() => {}));
    render(<InstitutionManagerView />);
    expect(screen.getByText('Loading institutions')).toBeInTheDocument();
  });

  it('renders with empty institutions list', async () => {
    api.fetchInstitutions.mockResolvedValue([]);
    render(<InstitutionManagerView />);
    await waitFor(() => {
      expect(screen.getByText(/Institutions: 0/)).toBeInTheDocument();
    });
  });

  it('renders all components without errors', () => {
    render(<InstitutionManagerView />);
    expect(screen.getByTestId('institution-grid')).toBeInTheDocument();
    expect(screen.getByTestId('create-button')).toBeInTheDocument();
  });
});
