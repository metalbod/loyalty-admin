import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreatePartnerModal from '../CreatePartnerModal.jsx';

describe('CreatePartnerModal', () => {
  const mockOnClose = jest.fn();
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when isOpen is false', () => {
    const { container } = render(
      <CreatePartnerModal isOpen={false} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when isOpen is true', () => {
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByText('Create channel partner')).toBeInTheDocument();
  });

  it('renders subtitle about default rates', () => {
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByText(/default to the global/)).toBeInTheDocument();
  });

  it('renders partner name input field', () => {
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByLabelText('Partner name')).toBeInTheDocument();
  });

  it('renders description textarea', () => {
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders create partner button', () => {
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByText('Create partner')).toBeInTheDocument();
  });

  it('calls onClose when cancel button clicked', async () => {
    const user = userEvent.setup();
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup();
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('validates that partner name is required', async () => {
    const user = userEvent.setup();
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const submitButton = screen.getByText('Create partner');
    await user.click(submitButton);
    expect(screen.getByText('partnerName is required')).toBeInTheDocument();
    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it('accepts partner name input', async () => {
    const user = userEvent.setup();
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const input = screen.getByLabelText('Partner name');
    await user.type(input, 'Visa Inc');
    expect(input).toHaveValue('Visa Inc');
  });

  it('accepts description input', async () => {
    const user = userEvent.setup();
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const textarea = screen.getByLabelText('Description');
    await user.type(textarea, 'Credit card transactions');
    expect(textarea).toHaveValue('Credit card transactions');
  });

  it('calls onCreate with partner data when submitted', async () => {
    const user = userEvent.setup();
    const onCreateMock = jest.fn(() => Promise.resolve());
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={onCreateMock} />);
    const nameInput = screen.getByLabelText('Partner name');
    const descriptionTextarea = screen.getByLabelText('Description');
    const submitButton = screen.getByText('Create partner');

    await user.type(nameInput, 'Mastercard');
    await user.type(descriptionTextarea, 'Credit card partner');
    await user.click(submitButton);

    expect(onCreateMock).toHaveBeenCalledWith({
      partnerName: 'Mastercard',
      description: 'Credit card partner',
    });
  });

  it('clears form fields on successful submission', async () => {
    const user = userEvent.setup();
    const onCreateMock = jest.fn(() => Promise.resolve());
    const onCloseMock = jest.fn();
    render(<CreatePartnerModal isOpen={true} onClose={onCloseMock} onCreate={onCreateMock} />);
    const nameInput = screen.getByLabelText('Partner name');
    const descriptionTextarea = screen.getByLabelText('Description');
    const submitButton = screen.getByText('Create partner');

    await user.type(nameInput, 'AmEx');
    await user.type(descriptionTextarea, 'American Express');
    await user.click(submitButton);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('clears validation error on successful submission', async () => {
    const user = userEvent.setup();
    const onCreateMock = jest.fn(() => Promise.resolve());
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={onCreateMock} />);
    const submitButton = screen.getByText('Create partner');

    // First attempt without name
    await user.click(submitButton);
    expect(screen.getByText('partnerName is required')).toBeInTheDocument();

    // Second attempt with name
    const nameInput = screen.getByLabelText('Partner name');
    await user.type(nameInput, 'Discover');
    await user.click(submitButton);

    // Validation error should be cleared
    expect(screen.queryByText('partnerName is required')).not.toBeInTheDocument();
  });

  it('enforces max length on partner name input', async () => {
    const user = userEvent.setup();
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const nameInput = screen.getByLabelText('Partner name');
    const longName = 'A'.repeat(60);
    await user.type(nameInput, longName);
    expect(nameInput).toHaveValue('A'.repeat(50));
  });

  it('enforces max length on description textarea', async () => {
    const user = userEvent.setup();
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const textarea = screen.getByLabelText('Description');
    const longDescription = 'B'.repeat(600);
    await user.type(textarea, longDescription);
    expect(textarea).toHaveValue('B'.repeat(500));
  });

  it('renders partner name input with correct placeholder', () => {
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const nameInput = screen.getByLabelText('Partner name');
    expect(nameInput).toHaveAttribute('placeholder', 'e.g. Acme Merchant');
  });

  it('renders description textarea with correct placeholder', () => {
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveAttribute('placeholder', 'What transactions come through this partner?');
  });

  it('displays error message from onCreate failure', async () => {
    const user = userEvent.setup();
    const onCreateMock = jest.fn(() => Promise.reject(new Error('Partner name already exists')));
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={onCreateMock} />);
    const nameInput = screen.getByLabelText('Partner name');
    const submitButton = screen.getByText('Create partner');

    await user.type(nameInput, 'Existing');
    await user.click(submitButton);

    expect(screen.getByText('Partner name already exists')).toBeInTheDocument();
  });

  it('renders partner name as first input field', () => {
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const nameInput = screen.getByLabelText('Partner name');
    expect(nameInput).toBeInTheDocument();
  });

  it('has description textarea with 3 rows', () => {
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveAttribute('rows', '3');
  });

  it('does not allow description textarea to be resized', () => {
    render(<CreatePartnerModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const textarea = screen.getByLabelText('Description');
    expect(textarea.className).toContain('resize-none');
  });
});
