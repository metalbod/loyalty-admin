import React from 'react';
import { renderHook } from '@testing-library/react';
import { usePartnerContext } from '../usePartnerContext.js';
import { PartnerProvider } from '../../context/PartnerContext.jsx';
import { AuthProvider } from '../../context/AuthContext.jsx';

// Mock the API client to avoid import.meta issues
jest.mock('../../api/client', () => ({
  fetchPartners: jest.fn(),
  createPartner: jest.fn(),
  configurePartnerRates: jest.fn(),
  createPartnerServiceAccount: jest.fn(),
}));

describe('usePartnerContext', () => {
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
});
