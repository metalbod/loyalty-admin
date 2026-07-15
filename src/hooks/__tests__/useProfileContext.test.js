import React from 'react';
import { renderHook } from '@testing-library/react';
import { useProfileContext } from '../useProfileContext.js';
import { ProfileProvider } from '../../context/ProfileContext.jsx';
import { AuthProvider } from '../../context/AuthContext.jsx';

// Mock the API client to avoid import.meta issues
jest.mock('../../api/client', () => ({
  fetchProfiles: jest.fn(),
  createProfile: jest.fn(),
  configureProfileRates: jest.fn(),
}));

describe('useProfileContext', () => {
  it('throws error when used outside ProfileProvider', () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useProfileContext());
    }).toThrow('useProfileContext must be used within a ProfileProvider');

    consoleError.mockRestore();
  });

  it('provides context when used within ProfileProvider', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <ProfileProvider>{children}</ProfileProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useProfileContext(), { wrapper });

    expect(result.current).toHaveProperty('profiles');
    expect(result.current).toHaveProperty('profilesLoading');
    expect(result.current).toHaveProperty('refreshProfiles');
    expect(result.current).toHaveProperty('addProfile');
    expect(result.current).toHaveProperty('updateProfileRates');
  });

  it('returns initial state correctly', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <ProfileProvider>{children}</ProfileProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useProfileContext(), { wrapper });

    expect(result.current.profiles).toEqual([]);
    expect(result.current.profilesLoading).toBe(false);
  });

  it('provides function references', () => {
    const wrapper = ({ children }) => (
      <AuthProvider>
        <ProfileProvider>{children}</ProfileProvider>
      </AuthProvider>
    );
    const { result } = renderHook(() => useProfileContext(), { wrapper });

    expect(typeof result.current.refreshProfiles).toBe('function');
    expect(typeof result.current.addProfile).toBe('function');
    expect(typeof result.current.updateProfileRates).toBe('function');
  });
});
