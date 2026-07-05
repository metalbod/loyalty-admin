import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Save, Trash2, Upload } from 'lucide-react';
import Modal from '../common/Modal.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useAsyncAction } from '../../hooks/useAsyncAction.js';

const DEFAULT_COLOR = '#10b981';
const HEX_PATTERN = /^#[0-9A-Fa-f]{6}$/;
// Guards against an oversized logo before it ever leaves the browser - the backend also
// enforces a (more generous) cap on the encoded string itself as a safety net.
const MAX_LOGO_BYTES = 500 * 1024;

export function EditBrandingModal({ isOpen, onClose, institution, onSave }) {
  const [name, setName] = useState('');
  const [logoDataUrl, setLogoDataUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState(DEFAULT_COLOR);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);
  const { run, isSubmitting, error, reset } = useAsyncAction(onSave);

  // The modal is never unmounted (see Modal.jsx) and is reused for whichever institution's
  // card was clicked, so its fields must be re-seeded from props every time it opens rather
  // than only once on mount.
  useEffect(() => {
    if (isOpen && institution) {
      setName(institution.name);
      setLogoDataUrl(institution.logoDataUrl || '');
      setPrimaryColor(institution.primaryColor || DEFAULT_COLOR);
      setValidationError(null);
    }
  }, [isOpen, institution]);

  const handleClose = () => {
    setValidationError(null);
    reset();
    onClose();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setValidationError('Logo must be an image file.');
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      setValidationError('Logo must be smaller than 500KB.');
      return;
    }
    setValidationError(null);
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoDataUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      setValidationError('Institution name must not be blank.');
      return;
    }
    if (!HEX_PATTERN.test(primaryColor)) {
      setValidationError('Color must be a valid hex value, e.g. #10B981.');
      return;
    }
    setValidationError(null);
    try {
      await run(institution.institutionId, { name, logoDataUrl, primaryColor });
      handleClose();
    } catch {
      // error surfaced via useAsyncAction's error state
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit branding"
      subtitle="Controls how this institution's own admin dashboard presents itself - visible only to their ROLE_ADMIN users."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="brandingName"
          label="Name shown on their dashboard"
          placeholder="e.g. Acme Bank"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <div>
          <label className="mb-1.5 block text-xs font-medium text-slate-300">Logo</label>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-900/70">
              {logoDataUrl ? (
                <img src={logoDataUrl} alt="Logo preview" className="h-full w-full object-contain" />
              ) : (
                <Upload size={16} className="text-slate-600" />
              )}
            </span>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" icon={Upload} onClick={() => fileInputRef.current?.click()}>
                {logoDataUrl ? 'Replace' : 'Upload'}
              </Button>
              {logoDataUrl && (
                <Button type="button" variant="ghost" icon={Trash2} onClick={handleRemoveLogo}>
                  Remove
                </Button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <p className="mt-1 text-xs text-slate-500">PNG, JPG, or SVG. Under 500KB.</p>
        </div>

        <div>
          <label htmlFor="brandingColor" className="mb-1.5 block text-xs font-medium text-slate-300">
            Dashboard accent color
          </label>
          <div className="flex items-center gap-3">
            <input
              id="brandingColor"
              type="color"
              value={HEX_PATTERN.test(primaryColor) ? primaryColor : DEFAULT_COLOR}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="h-9 w-14 cursor-pointer rounded-md border border-slate-700 bg-slate-900/70 p-1"
            />
            <Input
              id="brandingColorHex"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              placeholder="#10B981"
              containerClassName="flex-1"
            />
          </div>
        </div>

        {(validationError || error) && <p className="text-xs text-rose-400">{validationError || error}</p>}

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" icon={Save} isLoading={isSubmitting}>
            Save branding
          </Button>
        </div>
      </form>
    </Modal>
  );
}

EditBrandingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  institution: PropTypes.shape({
    institutionId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    logoDataUrl: PropTypes.string,
    primaryColor: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
};

export default EditBrandingModal;
