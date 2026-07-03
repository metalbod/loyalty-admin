import React from 'react';
import PropTypes from 'prop-types';
import { Layers } from 'lucide-react';
import ProfileCard from './ProfileCard.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import EmptyState from '../common/EmptyState.jsx';

export function ProfileGrid({ profiles, isLoading = false, onConfigureRates }) {
  if (isLoading && profiles.length === 0) {
    return <LoadingSpinner label="Loading profiles…" />;
  }

  if (!isLoading && profiles.length === 0) {
    return (
      <EmptyState
        icon={Layers}
        title="No tiers yet"
        description="Create your first profile tier to start configuring custom rates."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {profiles.map((profile) => (
        <ProfileCard key={profile.profileId} profile={profile} onConfigureRates={onConfigureRates} />
      ))}
    </div>
  );
}

ProfileGrid.propTypes = {
  profiles: PropTypes.arrayOf(
    PropTypes.shape({
      profileId: PropTypes.string.isRequired,
      profileName: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
  onConfigureRates: PropTypes.func.isRequired,
};

export default ProfileGrid;
