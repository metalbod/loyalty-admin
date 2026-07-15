import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WalletsListView from '../WalletsListView.jsx';

// Mock DashboardLayout
jest.mock('../../layouts/DashboardLayout.jsx', () => ({
  __esModule: true,
  default: ({ title, description, children }) => (
    <div data-testid="dashboard-layout">
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </div>
  ),
}));

// Mock WalletsTable
jest.mock('../../components/wallets/WalletsTable.jsx', () => ({
  __esModule: true,
  default: ({ wallets, isLoading, sortField, sortDirection, onSortChange, onPageChange }) => (
    <div data-testid="wallets-table">
      {isLoading ? (
        <p>Loading wallets...</p>
      ) : wallets?.content?.length > 0 ? (
        <div>
          <div>{wallets.content.length} wallets</div>
          <button onClick={() => onSortChange('userId')}>Sort by User ID</button>
          <button onClick={() => onSortChange('profileName')}>Sort by Tier</button>
          <button onClick={() => onSortChange('currentBalance')}>Sort by Balance</button>
          <span data-testid="sort-info">
            Sorted by: {sortField} ({sortDirection})
          </span>
          <button onClick={() => onPageChange(0)}>Page 1</button>
          <button onClick={() => onPageChange(1)}>Page 2</button>
        </div>
      ) : (
        <p>No wallets</p>
      )}
    </div>
  ),
}));

// Mock useAdminContext
jest.mock('../../hooks/useAdminContext.js', () => ({
  useAdminContext: jest.fn(),
}));

const { useAdminContext } = require('../../hooks/useAdminContext.js');

