import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ label = 'Loading…', size = 20, className = '' }) {
  return (
    <div className={['flex items-center justify-center gap-2 py-8 text-slate-400', className].filter(Boolean).join(' ')}>
      <Loader2 size={size} className="animate-spin" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}

LoadingSpinner.propTypes = {
  label: PropTypes.node,
  size: PropTypes.number,
  className: PropTypes.string,
};

export default LoadingSpinner;
