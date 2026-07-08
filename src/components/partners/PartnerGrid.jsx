import React from 'react';
import PropTypes from 'prop-types';
import { Handshake } from 'lucide-react';
import PartnerCard from './PartnerCard.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import EmptyState from '../common/EmptyState.jsx';

export function PartnerGrid({ partners, isLoading = false, onConfigureRates, onCreateServiceAccount }) {
  if (isLoading && partners.length === 0) {
    return <LoadingSpinner label="Loading partners…" />;
  }

  if (!isLoading && partners.length === 0) {
    return (
      <EmptyState
        icon={Handshake}
        title="No channel partners yet"
        description="Create your first partner to configure a per-partner earn/burn rate and service account."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {partners.map((partner) => (
        <PartnerCard
          key={partner.partnerId}
          partner={partner}
          onConfigureRates={onConfigureRates}
          onCreateServiceAccount={onCreateServiceAccount}
        />
      ))}
    </div>
  );
}

PartnerGrid.propTypes = {
  partners: PropTypes.arrayOf(
    PropTypes.shape({
      partnerId: PropTypes.string.isRequired,
      partnerName: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
  onConfigureRates: PropTypes.func.isRequired,
  onCreateServiceAccount: PropTypes.func.isRequired,
};

export default PartnerGrid;
