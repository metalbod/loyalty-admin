import React, { useEffect } from 'react';
import CampaignForm from '../components/campaigns/CampaignForm.jsx';
import CampaignList from '../components/campaigns/CampaignList.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import { useAdminContext } from '../hooks/useAdminContext.js';

export function CampaignEditorView() {
  const { campaigns, campaignsLoading, refreshCampaigns, addCampaign } = useAdminContext();

  useEffect(() => {
    refreshCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout
      title="Campaign Calendar Editor"
      description="Schedule promotional windows. Overlapping campaigns resolve to the highest earn multiplier and lowest burn discount."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <CampaignForm onCreate={addCampaign} />
        <CampaignList campaigns={campaigns} isLoading={campaignsLoading} />
      </div>
    </DashboardLayout>
  );
}

export default CampaignEditorView;
