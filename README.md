# Loyalty Admin Dashboard

A comprehensive React-based admin interface for managing loyalty point systems, campaigns, partner integrations, and wallet tier configurations.

## Overview

The admin dashboard provides superadmins and institution administrators with tools to:
- **Manage Tier Profiles**: Define wallet tier hierarchies with earn/burn rates and point validity
- **Configure Automatic Tier Promotion**: Set up rules to automatically promote customer wallets based on transaction activity
- **Manage Tier Reassignment**: Manually adjust wallet tiers for customer support or fraud prevention
- **Partner Integration**: Create and manage channel partners with partner-specific rate overrides
- **Campaign Management**: Schedule and manage promotional campaigns with earned-point multipliers and burn discounts
- **Points Exchange**: Configure external points programs and track redemption requests
- **Global Settings**: Define institution-wide fallback rates and points validity periods
- **Wallet Administration**: View and manage individual customer wallets, transaction history, and ledger activity
- **Feature Flags**: Enable/disable features (Partners, Campaigns, Points Exchange, Automatic Tier Promotion) at the institution level

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── common/             # Generic (Modal, Button, Input, Card, etc.)
│   ├── institutions/       # Institution & profile management
│   ├── partners/           # Partner configuration
│   ├── campaigns/          # Campaign scheduling
│   ├── exchange/           # Points exchange provider management
│   ├── wallets/            # Wallet/customer display
│   └── ledger/             # Transaction history & metrics
├── views/                  # Page-level views
│   ├── *ManagerView.jsx    # CRUD views for entities
│   ├── *EditorView.jsx     # Complex editing views
│   ├── *ListView.jsx       # List/table views
│   └── GlobalSettingsView.jsx
├── layouts/                # Layout containers (DashboardLayout, Sidebar)
├── hooks/                  # Custom React hooks
│   ├── useAdminContext.js  # Admin state management
│   ├── useAsyncAction.js   # Async operation handler
│   └── useAuth.js          # Authentication state
├── context/                # React Context providers
│   └── AdminContext.jsx    # Central admin state (multi-tenant)
├── api/                    # Backend API client
│   └── client.js
├── utils/                  # Utility functions
│   ├── formatters.js       # Display formatting
│   ├── formConverters.js   # Form input/output conversion
│   └── dateUtils.js        # Date manipulation
├── constants/              # Application constants
└── styles/                 # Global styles & theme
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
cd loyalty-admin-dashboard
npm install
```

### Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173` by default.

### Environment Variables

Create a `.env.local` file:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Adjust `VITE_API_BASE_URL` to point to your loyalty points backend server.

## Key Abstractions

### AdminContext
Central state management provider (src/context/AdminContext.jsx) managing:
- Authentication & current user
- Profiles, partners, campaigns, exchange providers (lazy-loaded on mount)
- Wallets and pagination
- Global settings & feature flags
- Activity feed and metrics

**Note**: This is a candidate for refactoring into smaller feature-scoped contexts (Phase 2 tech debt).

### useAsyncAction Hook
Handles async operations with built-in loading/error states:
```javascript
const { run, isSubmitting, error, reset } = useAsyncAction(api.updateSomething);
await run(payload);
if (error) { /* handle error */ }
```

### Multi-Tenant Design
TenantContext (ThreadLocal) on backend isolates data by institution. All API calls include `X-Admin-Id` header for audit logging.

## Building & Deployment

### Production Build

```bash
npm run build
```

Output: `dist/` directory with optimized bundle.

### Deployment

The built artifacts can be served by any static web server:

```bash
# Example: serve from dist directory
npx serve dist
```

Or deploy to CDN/hosting platform (Vercel, Netlify, AWS S3, etc.).

## Tailwind CSS

Styling uses Tailwind CSS with a light theme (slate-50/100 backgrounds, slate-900 text, emerald accents).

Theme colors defined in `tailwind.config.js`. To adjust the palette, modify CSS variables or Tailwind config.

## Testing

**Current status**: No frontend tests (Phase 2 initiative). See tech-debt audit for testing roadmap.

When testing is added, run with:
```bash
npm run test
```

## Common Tasks

### Adding a New View

1. Create `src/views/NewFeatureView.jsx` (follows `DashboardLayout` pattern)
2. Add route in `src/App.jsx`
3. Add nav item to `NAV_ITEMS` in `src/constants`
4. Use `useAdminContext()` to access shared state

### Adding a New Component

1. Create `src/components/feature/ComponentName.jsx`
2. Import and use in views/modals
3. Follow the existing component patterns (Props, PropTypes, error handling)

### Integrating with AdminContext

```javascript
const { profiles, refreshProfiles, updateProfile } = useAdminContext();

useEffect(() => {
  // Load on mount
  refreshProfiles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

## Troubleshooting

### Login Issues
- Verify backend is running at `VITE_API_BASE_URL`
- Check browser console for API errors
- Confirm X-Admin-Id header is present in requests

### Modal/Form Not Responding
- Check `useAsyncAction` error state in browser DevTools
- Verify backend endpoint exists and is accessible
- Check that modal's `onSave`/`onCreate` callback is defined

### Styling Issues
- Ensure Tailwind CSS is built (`npm run dev` rebuilds on changes)
- Check for conflicting inline styles or CSS resets
- Verify `tailwind.config.js` paths match your file structure

## Contributing

See CLAUDE.md in the project root for coding standards and branch strategy.

## License

Internal - Mandrill Ventures

---

**Status**: Production-ready. Active development with Phase 2 tech-debt initiatives queued (testing infrastructure, context refactoring).
