import React from 'react';
import PropTypes from 'prop-types';
import { ArrowDownCircle, ArrowUpCircle, ShieldAlert, Sparkles } from 'lucide-react';
import Card, { CardHeader } from '../common/Card.jsx';
import Badge from '../common/Badge.jsx';
import Pagination from '../common/Pagination.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import EmptyState from '../common/EmptyState.jsx';
import ValuePreview from './ValuePreview.jsx';
import { formatDateTime } from '../../utils/dateUtils.js';

const ACTION_ICONS = {
  EARN: { icon: ArrowUpCircle, variant: 'emerald' },
  BURN: { icon: ArrowDownCircle, variant: 'sky' },
  EXPIRED: { icon: ShieldAlert, variant: 'amber' },
  CREATE: { icon: Sparkles, variant: 'fuchsia' },
  UPDATE: { icon: Sparkles, variant: 'amber' },
  DELETE: { icon: Sparkles, variant: 'rose' },
};

function SourceBadge({ source }) {
  return source === 'ADMIN_ACTION' ? (
    <Badge variant="fuchsia">Admin action</Badge>
  ) : (
    <Badge variant="sky">Transaction</Badge>
  );
}

SourceBadge.propTypes = { source: PropTypes.string.isRequired };

export function LedgerTable({ feed = null, isLoading = false, onPageChange }) {
  const rows = feed?.content ?? [];

  return (
    <Card>
      <CardHeader
        title="Live activity feed"
        subtitle="Point transactions and admin actions, merged and sorted by most recent."
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-2.5 font-medium">Timestamp</th>
              <th className="px-3 py-2.5 font-medium">Source</th>
              <th className="px-3 py-2.5 font-medium">Action</th>
              <th className="px-3 py-2.5 font-medium">Target entity</th>
              <th className="px-3 py-2.5 font-medium">Status</th>
              <th className="px-3 py-2.5 font-medium">Old → New values</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const actionMeta = ACTION_ICONS[row.action] || { icon: Sparkles, variant: 'slate' };
              const ActionIcon = actionMeta.icon;
              return (
                <tr key={row.id} className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
                  <td className="whitespace-nowrap px-5 py-3 text-xs text-slate-500">
                    {formatDateTime(row.timestamp)}
                  </td>
                  <td className="px-3 py-3">
                    <SourceBadge source={row.source} />
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant={actionMeta.variant} icon={ActionIcon}>
                      {row.action}
                    </Badge>
                  </td>
                  <td className="px-3 py-3 text-xs font-medium text-slate-800">{row.targetEntity}</td>
                  <td className="px-3 py-3">
                    <Badge variant={row.status === 'SUCCESS' ? 'emerald' : 'rose'}>{row.status}</Badge>
                  </td>
                  <td className="px-3 py-3">
                    <ValuePreview oldValue={row.oldValue} newValue={row.newValue} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isLoading && <LoadingSpinner label="Refreshing feed…" />}
        {!isLoading && rows.length === 0 && (
          <EmptyState title="No activity yet" description="Transactions and admin actions will appear here." />
        )}
      </div>
      {feed && rows.length > 0 && (
        <Pagination
          page={feed.page}
          totalPages={feed.totalPages}
          totalElements={feed.totalElements}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      )}
    </Card>
  );
}

LedgerTable.propTypes = {
  feed: PropTypes.shape({
    content: PropTypes.arrayOf(PropTypes.object),
    page: PropTypes.number,
    totalPages: PropTypes.number,
    totalElements: PropTypes.number,
  }),
  isLoading: PropTypes.bool,
  onPageChange: PropTypes.func.isRequired,
};

export default LedgerTable;
