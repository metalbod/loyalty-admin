import React from 'react';
import PropTypes from 'prop-types';
import { Settings2, Users } from 'lucide-react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import TierRulesSection from './TierRulesSection.jsx';
import { GLOBAL_RATES, TIER_ACCENTS } from '../../constants';

function RateRow({ label, overrideValue = null, globalValue, suffix }) {
  const usingOverride = overrideValue !== null && overrideValue !== undefined;
  return (
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-xs text-slate-500">{label}</span>
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-900">
          {usingOverride ? overrideValue : globalValue}{' '}
          <span className="text-xs font-normal text-slate-500">{suffix}</span>
        </p>
        {usingOverride ? (
          <Badge variant="emerald" className="mt-0.5">
            Override
          </Badge>
        ) : (
          <Badge variant="slate" className="mt-0.5">
            Global fallback
          </Badge>
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
    <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
      <span className="text-xs text-slate-500">Points validity</span>
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-900">{formatValidityDays(effective)}</p>
        {usingOverride ? (
          <Badge variant="emerald" className="mt-0.5">
            Override
          </Badge>
        ) : (
          <Badge variant="slate" className="mt-0.5">
            Global fallback
          </Badge>
        )}
      </div>
    </div>
  );
}

ValidityRow.propTypes = {
  overrideValue: PropTypes.number,
  globalValue: PropTypes.number.isRequired,
};

export function ProfileCard({ profile, profiles, partners, onConfigureRates }) {
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

      <p className="mt-2 min-h-[2.5rem] text-xs leading-relaxed text-slate-500">
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
        <ValidityRow
          overrideValue={profile.config?.pointsValidityDays ?? null}
          globalValue={GLOBAL_RATES.pointsValidityDays}
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

      <TierRulesSection profile={profile} profiles={profiles} partners={partners} />
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
      pointsValidityDays: PropTypes.number,
    }),
  }).isRequired,
  profiles: PropTypes.arrayOf(
    PropTypes.shape({
      profileId: PropTypes.string.isRequired,
      profileName: PropTypes.string.isRequired,
    })
  ).isRequired,
  partners: PropTypes.arrayOf(
    PropTypes.shape({
      partnerId: PropTypes.string.isRequired,
      partnerName: PropTypes.string.isRequired,
    })
  ).isRequired,
  onConfigureRates: PropTypes.func.isRequired,
};

export default ProfileCard;
