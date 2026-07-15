import React, { createContext, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../api/client';
import { useAuth } from '../hooks/useAuth.js';

export const CampaignContext = createContext(null);

export function CampaignProvider({ children }) {
  const { user } = useAuth();
  const adminId = user?.email;

  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);

  const refreshCampaigns = useCallback(async () => {
    setCampaignsLoading(true);
    try {
      const data = await api.fetchCampaigns();
      setCampaigns(data);
    } finally {
      setCampaignsLoading(false);
    }
  }, []);

  const addCampaign = useCallback(
    async (payload) => {
      const created = await api.createCampaign(payload, adminId);
      setCampaigns((prev) =>
        [...prev, created].sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      );
      return created;
    },
    [adminId]
  );

  const value = useMemo(
    () => ({
      campaigns,
      campaignsLoading,
      refreshCampaigns,
      addCampaign,
    }),
    [campaigns, campaignsLoading, refreshCampaigns, addCampaign]
  );

  return <CampaignContext.Provider value={value}>{children}</CampaignContext.Provider>;
}

CampaignProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
