import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SuperAdminRoute from '../SuperAdminRoute.jsx';

// Mock useAuth hook
jest.mock('../../../hooks/useAuth.js', () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = require('../../../hooks/useAuth.js');

// Test component to render inside SuperAdminRoute
function SuperAdminContent() {
  return <div data-testid="superadmin-content">SuperAdmin Content</div>;
}

function LoginPage() {
  return <div data-testid="login-page">Login Page</div>;
}

function HomePage() {
  return <div data-testid="home-page">Home Page</div>;
}

describe('SuperAdminRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when user is authenticated superadmin', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'ROLE_SUPERADMIN', email: 'super@example.com' },
    });

    render(
      <MemoryRouter>
        <SuperAdminRoute>
          <SuperAdminContent />
        </SuperAdminRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('superadmin-content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/superadmin/institutions']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/superadmin/institutions"
            element={
              <SuperAdminRoute>
                <SuperAdminContent />
              </SuperAdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('superadmin-content')).not.toBeInTheDocument();
  });

  it('redirects regular admin to / (home)', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'ROLE_ADMIN', email: 'admin@example.com' },
    });

    render(
      <MemoryRouter initialEntries={['/superadmin/institutions']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/superadmin/institutions"
            element={
              <SuperAdminRoute>
                <SuperAdminContent />
              </SuperAdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.queryByTestId('superadmin-content')).not.toBeInTheDocument();
  });

  it('rejects authenticated non-superadmin users', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: {
        role: 'ROLE_ADMIN',
        email: 'admin@example.com',
        institutionName: 'Bank A',
      },
    });

    render(
      <MemoryRouter initialEntries={['/superadmin/institutions']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/superadmin/institutions"
            element={
              <SuperAdminRoute>
                <SuperAdminContent />
              </SuperAdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.queryByTestId('superadmin-content')).not.toBeInTheDocument();
  });

  it('accepts only ROLE_SUPERADMIN role', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'ROLE_SUPERADMIN' },
    });

    render(
      <MemoryRouter>
        <SuperAdminRoute>
          <SuperAdminContent />
        </SuperAdminRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('superadmin-content')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to login', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/superadmin/institutions']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/superadmin/institutions"
            element={
              <SuperAdminRoute>
                <SuperAdminContent />
              </SuperAdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('handles user with no role property as non-superadmin', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { email: 'test@example.com' },
    });

    render(
      <MemoryRouter initialEntries={['/superadmin/institutions']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/superadmin/institutions"
            element={
              <SuperAdminRoute>
                <SuperAdminContent />
              </SuperAdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.queryByTestId('superadmin-content')).not.toBeInTheDocument();
  });

  it('does not render children for regular admin users', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'ROLE_ADMIN' },
    });

    render(
      <MemoryRouter initialEntries={['/superadmin/institutions']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/superadmin/institutions"
            element={
              <SuperAdminRoute>
                <SuperAdminContent />
              </SuperAdminRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('superadmin-content')).not.toBeInTheDocument();
  });
});
