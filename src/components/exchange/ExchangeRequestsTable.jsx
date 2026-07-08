import React from 'react';
import PropTypes from 'prop-types';
import { ArrowDownCircle, ArrowUpCircle, ListChecks } from 'lucide-react';
import Card, { CardHeader } from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import Pagination from '../common/Pagination.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { formatDateTime } from '../../utils/dateUtils.js';

const STATUS_VARIANT = {
  PENDING: 'amber',
  SETTLED: 'emerald',
  FAILED: 'rose',
};

const DIRECTION_META = {
  IN: { icon: ArrowDownCircle, variant: 'sky', label: 'IN' },
  OUT: { icon: ArrowUpCircle, variant: 'fuchsia', label: 'OUT' },
};

export function ExchangeRequestsTable({ requests, isLoading = false, onPageChange }) {
  const rows = requests?.content ?? [];
  const page = requests?.page ?? { number: 0, totalPages: 1, totalElements: 0 };

  return (
    <Card>
      <CardHeader
        title="Exchange requests"
        subtitle="Every points exchange request, pending until the batch submit/reconcile jobs settle it."
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700/80 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-2.5 font-medium">Created</th>
              <th className="px-3 py-2.5 font-medium">User</th>
              <th className="px-3 py-2.5 font-medium">Direction</th>
              <th className="px-3 py-2.5 font-medium">External units</th>
              <th className="px-3 py-2.5 font-medium">Points</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5 font-medium">Detail</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const directionMeta = DIRECTION_META[row.direction] || DIRECTION_META.IN;
              const DirectionIcon = directionMeta.icon;
              return (
                <tr key={row.requestId} className="border-b border-slate-800 last:border-0 hover:bg-slate-800/40">
                  <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-400">
                    {formatDateTime(row.createdAt)}
                  </td>
                  <td className="px-3 py-3 text-xs font-medium text-slate-200">#{row.userId}</td>
                  <td className="px-3 py-3">
                    <Badge variant={directionMeta.variant} icon={DirectionIcon}>{directionMeta.label}</Badge>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-300">{row.externalUnits}</td>
                  <td className="px-3 py-3 text-xs font-semibold text-slate-100">{row.points}</td>
                  <td className="px-3 py-3">
                    <Badge variant={STATUS_VARIANT[row.status] || 'slate'}>{row.status}</Badge>
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-400">
                    {row.status === 'FAILED' ? (row.failureReason || '—') : (row.externalRefId || '—')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isLoading && <LoadingSpinner label="Loading exchange requests…" />}
        {!isLoading && rows.length === 0 && (
          <EmptyState
            icon={ListChecks}
            title="No exchange requests yet"
            description="Customer-initiated points exchanges will appear here."
          />
        )}
      </div>
      {rows.length > 0 && (
        <Pagination
          page={page.number}
          totalPages={page.totalPages}
          totalElements={page.totalElements}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      )}
    </Card>
  );
}

ExchangeRequestsTable.propTypes = {
  requests: PropTypes.shape({
    content: PropTypes.arrayOf(PropTypes.object),
    page: PropTypes.shape({
      number: PropTypes.number,
      totalPages: PropTypes.number,
      totalElements: PropTypes.number,
    }),
  }),
  isLoading: PropTypes.bool,
  onPageChange: PropTypes.func.isRequired,
};

export default ExchangeRequestsTable;
