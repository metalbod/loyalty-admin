import React from 'react';
import { renderHook } from '@testing-library/react';
import { useExchangeContext } from '../useExchangeContext.js';
import { ExchangeProvider } from '../../context/ExchangeContext.jsx';
import { AuthProvider } from '../../context/AuthContext.jsx';

// Mock the API client to avoid import.meta issues
jest.mock('../../api/client', () => ({
  fetchExchangeProviders: jest.fn(),
  fetchExchangeRequests: jest.fn(),
  createExchangeProvider: jest.fn(),
  updateExchangeProvider: jest.fn(),
}));

describe('useExchangeContext', () => {
  it('throws error when used outside ExchangeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useExchangeContext());
    }).toThrow('useExchangeContext must be used within an ExchangeProvider');

    consoleError.mockRestore();
  });

  it('provides context when used within ExchangeProvider', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    expect(result.current).toHaveProperty('exchangeProviders');
    expect(result.current).toHaveProperty('exchangeProvidersLoading');
    expect(result.current).toHaveProperty('refreshExchangeProviders');
    expect(result.current).toHaveProperty('exchangeRequests');
    expect(result.current).toHaveProperty('exchangeRequestsLoading');
    expect(result.current).toHaveProperty('loadExchangeRequestsPage');
    expect(result.current).toHaveProperty('addExchangeProvider');
    expect(result.current).toHaveProperty('updateExchangeProviderConfig');
  });

  it('returns initial state correctly', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    expect(result.current.exchangeProviders).toEqual([]);
    expect(result.current.exchangeProvidersLoading).toBe(false);
    expect(result.current.exchangeRequests).toHaveProperty('content');
    expect(result.current.exchangeRequests).toHaveProperty('page');
  });

  it('provides all required functions', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    expect(typeof result.current.refreshExchangeProviders).toBe('function');
    expect(typeof result.current.addExchangeProvider).toBe('function');
    expect(typeof result.current.updateExchangeProviderConfig).toBe('function');
    expect(typeof result.current.loadExchangeRequestsPage).toBe('function');
  });
});
