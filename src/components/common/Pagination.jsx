import React from 'react';
import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ page, totalPages, totalElements, onPageChange, isLoading = false }) {
  const canGoPrevious = page > 0 && !isLoading;
  const canGoNext = page < totalPages - 1 && !isLoading;

  return (
    <div className="flex items-center justify-between border-t border-slate-700/80 px-5 py-3">
      <p className="text-xs text-slate-500">
        Page <span className="text-slate-300">{page + 1}</span> of{' '}
        <span className="text-slate-300">{totalPages}</span>
        <span className="mx-1.5">·</span>
        {totalElements} total entries
      </p>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={!canGoPrevious}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1 rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={14} />
          Prev
        </button>
        <button
          type="button"
          disabled={!canGoNext}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1 rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-300 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalElements: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default Pagination;
