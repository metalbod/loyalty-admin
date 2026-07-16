import React from 'react';
import { render, screen } from '@testing-library/react';
import CreateInstitutionModal from '../CreateInstitutionModal.jsx';

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

jest.mock('lucide-react', () => ({ PlusCircle: () => null }));

jest.mock('../../../hooks/useAsyncAction.js', () => ({
  useAsyncAction: jest.fn(() => ({ run: jest.fn(), isSubmitting: false, error: null, reset: jest.fn() })),
}));

describe('CreateInstitutionModal', () => {
  const mockOnCreate = jest.fn(() => Promise.resolve());
  const mockOnClose = jest.fn();

  it('renders when open', () => {
    render(<CreateInstitutionModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<CreateInstitutionModal isOpen={false} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  it('renders form inputs', () => {
    render(<CreateInstitutionModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const inputs = screen.getAllByTestId('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('handles modal state changes', () => {
    const { rerender } = render(
      <CreateInstitutionModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    rerender(<CreateInstitutionModal isOpen={false} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});
