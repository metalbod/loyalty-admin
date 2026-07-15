import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import WalletsTable from '../components/wallets/WalletsTable.jsx';
import { useAdminContext } from '../hooks/useAdminContext.js';

// Maps a column key to the property path the backend actually needs to sort on -
// profileName lives on the joined Profile entity, not on LoyaltyWallet itself.
const SORT_PROPERTY = {
  userId: 'userId',
  currentBalance: 'currentBalance',
  profileName: 'profile.profileName',
};

export function WalletsListView() {
  const { wallets, walletsLoading, loadWalletsPage } = useAdminContext();
  const [sortField, setSortField] = useState('userId');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    loadWalletsPage(0, `${SORT_PROPERTY[sortField]},${sortDirection}`);
    // Reload page when sort field/direction changes; loadWalletsPage reference changes on each render so can't be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortField, sortDirection]);

  const handleSortChange = (field) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handlePageChange = (page) => {
    loadWalletsPage(page, `${SORT_PROPERTY[sortField]},${sortDirection}`);
  };

  return (
    <DashboardLayout
      title="Wallets"
      description="Browse every wallet in your institution and drill into its transaction history."
    >
      <WalletsTable
        wallets={wallets}
        isLoading={walletsLoading}
        onPageChange={handlePageChange}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
    </DashboardLayout>
  );
}

export default WalletsListView;
