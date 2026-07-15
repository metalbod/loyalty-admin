import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../Pagination.jsx';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page information', () => {
    render(
      <Pagination
        page={0}
        totalPages={5}
        totalElements={50}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText(/Page/)).toBeInTheDocument();
    expect(screen.getByText(/50 total entries/)).toBeInTheDocument();
  });

  it('displays correct current page number', () => {
    render(
      <Pagination
        page={2}
        totalPages={5}
        totalElements={50}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('displays correct total pages', () => {
    render(
      <Pagination
        page={0}
        totalPages={10}
        totalElements={100}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders Previous and Next buttons', () => {
    render(
      <Pagination
        page={1}
        totalPages={5}
        totalElements={50}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText('Prev')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables Previous button on first page', () => {
    render(
      <Pagination
        page={0}
        totalPages={5}
        totalElements={50}
        onPageChange={mockOnPageChange}
      />,
    );
    const prevButton = screen.getByText('Prev').closest('button');
    expect(prevButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(
      <Pagination
        page={4}
        totalPages={5}
        totalElements={50}
        onPageChange={mockOnPageChange}
      />,
    );
    const nextButton = screen.getByText('Next').closest('button');
    expect(nextButton).toBeDisabled();
  });

  it('enables both buttons on middle page', () => {
    render(
      <Pagination
        page={2}
        totalPages={5}
        totalElements={50}
        onPageChange={mockOnPageChange}
      />,
    );
    const prevButton = screen.getByText('Prev').closest('button');
    const nextButton = screen.getByText('Next').closest('button');
    expect(prevButton).not.toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('calls onPageChange with previous page when Prev clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        page={2}
        totalPages={5}
        totalElements={50}
        onPageChange={mockOnPageChange}
      />,
    );
    const prevButton = screen.getByText('Prev');
    await user.click(prevButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with next page when Next clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination
        page={1}
        totalPages={5}
        totalElements={50}
        onPageChange={mockOnPageChange}
      />,
    );
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('disables buttons when loading', () => {
    render(
      <Pagination
        page={2}
        totalPages={5}
        totalElements={50}
        onPageChange={mockOnPageChange}
        isLoading={true}
      />,
    );
    const prevButton = screen.getByText('Prev').closest('button');
    const nextButton = screen.getByText('Next').closest('button');
    expect(prevButton).toBeDisabled();
    expect(nextButton).toBeDisabled();
  });

  it('renders border separator', () => {
    const { container } = render(
      <Pagination
        page={0}
        totalPages={5}
        totalElements={50}
        onPageChange={mockOnPageChange}
      />,
    );
    const separator = container.querySelector('.border-t');
    expect(separator).toBeInTheDocument();
  });

  it('has flex layout with space-between', () => {
    const { container } = render(
      <Pagination
        page={0}
        totalPages={5}
        totalElements={50}
        onPageChange={mockOnPageChange}
      />,
    );
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('flex');
    expect(wrapper.className).toContain('justify-between');
  });

  it('displays total elements count', () => {
    render(
      <Pagination
        page={0}
        totalPages={5}
        totalElements={247}
        onPageChange={mockOnPageChange}
      />,
    );
    expect(screen.getByText(/247 total entries/)).toBeInTheDocument();
  });
});
