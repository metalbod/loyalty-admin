import React from 'react';
import { render, screen } from '@testing-library/react';
import EditInstitutionModal from '../EditInstitutionModal.jsx';

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

jest.mock('lucide-react', () => ({ Save: () => null }));

jest.mock('../../../hooks/useAsyncAction.js', () => ({
  useAsyncAction: jest.fn(() => ({ run: jest.fn(), isSubmitting: false, error: null, reset: jest.fn() })),
}));

describe('EditInstitutionModal', () => {
  const mockInstitution = { institutionId: 'inst-1', name: 'Acme', adminEmail: 'admin@acme.com' };
  const mockOnSave = jest.fn(() => Promise.resolve());
  const mockOnClose = jest.fn();

  it('renders when open', () => {
    render(<EditInstitutionModal isOpen={true} onClose={mockOnClose} institution={mockInstitution} onSave={mockOnSave} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<EditInstitutionModal isOpen={false} onClose={mockOnClose} institution={mockInstitution} onSave={mockOnSave} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders form inputs', () => {
    render(<EditInstitutionModal isOpen={true} onClose={mockOnClose} institution={mockInstitution} onSave={mockOnSave} />);
    const inputs = screen.getAllByTestId('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('handles modal state changes', () => {
    const { rerender } = render(
      <EditInstitutionModal isOpen={true} onClose={mockOnClose} institution={mockInstitution} onSave={mockOnSave} />
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    rerender(
      <EditInstitutionModal isOpen={false} onClose={mockOnClose} institution={mockInstitution} onSave={mockOnSave} />
    );
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});
