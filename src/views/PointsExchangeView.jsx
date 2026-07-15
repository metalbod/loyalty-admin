import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import ExchangeProviderGrid from '../components/exchange/ExchangeProviderGrid.jsx';
import CreateExchangeProviderModal from '../components/exchange/CreateExchangeProviderModal.jsx';
import EditExchangeProviderModal from '../components/exchange/EditExchangeProviderModal.jsx';
import ExchangeRequestsTable from '../components/exchange/ExchangeRequestsTable.jsx';
import Button from '../components/common/Button.jsx';
import { useExchangeContext } from '../hooks/useExchangeContext.js';

export function PointsExchangeView() {
  const {
    exchangeProviders,
    exchangeProvidersLoading,
    refreshExchangeProviders,
    addExchangeProvider,
    updateExchangeProviderConfig,
    exchangeRequests,
    exchangeRequestsLoading,
    loadExchangeRequestsPage,
  } = useExchangeContext();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editProvider, setEditProvider] = useState(null);

  useEffect(() => {
    refreshExchangeProviders();
    loadExchangeRequestsPage(0);
    // Load once on mount; context function references change on each render so can't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout
      title="Points Exchange"
      description="Let customers convert points to/from an external loyalty provider, settled in batches - see the request table below for live status."
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button icon={PlusCircle} onClick={() => setIsCreateOpen(true)}>
            Create provider
          </Button>
        </div>

        <ExchangeProviderGrid
          providers={exchangeProviders}
          isLoading={exchangeProvidersLoading}
          onEdit={setEditProvider}
        />

        <ExchangeRequestsTable
          requests={exchangeRequests}
          isLoading={exchangeRequestsLoading}
          onPageChange={loadExchangeRequestsPage}
        />
      </div>

      <CreateExchangeProviderModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={addExchangeProvider}
      />
      <EditExchangeProviderModal
        isOpen={Boolean(editProvider)}
        provider={editProvider}
        onClose={() => setEditProvider(null)}
        onSave={updateExchangeProviderConfig}
      />
    </DashboardLayout>
  );
}

export default PointsExchangeView;
