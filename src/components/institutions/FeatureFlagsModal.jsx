import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import * as api from '../../api/client';

const FEATURE_LABELS = {
  PARTNERS: { title: ‘Partners’, description: ‘Channel partner management and partner-scoped rates.’ },
  POINTS_EXCHANGE: { title: ‘Points Exchange’, description: ‘Redeeming points to/from an external loyalty provider.’ },
  CAMPAIGNS: { title: ‘Campaigns’, description: ‘Promotional earn/burn rate multipliers.’ },
  AUTOMATIC_TIER_PROMOTION: {
    title: ‘Automatic Tier Promotion’,
    description: ‘Auto-promotes a wallet when its EARN activity crosses a tier rule’s threshold. Manual ‘
      + ‘tier changes on a wallet always stay available regardless of this setting.’,
  },
  GIFT_REWARDS: {
    title: ‘Gift Rewards’,
    description: ‘Allow users to earn and redeem gifts with configurable validity periods and auto-expiry.’,
  },
};

function FlagRow({ flag, onToggle, isSubmitting }) {
  const label = FEATURE_LABELS[flag.featureKey] || { title: flag.featureKey, description: '' };
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 px-3 py-3">
      <div>
        <p className="text-sm font-medium text-slate-900">{label.title}</p>
        <p className="mt-0.5 text-xs text-slate-500">{label.description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={flag.enabled}
        disabled={isSubmitting}
        onClick={() => onToggle(flag.featureKey, !flag.enabled)}
        className={[
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full p-0 transition-colors disabled:opacity-60',
          flag.enabled ? 'bg-[var(--brand)]' : 'bg-slate-300',
        ].join(' ')}
      >
        {isSubmitting ? (
          <Loader2 size={14} className="absolute inset-0 m-auto animate-spin text-white" />
        ) : (
          <span
            className={[
              'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
              flag.enabled ? 'translate-x-5' : 'translate-x-0',
            ].join(' ')}
          />
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

export function FeatureFlagsModal({ isOpen, onClose, institution, adminId }) {
  const [flags, setFlags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submittingKey, setSubmittingKey] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && institution) {
      setError(null);
      setIsLoading(true);
      api.fetchInstitutionFeatureFlags(institution.institutionId)
        .then(setFlags)
        .catch((err) => setError(err?.message || 'Could not load feature flags.'))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, institution]);

  const handleToggle = async (featureKey, enabled) => {
    setError(null);
    setSubmittingKey(featureKey);
    try {
      const updated = await api.updateInstitutionFeatureFlag(institution.institutionId, featureKey, enabled, adminId);
      setFlags((prev) => prev.map((f) => (f.featureKey === featureKey ? updated : f)));
    } catch (err) {
      setError(err?.message || 'Could not update this feature flag.');
    } finally {
      setSubmittingKey(null);
    }
  };

  if (!institution) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Feature flags"
      subtitle={`Turn platform features on or off for ${institution.name}.`}
    >
      <div className="space-y-2">
        {isLoading && <p className="text-xs text-slate-500">Loading…</p>}
        {!isLoading && flags.map((flag) => (
          <FlagRow
            key={flag.featureKey}
            flag={flag}
            onToggle={handleToggle}
            isSubmitting={submittingKey === flag.featureKey}
          />
        ))}
        {error && <p className="text-xs text-rose-600">{error}</p>}
      </div>
    </Modal>
  );
}

FeatureFlagsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  institution: PropTypes.shape({
    institutionId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  adminId: PropTypes.string.isRequired,
};

export default FeatureFlagsModal;
