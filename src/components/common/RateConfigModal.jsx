import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Save } from 'lucide-react';
import Modal from './Modal.jsx';
import Input from './Input.jsx';
import Button from './Button.jsx';
import { useAsyncAction } from '../../hooks/useAsyncAction.js';
import { GLOBAL_RATES } from '../../constants';
import { toInputValue, toRateOrNull } from '../../utils/formConverters.js';

export function RateConfigModal({ isOpen, onClose, entity = null, entityType = 'profile', onSave, subtitle = null }) {
  const [earnRate, setEarnRate] = useState('');
  const [burnRate, setBurnRate] = useState('');
  const [pointsValidityDays, setPointsValidityDays] = useState('');
  const [validationError, setValidationError] = useState(null);
  const { run, isSubmitting, error, reset } = useAsyncAction(onSave);

  // Determine entity field names based on type
  const idField = entityType === 'partner' ? 'partnerId' : 'profileId';
  const nameField = entityType === 'partner' ? 'partnerName' : 'profileName';
  const inputIdPrefix = entityType === 'partner' ? 'partner' : '';

  const defaultSubtitle =
    entityType === 'partner'
      ? 'This rate replaces the wallet\'s tier rate entirely for transactions through this partner. Leave a field blank to fall back to the global system rate.'
      : 'Leave a field blank to fall back to the global system rate.';

  useEffect(() => {
    if (entity) {
      setEarnRate(toInputValue(entity.config?.earnRateCentsPerPoint));
      setBurnRate(toInputValue(entity.config?.burnRatePointsPerCent));
      setPointsValidityDays(toInputValue(entity.config?.pointsValidityDays));
      setValidationError(null);
      reset();
    }
    // Effect should only re-run when entity changes, not on reset function updates (which would cause loops)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  if (!entity) return null;

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
      await run(entity[idField], {
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
      title={`Configure rates — ${entity[nameField]}`}
      subtitle={subtitle || defaultSubtitle}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id={`${inputIdPrefix}EarnRate`}
          type="number"
          step="1"
          label="Earn rate override"
          placeholder={`Global: ${GLOBAL_RATES.earnRateCentsPerPoint}`}
          suffix="¢ / point"
          value={earnRate}
          onChange={(e) => setEarnRate(e.target.value)}
          hint="Cents of spend required to earn 1 point. Lower is more generous."
        />
        <Input
          id={`${inputIdPrefix}BurnRate`}
          type="number"
          step="1"
          label="Burn rate override"
          placeholder={`Global: ${GLOBAL_RATES.burnRatePointsPerCent}`}
          suffix="pts / cent"
          value={burnRate}
          onChange={(e) => setBurnRate(e.target.value)}
          hint="Points required to redeem 1 cent of discount. Lower is more generous."
        />
        <Input
          id={`${inputIdPrefix}PointsValidityDays`}
          type="number"
          step="1"
          label="Points validity override"
          placeholder="Falls back to the global default"
          suffix="days"
          value={pointsValidityDays}
          onChange={(e) => setPointsValidityDays(e.target.value)}
          hint={
            entityType === 'partner'
              ? 'Days points earned through this partner stay valid before expiring. 0 means they never expire.'
              : 'Days earned points stay valid before expiring. 0 means these points never expire.'
          }
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

RateConfigModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  entity: PropTypes.shape({
    profileId: PropTypes.string,
    partnerId: PropTypes.string,
    profileName: PropTypes.string,
    partnerName: PropTypes.string,
    config: PropTypes.shape({
      earnRateCentsPerPoint: PropTypes.number,
      burnRatePointsPerCent: PropTypes.number,
      pointsValidityDays: PropTypes.number,
    }),
  }),
  entityType: PropTypes.oneOf(['profile', 'partner']),
  onSave: PropTypes.func.isRequired,
  subtitle: PropTypes.string,
};

export default RateConfigModal;
