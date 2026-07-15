import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Save } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useAsyncAction } from '../../hooks/useAsyncAction.js';

// Reassigning the first admin's password is optional on every edit - leaving it blank keeps
// their existing password untouched, matching the backend's partial-update semantics
// (UpdateInstitutionDetailsRequest treats a null adminPassword as "no change").
export function EditInstitutionModal({ isOpen, onClose, institution, onSave }) {
  const [name, setName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [validationError, setValidationError] = useState(null);
  const { run, isSubmitting, error, reset } = useAsyncAction(onSave);

  // Modal is reused for whichever institution's card was clicked (see EditBrandingModal),
  // so fields must be re-seeded from props every time it opens.
  useEffect(() => {
    if (isOpen && institution) {
      setName(institution.name);
      setAdminEmail(institution.adminEmail || '');
      setAdminPassword('');
      setValidationError(null);
    }
  }, [isOpen, institution]);

  const handleClose = () => {
    setValidationError(null);
    reset();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setValidationError('Institution name must not be blank.');
      return;
    }
    if (!adminEmail.trim()) {
      setValidationError('Admin email must not be blank.');
      return;
    }
    if (adminPassword && adminPassword.length < 8) {
      setValidationError(
        'New password must be at least 8 characters, or left blank to keep the current one.'
      );
      return;
    }
    setValidationError(null);
    try {
      await run(institution.institutionId, {
        name,
        adminEmail,
        adminPassword: adminPassword || null,
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
      title="Edit institution"
      subtitle="Change the institution's name or its first admin's sign-in credentials."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="editInstitutionName"
          label="Institution name"
          placeholder="e.g. Acme Bank"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <Input
          id="editAdminEmail"
          type="email"
          label="First admin's email"
          placeholder="admin@acmebank.com"
          autoComplete="off"
          value={adminEmail}
          onChange={(e) => setAdminEmail(e.target.value)}
        />
        <Input
          id="editAdminPassword"
          type="password"
          label="New password"
          hint="Leave blank to keep the current password. At least 8 characters if set."
          autoComplete="new-password"
          value={adminPassword}
          onChange={(e) => setAdminPassword(e.target.value)}
        />

        {(validationError || error) && (
          <p className="text-xs text-rose-600">{validationError || error}</p>
        )}

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

EditInstitutionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  institution: PropTypes.shape({
    institutionId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    adminEmail: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};

export default EditInstitutionModal;
