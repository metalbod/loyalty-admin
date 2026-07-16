import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GiftRulesPanel from '../GiftRulesPanel.jsx';

describe('GiftRulesPanel', () => {
  const mockGifts = [
    {
      gift_id: 1,
      name: 'Premium Coffee Card',
      pointCost: 5000,
    },
    {
      gift_id: 2,
      name: 'Movie Voucher',
      pointCost: 7500,
    },
  ];

  const mockRules = [
    {
      rule_id: 1,
      gift_id: 1,
      trigger_points: 10000,
      triggerPoints: 10000,
    },
    {
      rule_id: 2,
      gift_id: 2,
      trigger_points: 25000,
      triggerPoints: 25000,
    },
  ];

  const mockOnAddRule = jest.fn(() => Promise.resolve());
  const mockOnUpdateRule = jest.fn(() => Promise.resolve());
  const mockOnDeleteRule = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders rules panel container', () => {
    const { container } = render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    expect(container.querySelector('.gift-rules-panel')).toBeInTheDocument();
  });

  it('displays panel heading', () => {
    render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    expect(screen.getByText(/Reward Rules/)).toBeInTheDocument();
  });

  it('renders add rule button', () => {
    render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    expect(screen.getByText(/Add Rule/)).toBeInTheDocument();
  });

  it('displays all rules', () => {
    render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    expect(screen.getByText('Premium Coffee Card')).toBeInTheDocument();
    expect(screen.getByText('Movie Voucher')).toBeInTheDocument();
  });

  it('displays trigger points for rules', () => {
    render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    expect(screen.getByText(/10,000/)).toBeInTheDocument();
    expect(screen.getByText(/25,000/)).toBeInTheDocument();
  });

  it('shows empty state when no rules', () => {
    render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={[]}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    expect(screen.getByText('No reward rules configured yet')).toBeInTheDocument();
  });

  it('shows edit and delete buttons for each rule', () => {
    render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    const editButtons = screen.getAllByText('Edit');
    const deleteButtons = screen.getAllByText('Delete');
    expect(editButtons.length).toBe(2);
    expect(deleteButtons.length).toBe(2);
  });

  it('displays rule form when add rule button clicked', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    const addButton = screen.getByText(/Add Rule/);
    await user.click(addButton);
    expect(container.querySelector('.rule-form')).toBeInTheDocument();
  });

  it('shows gift select dropdown in form', async () => {
    const user = userEvent.setup();
    render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    const addButton = screen.getByText(/Add Rule/);
    await user.click(addButton);
    expect(screen.getByLabelText('Select Gift')).toBeInTheDocument();
  });

  it('shows trigger points input in form', async () => {
    const user = userEvent.setup();
    render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    const addButton = screen.getByText(/Add Rule/);
    await user.click(addButton);
    expect(screen.getByLabelText(/Award when user has/)).toBeInTheDocument();
  });

  it('displays create rule button in form', async () => {
    const user = userEvent.setup();
    render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    const addButton = screen.getByText(/Add Rule/);
    await user.click(addButton);
    const createButton = screen.getByText('Create Rule');
    expect(createButton).toBeInTheDocument();
  });

  it('displays cancel button in form', async () => {
    const user = userEvent.setup();
    render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    const addButton = screen.getByText(/Add Rule/);
    await user.click(addButton);
    const cancelButtons = screen.getAllByText('Cancel');
    expect(cancelButtons.length).toBeGreaterThan(0);
  });

  it('lists gift options in select', async () => {
    const user = userEvent.setup();
    render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    const addButton = screen.getByText(/Add Rule/);
    await user.click(addButton);
    const select = screen.getByLabelText('Select Gift');
    const options = select.querySelectorAll('option');
    expect(options.length).toBeGreaterThan(mockGifts.length);
  });

  it('renders rules list container', () => {
    const { container } = render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    expect(container.querySelector('.rules-list')).toBeInTheDocument();
  });

  it('displays heading for each rule', () => {
    const { container } = render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    const ruleHeadings = container.querySelectorAll('.rule-item h4');
    expect(ruleHeadings.length).toBe(2);
  });

  it('displays rule description text', () => {
    render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={mockRules}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    const descriptions = screen.getAllByText(/Award when user reaches/);
    expect(descriptions.length).toBeGreaterThan(0);
  });

  it('handles rules with missing gifts', () => {
    const rulesWithMissingGift = [
      {
        rule_id: 1,
        gift_id: 999,
        trigger_points: 10000,
        triggerPoints: 10000,
      },
    ];
    render(
      <GiftRulesPanel
        gifts={mockGifts}
        rules={rulesWithMissingGift}
        onAddRule={mockOnAddRule}
        onUpdateRule={mockOnUpdateRule}
        onDeleteRule={mockOnDeleteRule}
      />
    );
    expect(screen.getByText(/Gift #999/)).toBeInTheDocument();
  });
});
