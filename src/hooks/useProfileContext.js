import { useContext } from 'react';
import { ProfileContext } from '../context/ProfileContext.jsx';

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext must be used within a ProfileProvider');
  }
  return context;
}
