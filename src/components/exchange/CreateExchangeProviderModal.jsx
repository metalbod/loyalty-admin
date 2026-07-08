import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PlusCircle } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useAsyncAction } from '../../hooks/useAsyncAction.js';

const MAX_CODE_LENGTH = 50;
const MAX_NAME_LENGTH = 100;

function toRateOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  return Number(value);
}

export function CreateExchangeProviderModal({ isOpen, onClose, onCreate }) {
  const [providerCode, setProviderCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [inboundRate, setInboundRate] = useState('');
  const [outboundRate, setOutboundRate] = useState('');
  const [validationError, setValidationError] = useState(null);
  const { run, isSubmitting, error, reset } = useAsyncAction(onCreate);

  const handleClose = () => {
    setProviderCode('');
    setDisplayName('');
    setInboundRate('');
    setOutboundRate('');
    setValidationError(null);
    reset();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!providerCode.trim() || !displayName.trim()) {
      setValidationError('providerCode and displayName are required');
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
      await run({
        providerCode,
        displayName,
        inboundPointsPerExternalUnit: parsedInbound,
        outboundPointsPerExternalUnit: parsedOutbound,
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
      title="Create exchange provider"
      subtitle="Customers will be able to convert points to/from this external loyalty program."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="providerCode"
          label="Provider code"
          placeholder="e.g. SKYMILES"
          value={providerCode}
          maxLength={MAX_CODE_LENGTH}
          onChange={(e) => setProviderCode(e.target.value)}
          hint="A short, stable identifier - not shown to customers."
          autoFocus
        />
        <Input
          id="displayName"
          label="Display name"
          placeholder="e.g. SkyMiles"
          value={displayName}
          maxLength={MAX_NAME_LENGTH}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <Input
          id="inboundRate"
          type="number"
          min="0"
          step="0.0001"
          label="Inbound rate"
          placeholder="Disabled if blank"
          suffix="pts / unit"
          value={inboundRate}
          onChange={(e) => setInboundRate(e.target.value)}
          hint="Points credited per external unit converted IN. Leave blank to disable this direction."
        />
        <Input
          id="outboundRate"
          type="number"
          min="0"
          step="0.0001"
          label="Outbound rate"
          placeholder="Disabled if blank"
          suffix="pts / unit"
          value={outboundRate}
          onChange={(e) => setOutboundRate(e.target.value)}
          hint="Points required per external unit converted OUT. Leave blank to disable this direction."
        />

        {validationError && <p className="text-xs text-rose-400">{validationError}</p>}
        {error && <p className="text-xs text-rose-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" icon={PlusCircle} isLoading={isSubmitting}>
            Create provider
          </Button>
        </div>
      </form>
    </Modal>
  );
}

CreateExchangeProviderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateExchangeProviderModal;
