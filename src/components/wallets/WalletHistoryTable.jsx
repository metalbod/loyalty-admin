import React from 'react';
import PropTypes from 'prop-types';
import { ArrowDownCircle, ArrowUpCircle, ShieldAlert, History } from 'lucide-react';
import Card, { CardHeader } from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import Pagination from '../common/Pagination.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { formatPoints } from '../../utils/formatters.js';
import { formatDateTime } from '../../utils/dateUtils.js';

const TYPE_META = {
  EARN: { icon: ArrowUpCircle, variant: 'emerald' },
  BURN: { icon: ArrowDownCircle, variant: 'sky' },
  EXPIRED: { icon: ShieldAlert, variant: 'amber' },
};

export function WalletHistoryTable({ history, isLoading = false, onPageChange }) {
  const rows = history?.content ?? [];
  const page = history?.page ?? { number: 0, totalPages: 1, totalElements: 0 };

  return (
    <Card>
      <CardHeader
        title="Transaction history"
        subtitle="Every earn/redeem entry for this wallet, most recent first."
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-2.5 font-medium">Timestamp</th>
              <th className="px-3 py-2.5 font-medium">Type</th>
              <th className="px-3 py-2.5 font-medium">Points</th>
              <th className="px-3 py-2.5 font-medium">Balance after</th>
              <th className="px-3 py-2.5 font-medium">Points expiry</th>
              <th className="px-3 py-2.5 font-medium">Reference</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((entry) => {
              const meta = TYPE_META[entry.transactionType] || { icon: History, variant: 'slate' };
              const TypeIcon = meta.icon;
              return (
                <tr
                  key={entry.ledgerId}
                  className="border-b border-slate-200 last:border-0 hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-500">
                    {formatDateTime(entry.createdAt)}
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={meta.variant} icon={TypeIcon}>
                      {entry.transactionType}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-xs font-semibold text-slate-900">
                    {formatPoints(entry.pointsChanged)}
                  </td>
                  <td className="px-3 py-3 text-xs text-slate-600">
                    {entry.runningBalance.toLocaleString()} pts
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500">
                    {/* Only EARN rows ever carry an expiry - expiresAt is null/absent on
                        BURN/EXPIRED rows and on EARN rows configured to never expire. */}
                    {entry.transactionType === 'EARN' ? formatDateTime(entry.expiresAt) : '—'}
                  </td>
                  <td
                    className="max-w-[220px] truncate px-3 py-3 text-xs text-slate-500"
                    title={entry.referenceId}
                  >
                    {entry.referenceId}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isLoading && <LoadingSpinner label="Loading history…" />}
        {!isLoading && rows.length === 0 && (
          <EmptyState
            icon={History}
            title="No transactions yet"
            description="Earn and redeem activity for this wallet will appear here."
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

WalletHistoryTable.propTypes = {
  history: PropTypes.shape({
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

export default WalletHistoryTable;
