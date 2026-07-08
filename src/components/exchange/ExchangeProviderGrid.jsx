import React from 'react';
import PropTypes from 'prop-types';
import { Repeat } from 'lucide-react';
import ExchangeProviderCard from './ExchangeProviderCard.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import EmptyState from '../common/EmptyState.jsx';

export function ExchangeProviderGrid({ providers, isLoading = false, onEdit }) {
  if (isLoading && providers.length === 0) {
    return <LoadingSpinner label="Loading exchange providers…" />;
  }

  if (!isLoading && providers.length === 0) {
    return (
      <EmptyState
        icon={Repeat}
        title="No exchange providers yet"
        description="Create a provider to let customers convert points to/from an external loyalty program."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {providers.map((provider) => (
        <ExchangeProviderCard key={provider.providerId} provider={provider} onEdit={onEdit} />
      ))}
    </div>
  );
}

ExchangeProviderGrid.propTypes = {
  providers: PropTypes.arrayOf(
    PropTypes.shape({
      providerId: PropTypes.string.isRequired,
      displayName: PropTypes.string.isRequired,
    }),
  ).isRequired,
  isLoading: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
};

export default ExchangeProviderGrid;
