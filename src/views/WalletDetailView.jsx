import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Wallet } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import WalletHistoryTable from '../components/wallets/WalletHistoryTable.jsx';
import * as api from '../api/client';
import { TIER_ACCENTS } from '../constants';
import { formatBalance, formatPoints } from '../utils/formatters.js';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'];

function monthName(offsetFromNow) {
  const date = new Date();
  date.setMonth(date.getMonth() + offsetFromNow);
  return MONTH_NAMES[date.getMonth()];
}

export function WalletDetailView() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [error, setError] = useState(null);

  const [expiringSummary, setExpiringSummary] = useState(null);

  const [history, setHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const loadHistoryPage = useCallback(async (page = 0) => {
    setHistoryLoading(true);
    try {
      const data = await api.fetchWalletHistory(userId, { page });
      setHistory(data);
    } finally {
      setHistoryLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let cancelled = false;
    setWalletLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await api.fetchWallet(userId);
        if (cancelled) return;
        setWallet(data);
        // Best-effort - the wallet balance above is the important part; a failure here
        // shouldn't block the rest of the page.
        api.fetchExpiringSummary(userId).then((summary) => {
          if (!cancelled) setExpiringSummary(summary);
        }).catch(() => {});
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof api.ApiError ? err.message : 'Something went wrong loading this wallet.');
      } finally {
        if (!cancelled) setWalletLoading(false);
      }
    })();
    loadHistoryPage(0);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const accent = wallet ? TIER_ACCENTS[wallet.profileName] || TIER_ACCENTS.DEFAULT : TIER_ACCENTS.DEFAULT;

  return (
    <DashboardLayout title={`Wallet #${userId}`} description="Balance and full transaction history for this customer.">
      <div className="space-y-6">
        <Button variant="secondary" icon={ArrowLeft} onClick={() => navigate('/wallets')}>
          Back to wallets
        </Button>

        {walletLoading && <LoadingSpinner label="Loading wallet…" />}

        {!walletLoading && error && <Card className="p-6 text-sm text-rose-400">{error}</Card>}

        {!walletLoading && !error && wallet && (
          <Card className={`flex items-center gap-4 p-6 ring-1 ${accent.ring}`}>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900/60 text-emerald-400">
              <Wallet size={22} />
            </span>
            <div>
              <p className="text-xs text-slate-500">User #{wallet.userId}</p>
              <p className="text-xl font-semibold text-slate-100">{formatBalance(wallet.currentBalance)}</p>
              <span className="mt-1 flex items-center gap-1.5 text-xs font-medium">
                <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
                <span className={accent.text}>{wallet.profileName}</span>
              </span>
            </div>
          </Card>
        )}

        {!walletLoading && !error && expiringSummary
          && (expiringSummary.expiringThisMonth > 0 || expiringSummary.expiringNextMonth > 0) && (
          <Card className="p-6 ring-1 ring-amber-500/30">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-amber-400">
              <Clock size={13} /> Expiring soon
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-100">
                  {formatPoints(expiringSummary.expiringThisMonth)}
                </p>
                <p className="text-xs text-slate-500">by end of {monthName(0)}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-100">
                  {formatPoints(expiringSummary.expiringNextMonth)}
                </p>
                <p className="text-xs text-slate-500">by end of {monthName(1)}</p>
              </div>
            </div>
          </Card>
        )}

        {!walletLoading && !error && (
          <WalletHistoryTable history={history} isLoading={historyLoading} onPageChange={loadHistoryPage} />
        )}
      </div>
    </DashboardLayout>
  );
}

export default WalletDetailView;
