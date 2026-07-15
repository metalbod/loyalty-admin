import React from 'react';
import PropTypes from 'prop-types';
import { Building2 } from 'lucide-react';
import InstitutionCard from './InstitutionCard.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import EmptyState from '../common/EmptyState.jsx';

export function InstitutionGrid({
  institutions,
  isLoading = false,
  onToggleStatus,
  onEditBranding,
  onEditDetails,
  updatingInstitutionId = null,
}) {
  if (isLoading && institutions.length === 0) {
    return <LoadingSpinner label="Loading institutions…" />;
  }

  if (!isLoading && institutions.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="No institutions yet"
        description="Create the first institution to provision its admin account and default rates."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {institutions.map((institution) => (
        <InstitutionCard
          key={institution.institutionId}
          institution={institution}
          onToggleStatus={onToggleStatus}
          onEditBranding={onEditBranding}
          onEditDetails={onEditDetails}
          isUpdating={updatingInstitutionId === institution.institutionId}
        />
      ))}
    </div>
  );
}

InstitutionGrid.propTypes = {
  institutions: PropTypes.arrayOf(
    PropTypes.shape({
      institutionId: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
  onToggleStatus: PropTypes.func.isRequired,
  onEditBranding: PropTypes.func.isRequired,
  onEditDetails: PropTypes.func.isRequired,
  updatingInstitutionId: PropTypes.string,
};

export default InstitutionGrid;
