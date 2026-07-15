import React from 'react';
import PropTypes from 'prop-types';
import { Settings2 } from 'lucide-react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';

function RateRow({ label, rate, unitLabel }) {
  const supported = rate !== null && rate !== undefined;
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-xs text-slate-500">{label}</span>
      {supported ? (
        <p className="text-sm font-semibold text-slate-900">
          {rate} <span className="text-xs font-normal text-slate-500">{unitLabel}</span>
        </p>
      ) : (
        <Badge variant="slate">Disabled</Badge>
      )}
    </div>
  );
}

RateRow.propTypes = {
  label: PropTypes.string.isRequired,
  rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  unitLabel: PropTypes.string.isRequired,
};

export function ExchangeProviderCard({ provider, onEdit }) {
  return (
    <Card className={`p-5 ring-1 ${provider.active ? 'ring-sky-300' : 'ring-slate-200'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={`h-2.5 w-2.5 rounded-full ${provider.active ? 'bg-sky-600' : 'bg-slate-200'}`}
          />
          <h3 className="text-base font-semibold text-sky-600">{provider.displayName}</h3>
        </div>
        <Badge variant={provider.active ? 'emerald' : 'slate'}>
          {provider.active ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <p className="mt-2 text-xs text-slate-500">Provider code: {provider.providerCode}</p>

      <div className="mt-4 space-y-2">
        <RateRow
          label="Inbound (customer → us)"
          rate={provider.inboundPointsPerExternalUnit}
          unitLabel="pts / unit"
        />
        <RateRow
          label="Outbound (us → customer)"
          rate={provider.outboundPointsPerExternalUnit}
          unitLabel="pts / unit"
        />
      </div>

      <div className="mt-4">
        <Button variant="secondary" icon={Settings2} fullWidth onClick={() => onEdit(provider)}>
          Edit provider
        </Button>
      </div>
    </Card>
  );
}

ExchangeProviderCard.propTypes = {
  provider: PropTypes.shape({
    providerId: PropTypes.string.isRequired,
    providerCode: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    inboundPointsPerExternalUnit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    outboundPointsPerExternalUnit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    active: PropTypes.bool.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ExchangeProviderCard;
