import React from 'react';
import PropTypes from 'prop-types';
import { CalendarClock, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import Card from '../common/Card.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';

const STAT_CONFIG = [
  {
    key: 'totalIssued',
    label: 'Points Issued',
    icon: TrendingUp,
    accent: 'text-emerald-600 bg-emerald-50',
    format: (v) => `+${v.toLocaleString()}`,
  },
  {
    key: 'totalBurned',
    label: 'Points Burned',
    icon: TrendingDown,
    accent: 'text-rose-600 bg-rose-50',
    format: (v) => `-${v.toLocaleString()}`,
  },
  {
    key: 'activeCampaigns',
    label: 'Active Campaigns',
    icon: CalendarClock,
    accent: 'text-amber-600 bg-amber-50',
    format: (v) => v.toLocaleString(),
  },
  {
    key: 'totalWallets',
    label: 'Total Wallets',
    icon: Wallet,
    accent: 'text-sky-600 bg-sky-50',
    format: (v) => v.toLocaleString(),
  },
];

export function MetricsGrid({ metrics = null, isLoading = false }) {
  if (isLoading && !metrics) {
    return (
      <Card>
        <LoadingSpinner label="Loading metrics…" />
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STAT_CONFIG.map(({ key, label, icon: Icon, accent, format }) => (
        <Card key={key} className="p-4">
          <div className="flex items-center justify-between">
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent}`}>
              <Icon size={18} />
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {metrics ? format(metrics[key] ?? 0) : '—'}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        </Card>
      ))}
    </div>
  );
}

MetricsGrid.propTypes = {
  metrics: PropTypes.shape({
    totalIssued: PropTypes.number,
    totalBurned: PropTypes.number,
    activeCampaigns: PropTypes.number,
    totalWallets: PropTypes.number,
  }),
  isLoading: PropTypes.bool,
};

export default MetricsGrid;
