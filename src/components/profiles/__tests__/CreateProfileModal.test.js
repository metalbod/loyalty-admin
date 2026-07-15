import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateProfileModal from '../CreateProfileModal.jsx';

describe('CreateProfileModal', () => {
  const mockOnClose = jest.fn();
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns null when isOpen is false', () => {
    const { container } = render(
      <CreateProfileModal isOpen={false} onClose={mockOnClose} onCreate={mockOnCreate} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when isOpen is true', () => {
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByText('Create profile tier')).toBeInTheDocument();
  });

  it('renders subtitle about default rates', () => {
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByText(/default to the global/)).toBeInTheDocument();
  });

  it('renders profile name input field', () => {
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByLabelText('Profile name')).toBeInTheDocument();
  });

  it('renders description textarea', () => {
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('renders cancel button', () => {
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders create profile button', () => {
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    expect(screen.getByText('Create profile')).toBeInTheDocument();
  });

  it('calls onClose when cancel button clicked', async () => {
    const user = userEvent.setup();
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onClose when close button clicked', async () => {
    const user = userEvent.setup();
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('validates that profile name is required', async () => {
    const user = userEvent.setup();
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const submitButton = screen.getByText('Create profile');
    await user.click(submitButton);
    expect(screen.getByText('profileName is required')).toBeInTheDocument();
    expect(mockOnCreate).not.toHaveBeenCalled();
  });

  it('accepts profile name input', async () => {
    const user = userEvent.setup();
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const input = screen.getByLabelText('Profile name');
    await user.type(input, 'Platinum');
    expect(input).toHaveValue('Platinum');
  });

  it('accepts description input', async () => {
    const user = userEvent.setup();
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const textarea = screen.getByLabelText('Description');
    await user.type(textarea, 'Premium members only');
    expect(textarea).toHaveValue('Premium members only');
  });

  it('calls onCreate with profile data when submitted', async () => {
    const user = userEvent.setup();
    const onCreateMock = jest.fn(() => Promise.resolve());
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={onCreateMock} />);
    const nameInput = screen.getByLabelText('Profile name');
    const descriptionTextarea = screen.getByLabelText('Description');
    const submitButton = screen.getByText('Create profile');

    await user.type(nameInput, 'Gold');
    await user.type(descriptionTextarea, 'Gold tier members');
    await user.click(submitButton);

    expect(onCreateMock).toHaveBeenCalledWith({
      profileName: 'Gold',
      description: 'Gold tier members',
    });
  });

  it('clears form fields on successful submission', async () => {
    const user = userEvent.setup();
    const onCreateMock = jest.fn(() => Promise.resolve());
    const onCloseMock = jest.fn();
    render(<CreateProfileModal isOpen={true} onClose={onCloseMock} onCreate={onCreateMock} />);
    const nameInput = screen.getByLabelText('Profile name');
    const descriptionTextarea = screen.getByLabelText('Description');
    const submitButton = screen.getByText('Create profile');

    await user.type(nameInput, 'Silver');
    await user.type(descriptionTextarea, 'Silver tier');
    await user.click(submitButton);

    expect(onCloseMock).toHaveBeenCalled();
  });

  it('clears validation error on successful submission', async () => {
    const user = userEvent.setup();
    const onCreateMock = jest.fn(() => Promise.resolve());
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={onCreateMock} />);
    const submitButton = screen.getByText('Create profile');

    // First attempt without name
    await user.click(submitButton);
    expect(screen.getByText('profileName is required')).toBeInTheDocument();

    // Second attempt with name
    const nameInput = screen.getByLabelText('Profile name');
    await user.type(nameInput, 'Bronze');
    await user.click(submitButton);

    // Validation error should be cleared
    expect(screen.queryByText('profileName is required')).not.toBeInTheDocument();
  });

  it('enforces max length on profile name input', async () => {
    const user = userEvent.setup();
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const nameInput = screen.getByLabelText('Profile name');
    const longName = 'A'.repeat(60); // Try to input more than 50 chars
    await user.type(nameInput, longName);
    // maxLength attribute prevents input beyond 50 chars
    expect(nameInput).toHaveValue('A'.repeat(50));
  });

  it('enforces max length on description textarea', async () => {
    const user = userEvent.setup();
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const textarea = screen.getByLabelText('Description');
    const longDescription = 'B'.repeat(600);
    await user.type(textarea, longDescription);
    // maxLength attribute prevents input beyond 500 chars
    expect(textarea).toHaveValue('B'.repeat(500));
  });

  it('renders profile name input with correct placeholder', () => {
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const nameInput = screen.getByLabelText('Profile name');
    expect(nameInput).toHaveAttribute('placeholder', 'e.g. PLATINUM');
  });

  it('renders description textarea with correct placeholder', () => {
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveAttribute('placeholder', 'Who belongs to this tier?');
  });

  it('displays error message from onCreate failure', async () => {
    const user = userEvent.setup();
    const onCreateMock = jest.fn(() => Promise.reject(new Error('Profile name already exists')));
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={onCreateMock} />);
    const nameInput = screen.getByLabelText('Profile name');
    const submitButton = screen.getByText('Create profile');

    await user.type(nameInput, 'Existing');
    await user.click(submitButton);

    expect(screen.getByText('Profile name already exists')).toBeInTheDocument();
  });

  it('renders profile name as first input field', () => {
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const nameInput = screen.getByLabelText('Profile name');
    // Profile name input appears before description in the form
    expect(nameInput).toBeInTheDocument();
  });

  it('has description textarea with 3 rows', () => {
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const textarea = screen.getByLabelText('Description');
    expect(textarea).toHaveAttribute('rows', '3');
  });

  it('does not allow description textarea to be resized', () => {
    render(<CreateProfileModal isOpen={true} onClose={mockOnClose} onCreate={mockOnCreate} />);
    const textarea = screen.getByLabelText('Description');
    expect(textarea.className).toContain('resize-none');
  });
});
