import React from 'react';
import PropTypes from 'prop-types';
import { Settings2, Users } from 'lucide-react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import { GLOBAL_RATES, TIER_ACCENTS } from '../../constants';

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

export function ProfileCard({ profile, onConfigureRates }) {
  const accent = TIER_ACCENTS[profile.profileName] || TIER_ACCENTS.DEFAULT;

  return (
    <Card className={`p-5 ring-1 ${accent.ring}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className={`h-2.5 w-2.5 rounded-full ${accent.dot}`} />
          <h3 className={`text-base font-semibold ${accent.text}`}>{profile.profileName}</h3>
        </div>
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <Users size={13} />
          {profile.memberCount}
        </span>
      </div>

      <p className="mt-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-400">
        {profile.description || 'No description provided.'}
      </p>

      <div className="mt-4 space-y-2">
        <RateRow
          label="Earn rate"
          overrideValue={profile.config?.earnRateCentsPerPoint ?? null}
          globalValue={GLOBAL_RATES.earnRateCentsPerPoint}
          suffix="cents / point"
        />
        <RateRow
          label="Burn rate"
          overrideValue={profile.config?.burnRatePointsPerCent ?? null}
          globalValue={GLOBAL_RATES.burnRatePointsPerCent}
          suffix="points / cent"
        />
      </div>

      <Button
        variant="secondary"
        icon={Settings2}
        fullWidth
        className="mt-4"
        onClick={() => onConfigureRates(profile)}
      >
        Configure rates
      </Button>
    </Card>
  );
}

ProfileCard.propTypes = {
  profile: PropTypes.shape({
    profileId: PropTypes.string.isRequired,
    profileName: PropTypes.string.isRequired,
    description: PropTypes.string,
    memberCount: PropTypes.number,
    config: PropTypes.shape({
      earnRateCentsPerPoint: PropTypes.number,
      burnRatePointsPerCent: PropTypes.number,
    }),
  }).isRequired,
  onConfigureRates: PropTypes.func.isRequired,
};

export default ProfileCard;
