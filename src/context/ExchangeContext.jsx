import React, { createContext, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../api/client';
import { useAuth } from '../hooks/useAuth.js';

export const ExchangeContext = createContext(null);

export function ExchangeProvider({ children }) {
  const { user } = useAuth();
  const adminId = user?.email;

  const [exchangeProviders, setExchangeProviders] = useState([]);
  const [exchangeProvidersLoading, setExchangeProvidersLoading] = useState(false);

  const [exchangeRequests, setExchangeRequests] = useState({
    content: [],
    page: { number: 0, totalPages: 1, totalElements: 0 },
  });
  const [exchangeRequestsLoading, setExchangeRequestsLoading] = useState(false);

  const refreshExchangeProviders = useCallback(async () => {
    setExchangeProvidersLoading(true);
    try {
      const data = await api.fetchExchangeProviders();
      setExchangeProviders(data);
    } finally {
      setExchangeProvidersLoading(false);
    }
  }, []);

  const loadExchangeRequestsPage = useCallback(async (page = 0, status = undefined) => {
    setExchangeRequestsLoading(true);
    try {
      const data = await api.fetchExchangeRequests({ page, status });
      setExchangeRequests(data);
    } finally {
      setExchangeRequestsLoading(false);
    }
  }, []);

  const addExchangeProvider = useCallback(
    async (payload) => {
      const created = await api.createExchangeProvider(payload, adminId);
      setExchangeProviders((prev) =>
        [...prev, created].sort((a, b) => a.displayName.localeCompare(b.displayName))
      );
      return created;
    },
    [adminId]
  );

  const updateExchangeProviderConfig = useCallback(
    async (providerId, payload) => {
      const updated = await api.updateExchangeProvider(providerId, payload, adminId);
      setExchangeProviders((prev) => prev.map((p) => (p.providerId === providerId ? updated : p)));
      return updated;
    },
    [adminId]
  );

  const value = useMemo(
    () => ({
      exchangeProviders,
      exchangeProvidersLoading,
      refreshExchangeProviders,
      addExchangeProvider,
      updateExchangeProviderConfig,
      exchangeRequests,
      exchangeRequestsLoading,
      loadExchangeRequestsPage,
    }),
    [
      exchangeProviders,
      exchangeProvidersLoading,
      refreshExchangeProviders,
      addExchangeProvider,
      updateExchangeProviderConfig,
      exchangeRequests,
      exchangeRequestsLoading,
      loadExchangeRequestsPage,
    ]
  );

  return <ExchangeContext.Provider value={value}>{children}</ExchangeContext.Provider>;
}

ExchangeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
