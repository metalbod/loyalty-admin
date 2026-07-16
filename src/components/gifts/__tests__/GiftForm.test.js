import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GiftForm from '../GiftForm.jsx';

describe('GiftForm', () => {
  const mockOnSave = jest.fn();
  const mockOnCancel = jest.fn();

  const mockGift = {
    name: 'Premium Coffee Card',
    description: 'A premium coffee card worth $25',
    imageUrl: 'https://example.com/coffee.jpg',
    pointCost: 5000,
    quantityAvailable: 100,
    validFrom: '2024-07-01T00:00:00',
    validUntil: '2024-12-31T23:59:59',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form overlay', () => {
    const { container } = render(
      <GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />
    );
    expect(container.querySelector('.gift-form-overlay')).toBeInTheDocument();
  });

  it('renders form modal', () => {
    const { container } = render(
      <GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />
    );
    expect(container.querySelector('.gift-form-modal')).toBeInTheDocument();
  });

  it('displays create title for new gift', () => {
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByText('Create New Gift')).toBeInTheDocument();
  });

  it('displays edit title for existing gift', () => {
    render(<GiftForm gift={mockGift} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByText('Edit Gift')).toBeInTheDocument();
  });

  it('renders gift name input', () => {
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByLabelText(/Gift Name/)).toBeInTheDocument();
  });

  it('renders description input', () => {
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('renders image URL input', () => {
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByLabelText('Image URL')).toBeInTheDocument();
  });

  it('renders point cost input', () => {
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByLabelText(/Point Cost/)).toBeInTheDocument();
  });

  it('renders quantity available input', () => {
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByLabelText('Quantity Available')).toBeInTheDocument();
  });

  it('renders valid from date input', () => {
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByLabelText(/Valid From/)).toBeInTheDocument();
  });

  it('renders valid until date input', () => {
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByLabelText(/Valid Until/)).toBeInTheDocument();
  });

  it('renders submit button for create', () => {
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByText('Create Gift')).toBeInTheDocument();
  });

  it('renders submit button for edit', () => {
    render(<GiftForm gift={mockGift} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByText('Update Gift')).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('allows typing in gift name field', async () => {
    const user = userEvent.setup();
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const input = screen.getByLabelText(/Gift Name/);
    await user.type(input, 'Test Gift');
    expect(input.value).toBe('Test Gift');
  });

  it('allows typing in description field', async () => {
    const user = userEvent.setup();
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const textarea = screen.getByLabelText('Description');
    await user.type(textarea, 'Test description');
    expect(textarea.value).toBe('Test description');
  });

  it('allows typing in point cost field', async () => {
    const user = userEvent.setup();
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const input = screen.getByLabelText(/Point Cost/);
    await user.type(input, '5000');
    expect(input.value).toBe('5000');
  });

  it('pre-populates form with gift data', async () => {
    render(<GiftForm gift={mockGift} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const nameInput = screen.getByLabelText(/Gift Name/);
    const costInput = screen.getByLabelText(/Point Cost/);
    expect(nameInput.value).toBe('Premium Coffee Card');
    expect(costInput.value).toBe('5000');
  });

  it('shows required asterisk on required fields', () => {
    render(<GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />);
    const labels = screen.getAllByText(/\*/);
    expect(labels.length).toBeGreaterThan(0);
  });

  it('renders form element', () => {
    const { container } = render(
      <GiftForm gift={null} onSave={mockOnSave} onCancel={mockOnCancel} />
    );
    expect(container.querySelector('form')).toBeInTheDocument();
  });
});
