# Testing Guide

This document covers the testing setup and patterns for the loyalty admin dashboard.

## Setup

Testing is configured with:
- **Jest** – JavaScript test runner
- **React Testing Library** – Component and hook testing utilities
- **@testing-library/jest-dom** – Additional matchers for DOM assertions

Install dependencies (already done via `npm install`):
```bash
npm install
```

## Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm test:watch

# Generate coverage report
npm test:coverage

# Run specific test file
npm test -- formatters.test.js

# Run tests matching a pattern
npm test -- --testNamePattern="formatPoints"
```

## Test Structure

Tests are co-located with source files in `__tests__` directories:

```
src/
├── utils/
│   ├── formatters.js
│   └── __tests__/
│       └── formatters.test.js
├── hooks/
│   ├── useAsyncAction.js
│   └── __tests__/
│       └── useAsyncAction.test.js
└── components/
    ├── common/
    │   └── Button.jsx
    └── __tests__/
        └── Button.test.js
```

## Test Patterns

### Utility Functions

Test pure functions directly:

```javascript
import { formatPoints } from '../formatters.js';

describe('formatPoints', () => {
  it('formats positive numbers with + prefix', () => {
    expect(formatPoints(100)).toBe('+100 pts');
  });
});
```

### React Hooks

Use `renderHook` from React Testing Library:

```javascript
import { renderHook, act } from '@testing-library/react';
import { useAsyncAction } from '../useAsyncAction.js';

describe('useAsyncAction', () => {
  it('sets isSubmitting while action runs', async () => {
    const mockAction = jest.fn(() => Promise.resolve());
    const { result } = renderHook(() => useAsyncAction(mockAction));

    act(() => {
      result.current.run();
    });

    expect(result.current.isSubmitting).toBe(true);
  });
});
```

### React Components

Use `render` and query utilities:

```javascript
import { render, screen } from '@testing-library/react';
import { Button } from '../Button.jsx';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

## Current Coverage

- ✅ **Utility functions**: 100% (formatters, formConverters)
- ✅ **Custom hooks**: useAsyncAction
- 📋 **Components**: Not yet
- 📋 **Context providers**: Not yet
- 📋 **Views**: Not yet

## Adding More Tests

### Priority order for expanding coverage:

1. **Contexts** (ProfileContext, PartnerContext, etc.) – Mid-complexity
2. **Common components** (Modal, Button, Input) – High-value, lower effort
3. **Form components** (modals, config components) – High-value
4. **Views** (manager views, list views) – Integration tests, higher effort

### When writing tests:

- Test behavior, not implementation
- Use descriptive test names
- Arrange-Act-Assert pattern
- Mock external dependencies (API calls, other services)
- Aim for ~80% coverage on critical paths

## Debugging Tests

Run a single test file:
```bash
npm test -- formatters.test.js
```

Use `only` to run a single test:
```javascript
it.only('specific test', () => {
  // Only this test runs
});
```

Debug in Node:
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## CI Integration

Tests should run in CI/CD pipelines before deployment:

```bash
npm test -- --coverage --watchAll=false
```

## Resources

- [Jest Documentation](https://jestjs.io)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
