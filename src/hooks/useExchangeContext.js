import { useContext } from 'react';
import { ExchangeContext } from '../context/ExchangeContext.jsx';

export function useExchangeContext() {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error('useExchangeContext must be used within an ExchangeProvider');
  }
  return context;
}
