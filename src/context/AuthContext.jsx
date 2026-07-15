import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../api/client';
import { setToken, setUnauthorizedHandler } from '../api/authToken';
import { applyBrandTheme, resetBrandTheme } from '../utils/theme.js';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // user is the single source of truth for "am I logged in" - there is no separate
  // persistence/rehydration step to run on mount, because the token deliberately isn't
  // persisted anywhere (see api/authToken.js). A fresh page load always starts logged out.
  const [user, setUser] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  const login = useCallback(async (email, password) => {
    const response = await api.login(email, password);
    setToken(response.token);
    setSessionExpired(false);
    // institutionId/institutionName/logoDataUrl/primaryColor are null for a superadmin, who
    // belongs to no institution.
    const loggedInUser = {
      email: response.email,
      role: response.role,
      institutionId: response.institutionId,
      institutionName: response.institutionName,
      logoDataUrl: response.logoDataUrl,
      primaryColor: response.primaryColor,
    };
    setUser(loggedInUser);
    applyBrandTheme(response.primaryColor);
    return loggedInUser;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    resetBrandTheme();
  }, []);

  // Wired to the fetch interceptor: any request that comes back 401 (expired/invalid token)
  // calls this, distinct from a manual logout() so the login page can explain why the user
  // landed back there instead of silently showing an empty form.
  const handleSessionExpired = useCallback(() => {
    setToken(null);
    setUser(null);
    setSessionExpired(true);
    resetBrandTheme();
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(handleSessionExpired);
    return () => setUnauthorizedHandler(() => {});
  }, [handleSessionExpired]);

  const acknowledgeSessionExpired = useCallback(() => setSessionExpired(false), []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      sessionExpired,
      login,
      logout,
      acknowledgeSessionExpired,
    }),
    [user, sessionExpired, login, logout, acknowledgeSessionExpired]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
