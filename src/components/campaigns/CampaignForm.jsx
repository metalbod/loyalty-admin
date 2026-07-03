import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CalendarPlus } from 'lucide-react';
import Card, { CardHeader } from '../common/Card.jsx';
import Input from '../common/Input.jsx';
import Button from '../common/Button.jsx';
import { useAsyncAction } from '../../hooks/useAsyncAction.js';

const INITIAL_FORM = {
  name: '',
  startTime: '',
  endTime: '',
  earnMultiplier: '1.0',
  burnDiscountMultiplier: '1.0',
};

function validate(form) {
  if (!form.name.trim()) return 'name is required';
  if (!form.startTime || !form.endTime) return 'startTime and endTime are required';
  if (new Date(form.endTime) <= new Date(form.startTime)) return 'endTime must be after startTime';
  if (Number(form.earnMultiplier) < 1.0) return 'earnMultiplier must be >= 1.0';
  if (Number(form.burnDiscountMultiplier) < 0 || Number(form.burnDiscountMultiplier) > 1) {
    return 'burnDiscountMultiplier must be between 0.0 and 1.0';
  }
  return null;
}

export function CampaignForm({ onCreate }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [validationError, setValidationError] = useState(null);
  const { run, isSubmitting, error, success, reset } = useAsyncAction(onCreate);

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    reset();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationMessage = validate(form);
    if (validationMessage) {
      setValidationError(validationMessage);
      return;
    }
    setValidationError(null);
    try {
      await run({
        name: form.name,
        startTime: form.startTime,
        endTime: form.endTime,
        earnMultiplier: form.earnMultiplier,
        burnDiscountMultiplier: form.burnDiscountMultiplier,
      });
      setForm(INITIAL_FORM);
    } catch {
      // error surfaced via useAsyncAction's error state
    }
  };

  return (
    <Card>
      <CardHeader
        icon={CalendarPlus}
        title="New promotional campaign"
        subtitle="Overlapping campaigns are resolved automatically - highest earn multiplier, lowest burn discount."
      />
      <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
        <Input
          id="campaignName"
          label="Campaign name"
          placeholder="e.g. Double Points Weekend"
          value={form.name}
          onChange={updateField('name')}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="startTime"
            type="datetime-local"
            label="Start time"
            value={form.startTime}
            onChange={updateField('startTime')}
          />
          <Input
            id="endTime"
            type="datetime-local"
            label="End time"
            value={form.endTime}
            onChange={updateField('endTime')}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            id="earnMultiplier"
            type="number"
            min="1.0"
            step="0.01"
            label="Earn multiplier"
            hint="Must be 1.0 or higher"
            value={form.earnMultiplier}
            onChange={updateField('earnMultiplier')}
          />
          <Input
            id="burnDiscountMultiplier"
            type="number"
            min="0"
            max="1"
            step="0.01"
            label="Burn discount multiplier"
            hint="Between 0.0 and 1.0 - lower means fewer points required"
            value={form.burnDiscountMultiplier}
            onChange={updateField('burnDiscountMultiplier')}
          />
        </div>

        {validationError && <p className="text-xs text-rose-400">{validationError}</p>}
        {error && <p className="text-xs text-rose-400">{error}</p>}
        {success && <p className="text-xs text-emerald-400">Campaign created successfully.</p>}

        <Button type="submit" icon={CalendarPlus} isLoading={isSubmitting} fullWidth>
          Create campaign
        </Button>
      </form>
    </Card>
  );
}

CampaignForm.propTypes = {
  onCreate: PropTypes.func.isRequired,
};

export default CampaignForm;
