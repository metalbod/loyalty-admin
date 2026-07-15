import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { PlusCircle } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useAsyncAction } from '../../hooks/useAsyncAction.js';

const SELECT_CLASSNAME = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 '
  + 'focus:outline-none focus:ring-2 focus:ring-emerald-500/30';

function Select({ id, label, value, onChange, children, hint = null }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-600">{label}</label>
      <select id={id} value={value} onChange={onChange} className={SELECT_CLASSNAME}>
        {children}
      </select>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

Select.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  hint: PropTypes.node,
};

export function CreateTierRuleModal({ isOpen, onClose, fromProfile = null, profiles, partners, onCreate }) {
  const [toProfileId, setToProfileId] = useState('');
  const [metricType, setMetricType] = useState('TRANSACTION_COUNT');
  const [partnerId, setPartnerId] = useState('');
  const [threshold, setThreshold] = useState('');
  const [windowDays, setWindowDays] = useState('365');
  const [validationError, setValidationError] = useState(null);
  const { run, isSubmitting, error, reset } = useAsyncAction(onCreate);

  const targetOptions = profiles.filter((p) => p.profileId !== fromProfile?.profileId);

  useEffect(() => {
    if (fromProfile) {
      setToProfileId(targetOptions[0]?.profileId || '');
      setMetricType('TRANSACTION_COUNT');
      setPartnerId('');
      setThreshold('');
      setWindowDays('365');
      setValidationError(null);
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromProfile]);

  if (!fromProfile) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const parsedThreshold = Number(threshold);
    const parsedWindowDays = Number(windowDays);
    if (!toProfileId) {
      setValidationError('Choose a target tier.');
      return;
    }
    if (!threshold || parsedThreshold <= 0) {
      setValidationError('Threshold must be a positive number.');
      return;
    }
    if (!windowDays || parsedWindowDays <= 0) {
      setValidationError('Window (days) must be a positive number.');
      return;
    }
    setValidationError(null);
    try {
      await run(fromProfile.profileId, {
        toProfileId,
        metricType,
        partnerId: partnerId || null,
        threshold: parsedThreshold,
        windowDays: parsedWindowDays,
      });
      handleClose();
    } catch {
      // error surfaced via useAsyncAction's error state
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`New promotion rule — ${fromProfile.profileName}`}
      subtitle="Automatically move a wallet to a higher tier once its EARN activity crosses this threshold."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select id="toProfileId" label="Promote to" value={toProfileId} onChange={(e) => setToProfileId(e.target.value)}>
          {targetOptions.map((p) => (
            <option key={p.profileId} value={p.profileId}>{p.profileName}</option>
          ))}
        </Select>

        <Select id="metricType" label="Based on" value={metricType} onChange={(e) => setMetricType(e.target.value)}>
          <option value="TRANSACTION_COUNT">Number of EARN transactions</option>
          <option value="CUMULATIVE_POINTS">Cumulative points earned</option>
        </Select>

        <Select
          id="partnerId"
          label="From"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value)}
          hint="Restrict to one channel partner's transactions, or count activity from anywhere."
        >
          <option value="">Any partner (or direct)</option>
          {partners.map((p) => (
            <option key={p.partnerId} value={p.partnerId}>{p.partnerName}</option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Input
            id="threshold"
            type="number"
            min="1"
            step="1"
            label="Threshold"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
          <Input
            id="windowDays"
            type="number"
            min="1"
            step="1"
            label="Rolling window"
            suffix="days"
            value={windowDays}
            onChange={(e) => setWindowDays(e.target.value)}
          />
        </div>

        {validationError && <p className="text-xs text-rose-600">{validationError}</p>}
        {error && <p className="text-xs text-rose-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" icon={PlusCircle} isLoading={isSubmitting}>
            Create rule
          </Button>
        </div>
      </form>
    </Modal>
  );
}

CreateTierRuleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fromProfile: PropTypes.shape({
    profileId: PropTypes.string.isRequired,
    profileName: PropTypes.string.isRequired,
  }),
  profiles: PropTypes.arrayOf(PropTypes.shape({
    profileId: PropTypes.string.isRequired,
    profileName: PropTypes.string.isRequired,
  })).isRequired,
  partners: PropTypes.arrayOf(PropTypes.shape({
    partnerId: PropTypes.string.isRequired,
    partnerName: PropTypes.string.isRequired,
  })).isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateTierRuleModal;
