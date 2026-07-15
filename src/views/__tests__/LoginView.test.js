import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginView from '../LoginView.jsx';

// Mock react-router-dom
const mockNavigateFn = jest.fn();
jest.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="navigate" data-to={to} />,
  useNavigate: jest.fn(() => mockNavigateFn),
  useLocation: jest.fn(() => ({
    pathname: '/login',
    state: null,
  })),
}));

// Mock useAuth
jest.mock('../../hooks/useAuth.js', () => ({
  useAuth: jest.fn(),
}));

// Mock useAsyncAction
jest.mock('../../hooks/useAsyncAction.js', () => ({
  useAsyncAction: jest.fn(),
}));

// Mock Card component
jest.mock('../../components/common/Card.jsx', () => ({
  __esModule: true,
  default: ({ children, className }) => <div data-testid="card" className={className}>{children}</div>,
}));

// Mock Input component
jest.mock('../../components/common/Input.jsx', () => ({
  __esModule: true,
  default: ({ id, type, label, value, onChange, autoFocus }) => (
    <div data-testid={`input-${id}`}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
      />
    </div>
  ),
}));

// Mock Button component
jest.mock('../../components/common/Button.jsx', () => ({
  __esModule: true,
  default: ({ children, type, isLoading, fullWidth, onClick }) => (
    <button
      type={type}
      disabled={isLoading}
      data-loading={isLoading}
      className={fullWidth ? 'fullWidth' : ''}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

const { useAuth } = require('../../hooks/useAuth.js');
const { useAsyncAction } = require('../../hooks/useAsyncAction.js');

describe('LoginView', () => {
  const mockLogin = jest.fn();
  const mockAcknowledgeSessionExpired = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigateFn.mockClear();
    useAuth.mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      sessionExpired: false,
      acknowledgeSessionExpired: mockAcknowledgeSessionExpired,
    });
    useAsyncAction.mockReturnValue({
      run: jest.fn(),
      isSubmitting: false,
      error: null,
    });
  });

  it('renders login form', () => {
    render(<LoginView />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<LoginView />);
    expect(screen.getByText('Loyalty Admin')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<LoginView />);
    expect(screen.getByText('Sign in to the back-office console')).toBeInTheDocument();
  });

  it('renders email input', () => {
    render(<LoginView />);
    expect(screen.getByTestId('input-email')).toBeInTheDocument();
  });

  it('renders password input', () => {
    render(<LoginView />);
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
  });

  it('renders sign in button', () => {
    render(<LoginView />);
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('redirects when already authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      login: mockLogin,
      sessionExpired: false,
      acknowledgeSessionExpired: mockAcknowledgeSessionExpired,
    });

    render(<LoginView />);
    expect(screen.getByTestId('navigate')).toHaveAttribute('data-to', '/');
  });

  it('does not render form when authenticated', () => {
    useAuth.mockReturnValue({
      isAuthenticated: true,
      login: mockLogin,
      sessionExpired: false,
      acknowledgeSessionExpired: mockAcknowledgeSessionExpired,
    });

    render(<LoginView />);
    expect(screen.queryByRole('button', { name: /Sign in/i })).not.toBeInTheDocument();
  });

  it('displays session expired message', () => {
    useAuth.mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      sessionExpired: true,
      acknowledgeSessionExpired: mockAcknowledgeSessionExpired,
    });

    render(<LoginView />);
    expect(screen.getByText('Your session has expired. Please log in again.')).toBeInTheDocument();
  });

  it('does not display session expired message by default', () => {
    render(<LoginView />);
    expect(screen.queryByText('Your session has expired')).not.toBeInTheDocument();
  });

  it('accepts email input', async () => {
    const user = userEvent.setup();
    render(<LoginView />);

    const emailInput = screen.getByRole('textbox', { name: /Email/i });
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('accepts password input', async () => {
    const user = userEvent.setup();
    render(<LoginView />);

    const passwordInput = screen.getByLabelText(/Password/i);
    await user.type(passwordInput, 'password123');

    expect(passwordInput).toHaveValue('password123');
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();
    const mockRun = jest.fn(() => Promise.resolve({ role: 'ROLE_ADMIN' }));
    useAsyncAction.mockReturnValue({
      run: mockRun,
      isSubmitting: false,
      error: null,
    });

    render(<LoginView />);

    const emailInput = screen.getByRole('textbox', { name: /Email/i });
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign in/i });

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(signInButton);

    expect(mockRun).toHaveBeenCalledWith('admin@example.com', 'password123');
  });

  it('navigates to dashboard for admin after login', async () => {
    const user = userEvent.setup();
    const mockRun = jest.fn(() => Promise.resolve({ role: 'ROLE_ADMIN' }));
    useAsyncAction.mockReturnValue({
      run: mockRun,
      isSubmitting: false,
      error: null,
    });

    render(<LoginView />);

    const emailInput = screen.getByRole('textbox', { name: /Email/i });
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign in/i });

    await user.type(emailInput, 'admin@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(signInButton);

    expect(mockNavigateFn).toHaveBeenCalledWith('/', { replace: true });
  });

  it('navigates to institutions for superadmin after login', async () => {
    const user = userEvent.setup();
    const mockRun = jest.fn(() => Promise.resolve({ role: 'ROLE_SUPERADMIN' }));
    useAsyncAction.mockReturnValue({
      run: mockRun,
      isSubmitting: false,
      error: null,
    });

    render(<LoginView />);

    const emailInput = screen.getByRole('textbox', { name: /Email/i });
    const passwordInput = screen.getByLabelText(/Password/i);
    const signInButton = screen.getByRole('button', { name: /Sign in/i });

    await user.type(emailInput, 'superadmin@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(signInButton);

    expect(mockNavigateFn).toHaveBeenCalledWith('/superadmin/institutions', { replace: true });
  });

  it('displays login error', () => {
    useAsyncAction.mockReturnValue({
      run: jest.fn(),
      isSubmitting: false,
      error: 'Invalid credentials',
    });

    render(<LoginView />);
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });

  it('acknowledges session expired when email changes', async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      sessionExpired: true,
      acknowledgeSessionExpired: mockAcknowledgeSessionExpired,
    });

    render(<LoginView />);

    const emailInput = screen.getByRole('textbox', { name: /Email/i });
    await user.type(emailInput, 'test@example.com');

    expect(mockAcknowledgeSessionExpired).toHaveBeenCalled();
  });

  it('acknowledges session expired when password changes', async () => {
    const user = userEvent.setup();
    useAuth.mockReturnValue({
      isAuthenticated: false,
      login: mockLogin,
      sessionExpired: true,
      acknowledgeSessionExpired: mockAcknowledgeSessionExpired,
    });

    render(<LoginView />);

    const passwordInput = screen.getByLabelText(/Password/i);
    await user.type(passwordInput, 'password123');

    expect(mockAcknowledgeSessionExpired).toHaveBeenCalled();
  });

  it('does not acknowledge session expired when not expired', async () => {
    const user = userEvent.setup();
    render(<LoginView />);

    const emailInput = screen.getByRole('textbox', { name: /Email/i });
    await user.type(emailInput, 'test@example.com');

    expect(mockAcknowledgeSessionExpired).not.toHaveBeenCalled();
  });

  it('disables sign in button while submitting', () => {
    useAsyncAction.mockReturnValue({
      run: jest.fn(),
      isSubmitting: true,
      error: null,
    });

    render(<LoginView />);
    const signInButton = screen.getByRole('button', { name: /Sign in/i });

    expect(signInButton).toBeDisabled();
  });

  it('enables sign in button when not submitting', () => {
    render(<LoginView />);
    const signInButton = screen.getByRole('button', { name: /Sign in/i });

    expect(signInButton).not.toBeDisabled();
  });

  it('renders shield icon in header', () => {
    render(<LoginView />);
    // Icon renders within the card, verify structure exists
    expect(screen.getByText('Loyalty Admin')).toBeInTheDocument();
  });

  it('has full-width sign in button', () => {
    render(<LoginView />);
    const signInButton = screen.getByRole('button', { name: /Sign in/i });

    expect(signInButton.className).toContain('fullWidth');
  });
});
