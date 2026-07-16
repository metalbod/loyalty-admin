import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth.js';
import { AuthProvider } from '../../context/AuthContext.jsx';
import * as authToken from '../../api/authToken';
import * as themeUtils from '../../utils/theme.js';

jest.mock('../../api/client', () => ({
  login: jest.fn(),
}));

jest.mock('../../api/authToken', () => ({
  setToken: jest.fn(),
  setUnauthorizedHandler: jest.fn(),
}));

jest.mock('../../utils/theme.js', () => ({
  applyBrandTheme: jest.fn(),
  resetBrandTheme: jest.fn(),
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error when used outside AuthProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
    consoleError.mockRestore();
  });

  it('provides auth context when used within AuthProvider', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('isAuthenticated');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
    expect(result.current).toHaveProperty('sessionExpired');
    expect(result.current).toHaveProperty('acknowledgeSessionExpired');
  });

  it('returns initial state correctly', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.sessionExpired).toBe(false);
  });

  it('provides function references', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.acknowledgeSessionExpired).toBe('function');
  });

  it('updates isAuthenticated based on user state', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('sets token and applies theme on login success', async () => {
    const mockLoginResponse = {
      token: 'test-token',
      email: 'admin@example.com',
      role: 'ADMIN',
      institutionId: 'inst-1',
      institutionName: 'Test',
      logoDataUrl: null,
      primaryColor: '#0066cc',
    };

    const { login: mockLogin } = require('../../api/client');
    mockLogin.mockResolvedValueOnce(mockLoginResponse);

    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('admin@example.com', 'password');
    });

    expect(authToken.setToken).toHaveBeenCalledWith('test-token');
    expect(themeUtils.applyBrandTheme).toHaveBeenCalledWith('#0066cc');
  });

  it('clears token and theme on logout', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(authToken.setToken).toHaveBeenCalledWith(null);
    expect(themeUtils.resetBrandTheme).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('sets up unauthorized handler on mount', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    renderHook(() => useAuth(), { wrapper });
    expect(authToken.setUnauthorizedHandler).toHaveBeenCalled();
  });

  it('acknowledges session expired flag', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.sessionExpired).toBe(false);

    act(() => {
      result.current.acknowledgeSessionExpired();
    });

    expect(result.current.sessionExpired).toBe(false);
  });
});
