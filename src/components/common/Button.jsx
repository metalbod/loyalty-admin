import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

const VARIANT_STYLES = {
  primary:
    'bg-emerald-500 text-slate-950 hover:bg-emerald-400 focus-visible:outline-emerald-400 disabled:bg-emerald-500/40',
  secondary:
    'bg-slate-700/80 text-slate-100 hover:bg-slate-700 focus-visible:outline-slate-400 disabled:bg-slate-700/40',
  ghost:
    'bg-transparent text-slate-300 hover:bg-slate-800 focus-visible:outline-slate-500 disabled:text-slate-600',
  danger:
    'bg-rose-500/90 text-white hover:bg-rose-500 focus-visible:outline-rose-400 disabled:bg-rose-500/40',
};

export function Button({
  children,
  onClick = undefined,
  type = 'button',
  variant = 'primary',
  icon: Icon = null,
  isLoading = false,
  disabled = false,
  className = '',
  fullWidth = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium',
        'transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:cursor-not-allowed',
        fullWidth ? 'w-full' : '',
        VARIANT_STYLES[variant] || VARIANT_STYLES.primary,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : Icon && <Icon size={16} />}
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(Object.keys(VARIANT_STYLES)),
  icon: PropTypes.elementType,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default Button;
