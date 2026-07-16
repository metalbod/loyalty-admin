import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GiftManagerView from '../GiftManagerView.jsx';

// Mock API client
jest.mock('../../api/client.js', () => ({
  fetchGifts: jest.fn(),
  createGift: jest.fn(),
  updateGift: jest.fn(),
  deleteGift: jest.fn(),
  fetchGiftRules: jest.fn(),
  createGiftRule: jest.fn(),
  updateGiftRule: jest.fn(),
  deleteGiftRule: jest.fn(),
}));

// Mock components
jest.mock('../../components/gifts/GiftForm.jsx', () => ({
  __esModule: true,
  default: ({ gift, onSave, onCancel }) => (
    <div data-testid="gift-form">
      <button onClick={onCancel} data-testid="cancel-form">Cancel</button>
    </div>
  ),
}));

jest.mock('../../components/gifts/GiftRulesPanel.jsx', () => ({
  __esModule: true,
  default: ({ gifts, rules }) => (
    <div data-testid="gift-rules-panel">
      {rules?.length || 0} rules
    </div>
  ),
}));

// Mock CSS import
jest.mock('../../styles/GiftManagerView.css', () => ({}));

// Mock useAuth
jest.mock('../../hooks/useAuth.js', () => ({
  useAuth: jest.fn(),
}));

const api = require('../../api/client.js');
const { useAuth } = require('../../hooks/useAuth.js');

describe('GiftManagerView', () => {
  const mockGifts = [
    {
      gift_id: 'gift-1',
      name: 'Gift A',
      description: 'A great gift',
      pointCost: 100,
      quantityAvailable: 50,
      active: true,
      validFrom: '2024-01-01',
      validUntil: '2024-12-31',
      isExpired: false,
    },
  ];

  const mockRules = [
    {
      rule_id: 'rule-1',
      gift_id: 'gift-1',
      description: 'Rule A',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      adminId: 'admin-1',
    });
    api.fetchGifts.mockResolvedValue(mockGifts);
    api.fetchGiftRules.mockResolvedValue(mockRules);
    api.createGift.mockResolvedValue(mockGifts[0]);
    api.updateGift.mockResolvedValue(mockGifts[0]);
    api.createGiftRule.mockResolvedValue(mockRules[0]);
    api.updateGiftRule.mockResolvedValue(mockRules[0]);
  });

  it('renders gift manager heading', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByText(/Gift Rewards Management/i)).toBeInTheDocument();
    });
  });

  it('renders new gift button', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByText(/New Gift/i)).toBeInTheDocument();
    });
  });

  it('loads gifts on mount', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(api.fetchGifts).toHaveBeenCalled();
    });
  });

  it('loads gift rules on mount', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(api.fetchGiftRules).toHaveBeenCalled();
    });
  });

  it('renders gift cards for each gift', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByText('Gift A')).toBeInTheDocument();
    });
  });

  it('renders gift description', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByText('A great gift')).toBeInTheDocument();
    });
  });

  it('displays point cost', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  it('displays quantity available', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  it('shows active status for active gift', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByText(/Active/i)).toBeInTheDocument();
    });
  });

  it('renders gift rules panel', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByTestId('gift-rules-panel')).toBeInTheDocument();
    });
  });

  it('displays empty state when no gifts', async () => {
    api.fetchGifts.mockResolvedValue([]);
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByText(/No gifts created yet/i)).toBeInTheDocument();
    });
  });

  it('shows edit button for each gift', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      const editButtons = screen.getAllByText('Edit');
      expect(editButtons.length).toBeGreaterThan(0);
    });
  });

  it('shows delete button for each gift', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete');
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  it('opens gift form when new gift button clicked', async () => {
    const user = userEvent.setup();
    render(<GiftManagerView />);

    const newGiftButton = await screen.findByText(/New Gift/i);
    await user.click(newGiftButton);

    expect(screen.getByTestId('gift-form')).toBeInTheDocument();
  });

  it('closes gift form when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<GiftManagerView />);

    const newGiftButton = await screen.findByText(/New Gift/i);
    await user.click(newGiftButton);

    const cancelButton = screen.getByTestId('cancel-form');
    await user.click(cancelButton);

    expect(screen.queryByTestId('gift-form')).not.toBeInTheDocument();
  });

  it('renders gifts section heading', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByText('Gifts Catalog')).toBeInTheDocument();
    });
  });

  it('renders rules section heading', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByTestId('gift-rules-panel')).toBeInTheDocument();
    });
  });

  it('displays gift validity dates', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByText(/Valid from/i)).toBeInTheDocument();
    });
  });

  it('handles gift loading', async () => {
    api.fetchGifts.mockImplementation(() => new Promise(() => {}));
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByText(/Loading gifts/i)).toBeInTheDocument();
    });
  });

  it('renders all components without crashing', async () => {
    render(<GiftManagerView />);
    await waitFor(() => {
      expect(screen.getByText(/Gift Rewards Management/i)).toBeInTheDocument();
      expect(screen.getByTestId('gift-rules-panel')).toBeInTheDocument();
    });
  });
});
