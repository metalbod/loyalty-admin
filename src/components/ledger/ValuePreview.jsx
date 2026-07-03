import React from 'react';
import PropTypes from 'prop-types';

function stringifyValue(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${val}`)
      .join(', ');
  }
  return String(value);
}

export function ValuePreview({ oldValue = null, newValue = null }) {
  const oldText = stringifyValue(oldValue);
  const newText = stringifyValue(newValue);

  if (!oldText && !newText) {
    return <span className="text-slate-600">—</span>;
  }

  return (
    <div className="flex max-w-xs flex-col gap-0.5 text-xs">
      {oldText && (
        <span className="truncate text-rose-400/80 line-through decoration-rose-500/40">{oldText}</span>
      )}
      {newText && <span className="truncate text-emerald-400">{newText}</span>}
    </div>
  );
}

ValuePreview.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  oldValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]),
  // eslint-disable-next-line react/forbid-prop-types
  newValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.number]),
};

export default ValuePreview;
