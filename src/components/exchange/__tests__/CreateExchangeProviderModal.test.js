import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateExchangeProviderModal from '../CreateExchangeProviderModal.jsx';

jest.mock('../../common/Modal.jsx', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, title, subtitle, children }) => (
    isOpen ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        {children}
      </div>
    ) : null
  ),
}));

jest.mock('../../common/Input.jsx', () => ({
  __esModule: true,
  default: ({ id, label, type, placeholder, value, onChange, hint, maxLength, autoFocus }) => (
    <div>
      <label htmlFor={id}>{label}</label>
      {hint && <span>{hint}</span>}
      <input
        id={id}
        type={type || 'text'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        autoFocus={autoFocus}
      />
    </div>
  ),
}));

jest.mock('../../common/Button.jsx', () => ({
  __esModule: true,
  default: ({ children, type, variant, icon: Icon, isLoading, onClick }) => (
    <button type={type} disabled={isLoading} onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('lucide-react', () => ({
  PlusCircle: () => null,
}));

jest.mock('../../../hooks/useAsyncAction.js', () => ({
  useAsyncAction: jest.fn(() => ({
    run: jest.fn(),
    isSubmitting: false,
    error: null,
    reset: jest.fn(),
  })),
}));

jest.mock('../../../utils/formConverters.js', () => ({
  toRateOrNull: (val) => (val ? Number(val) : null),
}));

describe('CreateExchangeProviderModal', () => {
  const mockOnCreate = jest.fn(() => Promise.resolve());
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(
      <CreateExchangeProviderModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('does not render modal when closed', () => {
    render(
      <CreateExchangeProviderModal isOpen={false} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('displays modal title', () => {
    render(
      <CreateExchangeProviderModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    expect(screen.getByText('Create exchange provider')).toBeInTheDocument();
  });

  it('renders provider code input', () => {
    render(
      <CreateExchangeProviderModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    expect(screen.getByLabelText('Provider code')).toBeInTheDocument();
  });

  it('renders display name input', () => {
    render(
      <CreateExchangeProviderModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    expect(screen.getByLabelText('Display name')).toBeInTheDocument();
  });

  it('renders inbound rate input', () => {
    render(
      <CreateExchangeProviderModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    expect(screen.getByLabelText('Inbound rate')).toBeInTheDocument();
  });

  it('renders outbound rate input', () => {
    render(
      <CreateExchangeProviderModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    expect(screen.getByLabelText('Outbound rate')).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(
      <CreateExchangeProviderModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    expect(screen.getByText('Create provider')).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    render(
      <CreateExchangeProviderModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('allows typing in provider code field', async () => {
    const user = userEvent.setup();
    render(
      <CreateExchangeProviderModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    const input = screen.getByLabelText('Provider code');
    await user.type(input, 'SKYMILES');
    expect(input.value).toBe('SKYMILES');
  });

  it('allows typing in display name field', async () => {
    const user = userEvent.setup();
    render(
      <CreateExchangeProviderModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    const input = screen.getByLabelText('Display name');
    await user.type(input, 'SkyMiles');
    expect(input.value).toBe('SkyMiles');
  });

  it('allows typing in rate fields', async () => {
    const user = userEvent.setup();
    render(
      <CreateExchangeProviderModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    const inboundInput = screen.getByLabelText('Inbound rate');
    await user.type(inboundInput, '10');
    expect(inboundInput.value).toBe('10');
  });

  it('renders form with all fields', () => {
    const { container } = render(
      <CreateExchangeProviderModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('displays hints for rate fields', () => {
    render(
      <CreateExchangeProviderModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    const hints = screen.getAllByText(/Leave blank to disable this direction/i);
    expect(hints.length).toBeGreaterThan(0);
  });
});
