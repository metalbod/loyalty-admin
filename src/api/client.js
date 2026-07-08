import { LEDGER_PAGE_SIZE, WALLETS_PAGE_SIZE } from '../constants';
import { getToken, notifyUnauthorized } from './authToken';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// The login endpoint's own 401 (wrong username/password) is a normal, expected error that
// the login form displays inline - it must NOT trigger the global "session expired" flow
// below, which is only for a previously-valid token going stale mid-session.
const AUTH_PATH_PREFIX = '/api/auth/';

// How many of the most recent rows to pull from each of the ledger/audit-log endpoints when
// building the merged activity feed. The backend has no single "everything, sorted" endpoint,
// so the feed is assembled client-side from two separately-paginated sources; entries older
// than this window (per source) won't appear. Fine for an admin console, not for a true
// unbounded audit export.
const ACTIVITY_FEED_FETCH_SIZE = 100;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// This function IS the fetch interceptor: every API call in this module goes through it, so
// attaching the auth header and reacting to 401s here covers the whole app in one place
// rather than needing every call site to remember to do it.
async function request(path, { method = 'GET', body, adminId } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (adminId) {
    headers['X-Admin-Id'] = adminId;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      `Could not reach the loyalty backend at ${API_BASE_URL}. Is it running?`,
      0,
    );
  }

  if (response.status === 401 && !path.startsWith(AUTH_PATH_PREFIX)) {
    notifyUnauthorized();
  }

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorBody = await response.json();
      message = errorBody.message || message;
    } catch {
      // response body wasn't JSON - fall back to statusText
    }
    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

// ---------------------------------------------------------------------------
// Metrics
// ---------------------------------------------------------------------------

export async function fetchMetrics() {
  return request('/api/admin/metrics');
}

// ---------------------------------------------------------------------------
// Live activity feed (merged point ledger + admin audit trail)
// ---------------------------------------------------------------------------

function ledgerEntryToFeedRow(entry) {
  return {
    id: `ledger-${entry.ledgerId}`,
    source: 'TRANSACTION',
    timestamp: entry.createdAt,
    action: entry.transactionType,
    targetEntity: `WALLET #${entry.userId}`,
    // The backend only ever persists successful transactions - a failed earn/redeem never
    // reaches point_ledger, so every row here is inherently a success.
    status: 'SUCCESS',
    oldValue: { runningBalance: entry.runningBalance - entry.pointsChanged },
    newValue: { runningBalance: entry.runningBalance, pointsChanged: entry.pointsChanged },
    referenceId: entry.referenceId,
  };
}

function auditLogToFeedRow(entry) {
  return {
    id: `audit-${entry.auditId}`,
    source: 'ADMIN_ACTION',
    timestamp: entry.createdAt,
    action: entry.action,
    targetEntity: `${entry.targetEntity} ${entry.targetId}`,
    status: 'SUCCESS',
    oldValue: entry.oldValues,
    newValue: entry.newValues,
    referenceId: entry.adminId,
  };
}

