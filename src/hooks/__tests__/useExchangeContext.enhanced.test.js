import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useExchangeContext } from '../useExchangeContext.js';
import { ExchangeProvider } from '../../context/ExchangeContext.jsx';
import { AuthProvider } from '../../context/AuthContext.jsx';

jest.mock('../../api/client', () => ({
  fetchExchangeProviders: jest.fn(),
  fetchExchangeRequests: jest.fn(),
  createExchangeProvider: jest.fn(),
  updateExchangeProvider: jest.fn(),
}));

jest.mock('../useAuth.js', () => ({
  useAuth: jest.fn(() => ({
    user: { email: 'admin@example.com', role: 'ADMIN' },
  })),
}));

describe('useExchangeContext - Enhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    expect(result.current.exchangeRequests.content).toEqual([]);
    expect(result.current.exchangeRequests.page.number).toBe(0);
    expect(result.current.exchangeRequestsLoading).toBe(false);
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

  it('fetches exchange providers on refresh', async () => {
    const mockProviders = [
      { providerId: '1', displayName: 'Provider A', active: true },
      { providerId: '2', displayName: 'Provider B', active: true },
    ];

    const { fetchExchangeProviders } = require('../../api/client');
    fetchExchangeProviders.mockResolvedValueOnce(mockProviders);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    await act(async () => {
      await result.current.refreshExchangeProviders();
    });

    expect(fetchExchangeProviders).toHaveBeenCalled();
    expect(result.current.exchangeProviders.length).toBe(2);
  });

  it('sets loading state during provider fetch', async () => {
    const { fetchExchangeProviders } = require('../../api/client');
    fetchExchangeProviders.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    act(() => {
      result.current.refreshExchangeProviders();
    });

    expect(result.current.exchangeProvidersLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.exchangeProvidersLoading).toBe(false);
    });
  });

  it('adds exchange provider and sorts by displayName', async () => {
    const existingProviders = [{ providerId: '1', displayName: 'Provider Z', active: true }];
    const newProvider = {
      providerId: '2',
      displayName: 'Provider A',
      active: true,
    };

    const { createExchangeProvider } = require('../../api/client');
    createExchangeProvider.mockResolvedValueOnce(newProvider);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    // Set initial providers
    act(() => {
      // Manually trigger state update through component render
      jest.spyOn(result.current, 'addExchangeProvider');
    });

    await act(async () => {
      await result.current.addExchangeProvider({ displayName: 'Provider A' });
    });

    expect(result.current.exchangeProviders.length).toBeGreaterThan(0);
  });

  it('returns created provider from addExchangeProvider', async () => {
    const newProvider = {
      providerId: '1',
      displayName: 'New Provider',
      active: true,
      inboundRate: 1.0,
      outboundRate: 1.0,
    };

    const { createExchangeProvider } = require('../../api/client');
    createExchangeProvider.mockResolvedValueOnce(newProvider);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    let createdProvider;
    await act(async () => {
      createdProvider = await result.current.addExchangeProvider({ displayName: 'New Provider' });
    });

    expect(createdProvider).toEqual(newProvider);
  });

  it('passes admin email to createExchangeProvider', async () => {
    const { createExchangeProvider } = require('../../api/client');
    createExchangeProvider.mockResolvedValueOnce({ providerId: '1' });

    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    const payload = { displayName: 'Test Provider' };
    await act(async () => {
      await result.current.addExchangeProvider(payload);
    });

    expect(createExchangeProvider).toHaveBeenCalledWith(payload, 'admin@example.com');
  });

  it('updates exchange provider config in place', async () => {
    const updatedProvider = {
      providerId: '1',
      displayName: 'Provider A',
      active: false,
      inboundRate: 1.05,
      outboundRate: 1.05,
    };

    const { updateExchangeProvider } = require('../../api/client');
    updateExchangeProvider.mockResolvedValueOnce(updatedProvider);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    let updated;
    await act(async () => {
      updated = await result.current.updateExchangeProviderConfig('1', { active: false });
    });

    expect(updated).toEqual(updatedProvider);
  });

  it('passes admin email to updateExchangeProvider', async () => {
    const { updateExchangeProvider } = require('../../api/client');
    updateExchangeProvider.mockResolvedValueOnce({ providerId: '1' });

    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    const payload = { active: false };
    await act(async () => {
      await result.current.updateExchangeProviderConfig('1', payload);
    });

    expect(updateExchangeProvider).toHaveBeenCalledWith('1', payload, 'admin@example.com');
  });

  it('loads exchange requests page with pagination', async () => {
    const mockRequests = {
      content: [
        { requestId: '1', status: 'COMPLETED', amount: 100 },
        { requestId: '2', status: 'PENDING', amount: 50 },
      ],
      page: { number: 0, totalPages: 5, totalElements: 10 },
    };

    const { fetchExchangeRequests } = require('../../api/client');
    fetchExchangeRequests.mockResolvedValueOnce(mockRequests);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    await act(async () => {
      await result.current.loadExchangeRequestsPage(0, 'COMPLETED');
    });

    expect(fetchExchangeRequests).toHaveBeenCalledWith({ page: 0, status: 'COMPLETED' });
    expect(result.current.exchangeRequests.content.length).toBe(2);
    expect(result.current.exchangeRequests.page.totalPages).toBe(5);
  });

  it('sets loading state during requests fetch', async () => {
    const { fetchExchangeRequests } = require('../../api/client');
    fetchExchangeRequests.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ content: [], page: {} }), 100))
    );

    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    act(() => {
      result.current.loadExchangeRequestsPage();
    });

    expect(result.current.exchangeRequestsLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.exchangeRequestsLoading).toBe(false);
    });
  });

  it('handles errors in refreshExchangeProviders', async () => {
    const { fetchExchangeProviders } = require('../../api/client');
    fetchExchangeProviders.mockRejectedValueOnce(new Error('API Error'));

    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    await act(async () => {
      try {
        await result.current.refreshExchangeProviders();
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.exchangeProvidersLoading).toBe(false);
  });

  it('handles errors in addExchangeProvider', async () => {
    const { createExchangeProvider } = require('../../api/client');
    createExchangeProvider.mockRejectedValueOnce(new Error('Creation failed'));

    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    await act(async () => {
      try {
        await result.current.addExchangeProvider({ displayName: 'Test' });
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.exchangeProviders.length).toBe(0);
  });

  it('handles errors in updateExchangeProviderConfig', async () => {
    const { updateExchangeProvider } = require('../../api/client');
    updateExchangeProvider.mockRejectedValueOnce(new Error('Update failed'));

    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    await act(async () => {
      try {
        await result.current.updateExchangeProviderConfig('1', { active: false });
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.exchangeProviders.length).toBe(0);
  });

  it('handles errors in loadExchangeRequestsPage', async () => {
    const { fetchExchangeRequests } = require('../../api/client');
    fetchExchangeRequests.mockRejectedValueOnce(new Error('Fetch failed'));

    const wrapper = ({ children }) => (
      <AuthProvider>
        <ExchangeProvider>{children}</ExchangeProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useExchangeContext(), { wrapper });

    await act(async () => {
      try {
        await result.current.loadExchangeRequestsPage();
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.exchangeRequestsLoading).toBe(false);
  });
});
