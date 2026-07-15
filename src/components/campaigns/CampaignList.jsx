import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { CalendarX2, Layers3 } from 'lucide-react';
import CampaignCard from './CampaignCard.jsx';
import Card from '../common/Card.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { formatMultiplier } from '../../utils/formatters.js';
import { resolveEffectiveCampaigns } from '../../utils/dateUtils.js';

export function CampaignList({ campaigns, isLoading = false }) {
  const { earnCampaign, burnCampaign, overlapping } = useMemo(
    () => resolveEffectiveCampaigns(campaigns),
    [campaigns]
  );

  if (isLoading && campaigns.length === 0) {
    return <LoadingSpinner label="Loading campaigns…" />;
  }

  if (!isLoading && campaigns.length === 0) {
    return (
      <EmptyState
        icon={CalendarX2}
        title="No campaigns yet"
        description="Create your first campaign using the form to see it appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      {(earnCampaign || burnCampaign) && (
        <Card
          accent
          className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-2 text-sm text-slate-800">
            <Layers3 size={16} className="text-emerald-600" />
            <span>
              Effective rates right now:{' '}
              <strong>{formatMultiplier(earnCampaign?.earnMultiplier)}</strong> earn ·{' '}
              <strong>{formatMultiplier(burnCampaign?.burnDiscountMultiplier)}</strong> burn
              discount
            </span>
          </div>
          {overlapping && (
            <span className="text-xs text-slate-500">
              {earnCampaign?.campaignId === burnCampaign?.campaignId
                ? `Driven by "${earnCampaign.name}"`
                : `Earn from "${earnCampaign?.name}", burn from "${burnCampaign?.name}"`}
            </span>
          )}
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.campaignId}
            campaign={campaign}
            isEffectiveEarn={earnCampaign?.campaignId === campaign.campaignId}
            isEffectiveBurn={burnCampaign?.campaignId === campaign.campaignId}
          />
        ))}
      </div>
    </div>
  );
}

CampaignList.propTypes = {
  campaigns: PropTypes.arrayOf(
    PropTypes.shape({
      campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  isLoading: PropTypes.bool,
};

export default CampaignList;
