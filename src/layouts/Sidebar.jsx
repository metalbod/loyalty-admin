import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Building2, CalendarClock, LogOut, ShieldCheck, Users, Wallet } from 'lucide-react';
import { NAV_ITEMS } from '../constants';
import { useAuth } from '../hooks/useAuth.js';
import { initials } from '../utils/formatters.js';

const ICONS = { Activity, Users, CalendarClock, Building2, Wallet };
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export function Sidebar() {
  const { user, logout } = useAuth();
  const visibleNavItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900/95 px-4 py-5">
      {user?.institutionName && (
        <div className="mb-4 flex items-center gap-2.5 border-b border-slate-800 px-2 pb-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-700 bg-slate-800/60">
            {user.logoDataUrl ? (
              <img
                src={user.logoDataUrl}
                alt={`${user.institutionName} logo`}
                className="h-full w-full object-contain"
              />
            ) : (
              <Building2 size={16} className="text-slate-400" />
            )}
          </span>
          <p className="truncate text-sm font-semibold text-slate-100">{user.institutionName}</p>
        </div>
      )}

      <div className="mb-8 flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--brand-40)] bg-[var(--brand-10)] text-[var(--brand)]">
          <ShieldCheck size={18} />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-100">Loyalty Admin</p>
          <p className="text-[11px] text-slate-500">Back-office console</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {visibleNavItems.map(({ path, label, icon }) => {
          const Icon = ICONS[icon];
          return (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              className={({ isActive }) =>
                [
                  'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border border-[var(--brand-40)] bg-[var(--brand-10)] text-[var(--brand)]'
                    : 'border border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200',
                ].join(' ')
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        {user && (
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-800/50 px-3 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-10)] text-xs font-semibold text-[var(--brand)]">
              {initials(user.email)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-slate-200">{user.email}</p>
              <p className="truncate text-[11px] text-slate-500">
                {user.role}
                {user.institutionName ? ` · ${user.institutionName}` : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={logout}
              title="Log out"
              className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-700 hover:text-rose-400"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}

        <div className="rounded-lg border border-slate-800 bg-slate-800/50 px-3 py-3">
          <p className="text-[11px] text-slate-500">Data source</p>
          <p className="mt-0.5 truncate text-xs font-medium text-emerald-400" title={API_BASE_URL}>
            Live API · {API_BASE_URL.replace(/^https?:\/\//, '')}
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
