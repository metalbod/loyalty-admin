import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar.jsx';

export function DashboardLayout({ title, description = null, children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 px-8 py-5 backdrop-blur">
          <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
        </header>
        <main className="px-8 py-6">{children}</main>
      </div>
    </div>
  );
}

DashboardLayout.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
