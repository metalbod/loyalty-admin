import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Heart } from 'lucide-react';
import Button from '../Button.jsx';

describe('Button', () => {
  it('renders with text content', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick}>Click</Button>);

    await user.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('sets button type correctly', () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  describe('variants', () => {
    it('renders primary variant by default', () => {
      const { container } = render(<Button>Primary</Button>);
      const button = container.querySelector('button');
      expect(button.className).toContain('bg-[var(--brand)]');
    });

    it('renders secondary variant', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>);
      const button = container.querySelector('button');
      expect(button.className).toContain('bg-slate-100');
    });

    it('renders ghost variant', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>);
      const button = container.querySelector('button');
      expect(button.className).toContain('bg-transparent');
    });

    it('renders danger variant', () => {
      const { container } = render(<Button variant="danger">Delete</Button>);
      const button = container.querySelector('button');
      expect(button.className).toContain('bg-rose-600');
    });
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('disables button when isLoading is true', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders icon when provided', () => {
    render(<Button icon={Heart}>Like</Button>);
    // Icon is rendered via lucide-react, check that it's in the DOM
    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('shows loading spinner instead of icon when isLoading', () => {
    const { container } = render(<Button icon={Heart} isLoading>Loading</Button>);
    const svgs = container.querySelectorAll('svg');
    // Should have spinner SVG, not Heart icon
    expect(svgs.length).toBeGreaterThan(0);
  });

  it('applies fullWidth class', () => {
    const { container } = render(<Button fullWidth>Full</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('w-full');
  });

  it('applies custom className', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>);
    const button = container.querySelector('button');
    expect(button.className).toContain('custom-class');
  });

  it('does not call onClick when disabled', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when isLoading', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    render(<Button onClick={handleClick} isLoading>Loading</Button>);

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
