import React from 'react';
import PropTypes from 'prop-types';

export function Input({
  label = null,
  hint = null,
  error = null,
  suffix = null,
  id = undefined,
  className = '',
  containerClassName = '',
  ...inputProps
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-300">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          className={[
            'w-full rounded-lg border bg-slate-900/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
            error ? 'border-rose-500/60' : 'border-slate-700',
            suffix ? 'pr-14' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...inputProps}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-slate-500">
            {suffix}
          </span>
        )}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-rose-400">{error}</p>
      ) : (
        hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>
      )}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.node,
  hint: PropTypes.node,
  error: PropTypes.node,
  suffix: PropTypes.node,
  id: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
};

export default Input;
