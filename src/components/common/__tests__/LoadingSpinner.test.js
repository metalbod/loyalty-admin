import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner.jsx';

describe('LoadingSpinner', () => {
  it('renders default label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('renders custom label', () => {
    render(<LoadingSpinner label="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('does not render label when label prop is falsy', () => {
    render(<LoadingSpinner label="" />);
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
  });

  it('does not render label when label prop is null', () => {
    render(<LoadingSpinner label={null} />);
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument();
  });

  it('renders spinner icon', () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies spin animation to icon', () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector('.animate-spin');
    expect(svg).toBeInTheDocument();
  });

  it('renders with default size', () => {
    const { container } = render(<LoadingSpinner />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('renders with custom size', () => {
    const { container } = render(<LoadingSpinner size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });

  it('has flex layout with gap', () => {
    const { container } = render(<LoadingSpinner />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('flex');
    expect(wrapper.className).toContain('gap-2');
  });

  it('centers content', () => {
    const { container } = render(<LoadingSpinner />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('items-center');
    expect(wrapper.className).toContain('justify-center');
  });

  it('has slate text color', () => {
    const { container } = render(<LoadingSpinner />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('text-slate-500');
  });

  it('applies padding', () => {
    const { container } = render(<LoadingSpinner />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('py-8');
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('custom-class');
  });

  it('renders label with small text size', () => {
    const { container } = render(<LoadingSpinner label="Loading" />);
    const label = screen.getByText('Loading');
    expect(label.className).toContain('text-sm');
  });
});
