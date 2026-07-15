import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import ProfileGrid from '../components/profiles/ProfileGrid.jsx';
import CreateProfileModal from '../components/profiles/CreateProfileModal.jsx';
import RateConfigModal from '../components/common/RateConfigModal.jsx';
import Button from '../components/common/Button.jsx';
import { useProfileContext } from '../hooks/useProfileContext.js';
import { usePartnerContext } from '../hooks/usePartnerContext.js';

export function ProfileManagerView() {
  const { profiles, profilesLoading, refreshProfiles, addProfile, updateProfileRates } = useProfileContext();
  const { partners, refreshPartners } = usePartnerContext();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [rateConfigProfile, setRateConfigProfile] = useState(null);

  useEffect(() => {
    refreshProfiles();
    // Tier rules can reference a channel partner, so the "From" dropdown on the create-rule
    // modal needs the partner list too - fetched here rather than by TierRulesSection itself,
    // same as AdminContext's other lazily-populated lists.
    refreshPartners();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout
      title="Profile & Tier Configuration"
      description="Manage loyalty tiers and override earn/burn rates independently per tier."
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button icon={PlusCircle} onClick={() => setIsCreateOpen(true)}>
            Create profile
          </Button>
        </div>

        <ProfileGrid
          profiles={profiles}
          partners={partners}
          isLoading={profilesLoading}
          onConfigureRates={setRateConfigProfile}
        />
      </div>

      <CreateProfileModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={addProfile}
      />
      <RateConfigModal
        isOpen={Boolean(rateConfigProfile)}
        entity={rateConfigProfile}
        entityType="profile"
        onClose={() => setRateConfigProfile(null)}
        onSave={updateProfileRates}
      />
    </DashboardLayout>
  );
}

export default ProfileManagerView;
