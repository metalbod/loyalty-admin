import React from 'react';
import { render, screen } from '@testing-library/react';
import { Heart } from 'lucide-react';
import EmptyState from '../EmptyState.jsx';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="No data" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="No data" description="Please try again later" />);
    expect(screen.getByText('Please try again later')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(<EmptyState title="No data" />);
    expect(screen.queryByText('Please try again')).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { container } = render(<EmptyState title="No data" icon={Heart} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('does not render icon when not provided', () => {
    const { container } = render(<EmptyState title="No data" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('renders icon in circular background', () => {
    const { container } = render(<EmptyState title="No data" icon={Heart} />);
    const background = container.querySelector('.bg-slate-100');
    expect(background).toBeInTheDocument();
    expect(background.className).toContain('rounded-full');
  });

  it('applies flex column layout', () => {
    const { container } = render(<EmptyState title="No data" />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('flex-col');
    expect(wrapper.className).toContain('items-center');
    expect(wrapper.className).toContain('justify-center');
  });

  it('has vertical gap spacing', () => {
    const { container } = render(<EmptyState title="No data" />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('gap-2');
  });

  it('applies padding to container', () => {
    const { container } = render(<EmptyState title="No data" />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('py-10');
  });

  it('centers text content', () => {
    const { container } = render(<EmptyState title="No data" />);
    const wrapper = container.firstChild;
    expect(wrapper.className).toContain('text-center');
  });

  it('renders title with medium font weight', () => {
    render(<EmptyState title="No data" />);
    const title = screen.getByText('No data');
    expect(title.className).toContain('font-medium');
  });

  it('renders description with small font size', () => {
    render(<EmptyState title="No data" description="Try again later" />);
    const description = screen.getByText('Try again later');
    expect(description.className).toContain('text-xs');
  });

  it('applies text color classes to title', () => {
    render(<EmptyState title="No data" />);
    const title = screen.getByText('No data');
    expect(title.className).toContain('text-slate-600');
  });

  it('applies text color classes to description', () => {
    render(<EmptyState title="No data" description="Try again later" />);
    const description = screen.getByText('Try again later');
    expect(description.className).toContain('text-slate-500');
  });

  it('limits description width', () => {
    render(<EmptyState title="No data" description="Try again later" />);
    const description = screen.getByText('Try again later');
    expect(description.className).toContain('max-w-xs');
  });

  it('renders with Node as title', () => {
    const titleNode = <span className="custom-title">Custom Title</span>;
    render(<EmptyState title={titleNode} />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders with Node as description', () => {
    const descNode = <span className="custom-desc">Custom Description</span>;
    render(<EmptyState title="Title" description={descNode} />);
    expect(screen.getByText('Custom Description')).toBeInTheDocument();
  });

  it('icon has slate text color', () => {
    const { container } = render(<EmptyState title="No data" icon={Heart} />);
    const background = container.querySelector('.bg-slate-100');
    expect(background.className).toContain('text-slate-500');
  });
});
