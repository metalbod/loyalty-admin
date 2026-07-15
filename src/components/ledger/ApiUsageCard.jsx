import React from 'react';
import PropTypes from 'prop-types';
import { Activity } from 'lucide-react';
import Card, { CardHeader } from '../common/Card.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import EmptyState from '../common/EmptyState.jsx';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];

function formatMonthLabel(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

function formatSinceDate(institutionCreatedAt) {
  if (!institutionCreatedAt) return null;
  return new Date(institutionCreatedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function ApiUsageCard({ metrics = null, isLoading = false }) {
  if (isLoading && !metrics) {
    return (
      <Card>
        <LoadingSpinner label="Loading API usage…" />
      </Card>
    );
  }

  const monthRows = metrics?.apiCallsByMonth ?? [];
  const allTime = metrics?.apiCallsAllTime;
  const since = formatSinceDate(metrics?.institutionCreatedAt);

  return (
    <Card>
      <CardHeader title="API Usage" subtitle="Billable calls to the integration API (/api/v1/**)" icon={Activity} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-5 py-2.5 font-medium">Month</th>
              <th className="px-3 py-2.5 font-medium">GET</th>
              <th className="px-3 py-2.5 font-medium">POST</th>
              <th className="px-3 py-2.5 font-medium">PUT</th>
              <th className="px-3 py-2.5 font-medium">DELETE</th>
              <th className="px-3 py-2.5 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {monthRows.map((row) => (
              <tr key={row.yearMonth} className="border-b border-slate-200 last:border-0 hover:bg-slate-50">
                <td className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-800">
                  {formatMonthLabel(row.yearMonth)}
                </td>
                <td className="px-3 py-3 text-slate-600">{row.get.toLocaleString()}</td>
                <td className="px-3 py-3 text-slate-600">{row.post.toLocaleString()}</td>
                <td className="px-3 py-3 text-slate-600">{row.put.toLocaleString()}</td>
                <td className="px-3 py-3 text-slate-600">{row.delete.toLocaleString()}</td>
                <td className="px-3 py-3 font-semibold text-slate-900">{row.total.toLocaleString()}</td>
              </tr>
            ))}
            {allTime && (
              <tr className="border-t-2 border-slate-200 bg-slate-50">
                <td className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-emerald-600">
                  All-time{since ? ` (since ${since})` : ''}
                </td>
                <td className="px-3 py-3 font-semibold text-slate-900">{allTime.get.toLocaleString()}</td>
                <td className="px-3 py-3 font-semibold text-slate-900">{allTime.post.toLocaleString()}</td>
                <td className="px-3 py-3 font-semibold text-slate-900">{allTime.put.toLocaleString()}</td>
                <td className="px-3 py-3 font-semibold text-slate-900">{allTime.delete.toLocaleString()}</td>
                <td className="px-3 py-3 font-semibold text-emerald-600">{allTime.total.toLocaleString()}</td>
              </tr>
            )}
          </tbody>
        </table>
        {!isLoading && monthRows.length === 0 && (
          <EmptyState title="No API usage yet" description="Calls to the integration API will appear here." />
        )}
      </div>
    </Card>
  );
}

const apiUsageRowShape = PropTypes.shape({
  yearMonth: PropTypes.string,
  get: PropTypes.number,
  post: PropTypes.number,
  put: PropTypes.number,
  delete: PropTypes.number,
  total: PropTypes.number,
});

ApiUsageCard.propTypes = {
  metrics: PropTypes.shape({
    institutionCreatedAt: PropTypes.string,
    apiCallsByMonth: PropTypes.arrayOf(apiUsageRowShape),
    apiCallsAllTime: apiUsageRowShape,
  }),
  isLoading: PropTypes.bool,
};

export default ApiUsageCard;
