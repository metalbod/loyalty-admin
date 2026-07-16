import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CampaignForm from '../CampaignForm.jsx';

jest.mock('../../common/Card.jsx', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="card">{children}</div>,
  CardHeader: ({ title }) => <h2>{title}</h2>,
}));

jest.mock('../../common/Input.jsx', () => ({
  __esModule: true,
  default: ({ id, label, type, placeholder, value, onChange, hint }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      {hint && <span>{hint}</span>}
      <input
        id={id}
        type={type || 'text'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  ),
}));

jest.mock('../../common/Button.jsx', () => ({
  __esModule: true,
  default: ({ children, type, isLoading, onClick }) => (
    <button type={type} disabled={isLoading} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  CalendarPlus: () => null,
}));

jest.mock('../../../hooks/useAsyncAction.js', () => ({
  useAsyncAction: jest.fn(() => ({
    run: jest.fn(),
    isSubmitting: false,
    error: null,
    success: false,
    reset: jest.fn(),
  })),
}));

describe('CampaignForm', () => {
  const mockOnCreate = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with card container', () => {
    render(<CampaignForm onCreate={mockOnCreate} />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('displays form title', () => {
    render(<CampaignForm onCreate={mockOnCreate} />);
    expect(screen.getByText('New promotional campaign')).toBeInTheDocument();
  });

  it('renders campaign name input', () => {
    render(<CampaignForm onCreate={mockOnCreate} />);
    const input = screen.getByLabelText('Campaign name');
    expect(input).toBeInTheDocument();
  });

  it('renders time inputs', () => {
    render(<CampaignForm onCreate={mockOnCreate} />);
    expect(screen.getByLabelText('Start time')).toBeInTheDocument();
    expect(screen.getByLabelText('End time')).toBeInTheDocument();
  });

  it('renders earn multiplier input', () => {
    render(<CampaignForm onCreate={mockOnCreate} />);
    expect(screen.getByLabelText('Earn multiplier')).toBeInTheDocument();
  });

  it('renders burn discount multiplier input', () => {
    render(<CampaignForm onCreate={mockOnCreate} />);
    expect(screen.getByLabelText('Burn discount multiplier')).toBeInTheDocument();
  });

  it('renders submit button with correct text', () => {
    render(<CampaignForm onCreate={mockOnCreate} />);
    expect(screen.getByText('Create campaign')).toBeInTheDocument();
  });

  it('allows typing in name field', async () => {
    const user = userEvent.setup();
    render(<CampaignForm onCreate={mockOnCreate} />);
    const input = screen.getByLabelText('Campaign name');
    await user.type(input, 'Test Campaign');
    expect(input.value).toBe('Test Campaign');
  });

  it('renders form in document', () => {
    const { container } = render(<CampaignForm onCreate={mockOnCreate} />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('has submit button type', () => {
    render(<CampaignForm onCreate={mockOnCreate} />);
    const button = screen.getByRole('button');
    expect(button.type).toBe('submit');
  });

  it('accepts disabled prop', () => {
    render(<CampaignForm onCreate={mockOnCreate} disabled={true} />);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    const { container } = render(<CampaignForm onCreate={mockOnCreate} />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBe(5);
  });

  it('renders form with proper structure', () => {
    const { container } = render(<CampaignForm onCreate={mockOnCreate} />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    const inputs = form.querySelectorAll('input');
    expect(inputs.length).toBe(5);
  });
});
