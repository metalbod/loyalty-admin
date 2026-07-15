import React, { createContext, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../api/client';
import { LEDGER_PAGE_SIZE, WALLETS_PAGE_SIZE } from '../constants';
import { useAuth } from '../hooks/useAuth.js';

export const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  // The X-Admin-Id header is attribution for the audit log ("who made this change"), not
  // authentication - that's handled by the Authorization: Bearer header the fetch
  // interceptor attaches. AdminProvider is mounted for the whole app (including the public
  // /login route), so `user` can be null here; that's harmless because every function below
  // is only ever invoked from views that live behind ProtectedRoute, by which point login()
  // has already populated it.
  const { user } = useAuth();
  const adminId = user?.email;

  const [metrics, setMetrics] = useState(null);
  const [metricsLoading, setMetricsLoading] = useState(false);

  const [configurations, setConfigurations] = useState([]);
  const [configurationsLoading, setConfigurationsLoading] = useState(false);

  const [featureFlags, setFeatureFlags] = useState([]);
  const [featureFlagsLoading, setFeatureFlagsLoading] = useState(false);

  const [activityFeed, setActivityFeed] = useState({
    content: [],
    page: 0,
    pageSize: LEDGER_PAGE_SIZE,
    totalElements: 0,
    totalPages: 1,
  });
  const [activityFeedLoading, setActivityFeedLoading] = useState(false);

  const [wallets, setWallets] = useState({
    content: [],
    page: { number: 0, totalPages: 1, totalElements: 0 },
  });
  const [walletsLoading, setWalletsLoading] = useState(false);

  const refreshMetrics = useCallback(async () => {
    setMetricsLoading(true);
    try {
      const data = await api.fetchMetrics();
      setMetrics(data);
    } finally {
      setMetricsLoading(false);
    }
  }, []);

  const refreshConfigurations = useCallback(async () => {
    setConfigurationsLoading(true);
    try {
      const data = await api.fetchConfigurations();
      setConfigurations(data);
    } finally {
      setConfigurationsLoading(false);
    }
  }, []);

  const updateConfigurationValue = useCallback(
    async (configKey, payload) => {
      const updated = await api.updateConfiguration(configKey, payload, adminId);
      setConfigurations((prev) => prev.map((c) => (c.configKey === configKey ? updated : c)));
      return updated;
    },
    [adminId]
  );

  const refreshFeatureFlags = useCallback(async () => {
    setFeatureFlagsLoading(true);
    try {
      const data = await api.fetchFeatureFlags();
      setFeatureFlags(data);
    } finally {
      setFeatureFlagsLoading(false);
    }
  }, []);

  // Missing entries default to enabled, same as the backend's FeatureFlagService.isEnabled -
  // featureFlags stays [] for a superadmin session (nothing ever calls refreshFeatureFlags
  // for that role), so this is harmlessly always-true there too.
  const isFeatureEnabled = useCallback(
    (featureKey) => featureFlags.find((f) => f.featureKey === featureKey)?.enabled ?? true,
    [featureFlags]
  );

  const loadActivityPage = useCallback(async (page = 0) => {
    setActivityFeedLoading(true);
    try {
      const data = await api.fetchActivityFeed({ page, pageSize: LEDGER_PAGE_SIZE });
      setActivityFeed(data);
    } finally {
      setActivityFeedLoading(false);
    }
  }, []);

  const loadWalletsPage = useCallback(async (page = 0, sort = 'userId,asc') => {
    setWalletsLoading(true);
    try {
      const data = await api.fetchWallets({ page, size: WALLETS_PAGE_SIZE, sort });
      setWallets(data);
    } finally {
      setWalletsLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({
      adminId,
      metrics,
      metricsLoading,
      refreshMetrics,
      configurations,
      configurationsLoading,
      refreshConfigurations,
      updateConfigurationValue,
      featureFlags,
      featureFlagsLoading,
      refreshFeatureFlags,
      isFeatureEnabled,
      activityFeed,
      activityFeedLoading,
      loadActivityPage,
      wallets,
      walletsLoading,
      loadWalletsPage,
    }),
    [
      adminId,
      metrics,
      metricsLoading,
      refreshMetrics,
      configurations,
      configurationsLoading,
      refreshConfigurations,
      updateConfigurationValue,
      featureFlags,
      featureFlagsLoading,
      refreshFeatureFlags,
      isFeatureEnabled,
      activityFeed,
      activityFeedLoading,
      loadActivityPage,
      wallets,
      walletsLoading,
      loadWalletsPage,
    ]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

AdminProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
