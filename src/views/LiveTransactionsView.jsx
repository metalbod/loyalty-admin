import React, { useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import MetricsGrid from '../components/ledger/MetricsGrid.jsx';
import ApiUsageCard from '../components/ledger/ApiUsageCard.jsx';
import LedgerTable from '../components/ledger/LedgerTable.jsx';
import { useAdminContext } from '../hooks/useAdminContext.js';

export function LiveTransactionsView() {
  const { metrics, metricsLoading, refreshMetrics, activityFeed, activityFeedLoading, loadActivityPage } =
    useAdminContext();

  useEffect(() => {
    refreshMetrics();
    loadActivityPage(0);
    // Load once on mount; context function references change on each render so can't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout
      title="Live Transactions & Ledger"
      description="Real-time snapshot of point movement and admin activity across the platform."
    >
      <div className="space-y-6">
        <MetricsGrid metrics={metrics} isLoading={metricsLoading} />
        <ApiUsageCard metrics={metrics} isLoading={metricsLoading} />
        <LedgerTable feed={activityFeed} isLoading={activityFeedLoading} onPageChange={loadActivityPage} />
      </div>
    </DashboardLayout>
  );
}

export default LiveTransactionsView;
