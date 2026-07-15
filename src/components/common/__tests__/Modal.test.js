import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../Modal.jsx';

describe('Modal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Content
      </Modal>
    );
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="My Title">
        Content
      </Modal>
    );
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Title" subtitle="Subtitle">
        Content
      </Modal>
    );
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Title">
        Content
      </Modal>
    );
    expect(screen.queryByText('Subtitle')).not.toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Title">
        <p>Modal Content</p>
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Title">
        Content
      </Modal>
    );

    const closeButton = screen.getByLabelText('Close modal');
    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when background is clicked', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();
    const { container } = render(
      <Modal isOpen={true} onClose={handleClose} title="Title">
        Content
      </Modal>
    );

    // The backdrop is a button element with absolute inset-0
    const backdrop = container
      .querySelector('button[aria-label="Close modal"]')
      .parentElement.querySelector('button:first-child');
    await user.click(backdrop);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Title">
        Content
      </Modal>
    );

    await user.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for other keys', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Title">
        Content
      </Modal>
    );

    await user.keyboard('a');
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('removes Escape key listener when modal closes', async () => {
    const handleClose = jest.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <Modal isOpen={true} onClose={handleClose} title="Title">
        Content
      </Modal>
    );

    // Close modal
    rerender(
      <Modal isOpen={false} onClose={handleClose} title="Title">
        Content
      </Modal>
    );

    // Press Escape
    await user.keyboard('{Escape}');

    // Should not have called onClose again
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('does not call onClose when isOpen changes but stays true', () => {
    const handleClose = jest.fn();
    const { rerender } = render(
      <Modal isOpen={true} onClose={handleClose} title="Title">
        Content
      </Modal>
    );

    rerender(
      <Modal isOpen={true} onClose={handleClose} title="Title Updated">
        Content
      </Modal>
    );

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('has backdrop blur effect', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} title="Title">
        Content
      </Modal>
    );

    const backdrop = container.querySelector('.backdrop-blur-sm');
    expect(backdrop).toBeInTheDocument();
  });

  it('positions modal at center', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} title="Title">
        Content
      </Modal>
    );

    const wrapper = container.querySelector('.fixed');
    expect(wrapper.className).toContain('flex');
    expect(wrapper.className).toContain('items-center');
    expect(wrapper.className).toContain('justify-center');
  });

  it('constrains modal width', () => {
    const { container } = render(
      <Modal isOpen={true} onClose={() => {}} title="Title">
        Content
      </Modal>
    );

    const modal = container.querySelector('.max-w-md');
    expect(modal).toBeInTheDocument();
  });
});
