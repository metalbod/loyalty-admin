import React, { createContext, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../api/client';
import { LEDGER_PAGE_SIZE } from '../constants';
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

  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);

  const [activityFeed, setActivityFeed] = useState({
    content: [],
    page: 0,
    pageSize: LEDGER_PAGE_SIZE,
    totalElements: 0,
    totalPages: 1,
  });
  const [activityFeedLoading, setActivityFeedLoading] = useState(false);

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

  const refreshCampaigns = useCallback(async () => {
    setCampaignsLoading(true);
    try {
      const data = await api.fetchCampaigns();
      setCampaigns(data);
    } finally {
      setCampaignsLoading(false);
    }
  }, []);

  const loadActivityPage = useCallback(async (page = 0) => {
    setActivityFeedLoading(true);
    try {
      const data = await api.fetchActivityFeed({ page, pageSize: LEDGER_PAGE_SIZE });
      setActivityFeed(data);
    } finally {
      setActivityFeedLoading(false);
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
      campaigns,
      campaignsLoading,
      refreshCampaigns,
      addCampaign,
      activityFeed,
      activityFeedLoading,
      loadActivityPage,
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
      campaigns,
      campaignsLoading,
      refreshCampaigns,
      addCampaign,
      activityFeed,
      activityFeedLoading,
      loadActivityPage,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

AdminProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
