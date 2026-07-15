import React from 'react';
import PropTypes from 'prop-types';

/**
 * The base card container used across every view - white surface, subtle border, optional
 * emerald accent ring for highlighting the "effective"/winning item in a list.
 */
export function Card({ children = null, className = '', accent = false, as: Component = 'div', ...rest }) {
  return (
    <Component
      className={[
        'rounded-xl border bg-white shadow-card',
        accent ? 'border-emerald-300 ring-1 ring-emerald-500/20' : 'border-slate-200',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {children}
    </Component>
  );
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  accent: PropTypes.bool,
  as: PropTypes.elementType,
};

export function CardHeader({ title, subtitle = null, icon: Icon = null, action = null }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Icon size={16} strokeWidth={2.25} />
          </span>
        )}
        <div>
          <h2 className="text-sm font-semibold tracking-wide text-slate-900">{title}</h2>
          {subtitle && <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

CardHeader.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  icon: PropTypes.elementType,
  action: PropTypes.node,
};

export default Card;
