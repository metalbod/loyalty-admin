import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsTable from '../WalletsTable.jsx';

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

describe('WalletsTable', () => {
  const mockWallets = {
    content: [
      {
        userId: 1,
        profileName: 'Silver',
        currentBalance: 1000,
      },
      {
        userId: 2,
        profileName: 'Gold',
        currentBalance: 5000,
      },
    ],
    page: {
      number: 0,
      totalPages: 1,
      totalElements: 2,
    },
  };

  const mockOnPageChange = jest.fn();
  const mockOnSortChange = jest.fn();

  const renderTable = (component) => render(component);

  it('renders table with header', () => {
    renderTable(<WalletsTable wallets={mockWallets} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('Wallets')).toBeInTheDocument();
  });

  it('renders column headers', () => {
    renderTable(<WalletsTable wallets={mockWallets} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('User ID')).toBeInTheDocument();
    expect(screen.getByText('Tier')).toBeInTheDocument();
    expect(screen.getByText('Balance')).toBeInTheDocument();
  });

  it('renders wallet rows', () => {
    renderTable(<WalletsTable wallets={mockWallets} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('Silver')).toBeInTheDocument();
    expect(screen.getByText('Gold')).toBeInTheDocument();
  });

  it('handles empty wallets array', () => {
    renderTable(
      <WalletsTable
        wallets={{ content: [], page: { number: 0, totalPages: 1, totalElements: 0 } }}
        onPageChange={mockOnPageChange}
      />
    );
    expect(screen.getByText('Wallets')).toBeInTheDocument();
  });

  it('handles undefined wallets object', () => {
    renderTable(<WalletsTable wallets={undefined} onPageChange={mockOnPageChange} />);
    expect(screen.getByText('Wallets')).toBeInTheDocument();
  });

  it('displays sort icons for sortable headers', () => {
    renderTable(
      <WalletsTable
        wallets={mockWallets}
        onPageChange={mockOnPageChange}
        sortField="userId"
        sortDirection="asc"
        onSortChange={mockOnSortChange}
      />
    );
    // Column headers should be rendered
    expect(screen.getByText('User ID')).toBeInTheDocument();
  });

  it('calls onSortChange when sort button is clicked', async () => {
    const user = userEvent.setup();
    renderTable(
      <WalletsTable
        wallets={mockWallets}
        onPageChange={mockOnPageChange}
        sortField="userId"
        sortDirection="asc"
        onSortChange={mockOnSortChange}
      />
    );

    const tierHeader = screen.getByText('Tier');
    await user.click(tierHeader);

    expect(mockOnSortChange).toHaveBeenCalledWith('profileName');
  });

  it('highlights active sort column', () => {
    renderTable(
      <WalletsTable
        wallets={mockWallets}
        onPageChange={mockOnPageChange}
        sortField="userId"
        sortDirection="asc"
        onSortChange={mockOnSortChange}
      />
    );

    const userIdHeader = screen.getByText('User ID').closest('button');
    expect(userIdHeader.className).toContain('text-emerald-600');
  });

  it('displays CardHeader with subtitle', () => {
    renderTable(<WalletsTable wallets={mockWallets} onPageChange={mockOnPageChange} />);
    expect(screen.getByText(/Every customer wallet/)).toBeInTheDocument();
  });

  it('renders table with overflow-x-auto for responsiveness', () => {
    const { container } = renderTable(
      <WalletsTable wallets={mockWallets} onPageChange={mockOnPageChange} />
    );
    const scrollContainer = container.querySelector('.overflow-x-auto');
    expect(scrollContainer).toBeInTheDocument();
  });

  it('renders table with min-width constraint', () => {
    const { container } = renderTable(
      <WalletsTable wallets={mockWallets} onPageChange={mockOnPageChange} />
    );
    const table = container.querySelector('table');
    expect(table.className).toContain('min-w-[560px]');
  });

  it('uses default sort field and direction', () => {
    renderTable(<WalletsTable wallets={mockWallets} onPageChange={mockOnPageChange} />);
    // Should render without errors with default props
    expect(screen.getByText('Wallets')).toBeInTheDocument();
  });
});
