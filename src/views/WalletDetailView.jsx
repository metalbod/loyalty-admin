import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Wallet } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import Card from '../components/common/Card.jsx';
import Button from '../components/common/Button.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import WalletHistoryTable from '../components/wallets/WalletHistoryTable.jsx';
import * as api from '../api/client';
import { TIER_ACCENTS } from '../constants';
import { formatBalance } from '../utils/formatters.js';

export function WalletDetailView() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [error, setError] = useState(null);

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

        {!walletLoading && !error && (
          <WalletHistoryTable history={history} isLoading={historyLoading} onPageChange={loadHistoryPage} />
        )}
      </div>
    </DashboardLayout>
  );
}

export default WalletDetailView;
