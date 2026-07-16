import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute.jsx';

// Mock useAuth hook
jest.mock('../../../hooks/useAuth.js', () => ({
  useAuth: jest.fn(),
}));

const { useAuth } = require('../../../hooks/useAuth.js');

// Test component to render inside ProtectedRoute
function ProtectedContent() {
  return <div data-testid="protected-content">Protected Content</div>;
}

function LoginPage() {
  return <div data-testid="login-page">Login Page</div>;
}

function SuperAdminPage() {
  return <div data-testid="superadmin-page">SuperAdmin Page</div>;
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when user is authenticated and not superadmin', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'ROLE_ADMIN', email: 'admin@example.com' },
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/superadmin/institutions" element={<SuperAdminPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/superadmin/institutions" element={<SuperAdminPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('redirects superadmin to /superadmin/institutions', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'ROLE_SUPERADMIN', email: 'super@example.com' },
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/superadmin/institutions" element={<SuperAdminPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('superadmin-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('renders children when user role is ROLE_ADMIN', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      user: { role: 'ROLE_ADMIN' },
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <ProtectedContent />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('does not render children when authentication state is false', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('handles null user when not authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('verifies unauthenticated user sees login page not protected content', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <ProtectedContent />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});