export async function fetchActivityFeed({ page = 0, pageSize = LEDGER_PAGE_SIZE } = {}) {
  const [ledgerPage, auditPage] = await Promise.all([
    request(`/api/admin/ledger?page=0&size=${ACTIVITY_FEED_FETCH_SIZE}`),
    request(`/api/admin/audit-logs?page=0&size=${ACTIVITY_FEED_FETCH_SIZE}`),
  ]);

  const merged = [
    ...ledgerPage.content.map(ledgerEntryToFeedRow),
    ...auditPage.content.map(auditLogToFeedRow),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const totalElements = merged.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
  const start = page * pageSize;
  const content = merged.slice(start, start + pageSize);

  return { content, page, pageSize, totalElements, totalPages };
}

// ---------------------------------------------------------------------------
// Wallets
// ---------------------------------------------------------------------------

export async function fetchWallets({ page = 0, size = WALLETS_PAGE_SIZE, sort = 'userId,asc' } = {}) {
  return request(`/api/admin/wallets?page=${page}&size=${size}&sort=${sort}`);
}

export async function fetchWallet(userId) {
  return request(`/api/v1/wallets/${userId}`);
}

export async function fetchWalletHistory(userId, { page = 0, size = WALLETS_PAGE_SIZE } = {}) {
  return request(`/api/v1/wallets/${userId}/history?page=${page}&size=${size}&sort=createdAt,desc`);
}

export async function fetchExpiringSummary(userId) {
  return request(`/api/v1/wallets/${userId}/expiring-summary`);
}

// ---------------------------------------------------------------------------
// Profiles & rate configuration
// ---------------------------------------------------------------------------

export async function fetchProfiles() {
  return request('/api/v1/admin/profiles');
}

export async function createProfile({ profileName, description }, adminId) {
  const created = await request('/api/v1/admin/profiles', {
    method: 'POST',
    adminId,
    body: { profileName, description: description || null },
  });
  // The create endpoint returns the bare profile - a fresh tier has no rate override yet
  // and no members, so normalize to the same shape the list endpoint returns.
  return { ...created, config: null, memberCount: 0 };
}

export async function configureProfileRates(profileId,
    { earnRateCentsPerPoint, burnRatePointsPerCent, pointsValidityDays }, adminId) {
  return request(`/api/v1/admin/profiles/${profileId}/rates`, {
    method: 'PUT',
    adminId,
    body: { earnRateCentsPerPoint, burnRatePointsPerCent, pointsValidityDays },
  });
}

// ---------------------------------------------------------------------------
// Channel partners, rate configuration & service accounts
// ---------------------------------------------------------------------------

export async function fetchPartners() {
  return request('/api/v1/admin/partners');
}

export async function createPartner({ partnerName, description }, adminId) {
  const created = await request('/api/v1/admin/partners', {
    method: 'POST',
    adminId,
    body: { partnerName, description: description || null },
  });
  // The create endpoint returns the bare partner - a fresh partner has no rate override yet,
  // so normalize to the same shape the list endpoint returns.
  return { ...created, config: null };
}

export async function configurePartnerRates(partnerId,
    { earnRateCentsPerPoint, burnRatePointsPerCent, pointsValidityDays }, adminId) {
  return request(`/api/v1/admin/partners/${partnerId}/rates`, {
    method: 'PUT',
    adminId,
    body: { earnRateCentsPerPoint, burnRatePointsPerCent, pointsValidityDays },
  });
}

export async function createPartnerServiceAccount(partnerId, { email, password }, adminId) {
  return request(`/api/v1/admin/partners/${partnerId}/service-account`, {
    method: 'POST',
    adminId,
    body: { email, password },
  });
}

// ---------------------------------------------------------------------------
// Points exchange: provider configuration + request visibility
// ---------------------------------------------------------------------------

export async function fetchExchangeProviders() {
  return request('/api/v1/admin/exchange-providers');
}

export async function createExchangeProvider(
    { providerCode, displayName, inboundPointsPerExternalUnit, outboundPointsPerExternalUnit }, adminId) {
  return request('/api/v1/admin/exchange-providers', {
    method: 'POST',
    adminId,
    body: { providerCode, displayName, inboundPointsPerExternalUnit, outboundPointsPerExternalUnit },
  });
}

export async function updateExchangeProvider(providerId,
    { displayName, inboundPointsPerExternalUnit, outboundPointsPerExternalUnit, active }, adminId) {
  return request(`/api/v1/admin/exchange-providers/${providerId}`, {
    method: 'PUT',
    adminId,
    body: { displayName, inboundPointsPerExternalUnit, outboundPointsPerExternalUnit, active },
  });
}

export async function fetchExchangeRequests({ page = 0, size = WALLETS_PAGE_SIZE, status } = {}) {
  const statusParam = status ? `&status=${status}` : '';
  return request(`/api/admin/exchange-requests?page=${page}&size=${size}${statusParam}`);
}

// ---------------------------------------------------------------------------
// Global system configuration (institution-wide fallback rates + points validity)
// ---------------------------------------------------------------------------

export async function fetchConfigurations() {
  return request('/api/admin/configurations');
}

export async function updateConfiguration(configKey, { configValue, description }, adminId) {
  return request(`/api/admin/configurations/${configKey}`, {
    method: 'PUT',
    adminId,
    body: { configValue, description: description || null },
  });
}

// ---------------------------------------------------------------------------
// Campaigns
// ---------------------------------------------------------------------------

export async function fetchCampaigns() {
  return request('/api/admin/campaigns');
}

export async function createCampaign(payload, adminId) {
  const { name, startTime, endTime, earnMultiplier, burnDiscountMultiplier } = payload;
  return request('/api/admin/campaigns', {
    method: 'POST',
    adminId,
    body: {
      name,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      earnMultiplier: Number(earnMultiplier),
      burnDiscountMultiplier: Number(burnDiscountMultiplier),
    },
  });
}

// ---------------------------------------------------------------------------
// Institutions (superadmin only)
// ---------------------------------------------------------------------------

export async function fetchInstitutions() {
  return request('/api/superadmin/institutions');
}

export async function createInstitution({ name, slug, adminEmail, adminPassword }, adminId) {
  return request('/api/superadmin/institutions', {
    method: 'POST',
    adminId,
    body: { name, slug, adminEmail, adminPassword },
  });
}

export async function updateInstitutionStatus(institutionId, status, adminId) {
  return request(`/api/superadmin/institutions/${institutionId}/status`, {
    method: 'PATCH',
    adminId,
    body: { status },
  });
}

export async function updateInstitutionBranding(institutionId, { name, logoDataUrl, primaryColor }, adminId) {
  return request(`/api/superadmin/institutions/${institutionId}/branding`, {
    method: 'PATCH',
    adminId,
    body: { name, logoDataUrl, primaryColor },
  });
}
