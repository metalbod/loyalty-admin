import React from 'react';
import { render, screen } from '@testing-library/react';
import { Heart } from 'lucide-react';
import Card, { CardHeader } from '../Card.jsx';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders as div by default', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('renders as custom component via as prop', () => {
    const { container } = render(
      <Card as="section">
        <p>Section content</p>
      </Card>,
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('applies default border styling', () => {
    const { container } = render(<Card>Card</Card>);
    const card = container.firstChild;
    expect(card.className).toContain('border-slate-200');
  });

  it('applies accent styling when accent prop is true', () => {
    const { container } = render(<Card accent>Accented</Card>);
    const card = container.firstChild;
    expect(card.className).toContain('border-emerald-300');
    expect(card.className).toContain('ring-emerald-500');
  });

  it('applies white background', () => {
    const { container } = render(<Card>Card</Card>);
    const card = container.firstChild;
    expect(card.className).toContain('bg-white');
  });

  it('applies rounded corners', () => {
    const { container } = render(<Card>Card</Card>);
    const card = container.firstChild;
    expect(card.className).toContain('rounded-xl');
  });

  it('applies shadow styling', () => {
    const { container } = render(<Card>Card</Card>);
    const card = container.firstChild;
    expect(card.className).toContain('shadow-card');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Card</Card>);
    const card = container.firstChild;
    expect(card.className).toContain('custom-class');
  });

  it('forwards additional props to component', () => {
    const { container } = render(
      <Card data-testid="custom-card" id="my-card">
        Card
      </Card>,
    );
    const card = container.querySelector('[data-testid="custom-card"]');
    expect(card).toHaveAttribute('id', 'my-card');
  });
});

describe('CardHeader', () => {
  it('renders title', () => {
    render(<CardHeader title="My Title" />);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(<CardHeader title="Title" subtitle="Subtitle" />);
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    render(<CardHeader title="Title" />);
    expect(screen.queryByText('Subtitle')).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { container } = render(<CardHeader title="Title" icon={Heart} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders action content when provided', () => {
    render(
      <CardHeader
        title="Title"
        action={<button>Action</button>}
      />,
    );
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('has flex layout with space-between', () => {
    const { container } = render(<CardHeader title="Title" />);
    const header = container.firstChild;
    expect(header.className).toContain('flex');
    expect(header.className).toContain('justify-between');
  });

  it('has top border styling', () => {
    const { container } = render(<CardHeader title="Title" />);
    const header = container.firstChild;
    expect(header.className).toContain('border-b');
    expect(header.className).toContain('border-slate-200');
  });

  it('has padding', () => {
    const { container } = render(<CardHeader title="Title" />);
    const header = container.firstChild;
    expect(header.className).toContain('px-5');
    expect(header.className).toContain('py-4');
  });

  it('renders icon with emerald background', () => {
    const { container } = render(<CardHeader title="Title" icon={Heart} />);
    const iconWrapper = container.querySelector('.bg-emerald-50');
    expect(iconWrapper).toBeInTheDocument();
  });
});
