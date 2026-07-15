import React, { useCallback, useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import InstitutionGrid from '../components/institutions/InstitutionGrid.jsx';
import CreateInstitutionModal from '../components/institutions/CreateInstitutionModal.jsx';
import EditBrandingModal from '../components/institutions/EditBrandingModal.jsx';
import Button from '../components/common/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import * as api from '../api/client.js';

// Institutions aren't tenant-scoped data (a superadmin belongs to no institution), so this
// view manages its own list state directly rather than going through AdminContext, which
// exists specifically for per-institution data (metrics/profiles/campaigns/activity feed).
export function InstitutionManagerView() {
  const { user } = useAuth();
  const [institutions, setInstitutions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [brandingInstitution, setBrandingInstitution] = useState(null);
  const [updatingInstitutionId, setUpdatingInstitutionId] = useState(null);
  const [statusError, setStatusError] = useState(null);

  const refreshInstitutions = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await api.fetchInstitutions();
      setInstitutions(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshInstitutions();
  }, [refreshInstitutions]);

  const handleCreate = async (payload) => {
    const created = await api.createInstitution(payload, user.email);
    setInstitutions((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    return created;
  };

  const handleUpdateBranding = async (institutionId, payload) => {
    const updated = await api.updateInstitutionBranding(institutionId, payload, user.email);
    setInstitutions((prev) => prev.map((i) => (i.institutionId === updated.institutionId ? updated : i)));
    return updated;
  };

  const handleToggleStatus = async (institution, nextStatus) => {
    setStatusError(null);
    setUpdatingInstitutionId(institution.institutionId);
    try {
      const updated = await api.updateInstitutionStatus(institution.institutionId, nextStatus, user.email);
      setInstitutions((prev) =>
        prev.map((i) => (i.institutionId === updated.institutionId ? updated : i)),
      );
    } catch (err) {
      setStatusError(err?.message || 'Could not update institution status.');
    } finally {
      setUpdatingInstitutionId(null);
    }
  };

  return (
    <DashboardLayout
      title="Institutions"
      description="Create and manage the institutions using this platform. Each institution has its own isolated users, tiers, campaigns, and rates."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          {statusError && <p className="text-xs text-rose-600">{statusError}</p>}
          <div className="ml-auto">
            <Button icon={PlusCircle} onClick={() => setIsCreateOpen(true)}>
              Create institution
            </Button>
          </div>
        </div>

        <InstitutionGrid
          institutions={institutions}
          isLoading={isLoading}
          onToggleStatus={handleToggleStatus}
          onEditBranding={setBrandingInstitution}
          updatingInstitutionId={updatingInstitutionId}
        />
      </div>

      <CreateInstitutionModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreate={handleCreate} />
      <EditBrandingModal
        isOpen={brandingInstitution !== null}
        onClose={() => setBrandingInstitution(null)}
        institution={brandingInstitution}
        onSave={handleUpdateBranding}
      />
    </DashboardLayout>
  );
}

export default InstitutionManagerView;
