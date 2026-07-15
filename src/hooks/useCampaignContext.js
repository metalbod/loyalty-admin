import { useContext } from 'react';
import { CampaignContext } from '../context/CampaignContext.jsx';

export function useCampaignContext() {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaignContext must be used within a CampaignProvider');
  }
  return context;
}
