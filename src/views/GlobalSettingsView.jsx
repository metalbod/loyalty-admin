import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Save, Settings } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Card, { CardHeader } from '../components/common/Card.jsx';
import Input from '../components/common/Input.jsx';
import Button from '../components/common/Button.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { useAdminContext } from '../hooks/useAdminContext.js';
import { useAsyncAction } from '../hooks/useAsyncAction.js';

// Friendlier labels/hints for the keys this institution is expected to have (see
// InstitutionService.seedDefaultRateConfiguration on the backend) - any other key still
// renders, just without this extra context, so the view never hides a real config row.
const KEY_METADATA = {
  EARN_RATE_CENTS_PER_POINT: {
    label: 'Global earn rate',
    suffix: '¢ / point',
    hint: 'Cents of spend required to earn 1 point when no tier/partner override applies. Must be positive.',
  },
  BURN_RATE_POINTS_PER_CENT: {
    label: 'Global burn rate',
    suffix: 'pts / cent',
    hint: 'Points required to redeem 1 cent of discount when no tier/partner override applies. Must be positive.',
  },
  POINTS_VALIDITY_DAYS: {
    label: 'Global points validity',
    suffix: 'days',
    hint: 'Days earned points stay valid before expiring, when no tier/partner override applies. 0 means points never expire.',
  },
};

function ConfigurationRow({ configuration, onSave }) {
  const metadata = KEY_METADATA[configuration.configKey] || { label: configuration.configKey, suffix: '' };
  const [value, setValue] = useState(String(configuration.configValue));
  const [validationError, setValidationError] = useState(null);
  const { run, isSubmitting, error, reset } = useAsyncAction(onSave);

  useEffect(() => {
    setValue(String(configuration.configValue));
    setValidationError(null);
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configuration.configValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 0) {
      setValidationError('Must be a non-negative whole number.');
      return;
    }
    setValidationError(null);
    try {
      await run(configuration.configKey, { configValue: parsed, description: configuration.description });
    } catch {
      // error surfaced via useAsyncAction's error state
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 border-b border-slate-700/60 px-5 py-4 last:border-b-0">
      <div className="flex-1">
        <Input
          id={`config-${configuration.configKey}`}
          type="number"
          min="0"
          step="1"
          label={metadata.label}
          suffix={metadata.suffix}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          hint={metadata.hint}
          error={validationError || error}
        />
      </div>
      <Button type="submit" variant="secondary" icon={Save} isLoading={isSubmitting}>
        Save
      </Button>
    </form>
  );
}

ConfigurationRow.propTypes = {
  configuration: PropTypes.shape({
    configKey: PropTypes.string.isRequired,
    configValue: PropTypes.number.isRequired,
    description: PropTypes.string,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};

export function GlobalSettingsView() {
  const { configurations, configurationsLoading, refreshConfigurations, updateConfigurationValue } = useAdminContext();

  useEffect(() => {
    refreshConfigurations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout
      title="Global Settings"
      description="Institution-wide fallback rates and points validity, used whenever a tier or partner has no override configured."
    >
      <Card>
        <CardHeader
          icon={Settings}
          title="System configuration"
          subtitle="Every tier/partner rate override falls back to these values when unset."
        />
        {configurationsLoading && configurations.length === 0 ? (
          <div className="px-5 py-4">
            <LoadingSpinner label="Loading settings…" />
          </div>
        ) : (
          configurations.map((configuration) => (
            <ConfigurationRow
              key={configuration.configKey}
              configuration={configuration}
              onSave={(configKey, payload) => updateConfigurationValue(configKey, payload)}
            />
          ))
        )}
      </Card>
    </DashboardLayout>
  );
}

export default GlobalSettingsView;
