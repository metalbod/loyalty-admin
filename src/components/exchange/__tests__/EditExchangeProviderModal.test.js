import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditExchangeProviderModal from '../EditExchangeProviderModal.jsx';

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
  default: ({ id, label, type, placeholder, value, onChange, maxLength, autoFocus }) => (
    <div>
      <label htmlFor={id}>{label}</label>
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
  Save: () => null,
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
  toInputValue: (val) => (val !== null && val !== undefined ? String(val) : ''),
  toRateOrNull: (val) => (val ? Number(val) : null),
}));

describe('EditExchangeProviderModal', () => {
  const mockProvider = {
    providerId: 'prov-1',
    providerCode: 'SKYMILES',
    displayName: 'SkyMiles',
    inboundPointsPerExternalUnit: 10,
    outboundPointsPerExternalUnit: 12,
    active: true,
  };

  const mockOnSave = jest.fn(() => Promise.resolve());
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when no provider provided', () => {
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={null}
        onSave={mockOnSave}
      />
    );
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders modal when open with provider', () => {
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('does not render modal when closed', () => {
    render(
      <EditExchangeProviderModal
        isOpen={false}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('displays edit title with provider display name', () => {
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByText(/Edit provider — SkyMiles/)).toBeInTheDocument();
  });

  it('displays provider code in subtitle', () => {
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByText(/Provider code: SKYMILES/)).toBeInTheDocument();
  });

  it('renders display name input', () => {
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByLabelText('Display name')).toBeInTheDocument();
  });

  it('renders inbound rate input', () => {
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByLabelText('Inbound rate')).toBeInTheDocument();
  });

  it('renders outbound rate input', () => {
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByLabelText('Outbound rate')).toBeInTheDocument();
  });

  it('renders active checkbox', () => {
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByLabelText(/Active \(visible to customers\)/)).toBeInTheDocument();
  });

  it('renders submit button', () => {
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByText('Save changes')).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('allows editing display name', async () => {
    const user = userEvent.setup();
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    const input = screen.getByLabelText('Display name');
    await user.clear(input);
    await user.type(input, 'Updated SkyMiles');
    expect(input.value).toBe('Updated SkyMiles');
  });

  it('allows editing inbound rate', async () => {
    const user = userEvent.setup();
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    const input = screen.getByLabelText('Inbound rate');
    await user.clear(input);
    await user.type(input, '15');
    expect(input.value).toBe('15');
  });

  it('allows toggling active checkbox', async () => {
    const user = userEvent.setup();
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    const checkbox = screen.getByLabelText(/Active \(visible to customers\)/);
    expect(checkbox.checked).toBe(true);
    await user.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('renders form with all fields', () => {
    const { container } = render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });

  it('calls onClose when cancel button clicked', async () => {
    const user = userEvent.setup();
    render(
      <EditExchangeProviderModal
        isOpen={true}
        onClose={mockOnClose}
        provider={mockProvider}
        onSave={mockOnSave}
      />
    );
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
