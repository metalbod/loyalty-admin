import React from 'react';
import PropTypes from 'prop-types';

const VARIANT_STYLES = {
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  amber: 'bg-amber-50 text-amber-600 border-amber-200',
  rose: 'bg-rose-50 text-rose-600 border-rose-200',
  sky: 'bg-sky-50 text-sky-600 border-sky-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  fuchsia: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200',
};

export function Badge({ children, variant = 'slate', icon: Icon = null, className = '' }) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide',
        VARIANT_STYLES[variant] || VARIANT_STYLES.slate,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {Icon && <Icon size={11} strokeWidth={2.5} />}
      {children}
    </span>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(Object.keys(VARIANT_STYLES)),
  icon: PropTypes.elementType,
  className: PropTypes.string,
};

export default Badge;
