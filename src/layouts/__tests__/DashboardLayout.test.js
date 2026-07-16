import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardLayout from '../DashboardLayout.jsx';

// Mock Sidebar
jest.mock('../Sidebar.jsx', () => ({
  __esModule: true,
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));

describe('DashboardLayout', () => {
  it('renders sidebar', () => {
    render(
      <DashboardLayout title="Test Page">
        <div>Content</div>
      </DashboardLayout>
    );
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders page title', () => {
    render(
      <DashboardLayout title="Dashboard">
        <div>Content</div>
      </DashboardLayout>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(
      <DashboardLayout title="Page" description="Page description">
        <div>Content</div>
      </DashboardLayout>
    );
    expect(screen.getByText('Page description')).toBeInTheDocument();
  });

  it('does not render description when not provided', () => {
    render(
      <DashboardLayout title="Page">
        <div>Content</div>
      </DashboardLayout>
    );
    expect(screen.queryByText(/description/i)).not.toBeInTheDocument();
  });

  it('renders children content', () => {
    render(
      <DashboardLayout title="Page">
        <div data-testid="test-content">Test content</div>
      </DashboardLayout>
    );
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('has correct layout structure', () => {
    const { container } = render(
      <DashboardLayout title="Page">
        <div>Content</div>
      </DashboardLayout>
    );
    // Should have flex container
    const flexContainer = container.querySelector('.flex');
    expect(flexContainer).toBeInTheDocument();
  });
});
