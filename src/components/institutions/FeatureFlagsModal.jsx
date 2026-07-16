import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import * as api from '../../api/client';

const FEATURE_LABELS = {
  PARTNERS: {
    title: 'Partners',
    description: 'Channel partner management and partner-scoped rates.',
  },
  POINTS_EXCHANGE: {
    title: 'Points Exchange',
    description: 'Redeeming points to/from an external loyalty provider.',
  },
  CAMPAIGNS: { title: 'Campaigns', description: 'Promotional earn/burn rate multipliers.' },
  AUTOMATIC_TIER_PROMOTION: {
    title: 'Automatic Tier Promotion',
    description:
      "Auto-promotes a wallet when its EARN activity crosses a tier rule's threshold. Manual " +
      'tier changes on a wallet always stay available regardless of this setting.',
  },
  GIFT_REWARDS: {
    title: 'Gift Rewards',
    description:
      'Allow users to earn and redeem gifts with configurable validity periods and auto-expiry.',
  },
};

function FlagRow({ flag, onToggle, isSubmitting }) {
  const label = FEATURE_LABELS[flag.featureKey] || { title: flag.featureKey, description: '' };
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 px-3 py-3">
      <div>
        <p className="text-sm font-semibold text-slate-900">{label.title}</p>
        <p className="text-xs text-slate-500">{label.description}</p>
      </div>
      <button
        type="button"
        onClick={() => onToggle(flag.featureKey)}
        disabled={isSubmitting}
        className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
          flag.enabled
            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
        }`}
      >
        {isSubmitting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : flag.enabled ? (
          'Enabled'
        ) : (
          'Disabled'
        )}
      </button>
    </div>
  );
}

FlagRow.propTypes = {
  flag: PropTypes.shape({
    featureKey: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
};

export function FeatureFlagsModal({ isOpen, onClose, flags, onToggle }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
    }
  }, [isOpen]);

  const handleToggle = async (featureKey) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onToggle(featureKey);
    } catch (err) {
      setError(err.message || 'Failed to toggle feature flag');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Feature Flags"
      subtitle="Enable or disable features for this institution."
    >
      <div className="space-y-2">
        {flags.map((flag) => (
          <FlagRow
            key={flag.featureKey}
            flag={flag}
            onToggle={handleToggle}
            isSubmitting={isSubmitting}
          />
        ))}
      </div>
      {error && <p className="mt-4 text-xs text-rose-600">{error}</p>}
    </Modal>
  );
}

FeatureFlagsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  flags: PropTypes.arrayOf(
    PropTypes.shape({
      featureKey: PropTypes.string.isRequired,
      enabled: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default FeatureFlagsModal;
