import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Save } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useAsyncAction } from '../../hooks/useAsyncAction.js';
import { GLOBAL_RATES } from '../../constants';
import { toInputValue, toRateOrNull } from '../../utils/formConverters.js';

export function PartnerRateConfigModal({ isOpen, onClose, partner = null, onSave }) {
  const [earnRate, setEarnRate] = useState('');
  const [burnRate, setBurnRate] = useState('');
  const [pointsValidityDays, setPointsValidityDays] = useState('');
  const [validationError, setValidationError] = useState(null);
  const { run, isSubmitting, error, reset } = useAsyncAction(onSave);

  useEffect(() => {
    if (partner) {
      setEarnRate(toInputValue(partner.config?.earnRateCentsPerPoint));
      setBurnRate(toInputValue(partner.config?.burnRatePointsPerCent));
      setPointsValidityDays(toInputValue(partner.config?.pointsValidityDays));
      setValidationError(null);
      reset();
    }
    // Effect should only re-run when partner changes, not on reset function updates (which would cause loops)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partner]);

  if (!partner) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const parsedEarn = toRateOrNull(earnRate);
    const parsedBurn = toRateOrNull(burnRate);
    const parsedValidity = toRateOrNull(pointsValidityDays);
    if ((parsedEarn !== null && parsedEarn <= 0) || (parsedBurn !== null && parsedBurn <= 0)) {
      setValidationError('Rates must be positive integers when provided.');
      return;
    }
    if (parsedValidity !== null && parsedValidity < 0) {
      setValidationError('Points validity must not be negative.');
      return;
    }
    setValidationError(null);
    try {
      await run(partner.partnerId, {
        earnRateCentsPerPoint: parsedEarn,
        burnRatePointsPerCent: parsedBurn,
        pointsValidityDays: parsedValidity,
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
      title={`Configure rates — ${partner.partnerName}`}
      subtitle="This rate replaces the wallet's tier rate entirely for transactions through this partner. Leave a field blank to fall back to the global system rate."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="partnerEarnRate"
          type="number"
          min="1"
          step="1"
          label="Earn rate override"
          placeholder={`Global: ${GLOBAL_RATES.earnRateCentsPerPoint}`}
          suffix="¢ / point"
          value={earnRate}
          onChange={(e) => setEarnRate(e.target.value)}
          hint="Cents of spend required to earn 1 point. Lower is more generous."
        />
        <Input
          id="partnerBurnRate"
          type="number"
          min="1"
          step="1"
          label="Burn rate override"
          placeholder={`Global: ${GLOBAL_RATES.burnRatePointsPerCent}`}
          suffix="pts / cent"
          value={burnRate}
          onChange={(e) => setBurnRate(e.target.value)}
          hint="Points required to redeem 1 cent of discount. Lower is more generous."
        />
        <Input
          id="partnerPointsValidityDays"
          type="number"
          min="0"
          step="1"
          label="Points validity override"
          placeholder="Falls back to the global default"
          suffix="days"
          value={pointsValidityDays}
          onChange={(e) => setPointsValidityDays(e.target.value)}
          hint="Days points earned through this partner stay valid before expiring. 0 means they never expire."
        />

        {validationError && <p className="text-xs text-rose-600">{validationError}</p>}
        {error && <p className="text-xs text-rose-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" icon={Save} isLoading={isSubmitting}>
            Save rates
          </Button>
        </div>
      </form>
    </Modal>
  );
}

PartnerRateConfigModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  partner: PropTypes.shape({
    partnerId: PropTypes.string.isRequired,
    partnerName: PropTypes.string.isRequired,
    config: PropTypes.shape({
      earnRateCentsPerPoint: PropTypes.number,
      burnRatePointsPerCent: PropTypes.number,
      pointsValidityDays: PropTypes.number,
    }),
  }),
  onSave: PropTypes.func.isRequired,
};

export default PartnerRateConfigModal;
