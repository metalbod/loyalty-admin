export const STORAGE_KEYS = {
  PROFILES: 'loyalty_admin_profiles',
  PROFILE_CONFIGS: 'loyalty_admin_profile_configs',
  CAMPAIGNS: 'loyalty_admin_campaigns',
  LEDGER: 'loyalty_admin_ledger',
  AUDIT_LOGS: 'loyalty_admin_audit_logs',
  WALLETS: 'loyalty_admin_wallets',
  SEEDED: 'loyalty_admin_seeded_v1',
};

export const NETWORK_LATENCY_MS = { min: 250, max: 650 };

// `roles` scopes each item to the roles that should see it - a superadmin manages the
// institutions list only (see SuperAdminRoute) and has no institution-scoped data to view, so
// it gets a disjoint nav from every other role.
export const NAV_ITEMS = [
  { path: '/', label: 'Live Transactions', icon: 'Activity', roles: ['ROLE_ADMIN'] },
  { path: '/wallets', label: 'Wallets', icon: 'Wallet', roles: ['ROLE_ADMIN'] },
  { path: '/profiles', label: 'Tier Profiles', icon: 'Users', roles: ['ROLE_ADMIN'] },
  { path: '/campaigns', label: 'Campaigns', icon: 'CalendarClock', roles: ['ROLE_ADMIN'] },
  { path: '/superadmin/institutions', label: 'Institutions', icon: 'Building2', roles: ['ROLE_SUPERADMIN'] },
];

export const TRANSACTION_TYPES = {
  EARN: 'EARN',
  BURN: 'BURN',
  EXPIRED: 'EXPIRED',
};

export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

export const CAMPAIGN_STATUS = {
  ACTIVE: 'ACTIVE',
  UPCOMING: 'UPCOMING',
  EXPIRED: 'EXPIRED',
};

export const CAMPAIGN_STATUS_STYLES = {
  [CAMPAIGN_STATUS.ACTIVE]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40',
  [CAMPAIGN_STATUS.UPCOMING]: 'bg-amber-500/10 text-amber-400 border-amber-500/40',
  [CAMPAIGN_STATUS.EXPIRED]: 'bg-slate-500/10 text-slate-400 border-slate-500/40',
};

export const TIER_ACCENTS = {
  VIP: { ring: 'ring-fuchsia-500/40', text: 'text-fuchsia-400', dot: 'bg-fuchsia-500' },
  GOLD: { ring: 'ring-amber-500/40', text: 'text-amber-400', dot: 'bg-amber-500' },
  STANDARD: { ring: 'ring-emerald-500/40', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  DEFAULT: { ring: 'ring-sky-500/40', text: 'text-sky-400', dot: 'bg-sky-500' },
};

export const GLOBAL_RATES = {
  earnRateCentsPerPoint: 100,
  burnRatePointsPerCent: 1,
};

export const LEDGER_PAGE_SIZE = 8;
export const WALLETS_PAGE_SIZE = 8;
