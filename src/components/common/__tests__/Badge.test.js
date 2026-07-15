import React from 'react';
import { render, screen } from '@testing-library/react';
import { Heart } from 'lucide-react';
import Badge from '../Badge.jsx';

describe('Badge', () => {
  it('renders with text content', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  describe('variants', () => {
    it('renders slate variant by default', () => {
      const { container } = render(<Badge>Default</Badge>);
      const span = container.querySelector('span');
      expect(span.className).toContain('bg-slate-100');
    });

    it('renders emerald variant', () => {
      const { container } = render(<Badge variant="emerald">Success</Badge>);
      const span = container.querySelector('span');
      expect(span.className).toContain('bg-emerald-50');
    });

    it('renders amber variant', () => {
      const { container } = render(<Badge variant="amber">Warning</Badge>);
      const span = container.querySelector('span');
      expect(span.className).toContain('bg-amber-50');
    });

    it('renders rose variant', () => {
      const { container } = render(<Badge variant="rose">Error</Badge>);
      const span = container.querySelector('span');
      expect(span.className).toContain('bg-rose-50');
    });

    it('renders sky variant', () => {
      const { container } = render(<Badge variant="sky">Info</Badge>);
      const span = container.querySelector('span');
      expect(span.className).toContain('bg-sky-50');
    });

    it('renders fuchsia variant', () => {
      const { container } = render(<Badge variant="fuchsia">Custom</Badge>);
      const span = container.querySelector('span');
      expect(span.className).toContain('bg-fuchsia-50');
    });
  });

  it('renders icon when provided', () => {
    const { container } = render(<Badge icon={Heart}>Liked</Badge>);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>);
    const span = container.querySelector('span');
    expect(span.className).toContain('custom-class');
  });

  it('renders as inline-flex', () => {
    const { container } = render(<Badge>Inline</Badge>);
    const span = container.querySelector('span');
    expect(span.className).toContain('inline-flex');
  });

  it('has uppercase text styling', () => {
    const { container } = render(<Badge>lowercase</Badge>);
    const span = container.querySelector('span');
    expect(span.className).toContain('uppercase');
  });

  it('has border styling', () => {
    const { container } = render(<Badge>Bordered</Badge>);
    const span = container.querySelector('span');
    expect(span.className).toContain('border');
  });
});
