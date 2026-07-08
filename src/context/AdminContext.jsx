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

  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(false);

  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(false);

  const [exchangeProviders, setExchangeProviders] = useState([]);
  const [exchangeProvidersLoading, setExchangeProvidersLoading] = useState(false);

  const [exchangeRequests, setExchangeRequests] = useState({
    content: [],
    page: { number: 0, totalPages: 1, totalElements: 0 },
  });
  const [exchangeRequestsLoading, setExchangeRequestsLoading] = useState(false);

  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);

  const [configurations, setConfigurations] = useState([]);
  const [configurationsLoading, setConfigurationsLoading] = useState(false);

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

  const refreshProfiles = useCallback(async () => {
    setProfilesLoading(true);
    try {
      const data = await api.fetchProfiles();
      setProfiles(data);
    } finally {
      setProfilesLoading(false);
    }
  }, []);

  const refreshPartners = useCallback(async () => {
    setPartnersLoading(true);
    try {
      const data = await api.fetchPartners();
      setPartners(data);
    } finally {
      setPartnersLoading(false);
    }
  }, []);

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

  const refreshCampaigns = useCallback(async () => {
    setCampaignsLoading(true);
    try {
      const data = await api.fetchCampaigns();
      setCampaigns(data);
    } finally {
      setCampaignsLoading(false);
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

  const updateConfigurationValue = useCallback(async (configKey, payload) => {
    const updated = await api.updateConfiguration(configKey, payload, adminId);
    setConfigurations((prev) => prev.map((c) => (c.configKey === configKey ? updated : c)));
    return updated;
  }, [adminId]);

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

  const addProfile = useCallback(async (payload) => {
    const created = await api.createProfile(payload, adminId);
    setProfiles((prev) => [...prev, created].sort((a, b) => a.profileName.localeCompare(b.profileName)));
    return created;
  }, [adminId]);

  const updateProfileRates = useCallback(async (profileId, rates) => {
    const config = await api.configureProfileRates(profileId, rates, adminId);
    setProfiles((prev) => prev.map((p) => (p.profileId === profileId ? { ...p, config } : p)));
    return config;
  }, [adminId]);

  const addPartner = useCallback(async (payload) => {
    const created = await api.createPartner(payload, adminId);
    setPartners((prev) => [...prev, created].sort((a, b) => a.partnerName.localeCompare(b.partnerName)));
    return created;
  }, [adminId]);

  const updatePartnerRates = useCallback(async (partnerId, rates) => {
    const config = await api.configurePartnerRates(partnerId, rates, adminId);
    setPartners((prev) => prev.map((p) => (p.partnerId === partnerId ? { ...p, config } : p)));
    return config;
  }, [adminId]);

  const createPartnerServiceAccount = useCallback(async (partnerId, payload) => {
    return api.createPartnerServiceAccount(partnerId, payload, adminId);
  }, [adminId]);

  const addExchangeProvider = useCallback(async (payload) => {
    const created = await api.createExchangeProvider(payload, adminId);
    setExchangeProviders((prev) => [...prev, created].sort((a, b) => a.displayName.localeCompare(b.displayName)));
    return created;
  }, [adminId]);

  const updateExchangeProviderConfig = useCallback(async (providerId, payload) => {
    const updated = await api.updateExchangeProvider(providerId, payload, adminId);
    setExchangeProviders((prev) => prev.map((p) => (p.providerId === providerId ? updated : p)));
    return updated;
  }, [adminId]);

  const addCampaign = useCallback(async (payload) => {
    const created = await api.createCampaign(payload, adminId);
    setCampaigns((prev) => [...prev, created].sort((a, b) => new Date(a.startTime) - new Date(b.startTime)));
    return created;
  }, [adminId]);

  const value = useMemo(
    () => ({
      adminId,
      metrics,
      metricsLoading,
      refreshMetrics,
      profiles,
      profilesLoading,
      refreshProfiles,
      addProfile,
      updateProfileRates,
      partners,
      partnersLoading,
      refreshPartners,
      addPartner,
      updatePartnerRates,
      createPartnerServiceAccount,
      exchangeProviders,
      exchangeProvidersLoading,
      refreshExchangeProviders,
      addExchangeProvider,
      updateExchangeProviderConfig,
      exchangeRequests,
      exchangeRequestsLoading,
      loadExchangeRequestsPage,
      campaigns,
      campaignsLoading,
      refreshCampaigns,
      addCampaign,
      configurations,
      configurationsLoading,
      refreshConfigurations,
      updateConfigurationValue,
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
      profiles,
      profilesLoading,
      refreshProfiles,
      addProfile,
      updateProfileRates,
      partners,
      partnersLoading,
      refreshPartners,
      addPartner,
      updatePartnerRates,
      createPartnerServiceAccount,
      exchangeProviders,
      exchangeProvidersLoading,
      refreshExchangeProviders,
      addExchangeProvider,
      updateExchangeProviderConfig,
      exchangeRequests,
      exchangeRequestsLoading,
      loadExchangeRequestsPage,
      campaigns,
      campaignsLoading,
      refreshCampaigns,
      addCampaign,
      configurations,
      configurationsLoading,
      refreshConfigurations,
      updateConfigurationValue,
      activityFeed,
      activityFeedLoading,
      loadActivityPage,
      wallets,
      walletsLoading,
      loadWalletsPage,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

AdminProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
