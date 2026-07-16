import React from 'react';
import { render, screen } from '@testing-library/react';
import EditBrandingModal from '../EditBrandingModal.jsx';

jest.mock('../../common/Modal.jsx', () => ({
  __esModule: true,
  default: ({ isOpen, children }) => (isOpen ? <div data-testid="modal">{children}</div> : null),
}));

jest.mock('../../common/Input.jsx', () => ({
  __esModule: true,
  default: () => <input data-testid="input" />,
}));

jest.mock('../../common/Button.jsx', () => ({
  __esModule: true,
  default: ({ children }) => <button>{children}</button>,
}));

jest.mock('lucide-react', () => ({ Save: () => null, Upload: () => null, Trash2: () => null }));

jest.mock('../../../hooks/useAsyncAction.js', () => ({
  useAsyncAction: jest.fn(() => ({ run: jest.fn(), isSubmitting: false, error: null, reset: jest.fn() })),
}));

describe('EditBrandingModal', () => {
  const mockInstitution = { institutionId: 'inst-1', name: 'Acme', logoDataUrl: '', primaryColor: '#0066cc' };
  const mockOnSave = jest.fn(() => Promise.resolve());
  const mockOnClose = jest.fn();

  it('renders when open', () => {
    render(<EditBrandingModal isOpen={true} onClose={mockOnClose} institution={mockInstitution} onSave={mockOnSave} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<EditBrandingModal isOpen={false} onClose={mockOnClose} institution={mockInstitution} onSave={mockOnSave} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders with institution provided', () => {
    render(<EditBrandingModal isOpen={true} onClose={mockOnClose} institution={mockInstitution} onSave={mockOnSave} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('handles modal state changes', () => {
    const { rerender } = render(
      <EditBrandingModal isOpen={true} onClose={mockOnClose} institution={mockInstitution} onSave={mockOnSave} />
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    rerender(
      <EditBrandingModal isOpen={false} onClose={mockOnClose} institution={mockInstitution} onSave={mockOnSave} />
    );
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});
