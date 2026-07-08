import React from 'react';
import PropTypes from 'prop-types';
import { Settings2, UserPlus } from 'lucide-react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import { GLOBAL_RATES } from '../../constants';

function RateRow({ label, overrideValue = null, globalValue, suffix }) {
  const usingOverride = overrideValue !== null && overrideValue !== undefined;
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-900/60 px-3 py-2">
      <span className="text-xs text-slate-400">{label}</span>
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-100">
          {usingOverride ? overrideValue : globalValue} <span className="text-xs font-normal text-slate-500">{suffix}</span>
        </p>
        {usingOverride ? (
          <Badge variant="emerald" className="mt-0.5">Override</Badge>
        ) : (
          <Badge variant="slate" className="mt-0.5">Global fallback</Badge>
        )}
      </div>
    </div>
  );
}

RateRow.propTypes = {
  label: PropTypes.string.isRequired,
  overrideValue: PropTypes.number,
  globalValue: PropTypes.number.isRequired,
  suffix: PropTypes.string.isRequired,
};

function formatValidityDays(days) {
  return days === 0 ? 'Never expires' : `${days} days`;
}

function ValidityRow({ overrideValue = null, globalValue }) {
  const usingOverride = overrideValue !== null && overrideValue !== undefined;
  const effective = usingOverride ? overrideValue : globalValue;
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-900/60 px-3 py-2">
      <span className="text-xs text-slate-400">Points validity</span>
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-100">{formatValidityDays(effective)}</p>
        {usingOverride ? (
          <Badge variant="emerald" className="mt-0.5">Override</Badge>
        ) : (
          <Badge variant="slate" className="mt-0.5">Global fallback</Badge>
        )}
      </div>
    </div>
  );
}

ValidityRow.propTypes = {
  overrideValue: PropTypes.number,
  globalValue: PropTypes.number.isRequired,
};

export function PartnerCard({ partner, onConfigureRates, onCreateServiceAccount }) {
  return (
    <Card className="p-5 ring-1 ring-indigo-500/40">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
          <h3 className="text-base font-semibold text-indigo-400">{partner.partnerName}</h3>
        </div>
      </div>

      <p className="mt-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-400">
        {partner.description || 'No description provided.'}
      </p>

      <div className="mt-4 space-y-2">
        <RateRow
          label="Earn rate"
          overrideValue={partner.config?.earnRateCentsPerPoint ?? null}
          globalValue={GLOBAL_RATES.earnRateCentsPerPoint}
          suffix="cents / point"
        />
        <RateRow
          label="Burn rate"
          overrideValue={partner.config?.burnRatePointsPerCent ?? null}
          globalValue={GLOBAL_RATES.burnRatePointsPerCent}
          suffix="points / cent"
        />
        <ValidityRow
          overrideValue={partner.config?.pointsValidityDays ?? null}
          globalValue={GLOBAL_RATES.pointsValidityDays}
        />
      </div>

      <div className="mt-4 flex gap-2">
        <Button variant="secondary" icon={Settings2} fullWidth onClick={() => onConfigureRates(partner)}>
          Configure rates
        </Button>
        <Button variant="secondary" icon={UserPlus} fullWidth onClick={() => onCreateServiceAccount(partner)}>
          Service account
        </Button>
      </div>
    </Card>
  );
}

PartnerCard.propTypes = {
  partner: PropTypes.shape({
    partnerId: PropTypes.string.isRequired,
    partnerName: PropTypes.string.isRequired,
    description: PropTypes.string,
    config: PropTypes.shape({
      earnRateCentsPerPoint: PropTypes.number,
      burnRatePointsPerCent: PropTypes.number,
      pointsValidityDays: PropTypes.number,
    }),
  }).isRequired,
  onConfigureRates: PropTypes.func.isRequired,
  onCreateServiceAccount: PropTypes.func.isRequired,
};

export default PartnerCard;
