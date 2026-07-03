import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext.jsx';

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}
