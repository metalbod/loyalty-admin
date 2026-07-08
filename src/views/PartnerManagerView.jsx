import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import PartnerGrid from '../components/partners/PartnerGrid.jsx';
import CreatePartnerModal from '../components/partners/CreatePartnerModal.jsx';
import PartnerRateConfigModal from '../components/partners/PartnerRateConfigModal.jsx';
import CreatePartnerServiceAccountModal from '../components/partners/CreatePartnerServiceAccountModal.jsx';
import Button from '../components/common/Button.jsx';
import { useAdminContext } from '../hooks/useAdminContext.js';

export function PartnerManagerView() {
  const {
    partners,
    partnersLoading,
    refreshPartners,
    addPartner,
    updatePartnerRates,
    createPartnerServiceAccount,
  } = useAdminContext();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [rateConfigPartner, setRateConfigPartner] = useState(null);
  const [serviceAccountPartner, setServiceAccountPartner] = useState(null);

  useEffect(() => {
    refreshPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout
      title="Channel Partners"
      description="Manage channel partners and override earn/burn rates - and service account logins - independently per partner."
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button icon={PlusCircle} onClick={() => setIsCreateOpen(true)}>
            Create partner
          </Button>
        </div>

        <PartnerGrid
          partners={partners}
          isLoading={partnersLoading}
          onConfigureRates={setRateConfigPartner}
          onCreateServiceAccount={setServiceAccountPartner}
        />
      </div>

      <CreatePartnerModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={addPartner}
      />
      <PartnerRateConfigModal
        isOpen={Boolean(rateConfigPartner)}
        partner={rateConfigPartner}
        onClose={() => setRateConfigPartner(null)}
        onSave={updatePartnerRates}
      />
      <CreatePartnerServiceAccountModal
        isOpen={Boolean(serviceAccountPartner)}
        partner={serviceAccountPartner}
        onClose={() => setServiceAccountPartner(null)}
        onCreate={createPartnerServiceAccount}
      />
    </DashboardLayout>
  );
}

export default PartnerManagerView;
