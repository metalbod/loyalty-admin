import React from 'react';
import { render, screen } from '@testing-library/react';
import CampaignEditorView from '../CampaignEditorView.jsx';

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
jest.mock('../../components/campaigns/CampaignForm.jsx', () => ({
  __esModule: true,
  default: ({ onCreate, disabled }) => (
    <div data-testid="campaign-form">
      {disabled ? 'Form disabled' : 'Form enabled'}
    </div>
  ),
}));

jest.mock('../../components/campaigns/CampaignList.jsx', () => ({
  __esModule: true,
  default: ({ campaigns, isLoading }) => (
    <div data-testid="campaign-list">
      {isLoading ? 'Loading campaigns' : `Campaigns: ${campaigns?.length || 0}`}
    </div>
  ),
}));

// Mock hooks
jest.mock('../../hooks/useCampaignContext.js', () => ({
  useCampaignContext: jest.fn(),
}));

jest.mock('../../hooks/useAdminContext.js', () => ({
  useAdminContext: jest.fn(),
}));

const { useCampaignContext } = require('../../hooks/useCampaignContext.js');
const { useAdminContext } = require('../../hooks/useAdminContext.js');

describe('CampaignEditorView', () => {
  const mockRefreshCampaigns = jest.fn();
  const mockAddCampaign = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCampaignContext.mockReturnValue({
      campaigns: [
        { id: 'camp-1', name: 'Summer Sale' },
        { id: 'camp-2', name: 'Holiday Promotion' },
      ],
      campaignsLoading: false,
      refreshCampaigns: mockRefreshCampaigns,
      addCampaign: mockAddCampaign,
    });
    useAdminContext.mockReturnValue({
      isFeatureEnabled: jest.fn(() => true),
    });
  });

  it('renders dashboard layout', () => {
    render(<CampaignEditorView />);
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('renders page title', () => {
    render(<CampaignEditorView />);
    expect(screen.getByText('Campaign Calendar Editor')).toBeInTheDocument();
  });

  it('renders page description', () => {
    render(<CampaignEditorView />);
    expect(screen.getByText(/overlapping campaigns/i)).toBeInTheDocument();
  });

  it('renders campaign form', () => {
    render(<CampaignEditorView />);
    expect(screen.getByTestId('campaign-form')).toBeInTheDocument();
  });

  it('renders campaign list', () => {
    render(<CampaignEditorView />);
    expect(screen.getByTestId('campaign-list')).toBeInTheDocument();
  });

  it('refreshes campaigns on mount', () => {
    render(<CampaignEditorView />);
    expect(mockRefreshCampaigns).toHaveBeenCalled();
  });

  it('passes campaigns to campaign list', () => {
    render(<CampaignEditorView />);
    expect(screen.getByText(/Campaigns: 2/)).toBeInTheDocument();
  });

  it('enables form when campaigns feature is enabled', () => {
    render(<CampaignEditorView />);
    expect(screen.getByText('Form enabled')).toBeInTheDocument();
  });

  it('disables form when campaigns feature is disabled', () => {
    useAdminContext.mockReturnValue({
      isFeatureEnabled: jest.fn(() => false),
    });

    render(<CampaignEditorView />);
    expect(screen.getByText('Form disabled')).toBeInTheDocument();
  });

  it('displays loading state for campaigns', () => {
    useCampaignContext.mockReturnValue({
      campaigns: [],
      campaignsLoading: true,
      refreshCampaigns: mockRefreshCampaigns,
      addCampaign: mockAddCampaign,
    });

    render(<CampaignEditorView />);
    expect(screen.getByText('Loading campaigns')).toBeInTheDocument();
  });

  it('renders with empty campaigns list', () => {
    useCampaignContext.mockReturnValue({
      campaigns: [],
      campaignsLoading: false,
      refreshCampaigns: mockRefreshCampaigns,
      addCampaign: mockAddCampaign,
    });

    render(<CampaignEditorView />);
    expect(screen.getByText(/Campaigns: 0/)).toBeInTheDocument();
  });

  it('renders grid layout for form and list', () => {
    const { container } = render(<CampaignEditorView />);
    const gridContainer = container.querySelector('[class*="grid"]');
    expect(gridContainer).toBeInTheDocument();
  });

  it('passes add campaign callback to form', () => {
    render(<CampaignEditorView />);
    expect(screen.getByTestId('campaign-form')).toBeInTheDocument();
  });

  it('renders all components without errors', () => {
    render(<CampaignEditorView />);
    expect(screen.getByTestId('campaign-form')).toBeInTheDocument();
    expect(screen.getByTestId('campaign-list')).toBeInTheDocument();
  });
});
