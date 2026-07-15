import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UserPlus } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useAsyncAction } from '../../hooks/useAsyncAction.js';

export function CreatePartnerServiceAccountModal({ isOpen, onClose, partner = null, onCreate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState(null);
  const { run, isSubmitting, error, reset } = useAsyncAction(onCreate);
  const [created, setCreated] = useState(null);

  useEffect(() => {
    if (partner) {
      setEmail('');
      setPassword('');
      setValidationError(null);
      setCreated(null);
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
    if (!email.trim() || !password.trim()) {
      setValidationError('email and password are required');
      return;
    }
    if (password.length < 8) {
      setValidationError('password must be at least 8 characters');
      return;
    }
    setValidationError(null);
    try {
      const result = await run(partner.partnerId, { email, password });
      setCreated(result);
    } catch {
      // error surfaced via useAsyncAction's error state
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Create service account — ${partner.partnerName}`}
      subtitle="Transactions authenticated with this login are attributed to this partner and use its configured rate."
    >
      {created ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Service account <span className="font-semibold text-slate-900">{created.email}</span>{' '}
            created. Share the password you chose directly with the integration owner - it isn't
            stored anywhere else.
          </p>
          <div className="flex justify-end">
            <Button type="button" onClick={handleClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="partnerServiceEmail"
            type="email"
            label="Service account email"
            placeholder="partner-integration@acmebank.com"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          <Input
            id="partnerServicePassword"
            type="password"
            label="Password"
            hint="At least 8 characters. Share this with the partner's integration owner directly."
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {(validationError || error) && (
            <p className="text-xs text-rose-600">{validationError || error}</p>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" icon={UserPlus} isLoading={isSubmitting}>
              Create service account
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

CreatePartnerServiceAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  partner: PropTypes.shape({
    partnerId: PropTypes.string.isRequired,
    partnerName: PropTypes.string.isRequired,
  }),
  onCreate: PropTypes.func.isRequired,
};

export default CreatePartnerServiceAccountModal;
