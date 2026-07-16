import React from 'react';
import { render, screen } from '@testing-library/react';
import GlobalSettingsView from '../GlobalSettingsView.jsx';

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

// Mock Card component
jest.mock('../../components/common/Card.jsx', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ children }) => <div data-testid="card-header">{children}</div>,
}));

// Mock useAdminContext
jest.mock('../../hooks/useAdminContext.js', () => ({
  useAdminContext: jest.fn(),
}));

// Mock useAsyncAction
jest.mock('../../hooks/useAsyncAction.js', () => ({
  useAsyncAction: jest.fn(),
}));

// Mock child components to avoid complex nested renders
jest.mock('../../components/common/Input.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="input-component" />,
}));

jest.mock('../../components/common/Button.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="button-component" />,
}));

const { useAdminContext } = require('../../hooks/useAdminContext.js');
const { useAsyncAction } = require('../../hooks/useAsyncAction.js');

describe('GlobalSettingsView', () => {
  const mockConfigurations = [
    {
      configKey: 'EARN_RATE_CENTS_PER_POINT',
      configValue: 100,
      description: 'Global earn rate',
    },
    {
      configKey: 'BURN_RATE_POINTS_PER_CENT',
      configValue: 50,
      description: 'Global burn rate',
    },
    {
      configKey: 'POINTS_VALIDITY_DAYS',
      configValue: 365,
      description: 'Points validity',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAdminContext.mockReturnValue({
      configurations: mockConfigurations,
      configurationsLoading: false,
      refreshConfigurations: jest.fn(),
      updateConfigurationValue: jest.fn(),
    });
    useAsyncAction.mockReturnValue({
      run: jest.fn(() => Promise.resolve()),
      isSubmitting: false,
      error: null,
      reset: jest.fn(),
    });
  });

  it('renders dashboard layout', () => {
    render(<GlobalSettingsView />);
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('renders page title', () => {
    render(<GlobalSettingsView />);
    expect(screen.getByText('Global Settings')).toBeInTheDocument();
  });

  it('renders page description', () => {
    render(<GlobalSettingsView />);
    expect(screen.getByText(/Institution-wide/i)).toBeInTheDocument();
  });

  it('renders card container', () => {
    render(<GlobalSettingsView />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('renders input components for configurations', () => {
    render(<GlobalSettingsView />);
    const inputs = screen.getAllByTestId('input-component');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('renders save buttons for configurations', () => {
    render(<GlobalSettingsView />);
    const buttons = screen.getAllByTestId('button-component');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('displays loading state when loading', () => {
    useAdminContext.mockReturnValue({
      configurations: [],
      configurationsLoading: true,
      refreshConfigurations: jest.fn(),
      updateConfigurationValue: jest.fn(),
    });

    render(<GlobalSettingsView />);
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('renders with empty configurations', () => {
    useAdminContext.mockReturnValue({
      configurations: [],
      configurationsLoading: false,
      refreshConfigurations: jest.fn(),
      updateConfigurationValue: jest.fn(),
    });

    render(<GlobalSettingsView />);
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('renders with single configuration', () => {
    useAdminContext.mockReturnValue({
      configurations: [mockConfigurations[0]],
      configurationsLoading: false,
      refreshConfigurations: jest.fn(),
      updateConfigurationValue: jest.fn(),
    });

    render(<GlobalSettingsView />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('renders with all configurations', () => {
    render(<GlobalSettingsView />);
    const inputs = screen.getAllByTestId('input-component');
    expect(inputs.length).toBe(3);
  });

  it('renders card header', () => {
    render(<GlobalSettingsView />);
    expect(screen.getByTestId('card-header')).toBeInTheDocument();
  });
});
