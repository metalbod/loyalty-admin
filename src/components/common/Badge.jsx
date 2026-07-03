import React from 'react';
import PropTypes from 'prop-types';

const VARIANT_STYLES = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/40',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/40',
  sky: 'bg-sky-500/10 text-sky-400 border-sky-500/40',
  slate: 'bg-slate-500/10 text-slate-400 border-slate-500/40',
  fuchsia: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/40',
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
