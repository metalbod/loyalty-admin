import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { PlusCircle } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useAsyncAction } from '../../hooks/useAsyncAction.js';

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export function CreateInstitutionModal({ isOpen, onClose, onCreate }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [validationError, setValidationError] = useState(null);
  const { run, isSubmitting, error, reset } = useAsyncAction(onCreate);

  const handleClose = () => {
    setName('');
    setSlug('');
    setAdminEmail('');
    setAdminPassword('');
    setValidationError(null);
    reset();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim() || !slug.trim() || !adminEmail.trim() || !adminPassword.trim()) {
      setValidationError('All fields are required');
      return;
    }
    if (!SLUG_PATTERN.test(slug)) {
      setValidationError('slug must be lowercase alphanumeric with single hyphens, e.g. "acme-bank"');
      return;
    }
    if (adminPassword.length < 8) {
      setValidationError('adminPassword must be at least 8 characters');
      return;
    }
    setValidationError(null);
    try {
      await run({ name, slug, adminEmail, adminPassword });
      handleClose();
    } catch {
      // error surfaced via useAsyncAction's error state
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create institution"
      subtitle="Provisions the institution and its first admin account in one step - there's no invite flow yet."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="institutionName"
          label="Institution name"
          placeholder="e.g. Acme Bank"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <Input
          id="institutionSlug"
          label="Slug"
          placeholder="e.g. acme-bank"
          hint="Lowercase letters, numbers, and single hyphens only."
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <Input
          id="adminEmail"
          type="email"
          label="First admin's email"
          placeholder="admin@acmebank.com"
          autoComplete="off"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
        />
        <Input
          id="adminPassword"
          type="password"
          label="First admin's password"
          hint="At least 8 characters. Share this with the institution's admin directly."
          autoComplete="new-password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />

        {(validationError || error) && <p className="text-xs text-rose-600">{validationError || error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" icon={PlusCircle} isLoading={isSubmitting}>
            Create institution
          </Button>
        </div>
      </form>
    </Modal>
  );
}

CreateInstitutionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
};

export default CreateInstitutionModal;
