import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowUpCircle, PlusCircle, Trash2 } from 'lucide-react';
import Button from '../common/Button.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import CreateTierRuleModal from './CreateTierRuleModal.jsx';
import * as api from '../../api/client';
import { useAuth } from '../../hooks/useAuth.js';

const METRIC_LABELS = {
  TRANSACTION_COUNT: 'transactions',
  CUMULATIVE_POINTS: 'points earned',
};

function profileName(profiles, profileId) {
  return profiles.find((p) => p.profileId === profileId)?.profileName || 'Unknown tier';
}

function partnerName(partners, partnerId) {
  if (!partnerId) return 'any partner';
  return partners.find((p) => p.partnerId === partnerId)?.partnerName || 'a removed partner';
}

export function TierRulesSection({ profile, profiles, partners }) {
  const { user } = useAuth();
  const [rules, setRules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const loadRules = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.fetchTierRules(profile.profileId);
      setRules(data);
    } finally {
      setIsLoading(false);
    }
  }, [profile.profileId]);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  const handleCreate = async (fromProfileId, payload) => {
    await api.createTierRule(fromProfileId, payload, user?.email);
    await loadRules();
  };

  const handleDelete = async (ruleId) => {
    await api.deleteTierRule(profile.profileId, ruleId, user?.email);
    await loadRules();
  };

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Promotion rules</p>
        <Button variant="ghost" icon={PlusCircle} onClick={() => setIsCreateOpen(true)} className="!px-2 !py-1 text-xs">
          Add
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Loading rules…" size={14} className="!py-3" />
      ) : rules.length === 0 ? (
        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
          No automatic promotion rules yet.
        </p>
      ) : (
        <ul className="space-y-1.5">
          {rules.map((rule) => (
            <li
              key={rule.ruleId}
              className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-700"
            >
              <span className="flex items-center gap-1.5">
                <ArrowUpCircle size={13} className="shrink-0 text-emerald-600" />
                <span>
                  <span className="font-semibold text-slate-900">{profileName(profiles, rule.toProfileId)}</span> after{' '}
                  <span className="font-semibold text-slate-900">{rule.threshold}</span>{' '}
                  {METRIC_LABELS[rule.metricType]} from {partnerName(partners, rule.partnerId)} within{' '}
                  {rule.windowDays}d
                </span>
              </span>
              <button
                type="button"
                onClick={() => handleDelete(rule.ruleId)}
                title="Delete rule"
                className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <CreateTierRuleModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        fromProfile={isCreateOpen ? profile : null}
        profiles={profiles}
        partners={partners}
        onCreate={handleCreate}
      />
    </div>
  );
}

TierRulesSection.propTypes = {
  profile: PropTypes.shape({
    profileId: PropTypes.string.isRequired,
  }).isRequired,
  profiles: PropTypes.arrayOf(PropTypes.shape({
    profileId: PropTypes.string.isRequired,
    profileName: PropTypes.string.isRequired,
  })).isRequired,
  partners: PropTypes.arrayOf(PropTypes.shape({
    partnerId: PropTypes.string.isRequired,
    partnerName: PropTypes.string.isRequired,
  })).isRequired,
};

export default TierRulesSection;
