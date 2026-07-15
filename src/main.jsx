import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { AdminProvider } from './context/AdminContext.jsx';
import { ProfileProvider } from './context/ProfileContext.jsx';
import { PartnerProvider } from './context/PartnerContext.jsx';
import { ExchangeProvider } from './context/ExchangeContext.jsx';
import { CampaignProvider } from './context/CampaignContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <ProfileProvider>
            <PartnerProvider>
              <ExchangeProvider>
                <CampaignProvider>
                  <App />
                </CampaignProvider>
              </ExchangeProvider>
            </PartnerProvider>
          </ProfileProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
