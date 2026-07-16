import React from 'react';
import { render, screen } from '@testing-library/react';
import ValuePreview from '../ValuePreview.jsx';

describe('ValuePreview', () => {
  it('renders dash when no values provided', () => {
    render(<ValuePreview />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders dash when both values are null', () => {
    render(<ValuePreview oldValue={null} newValue={null} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('renders only new value when old value is null', () => {
    render(<ValuePreview newValue="New Value" />);
    expect(screen.getByText('New Value')).toBeInTheDocument();
  });

  it('renders only old value when new value is null', () => {
    render(<ValuePreview oldValue="Old Value" />);
    expect(screen.getByText('Old Value')).toBeInTheDocument();
  });

  it('renders both old and new values', () => {
    render(<ValuePreview oldValue="Old" newValue="New" />);
    expect(screen.getByText('Old')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('handles numeric old value', () => {
    render(<ValuePreview oldValue={100} newValue={150} />);
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('handles object old value', () => {
    const oldObj = { key1: 'value1', key2: 'value2' };
    render(<ValuePreview oldValue={oldObj} />);
    expect(screen.getByText(/key1: value1/)).toBeInTheDocument();
  });

  it('handles object new value', () => {
    const newObj = { status: 'active', count: 5 };
    render(<ValuePreview newValue={newObj} />);
    expect(screen.getByText(/status: active/)).toBeInTheDocument();
  });

  it('renders undefined value as dash', () => {
    render(<ValuePreview oldValue={undefined} newValue={undefined} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('handles zero as a valid new value', () => {
    render(<ValuePreview newValue={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('handles empty string as null', () => {
    render(<ValuePreview oldValue="" newValue="" />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('applies strikethrough styling to old value', () => {
    const { container } = render(<ValuePreview oldValue="Old" newValue="New" />);
    const oldValueSpan = container.querySelector('.line-through');
    expect(oldValueSpan).toBeInTheDocument();
  });
});
