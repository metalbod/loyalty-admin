// IMPORTANT: All mocks MUST come before any imports of actual modules
jest.mock('../../api/client.js', () => ({
  // API client mock - prevents import.meta.env errors
}));

jest.mock('react-router-dom', () => ({
  NavLink: () => null,
}));

jest.mock('../../hooks/useAuth.js', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../hooks/useAdminContext.js', () => ({
  useAdminContext: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  Activity: () => null,
  Users: () => null,
  CalendarClock: () => null,
  Building2: () => null,
  Wallet: () => null,
  Handshake: () => null,
  Settings: () => null,
  Repeat: () => null,
  ShieldCheck: () => null,
  LogOut: () => null,
}));

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../Sidebar.jsx';

const { useAuth } = require('../../hooks/useAuth.js');
const { useAdminContext } = require('../../hooks/useAdminContext.js');

describe('Sidebar', () => {
  const mockLogout = jest.fn();
  const mockRefreshFeatureFlags = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: {
        email: 'admin@example.com',
        role: 'ROLE_ADMIN',
        institutionName: 'Acme Bank',
      },
      logout: mockLogout,
    });
    useAdminContext.mockReturnValue({
      refreshFeatureFlags: mockRefreshFeatureFlags,
      isFeatureEnabled: jest.fn(() => true),
    });
  });

  it('renders user email', () => {
    render(<Sidebar />);
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
  });

  it('renders user role', () => {
    const { container } = render(<Sidebar />);
    expect(container.textContent).toContain('ROLE_ADMIN');
  });

  it('renders institution name when provided', () => {
    render(<Sidebar />);
    expect(screen.getByText('Acme Bank')).toBeInTheDocument();
  });

  it('renders app title', () => {
    render(<Sidebar />);
    expect(screen.getByText('Loyalty Admin')).toBeInTheDocument();
  });

  it('renders back-office console subtitle', () => {
    render(<Sidebar />);
    expect(screen.getByText('Back-office console')).toBeInTheDocument();
  });

  it('calls logout when logout button clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const logoutButton = screen.getByTitle('Log out');
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalled();
  });

  it('refreshes feature flags on mount for admin', () => {
    render(<Sidebar />);
    expect(mockRefreshFeatureFlags).toHaveBeenCalled();
  });

  it('does not refresh feature flags for superadmin', () => {
    useAuth.mockReturnValue({
      user: {
        email: 'super@example.com',
        role: 'ROLE_SUPERADMIN',
      },
      logout: mockLogout,
    });

    render(<Sidebar />);
    expect(mockRefreshFeatureFlags).not.toHaveBeenCalled();
  });

  it('handles missing institution name gracefully', () => {
    useAuth.mockReturnValue({
      user: {
        email: 'admin@example.com',
        role: 'ROLE_ADMIN',
      },
      logout: mockLogout,
    });

    render(<Sidebar />);
    expect(screen.queryByText(/institution/i)).not.toBeInTheDocument();
  });

  it('displays API base URL info', () => {
    const { container } = render(<Sidebar />);
    expect(container.textContent).toContain('Live API');
  });
});
