import React from 'react';
import { renderHook } from '@testing-library/react';
import { useAdminContext } from '../useAdminContext.js';
import { AdminProvider } from '../../context/AdminContext.jsx';
import { AuthProvider } from '../../context/AuthContext.jsx';

// Mock the API client to avoid import.meta issues
jest.mock('../../api/client', () => ({
  fetchMetrics: jest.fn(),
  fetchConfigurations: jest.fn(),
  fetchFeatureFlags: jest.fn(),
  fetchActivityFeed: jest.fn(),
  fetchWallets: jest.fn(),
  fetchWallet: jest.fn(),
}));

describe('useAdminContext', () => {
  it('throws error when used outside AdminProvider', () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useAdminContext());
    }).toThrow('useAdminContext must be used within an AdminProvider');

    consoleError.mockRestore();
  });

  it('provides context when used within AdminProvider', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <AdminProvider>{children}</AdminProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useAdminContext(), { wrapper });

    expect(result.current).toHaveProperty('metrics');
    expect(result.current).toHaveProperty('metricsLoading');
    expect(result.current).toHaveProperty('refreshMetrics');
  });

  it('returns initial state correctly', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <AdminProvider>{children}</AdminProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useAdminContext(), { wrapper });

    expect(result.current.metrics).toBeNull();
    expect(result.current.metricsLoading).toBe(false);
    expect(result.current.configurations).toEqual([]);
    expect(result.current.configurationsLoading).toBe(false);
  });

  it('provides metrics properties', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <AdminProvider>{children}</AdminProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useAdminContext(), { wrapper });

    expect(typeof result.current.refreshMetrics).toBe('function');
    expect(result.current).toHaveProperty('metricsLoading');
  });

  it('provides configuration properties', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <AdminProvider>{children}</AdminProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useAdminContext(), { wrapper });

    expect(typeof result.current.refreshConfigurations).toBe('function');
    expect(result.current).toHaveProperty('configurationsLoading');
  });

  it('provides feature flags properties', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <AdminProvider>{children}</AdminProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useAdminContext(), { wrapper });

    expect(typeof result.current.refreshFeatureFlags).toBe('function');
    expect(result.current).toHaveProperty('featureFlagsLoading');
  });

  it('provides activity feed properties', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <AdminProvider>{children}</AdminProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useAdminContext(), { wrapper });

    expect(typeof result.current.loadActivityPage).toBe('function');
    expect(result.current).toHaveProperty('activityFeedLoading');
    expect(result.current).toHaveProperty('activityFeed');
  });

  it('provides wallets properties', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <AdminProvider>{children}</AdminProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useAdminContext(), { wrapper });

    expect(typeof result.current.loadWalletsPage).toBe('function');
    expect(result.current).toHaveProperty('walletsLoading');
    expect(result.current).toHaveProperty('wallets');
  });

  it('provides function references', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <AdminProvider>{children}</AdminProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useAdminContext(), { wrapper });

    expect(typeof result.current.refreshMetrics).toBe('function');
    expect(typeof result.current.refreshConfigurations).toBe('function');
    expect(typeof result.current.refreshFeatureFlags).toBe('function');
    expect(typeof result.current.loadActivityPage).toBe('function');
    expect(typeof result.current.loadWalletsPage).toBe('function');
  });
});
