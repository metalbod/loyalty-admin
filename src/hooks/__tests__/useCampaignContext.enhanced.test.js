import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCampaignContext } from '../useCampaignContext.js';
import { CampaignProvider } from '../../context/CampaignContext.jsx';
import { AuthProvider } from '../../context/AuthContext.jsx';

// Mock the API client
jest.mock('../../api/client', () => ({
  fetchCampaigns: jest.fn(),
  createCampaign: jest.fn(),
}));

// Mock useAuth
jest.mock('../useAuth.js', () => ({
  useAuth: jest.fn(() => ({
    user: { email: 'admin@example.com', role: 'ADMIN' },
  })),
}));

describe('useCampaignContext - Enhanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws error when used outside CampaignProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useCampaignContext());
    }).toThrow('useCampaignContext must be used within a CampaignProvider');

    consoleError.mockRestore();
  });

  it('provides context when used within CampaignProvider', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <CampaignProvider>{children}</CampaignProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useCampaignContext(), { wrapper });

    expect(result.current).toHaveProperty('campaigns');
    expect(result.current).toHaveProperty('campaignsLoading');
    expect(result.current).toHaveProperty('refreshCampaigns');
    expect(result.current).toHaveProperty('addCampaign');
  });

  it('returns initial state correctly', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <CampaignProvider>{children}</CampaignProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useCampaignContext(), { wrapper });

    expect(result.current.campaigns).toEqual([]);
    expect(result.current.campaignsLoading).toBe(false);
  });

  it('provides all required functions', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <CampaignProvider>{children}</CampaignProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useCampaignContext(), { wrapper });

    expect(typeof result.current.refreshCampaigns).toBe('function');
    expect(typeof result.current.addCampaign).toBe('function');
  });

  it('fetches campaigns on refresh', async () => {
    const mockCampaigns = [
      { campaignId: '1', name: 'Summer Sale', startTime: '2024-07-01', endTime: '2024-07-31' },
      { campaignId: '2', name: 'Back to School', startTime: '2024-08-01', endTime: '2024-08-31' },
    ];

    const { fetchCampaigns } = require('../../api/client');
    fetchCampaigns.mockResolvedValueOnce(mockCampaigns);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <CampaignProvider>{children}</CampaignProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useCampaignContext(), { wrapper });

    await act(async () => {
      await result.current.refreshCampaigns();
    });

    expect(fetchCampaigns).toHaveBeenCalled();
    expect(result.current.campaigns.length).toBe(2);
  });

  it('sets loading state during fetch', async () => {
    const { fetchCampaigns } = require('../../api/client');
    fetchCampaigns.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 100))
    );

    const wrapper = ({ children }) => (
      <AuthProvider>
        <CampaignProvider>{children}</CampaignProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useCampaignContext(), { wrapper });

    act(() => {
      result.current.refreshCampaigns();
    });

    expect(result.current.campaignsLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.campaignsLoading).toBe(false);
    });
  });

  it('adds campaign to list and sorts by startTime', async () => {
    const existingCampaigns = [
      { campaignId: '1', name: 'Campaign 1', startTime: '2024-08-01', endTime: '2024-08-31' },
    ];
    const newCampaign = {
      campaignId: '2',
      name: 'Campaign 2',
      startTime: '2024-07-01',
      endTime: '2024-07-31',
    };

    const { fetchCampaigns, createCampaign } = require('../../api/client');
    fetchCampaigns.mockResolvedValueOnce(existingCampaigns);
    createCampaign.mockResolvedValueOnce(newCampaign);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <CampaignProvider>{children}</CampaignProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useCampaignContext(), { wrapper });

    // Load initial campaigns
    await act(async () => {
      await result.current.refreshCampaigns();
    });

    expect(result.current.campaigns.length).toBe(1);

    // Add new campaign
    await act(async () => {
      await result.current.addCampaign({ name: 'Campaign 2' });
    });

    expect(result.current.campaigns.length).toBe(2);
    // Verify sorting - earlier start date should come first
    expect(result.current.campaigns[0].campaignId).toBe('2');
    expect(result.current.campaigns[1].campaignId).toBe('1');
  });

  it('returns created campaign from addCampaign', async () => {
    const newCampaign = {
      campaignId: '1',
      name: 'New Campaign',
      startTime: '2024-07-01',
      endTime: '2024-07-31',
    };

    const { createCampaign } = require('../../api/client');
    createCampaign.mockResolvedValueOnce(newCampaign);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <CampaignProvider>{children}</CampaignProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useCampaignContext(), { wrapper });

    let createdCampaign;
    await act(async () => {
      createdCampaign = await result.current.addCampaign({ name: 'New Campaign' });
    });

    expect(createdCampaign).toEqual(newCampaign);
  });

  it('passes admin email to createCampaign', async () => {
    const { createCampaign } = require('../../api/client');
    createCampaign.mockResolvedValueOnce({});

    const wrapper = ({ children }) => (
      <AuthProvider>
        <CampaignProvider>{children}</CampaignProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useCampaignContext(), { wrapper });

    const payload = { name: 'Test Campaign' };
    await act(async () => {
      await result.current.addCampaign(payload);
    });

    expect(createCampaign).toHaveBeenCalledWith(payload, 'admin@example.com');
  });

  it('handles errors in refreshCampaigns', async () => {
    const { fetchCampaigns } = require('../../api/client');
    fetchCampaigns.mockRejectedValueOnce(new Error('API Error'));

    const wrapper = ({ children }) => (
      <AuthProvider>
        <CampaignProvider>{children}</CampaignProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useCampaignContext(), { wrapper });

    await act(async () => {
      try {
        await result.current.refreshCampaigns();
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.campaignsLoading).toBe(false);
  });

  it('handles errors in addCampaign', async () => {
    const { createCampaign } = require('../../api/client');
    createCampaign.mockRejectedValueOnce(new Error('Creation failed'));

    const wrapper = ({ children }) => (
      <AuthProvider>
        <CampaignProvider>{children}</CampaignProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useCampaignContext(), { wrapper });

    await act(async () => {
      try {
        await result.current.addCampaign({ name: 'Test' });
      } catch {
        // Expected to throw
      }
    });

    expect(result.current.campaigns.length).toBe(0);
  });

  it('maintains campaign list across multiple operations', async () => {
    const campaign1 = { campaignId: '1', name: 'Campaign 1', startTime: '2024-07-01', endTime: '2024-07-31' };
    const campaign2 = { campaignId: '2', name: 'Campaign 2', startTime: '2024-08-01', endTime: '2024-08-31' };

    const { createCampaign } = require('../../api/client');
    createCampaign
      .mockResolvedValueOnce(campaign1)
      .mockResolvedValueOnce(campaign2);

    const wrapper = ({ children }) => (
      <AuthProvider>
        <CampaignProvider>{children}</CampaignProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useCampaignContext(), { wrapper });

    await act(async () => {
      await result.current.addCampaign({ name: 'Campaign 1' });
    });

    expect(result.current.campaigns.length).toBe(1);

    await act(async () => {
      await result.current.addCampaign({ name: 'Campaign 2' });
    });

    expect(result.current.campaigns.length).toBe(2);
  });
});
