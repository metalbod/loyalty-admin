import React, { createContext, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../api/client';
import { useAuth } from '../hooks/useAuth.js';

export const PartnerContext = createContext(null);

export function PartnerProvider({ children }) {
  const { user } = useAuth();
  const adminId = user?.email;

  const [partners, setPartners] = useState([]);
  const [partnersLoading, setPartnersLoading] = useState(false);

  const refreshPartners = useCallback(async () => {
    setPartnersLoading(true);
    try {
      const data = await api.fetchPartners();
      setPartners(data);
    } finally {
      setPartnersLoading(false);
    }
  }, []);

  const addPartner = useCallback(
    async (payload) => {
      const created = await api.createPartner(payload, adminId);
      setPartners((prev) => [...prev, created].sort((a, b) => a.partnerName.localeCompare(b.partnerName)));
      return created;
    },
    [adminId],
  );

  const updatePartnerRates = useCallback(
    async (partnerId, rates) => {
      const config = await api.configurePartnerRates(partnerId, rates, adminId);
      setPartners((prev) => prev.map((p) => (p.partnerId === partnerId ? { ...p, config } : p)));
      return config;
    },
    [adminId],
  );

  const createPartnerServiceAccount = useCallback(
    async (partnerId, payload) => {
      return api.createPartnerServiceAccount(partnerId, payload, adminId);
    },
    [adminId],
  );

  const value = useMemo(
    () => ({
      partners,
      partnersLoading,
      refreshPartners,
      addPartner,
      updatePartnerRates,
      createPartnerServiceAccount,
    }),
    [partners, partnersLoading, refreshPartners, addPartner, updatePartnerRates, createPartnerServiceAccount],
  );

  return <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>;
}

PartnerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
