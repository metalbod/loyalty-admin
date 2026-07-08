import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PlusCircle } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useAsyncAction } from '../../hooks/useAsyncAction.js';

const MAX_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 500;

export function CreatePartnerModal({ isOpen, onClose, onCreate }) {
  const [partnerName, setPartnerName] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState(null);
  const { run, isSubmitting, error, reset } = useAsyncAction(onCreate);

  const handleClose = () => {
    setPartnerName('');
    setDescription('');
    setValidationError(null);
    reset();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!partnerName.trim()) {
      setValidationError('partnerName is required');
      return;
    }
    setValidationError(null);
    try {
      await run({ partnerName, description });
      handleClose();
    } catch {
      // error surfaced via useAsyncAction's error state
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create channel partner"
      subtitle="New partners default to the global earn/burn rate until configured."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="partnerName"
          label="Partner name"
          placeholder="e.g. Acme Merchant"
          value={partnerName}
          maxLength={MAX_NAME_LENGTH}
          onChange={(e) => setPartnerName(e.target.value)}
          error={validationError}
          autoFocus
        />
        <div>
          <label htmlFor="description" className="mb-1.5 block text-xs font-medium text-slate-300">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            maxLength={MAX_DESCRIPTION_LENGTH}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What transactions come through this partner?"
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {error && <p className="text-xs text-rose-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" icon={PlusCircle} isLoading={isSubmitting}>
            Create partner
          </Button>
        </div>
      </form>
    </Modal>
  );
}

CreatePartnerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreatePartnerModal;
