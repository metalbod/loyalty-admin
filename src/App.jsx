import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LiveTransactionsView from './views/LiveTransactionsView.jsx';
import WalletsListView from './views/WalletsListView.jsx';
import WalletDetailView from './views/WalletDetailView.jsx';
import ProfileManagerView from './views/ProfileManagerView.jsx';
import CampaignEditorView from './views/CampaignEditorView.jsx';
import InstitutionManagerView from './views/InstitutionManagerView.jsx';
import LoginView from './views/LoginView.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import SuperAdminRoute from './components/auth/SuperAdminRoute.jsx';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <LiveTransactionsView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallets"
        element={
          <ProtectedRoute>
            <WalletsListView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wallets/:userId"
        element={
          <ProtectedRoute>
            <WalletDetailView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profiles"
        element={
          <ProtectedRoute>
            <ProfileManagerView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/campaigns"
        element={
          <ProtectedRoute>
            <CampaignEditorView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/institutions"
        element={
          <SuperAdminRoute>
            <InstitutionManagerView />
          </SuperAdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
