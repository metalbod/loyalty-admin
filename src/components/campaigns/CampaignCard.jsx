import React from 'react';
import PropTypes from 'prop-types';
import { CalendarClock, Clock, TrendingDown, TrendingUp } from 'lucide-react';
import Card from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import { CAMPAIGN_STATUS, CAMPAIGN_STATUS_STYLES } from '../../constants';
import { formatDateTime, formatRelativeToNow, getCampaignStatus } from '../../utils/dateUtils.js';
import { formatMultiplier } from '../../utils/formatters.js';

export function CampaignCard({ campaign, isEffectiveEarn = false, isEffectiveBurn = false }) {
  const status = getCampaignStatus(campaign);
  const isHighlighted = isEffectiveEarn || isEffectiveBurn;

  return (
    <Card accent={isHighlighted} className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{campaign.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
            <CalendarClock size={12} />
            {formatDateTime(campaign.startTime)} → {formatDateTime(campaign.endTime)}
          </p>
        </div>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide ${CAMPAIGN_STATUS_STYLES[status]}`}>
          {status}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
        <Clock size={12} />
        {status === CAMPAIGN_STATUS.EXPIRED ? 'Ended' : status === CAMPAIGN_STATUS.UPCOMING ? 'Starts' : 'Ends'}{' '}
        {formatRelativeToNow(status === CAMPAIGN_STATUS.UPCOMING ? campaign.startTime : campaign.endTime)}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-slate-500">
            <TrendingUp size={11} /> Earn
          </p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">{formatMultiplier(campaign.earnMultiplier)}</p>
          {isEffectiveEarn && (
            <Badge variant="emerald" className="mt-1">
              Effective now
            </Badge>
          )}
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-2">
          <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-slate-500">
            <TrendingDown size={11} /> Burn discount
          </p>
          <p className="mt-0.5 text-sm font-semibold text-slate-900">
            {formatMultiplier(campaign.burnDiscountMultiplier)}
          </p>
          {isEffectiveBurn && (
            <Badge variant="emerald" className="mt-1">
              Effective now
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

CampaignCard.propTypes = {
  campaign: PropTypes.shape({
    campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    startTime: PropTypes.string.isRequired,
    endTime: PropTypes.string.isRequired,
    earnMultiplier: PropTypes.number.isRequired,
    burnDiscountMultiplier: PropTypes.number.isRequired,
  }).isRequired,
  isEffectiveEarn: PropTypes.bool,
  isEffectiveBurn: PropTypes.bool,
};

export default CampaignCard;
