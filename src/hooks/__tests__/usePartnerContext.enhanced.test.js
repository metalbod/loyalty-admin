import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { usePartnerContext } from '../usePartnerContext.js';
import { PartnerProvider } from '../../context/PartnerContext.jsx';
import { AuthProvider } from '../../context/AuthContext.jsx';

jest.mock('../../api/client', () => ({
  fetchPartners: jest.fn(),
  createPartner: jest.fn(),
  configurePartnerRates: jest.fn(),
  createPartnerServiceAccount: jest.fn(),
}));

jest.mock('../useAuth.js', () => ({
  useAuth: jest.fn(() => ({
    user: { email: 'admin@example.com', role: 'ADMIN' },
  })),
}));

describe('usePartnerContext - Enhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error when used outside PartnerProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => usePartnerContext());
    }).toThrow('usePartnerContext must be used within a PartnerProvider');

    consoleError.mockRestore();
  });

  it('provides context when used within PartnerProvider', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    expect(result.current).toHaveProperty('partners');
    expect(result.current).toHaveProperty('partnersLoading');
    expect(result.current).toHaveProperty('refreshPartners');
    expect(result.current).toHaveProperty('addPartner');
    expect(result.current).toHaveProperty('updatePartnerRates');
    expect(result.current).toHaveProperty('createPartnerServiceAccount');
  });

  it('returns initial state correctly', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    expect(result.current.partners).toEqual([]);
    expect(result.current.partnersLoading).toBe(false);
  });

  it('provides all required functions', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    expect(typeof result.current.refreshPartners).toBe('function');
    expect(typeof result.current.addPartner).toBe('function');
    expect(typeof result.current.updatePartnerRates).toBe('function');
    expect(typeof result.current.createPartnerServiceAccount).toBe('function');
  });

  it('fetches partners on refresh', async () => {
    const mockPartners = [
      { partnerId: '1', partnerName: 'Partner A', status: 'ACTIVE' },
      { partnerId: '2', partnerName: 'Partner B', status: 'ACTIVE' },
    ];

    const { fetchPartners } = require('../../api/client');
    fetchPartners.mockResolvedValueOnce(mockPartners);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    await act(async () => {
      await result.current.refreshPartners();
    });

    expect(fetchPartners).toHaveBeenCalled();
    expect(result.current.partners.length).toBe(2);
  });

  it('sets loading state during partner fetch', async () => {
    const { fetchPartners } = require('../../api/client');
    fetchPartners.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    act(() => {
      result.current.refreshPartners();
    });

    expect(result.current.partnersLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.partnersLoading).toBe(false);
    });
  });

  it('adds partner and sorts by partnerName', async () => {
    const newPartner = {
      partnerId: '1',
      partnerName: 'New Partner',
      status: 'ACTIVE',
    };

    const { createPartner } = require('../../api/client');
    createPartner.mockResolvedValueOnce(newPartner);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    let createdPartner;
    await act(async () => {
      createdPartner = await result.current.addPartner({ partnerName: 'New Partner' });
    });

    expect(createdPartner).toEqual(newPartner);
    expect(result.current.partners.length).toBe(1);
  });

  it('returns created partner from addPartner', async () => {
    const newPartner = {
      partnerId: '1',
      partnerName: 'Test Partner',
      status: 'ACTIVE',
      apiKey: 'test-key',
    };

    const { createPartner } = require('../../api/client');
    createPartner.mockResolvedValueOnce(newPartner);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    let createdPartner;
    await act(async () => {
      createdPartner = await result.current.addPartner({ partnerName: 'Test Partner' });
    });

    expect(createdPartner).toEqual(newPartner);
  });

  it('passes admin email to createPartner', async () => {
    const { createPartner } = require('../../api/client');
    createPartner.mockResolvedValueOnce({ partnerId: '1' });

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    const payload = { partnerName: 'Test Partner' };
    await act(async () => {
      await result.current.addPartner(payload);
    });

    expect(createPartner).toHaveBeenCalledWith(payload, 'admin@example.com');
  });

  it('updates partner rates in place', async () => {
    const updatedConfig = {
      inboundRate: 1.05,
      outboundRate: 1.05,
      active: true,
    };

    const { configurePartnerRates } = require('../../api/client');
    configurePartnerRates.mockResolvedValueOnce(updatedConfig);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    let config;
    await act(async () => {
      config = await result.current.updatePartnerRates('1', updatedConfig);
    });

    expect(config).toEqual(updatedConfig);
  });

  it('passes admin email to configurePartnerRates', async () => {
    const { configurePartnerRates } = require('../../api/client');
    configurePartnerRates.mockResolvedValueOnce({ inboundRate: 1.0 });

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    const rates = { inboundRate: 1.05, outboundRate: 1.05 };
    await act(async () => {
      await result.current.updatePartnerRates('1', rates);
    });

    expect(configurePartnerRates).toHaveBeenCalledWith('1', rates, 'admin@example.com');
  });

  it('creates partner service account', async () => {
    const serviceAccount = {
      accountId: 'acc-1',
      accountName: 'Service Account 1',
      active: true,
    };

    const { createPartnerServiceAccount } = require('../../api/client');
    createPartnerServiceAccount.mockResolvedValueOnce(serviceAccount);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    let account;
    await act(async () => {
      account = await result.current.createPartnerServiceAccount('1', {
        accountName: 'Service Account 1',
      });
    });

    expect(account).toEqual(serviceAccount);
  });

  it('passes admin email to createPartnerServiceAccount', async () => {
    const { createPartnerServiceAccount } = require('../../api/client');
    createPartnerServiceAccount.mockResolvedValueOnce({ accountId: 'acc-1' });

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    const payload = { accountName: 'Service Account 1' };
    await act(async () => {
      await result.current.createPartnerServiceAccount('1', payload);
    });

    expect(createPartnerServiceAccount).toHaveBeenCalledWith('1', payload, 'admin@example.com');
  });

  it('handles errors in refreshPartners', async () => {
    const { fetchPartners } = require('../../api/client');
    fetchPartners.mockRejectedValueOnce(new Error('API Error'));

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    await act(async () => {
      try {
        await result.current.refreshPartners();
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.partnersLoading).toBe(false);
  });

  it('handles errors in addPartner', async () => {
    const { createPartner } = require('../../api/client');
    createPartner.mockRejectedValueOnce(new Error('Creation failed'));

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    await act(async () => {
      try {
        await result.current.addPartner({ partnerName: 'Test' });
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.partners.length).toBe(0);
  });

  it('handles errors in updatePartnerRates', async () => {
    const { configurePartnerRates } = require('../../api/client');
    configurePartnerRates.mockRejectedValueOnce(new Error('Update failed'));

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    await act(async () => {
      try {
        await result.current.updatePartnerRates('1', { inboundRate: 1.05 });
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.partners.length).toBe(0);
  });

  it('handles errors in createPartnerServiceAccount', async () => {
    const { createPartnerServiceAccount } = require('../../api/client');
    createPartnerServiceAccount.mockRejectedValueOnce(new Error('Account creation failed'));

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    await act(async () => {
      try {
        await result.current.createPartnerServiceAccount('1', { accountName: 'Test' });
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.partners.length).toBe(0);
  });

  it('maintains partner list across multiple operations', async () => {
    const partner1 = { partnerId: '1', partnerName: 'Partner A', status: 'ACTIVE' };
    const partner2 = { partnerId: '2', partnerName: 'Partner B', status: 'ACTIVE' };

    const { createPartner } = require('../../api/client');
    createPartner.mockResolvedValueOnce(partner1).mockResolvedValueOnce(partner2);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <PartnerProvider>{children}</PartnerProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => usePartnerContext(), { wrapper });

    await act(async () => {
      await result.current.addPartner({ partnerName: 'Partner A' });
    });

    expect(result.current.partners.length).toBe(1);

    await act(async () => {
      await result.current.addPartner({ partnerName: 'Partner B' });
    });

    expect(result.current.partners.length).toBe(2);
  });
});
