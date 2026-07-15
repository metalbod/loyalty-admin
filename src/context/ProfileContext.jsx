import React, { createContext, useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import * as api from '../api/client';
import { useAuth } from '../hooks/useAuth.js';

export const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { user } = useAuth();
  const adminId = user?.email;

  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(false);

  const refreshProfiles = useCallback(async () => {
    setProfilesLoading(true);
    try {
      const data = await api.fetchProfiles();
      setProfiles(data);
    } finally {
      setProfilesLoading(false);
    }
  }, []);

  const addProfile = useCallback(
    async (payload) => {
      const created = await api.createProfile(payload, adminId);
      setProfiles((prev) =>
        [...prev, created].sort((a, b) => a.profileName.localeCompare(b.profileName))
      );
      return created;
    },
    [adminId]
  );

  const updateProfileRates = useCallback(
    async (profileId, rates) => {
      const config = await api.configureProfileRates(profileId, rates, adminId);
      setProfiles((prev) => prev.map((p) => (p.profileId === profileId ? { ...p, config } : p)));
      return config;
    },
    [adminId]
  );

  const value = useMemo(
    () => ({
      profiles,
      profilesLoading,
      refreshProfiles,
      addProfile,
      updateProfileRates,
    }),
    [profiles, profilesLoading, refreshProfiles, addProfile, updateProfileRates]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

ProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
