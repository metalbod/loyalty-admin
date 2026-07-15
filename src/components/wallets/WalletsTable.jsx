import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, ArrowUpDown, Wallet } from 'lucide-react';
import Card, { CardHeader } from '../common/Card.jsx';
import Pagination from '../common/Pagination.jsx';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { TIER_ACCENTS } from '../../constants';
import { formatBalance } from '../../utils/formatters.js';

const COLUMNS = [
  { field: 'userId', label: 'User ID' },
  { field: 'profileName', label: 'Tier' },
  { field: 'currentBalance', label: 'Balance' },
];

function SortableHeader({ field, label, sortField, sortDirection, onSortChange }) {
  const isActive = field === sortField;
  const Icon = isActive ? (sortDirection === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
  return (
    <th className="px-3 py-2.5 font-medium first:px-5">
      <button
        type="button"
        onClick={() => onSortChange(field)}
        className={[
          'flex items-center gap-1 uppercase tracking-wide transition-colors',
          isActive ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-600',
        ].join(' ')}
      >
        {label}
        <Icon size={12} strokeWidth={2.5} />
      </button>
    </th>
  );
}

SortableHeader.propTypes = {
  field: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  sortField: PropTypes.string.isRequired,
  sortDirection: PropTypes.oneOf(['asc', 'desc']).isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export function WalletsTable({
  wallets,
  isLoading = false,
  onPageChange,
  sortField = 'userId',
  sortDirection = 'asc',
  onSortChange = null,
}) {
  const navigate = useNavigate();
  const rows = wallets?.content ?? [];
  const page = wallets?.page ?? { number: 0, totalPages: 1, totalElements: 0 };

  return (
    <Card>
      <CardHeader
        title="Wallets"
        subtitle="Every customer wallet in your institution - click a column to sort, or a row to see its transaction history."
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
              {COLUMNS.map(({ field, label }) => (
                <SortableHeader
                  key={field}
                  field={field}
                  label={label}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={onSortChange}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((wallet) => {
              const accent = TIER_ACCENTS[wallet.profileName] || TIER_ACCENTS.DEFAULT;
              return (
                <tr
                  key={wallet.userId}
                  onClick={() => navigate(`/wallets/${wallet.userId}`)}
                  className="cursor-pointer border-b border-slate-200 last:border-0 hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-800">
                    #{wallet.userId}
                  </td>
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-1.5 text-xs font-medium">
                      <span className={`h-2 w-2 rounded-full ${accent.dot}`} />
                      <span className={accent.text}>{wallet.profileName}</span>
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs font-semibold text-slate-900">
                    {formatBalance(wallet.currentBalance)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {isLoading && <LoadingSpinner label="Loading wallets…" />}
        {!isLoading && rows.length === 0 && (
          <EmptyState
            icon={Wallet}
            title="No wallets yet"
            description="Wallets appear here once customers earn or redeem points."
          />
        )}
      </div>
      {rows.length > 0 && (
        <Pagination
          page={page.number}
          totalPages={page.totalPages}
          totalElements={page.totalElements}
          onPageChange={onPageChange}
          isLoading={isLoading}
        />
      )}
    </Card>
  );
}

WalletsTable.propTypes = {
  wallets: PropTypes.shape({
    content: PropTypes.arrayOf(PropTypes.object),
    page: PropTypes.shape({
      number: PropTypes.number,
      totalPages: PropTypes.number,
      totalElements: PropTypes.number,
    }),
  }),
  isLoading: PropTypes.bool,
  onPageChange: PropTypes.func.isRequired,
  sortField: PropTypes.string,
  sortDirection: PropTypes.oneOf(['asc', 'desc']),
  onSortChange: PropTypes.func,
};

export default WalletsTable;
