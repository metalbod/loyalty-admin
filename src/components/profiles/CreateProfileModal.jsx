import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PlusCircle } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useAsyncAction } from '../../hooks/useAsyncAction.js';

const MAX_NAME_LENGTH = 50;
const MAX_DESCRIPTION_LENGTH = 500;

export function CreateProfileModal({ isOpen, onClose, onCreate }) {
  const [profileName, setProfileName] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState(null);
  const { run, isSubmitting, error, reset } = useAsyncAction(onCreate);

  const handleClose = () => {
    setProfileName('');
    setDescription('');
    setValidationError(null);
    reset();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!profileName.trim()) {
      setValidationError('profileName is required');
      return;
    }
    setValidationError(null);
    try {
      await run({ profileName, description });
      handleClose();
    } catch {
      // error surfaced via useAsyncAction's error state
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create profile tier"
      subtitle="New tiers default to the global earn/burn rate until configured."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="profileName"
          label="Profile name"
          placeholder="e.g. PLATINUM"
          value={profileName}
          maxLength={MAX_NAME_LENGTH}
          onChange={(e) => setProfileName(e.target.value)}
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
            placeholder="Who belongs to this tier?"
            className="w-full resize-none rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
          />
        </div>

        {error && <p className="text-xs text-rose-400">{error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" icon={PlusCircle} isLoading={isSubmitting}>
            Create profile
          </Button>
        </div>
      </form>
    </Modal>
  );
}

CreateProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateProfileModal;
