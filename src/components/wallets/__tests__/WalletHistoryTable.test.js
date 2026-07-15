import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletHistoryTable from '../WalletHistoryTable.jsx';

describe('WalletHistoryTable', () => {
  const mockOnPageChange = jest.fn();

  const mockHistory = {
    content: [
      {
        ledgerId: 'ledger-1',
        transactionType: 'EARN',
        pointsChanged: 100,
        runningBalance: 2500,
        createdAt: '2026-07-01T10:30:00Z',
        expiresAt: '2027-07-01T10:30:00Z',
        referenceId: 'REF-001',
      },
      {
        ledgerId: 'ledger-2',
        transactionType: 'BURN',
        pointsChanged: -50,
        runningBalance: 2450,
        createdAt: '2026-07-02T15:45:00Z',
        expiresAt: null,
        referenceId: 'REF-002',
      },
      {
        ledgerId: 'ledger-3',
        transactionType: 'EXPIRED',
        pointsChanged: -200,
        runningBalance: 2250,
        createdAt: '2026-07-03T09:00:00Z',
        expiresAt: null,
        referenceId: 'REF-003',
      },
    ],
    page: {
      number: 0,
      totalPages: 2,
      totalElements: 45,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table header', () => {
    render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText('Transaction history')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText('Timestamp')).toBeInTheDocument();
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('Points')).toBeInTheDocument();
    expect(screen.getByText('Balance after')).toBeInTheDocument();
    expect(screen.getByText('Points expiry')).toBeInTheDocument();
    expect(screen.getByText('Reference')).toBeInTheDocument();
  });

  it('renders transaction rows', () => {
    render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText('EARN')).toBeInTheDocument();
    expect(screen.getByText('BURN')).toBeInTheDocument();
    expect(screen.getByText('EXPIRED')).toBeInTheDocument();
  });

  it('renders transaction type badges', () => {
    render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    const earnBadge = screen.getByText('EARN');
    expect(earnBadge).toBeInTheDocument();
  });

  it('renders points changed values', () => {
    render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    // formatPoints converts 100 to "+100" and -50 to "-50"
    expect(screen.getByText(/100/)).toBeInTheDocument();
    expect(screen.getByText(/-50/)).toBeInTheDocument();
  });

  it('renders running balance', () => {
    render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText('2,500 pts')).toBeInTheDocument();
    expect(screen.getByText('2,450 pts')).toBeInTheDocument();
  });

  it('renders reference IDs', () => {
    render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText('REF-001')).toBeInTheDocument();
    expect(screen.getByText('REF-002')).toBeInTheDocument();
    expect(screen.getByText('REF-003')).toBeInTheDocument();
  });

  it('renders points expiry for EARN transactions', () => {
    const { container } = render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    // Should render expiry date for EARN transaction (formatDateTime formats dates)
    // Check that 2027 appears in the table (the year from the expiry date)
    const text = container.textContent;
    expect(text).toMatch(/2027/);
  });

  it('renders dash for non-EARN transactions expiry', () => {
    render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });

  it('handles empty history', () => {
    render(
      <WalletHistoryTable
        history={{ content: [], page: { number: 0, totalPages: 1, totalElements: 0 } }}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText('No transactions yet')).toBeInTheDocument();
  });

  it('handles undefined history object', () => {
    render(
      <WalletHistoryTable
        history={undefined}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText('Transaction history')).toBeInTheDocument();
  });

  it('renders pagination when history exists', () => {
    render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText(/Page/)).toBeInTheDocument();
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('does not render pagination when no history', () => {
    render(
      <WalletHistoryTable
        history={{ content: [], page: { number: 0, totalPages: 1, totalElements: 0 } }}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.queryByText('Prev')).not.toBeInTheDocument();
  });

  it('displays loading spinner when isLoading is true', () => {
    render(
      <WalletHistoryTable
        history={mockHistory}
        isLoading={true}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText('Loading history…')).toBeInTheDocument();
  });

  it('renders subtitle about transaction history', () => {
    render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText(/most recent first/)).toBeInTheDocument();
  });

  it('renders overflow-x-auto container', () => {
    const { container } = render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    const scrollContainer = container.querySelector('.overflow-x-auto');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('renders table with min-width constraint', () => {
    const { container } = render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    const table = container.querySelector('table');
    expect(table.className).toContain('min-w-[720px]');
  });

  it('calls onPageChange when pagination button clicked', async () => {
    const user = userEvent.setup();
    render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('renders each row with hover effect', () => {
    const { container } = render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0].className).toContain('hover:bg-slate-50');
  });

  it('renders transaction type with appropriate icon', () => {
    const { container } = render(
      <WalletHistoryTable
        history={mockHistory}
        onPageChange={mockOnPageChange}
      />,
    );
    // All transaction types should render with an icon (inside Badge)
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('handles transactions with no expiry date', () => {
    const historyNoExpiry = {
      content: [
        {
          ledgerId: 'ledger-1',
          transactionType: 'EARN',
          pointsChanged: 100,
          runningBalance: 2500,
          createdAt: '2026-07-01T10:30:00Z',
          expiresAt: null,
          referenceId: 'REF-NEVER-EXPIRES',
        },
      ],
      page: { number: 0, totalPages: 1, totalElements: 1 },
    };
    render(
      <WalletHistoryTable
        history={historyNoExpiry}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText('REF-NEVER-EXPIRES')).toBeInTheDocument();
  });
});
