import React from 'react';
import { renderHook } from '@testing-library/react';
import { useCampaignContext } from '../useCampaignContext.js';
import { CampaignProvider } from '../../context/CampaignContext.jsx';
import { AuthProvider } from '../../context/AuthContext.jsx';

// Mock the API client to avoid import.meta issues
jest.mock('../../api/client', () => ({
  fetchCampaigns: jest.fn(),
  createCampaign: jest.fn(),
}));

describe('useCampaignContext', () => {
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
});
