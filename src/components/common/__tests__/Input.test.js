import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../Input.jsx';

describe('Input', () => {
  it('renders input element by default', () => {
    render(<Input id="test" />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<Input id="test" label="Email" />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('associates label with input via htmlFor', () => {
    render(<Input id="email" label="Email" />);
    const label = screen.getByText('Email');
    expect(label).toHaveAttribute('for', 'email');
  });

  it('renders hint text when provided', () => {
    render(<Input id="test" hint="This is a hint" />);
    expect(screen.getByText('This is a hint')).toBeInTheDocument();
  });

  it('renders error message when provided', () => {
    render(<Input id="test" error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('hides hint when error is present', () => {
    render(<Input id="test" hint="Hint" error="Error" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
  });

  it('applies error styling when error prop is set', () => {
    const { container } = render(<Input id="test" error="Error" />);
    const input = container.querySelector('input');
    expect(input.className).toContain('border-rose-300');
  });

  it('applies normal styling without error', () => {
    const { container } = render(<Input id="test" />);
    const input = container.querySelector('input');
    expect(input.className).toContain('border-slate-200');
  });

  it('renders suffix text', () => {
    render(<Input id="test" suffix="@example.com" />);
    expect(screen.getByText('@example.com')).toBeInTheDocument();
  });

  it('applies suffix padding when suffix is provided', () => {
    const { container } = render(<Input id="test" suffix="pts" />);
    const input = container.querySelector('input');
    expect(input.className).toContain('pr-14');
  });

  it('handles value changes', async () => {
    const user = userEvent.setup();
    render(<Input id="test" defaultValue="" />);
    const input = screen.getByRole('textbox');

    await user.type(input, 'hello');
    expect(input).toHaveValue('hello');
  });

  it('accepts different input types', () => {
    render(<Input id="test" type="email" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('applies custom className', () => {
    const { container } = render(<Input id="test" className="custom-class" />);
    const input = container.querySelector('input');
    expect(input.className).toContain('custom-class');
  });

  it('applies custom containerClassName', () => {
    const { container } = render(<Input id="test" containerClassName="custom-container" />);
    const div = container.querySelector('.custom-container');
    expect(div).toBeInTheDocument();
  });

  it('forwards input props to input element', () => {
    render(<Input id="test" placeholder="Enter text" required />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input).toHaveAttribute('required');
  });

  it('handles number input type', () => {
    render(<Input id="test" type="number" min="0" max="100" />);
    const input = screen.getByRole('spinbutton');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
  });

  it('handles readonly state', () => {
    render(<Input id="test" readOnly defaultValue="readonly" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readOnly');
  });

  it('handles disabled state', () => {
    render(<Input id="test" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});
