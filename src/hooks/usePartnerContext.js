import { useContext } from 'react';
import { PartnerContext } from '../context/PartnerContext.jsx';

export function usePartnerContext() {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error('usePartnerContext must be used within a PartnerProvider');
  }
  return context;
}