describe('WalletsListView', () => {
  const mockWallets = {
    content: [
      { userId: 1, profileName: 'Gold', currentBalance: 5000 },
      { userId: 2, profileName: 'Silver', currentBalance: 3000 },
    ],
    page: {
      number: 0,
      totalPages: 5,
      totalElements: 100,
    },
  };

  const mockLoadWalletsPage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAdminContext.mockReturnValue({
      wallets: mockWallets,
      walletsLoading: false,
      loadWalletsPage: mockLoadWalletsPage,
    });
  });

  it('renders dashboard layout with correct title', () => {
    render(<WalletsListView />);
    expect(screen.getByText('Wallets')).toBeInTheDocument();
  });

  it('renders description text', () => {
    render(<WalletsListView />);
    expect(screen.getByText(/Browse every wallet/)).toBeInTheDocument();
  });

  it('calls loadWalletsPage on mount with default sort', () => {
    render(<WalletsListView />);
    expect(mockLoadWalletsPage).toHaveBeenCalledWith(0, 'userId,asc');
  });

  it('renders wallets table', () => {
    render(<WalletsListView />);
    expect(screen.getByTestId('wallets-table')).toBeInTheDocument();
  });

  it('displays loading state when wallets are loading', () => {
    useAdminContext.mockReturnValue({
      wallets: mockWallets,
      walletsLoading: true,
      loadWalletsPage: mockLoadWalletsPage,
    });

    render(<WalletsListView />);
    expect(screen.getByText('Loading wallets...')).toBeInTheDocument();
  });

  it('displays empty state when no wallets', () => {
    useAdminContext.mockReturnValue({
      wallets: { content: [], page: { number: 0, totalPages: 1, totalElements: 0 } },
      walletsLoading: false,
      loadWalletsPage: mockLoadWalletsPage,
    });

    render(<WalletsListView />);
    expect(screen.getByText('No wallets')).toBeInTheDocument();
  });

  it('passes wallets data to table', () => {
    render(<WalletsListView />);
    expect(screen.getByText('2 wallets')).toBeInTheDocument();
  });

  it('passes initial sort field to table', () => {
    render(<WalletsListView />);
    expect(screen.getByTestId('sort-info')).toHaveTextContent('userId');
  });

  it('passes initial sort direction to table', () => {
    render(<WalletsListView />);
    expect(screen.getByTestId('sort-info')).toHaveTextContent('asc');
  });

  it('handles sort by userId', async () => {
    const user = userEvent.setup();
    render(<WalletsListView />);

    const sortButton = screen.getByText('Sort by User ID');
    await user.click(sortButton);

    // Should reload with same sort field but toggled direction
    expect(mockLoadWalletsPage).toHaveBeenCalledWith(0, 'userId,desc');
  });

  it('handles sort by tier (profileName)', async () => {
    const user = userEvent.setup();
    render(<WalletsListView />);

    const sortButton = screen.getByText('Sort by Tier');
    await user.click(sortButton);

    // Should reload with new sort field and ascending direction
    expect(mockLoadWalletsPage).toHaveBeenCalledWith(0, 'profile.profileName,asc');
  });

  it('handles sort by balance', async () => {
    const user = userEvent.setup();
    render(<WalletsListView />);

    const sortButton = screen.getByText('Sort by Balance');
    await user.click(sortButton);

    expect(mockLoadWalletsPage).toHaveBeenCalledWith(0, 'currentBalance,asc');
  });

  it('toggles sort direction on same field click', async () => {
    const user = userEvent.setup();
    render(<WalletsListView />);

    const sortButton = screen.getByText('Sort by User ID');

    // First click - should toggle to desc
    await user.click(sortButton);
    expect(mockLoadWalletsPage).toHaveBeenCalledWith(0, 'userId,desc');

    jest.clearAllMocks();

    // Second click - should toggle back to asc
    await user.click(sortButton);
    expect(mockLoadWalletsPage).toHaveBeenCalledWith(0, 'userId,asc');
  });

  it('resets sort direction when changing sort field', async () => {
    const user = userEvent.setup();
    render(<WalletsListView />);

    // First, sort by userId desc
    const userIdButton = screen.getByText('Sort by User ID');
    await user.click(userIdButton);
    expect(mockLoadWalletsPage).toHaveBeenCalledWith(0, 'userId,desc');

    jest.clearAllMocks();

    // Then sort by different field - should reset to asc
    const tierButton = screen.getByText('Sort by Tier');
    await user.click(tierButton);
    expect(mockLoadWalletsPage).toHaveBeenCalledWith(0, 'profile.profileName,asc');
  });

  it('handles page change', async () => {
    const user = userEvent.setup();
    render(<WalletsListView />);

    const page2Button = screen.getByText('Page 2');
    await user.click(page2Button);

    expect(mockLoadWalletsPage).toHaveBeenCalledWith(1, 'userId,asc');
  });

  it('maintains sort when changing page', async () => {
    const user = userEvent.setup();
    render(<WalletsListView />);

    // Set sort to desc
    const sortButton = screen.getByText('Sort by User ID');
    await user.click(sortButton);
    expect(mockLoadWalletsPage).toHaveBeenCalledWith(0, 'userId,desc');

    jest.clearAllMocks();

    // Change page - should keep sort direction
    const page2Button = screen.getByText('Page 2');
    await user.click(page2Button);

    expect(mockLoadWalletsPage).toHaveBeenCalledWith(1, 'userId,desc');
  });

  it('maps column fields to backend sort properties', async () => {
    const user = userEvent.setup();
    render(<WalletsListView />);

    // profileName should map to profile.profileName in backend
    const tierButton = screen.getByText('Sort by Tier');
    await user.click(tierButton);

    expect(mockLoadWalletsPage).toHaveBeenCalledWith(0, 'profile.profileName,asc');
  });

  it('passes isLoading state to table', () => {
    useAdminContext.mockReturnValue({
      wallets: mockWallets,
      walletsLoading: true,
      loadWalletsPage: mockLoadWalletsPage,
    });

    render(<WalletsListView />);
    expect(screen.getByTestId('wallets-table')).toBeInTheDocument();
  });

  it('maintains dashboard layout structure', () => {
    render(<WalletsListView />);
    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
  });

  it('renders table inside dashboard layout', () => {
    render(<WalletsListView />);
    const layout = screen.getByTestId('dashboard-layout');
    expect(layout).toContainElement(screen.getByTestId('wallets-table'));
  });
});
