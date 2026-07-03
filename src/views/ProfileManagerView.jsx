import React, { useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import ProfileGrid from '../components/profiles/ProfileGrid.jsx';
import CreateProfileModal from '../components/profiles/CreateProfileModal.jsx';
import RateConfigModal from '../components/profiles/RateConfigModal.jsx';
import Button from '../components/common/Button.jsx';
import { useAdminContext } from '../hooks/useAdminContext.js';

export function ProfileManagerView() {
  const { profiles, profilesLoading, refreshProfiles, addProfile, updateProfileRates } = useAdminContext();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [rateConfigProfile, setRateConfigProfile] = useState(null);

  useEffect(() => {
    refreshProfiles();
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
        profile={rateConfigProfile}
        onClose={() => setRateConfigProfile(null)}
        onSave={updateProfileRates}
      />
    </DashboardLayout>
  );
}

export default ProfileManagerView;
