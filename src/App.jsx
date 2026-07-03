import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LiveTransactionsView from './views/LiveTransactionsView.jsx';
import ProfileManagerView from './views/ProfileManagerView.jsx';
import CampaignEditorView from './views/CampaignEditorView.jsx';
import LoginView from './views/LoginView.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
