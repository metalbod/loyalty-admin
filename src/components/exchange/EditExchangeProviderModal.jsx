import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Save } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useAsyncAction } from '../../hooks/useAsyncAction.js';

const MAX_NAME_LENGTH = 100;

function toInputValue(value) {
  return value === null || value === undefined ? '' : String(value);
}

function toRateOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  return Number(value);
}

export function EditExchangeProviderModal({ isOpen, onClose, provider = null, onSave }) {
  const [displayName, setDisplayName] = useState('');
  const [inboundRate, setInboundRate] = useState('');
  const [outboundRate, setOutboundRate] = useState('');
  const [active, setActive] = useState(true);
  const [validationError, setValidationError] = useState(null);
  const { run, isSubmitting, error, reset } = useAsyncAction(onSave);

  useEffect(() => {
    if (provider) {
      setDisplayName(provider.displayName);
      setInboundRate(toInputValue(provider.inboundPointsPerExternalUnit));
      setOutboundRate(toInputValue(provider.outboundPointsPerExternalUnit));
      setActive(provider.active);
      setValidationError(null);
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  if (!provider) return null;

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!displayName.trim()) {
      setValidationError('displayName is required');
      return;
    }
    const parsedInbound = toRateOrNull(inboundRate);
    const parsedOutbound = toRateOrNull(outboundRate);
    if (parsedInbound === null && parsedOutbound === null) {
      setValidationError('At least one of inbound or outbound rate is required');
      return;
    }
    setValidationError(null);
    try {
      await run(provider.providerId, {
        displayName,
        inboundPointsPerExternalUnit: parsedInbound,
        outboundPointsPerExternalUnit: parsedOutbound,
        active,
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
      title={`Edit provider — ${provider.displayName}`}
      subtitle={`Provider code: ${provider.providerCode} (fixed at creation)`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="editDisplayName"
          label="Display name"
          value={displayName}
          maxLength={MAX_NAME_LENGTH}
          onChange={(e) => setDisplayName(e.target.value)}
          autoFocus
        />
        <Input
          id="editInboundRate"
          type="number"
          min="0"
          step="0.0001"
          label="Inbound rate"
          placeholder="Disabled if blank"
          suffix="pts / unit"
          value={inboundRate}
          onChange={(e) => setInboundRate(e.target.value)}
        />
        <Input
          id="editOutboundRate"
          type="number"
          min="0"
          step="0.0001"
          label="Outbound rate"
          placeholder="Disabled if blank"
          suffix="pts / unit"
          value={outboundRate}
          onChange={(e) => setOutboundRate(e.target.value)}
        />
        <label className="flex items-center gap-2 text-xs text-slate-600">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 bg-slate-50 text-sky-600 focus:ring-sky-300"
          />
          Active (visible to customers)
        </label>

        {validationError && <p className="text-xs text-rose-600">{validationError}</p>}
        {error && <p className="text-xs text-rose-600">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" icon={Save} isLoading={isSubmitting}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

EditExchangeProviderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  provider: PropTypes.shape({
    providerId: PropTypes.string.isRequired,
    providerCode: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    inboundPointsPerExternalUnit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    outboundPointsPerExternalUnit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    active: PropTypes.bool,
  }),
  onSave: PropTypes.func.isRequired,
};

export default EditExchangeProviderModal;
