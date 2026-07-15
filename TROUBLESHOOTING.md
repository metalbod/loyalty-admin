# Troubleshooting Guide

**For Deployment Issues**, see [DEPLOYMENT.md](DEPLOYMENT.md)  
**For Test Failures**, see [TESTING.md](TESTING.md)

---

## Login & Authentication

### Login Page Shows Infinite Redirect Loop

**Symptoms**: Navigate to `/login` → redirected to `/login` → repeat

**Debug Steps**:
1. Open DevTools (F12) → Network tab
2. Reload page, check requests to `/api/auth/login`
3. Look for response status (200, 401, 500)

**Common Causes & Fixes**:

| Cause | Fix |
|-------|-----|
| Backend unavailable | Verify `VITE_API_BASE_URL` points to running backend |
| Token not stored | Check if `localStorage` is blocked (some browsers) |
| isAuthenticated state stuck | Clear browser cookies: DevTools → Application → Cookies → Delete |
| Network connectivity | Check internet; try different network |

**Advanced Debug**:
```javascript
// Open console and run:
console.log(localStorage.getItem('authToken'));  // Should show token after login
```

---

### "Your session has expired" Message Appears Immediately

**Symptoms**: Login succeeds → redirected to dashboard → session expired message

**Causes**:
- Token expired or invalid
- Backend session validation failed
- Clock skew (device time wrong)

**Fixes**:
1. Check device time: `date`
2. Verify backend session timeout setting
3. Try incognito window (clear cookies)
4. Restart browser

---

### Login Returns 401 Invalid Credentials

**Symptoms**: "Invalid credentials" error on login

**Debug**:
1. Verify username/password are correct
2. Check if user account exists on backend
3. Check if account is active (not disabled/deleted)

**Backend Check**:
```bash
# Query backend for user (requires admin access)
curl -H "Authorization: Bearer $TOKEN" \
  https://api.loyalty.internal/api/admin/users/username@example.com
# Should return 200 with user object
```

---

## Navigation & Routing

### "Page Not Found" When Navigating

**Symptoms**: Navigate to `/profiles` → blank page or 404

**Cause**: Router not properly initialized or route not defined

**Fix**:
1. Check `src/App.jsx` has route defined
2. Verify URL matches route path exactly
3. Clear browser cache & reload
4. Check browser console for routing errors

**Example**:
```javascript
// In App.jsx, route must exist:
<Route path="/profiles" element={<ProfileManagerView />} />
```

---

### Sidebar Navigation Links Not Appearing

**Symptoms**: Sidebar empty or only shows some items

**Causes**:
- Role-based access control (RBAC) hiding items
- Feature flags disabled
- Layout component not rendering

**Debug**:
1. Open DevTools → Application → Local Storage
2. Check `user.role` (should be `ROLE_ADMIN` or `ROLE_SUPERADMIN`)
3. Check feature flags: Look for `featureFlags` in network request to `/api/admin/feature-flags`

**Fix Role-Based Access**:
```javascript
// Sidebar filters nav items by role
const visibleNavItems = NAV_ITEMS.filter(
  (item) => item.roles.includes(user?.role)  // Check user role here
);
```

---

## Forms & Modals

### Modal Won't Open / Stays Closed

**Symptoms**: Click "Create" button → no modal appears

**Debug**:
1. Open DevTools → Console
2. Look for JavaScript errors
3. Check Network tab for failed API calls
4. Verify modal state in React DevTools

**Common Causes**:
- Modal component not mounted
- `isOpen` state not toggled
- Click handler not firing

**Fix**:
```javascript
// Check that modal has both isOpen and onClose
<CreateProfileModal 
  isOpen={isOpen}           // Must be boolean
  onClose={handleClose}     // Must be function
  onCreate={handleCreate}   // Must be function
/>
```

---

### Form Validation Messages Don't Appear

**Symptoms**: Submit invalid form → no error message, no feedback

**Debug**:
1. Check browser console for errors
2. Verify API response (Network tab → Response)
3. Check form component's error handling

**Fix Example**:
```javascript
// Form should display error state
{validationError && (
  <p className="text-xs text-rose-600">{validationError}</p>
)}
```

---

### Modal Won't Close After Submit

**Symptoms**: Click Save → modal stays open, no success feedback

**Debug**:
1. Check Network tab: Did API request succeed (200)?
2. Look for error message in modal
3. Check `isSubmitting` state in DevTools

**Common Causes**:
- API returned error (check Response in Network)
- `onClose` callback not called
- `isSubmitting` stuck true

**Fix**:
```javascript
// After successful API call, close modal
try {
  await run(payload);
  onClose();  // This must be called
} catch (err) {
  // Error handled by useAsyncAction
}
```

---

## API & Network Issues

### All API Calls Return 401 Unauthorized

**Symptoms**: Any API request returns 401

**Causes**:
- Token expired or invalid
- Backend doesn't recognize token
- Authorization header not sent

**Debug**:
1. DevTools → Network tab
2. Click any API request
3. Check **Request Headers** → `Authorization: Bearer <token>`
4. If missing, token not in localStorage

**Fixes**:
1. Re-login: Clear cookies & log in again
2. Check `VITE_API_BASE_URL` matches backend server
3. Verify token format: Should be `Bearer <long-jwt-string>`

---

### API Returns 403 Forbidden

**Symptoms**: Action results in "Access Denied" or 403 error

**Causes**:
- User role doesn't have permission
- Action requires specific feature flag

**Fix**:
1. Check user role (should be ROLE_ADMIN or ROLE_SUPERADMIN)
2. Verify feature flag is enabled (if applicable)
3. Contact admin to grant permissions

---

### Backend Timeout / Slow Requests

**Symptoms**: 
- Requests take 30+ seconds
- Timeout errors ("request took too long")
- UI hangs while loading data

**Causes**:
- Backend overloaded
- Network latency
- Large dataset processing

**Fixes**:
1. Check backend status/health endpoint
2. Verify network connectivity: `ping api.loyalty.internal`
3. Increase timeout: Contact admin to adjust server settings
4. Reduce data size: Filter results or paginate

**Monitoring**:
```javascript
// DevTools → Network tab → check response times
// Should be < 1 second for normal requests
```

---

## UI & Styling Issues

### Styling Looks Broken (Misaligned, Wrong Colors)

**Symptoms**:
- Buttons too large/small
- Colors look wrong
- Layout is broken

**Causes**:
- Tailwind CSS not built
- CSS cache not cleared
- Browser zoom affecting layout

**Fixes**:
1. Clear browser cache:
   - Windows/Linux: Shift + Ctrl + Delete
   - Mac: Shift + Cmd + Delete
2. Hard refresh: Shift + Ctrl + R (Windows/Linux) or Shift + Cmd + R (Mac)
3. Check Tailwind build: `npm run build` should succeed

---

### Theme Colors Wrong (Brand Color Not Applied)

**Symptoms**: Institution branding not showing, using default colors

**Causes**:
- Theme not initialized on login
- Brand color CSS variable not set

**Debug**:
1. Log in as admin
2. DevTools → Application → Local Storage → Check `user.logoDataUrl` and `user.primaryColor`
3. DevTools → Elements → Find `:root` → Check `--brand` variable

**Fix**:
- Theme is applied in `src/utils/theme.js` after login
- If not working, check `useAuth()` returns correct user object

---

### Dark Mode Not Working

**Symptoms**: App always light theme, no dark mode toggle

**Note**: This app uses light theme only (no dark mode implemented)

**If dark mode needed**:
- Add theme toggle in Sidebar
- Implement dark mode CSS in styles
- Store preference in localStorage
- Check `TESTING.md` for component testing examples

---

## Performance Issues

### App Loads Slowly (Blank Page for 5+ Seconds)

**Symptoms**: Open app → white screen → long wait → content appears

**Debug**:
1. DevTools → Performance tab → Record → Reload → Stop
2. Look for "First Contentful Paint" time (target: < 2 seconds)
3. Check Network tab: Slow API requests?

**Fixes**:
1. Cache API responses (already done via context)
2. Lazy-load routes (need implementation)
3. Minimize bundle size: `npm run build` and check sizes

---

### UI Is Laggy / Slow to Interact

**Symptoms**:
- Typing in inputs shows lag
- Clicking buttons has delay
- Scrolling is janky

**Causes**:
- Excessive re-renders
- Heavy computation
- Too many DOM elements

**Debug**:
1. DevTools → Performance → Record interaction → Check frame rate
2. React DevTools → Profiler → See which components re-render
3. Check browser CPU usage (Windows: Task Manager, Mac: Activity Monitor)

**Fixes**:
- Use React.memo for expensive components
- Move heavy computation to useCallback/useMemo
- Split large lists with pagination (already done)

---

## Browser-Specific Issues

### Works in Chrome, Broken in Safari

**Common Issues**:
- Missing polyfills for older APIs
- CSS flex/grid not fully supported
- localStorage behavior different

**Fixes**:
1. Check browser console for errors
2. Try Chrome DevTools device emulation (toggle to Safari behavior)
3. Clear Safari cache: Develop → Empty Caches

---

### Mobile App Doesn't Work (Responsive Issues)

**Symptoms**: App broken on phone, buttons too small, layout wrong

**Debug**:
1. DevTools → Toggle Device Toolbar (Ctrl + Shift + M)
2. Test at different screen sizes (320px, 768px, 1024px)
3. Check touch targets: Buttons should be ≥ 44x44 pixels

**Note**: This app is optimized for desktop; mobile support is limited.

---

## Development Issues

### Tests Failing After Code Changes

**Symptom**: `npm test` shows failures

**Debug**:
1. Read error message carefully (tells you exactly what failed)
2. Check which test file failed: `npm test -- failing-file.test.js`
3. Run in watch mode: `npm test:watch` to see live updates

**Common Causes**:
- Props changed but test mocks not updated
- State management refactored
- API endpoints changed

**Fix**:
- Update test mocks to match new implementation
- See TESTING.md for test patterns

---

### ESLint / Prettier Complaints

**Symptoms**: `npm run lint` or `npm run format:check` fails

**Fix**:
```bash
# Auto-fix all violations
npm run lint:fix
npm run format

# Or fix manually in editor
```

---

### Build Fails with Module Not Found

**Error**: `Cannot find module './SomeComponent'`

**Causes**:
- File renamed or deleted
- Wrong import path
- Case sensitivity (Mac/Linux are case-sensitive)

**Fix**:
```bash
# Find the correct file
find src -name "*SomeComponent*"

# Update import path
import SomeComponent from '../components/SomeComponent.jsx'
```

---

## Getting Help

**Still stuck?**

1. Check logs:
   - Browser console: F12 → Console tab
   - Network errors: F12 → Network tab
   - Build errors: `npm run build` output

2. Search this guide for your issue

3. Check related docs:
   - [TESTING.md](TESTING.md) - Test patterns
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment issues
   - [README.md](README.md) - Project overview

4. Contact team:
   - Backend issues: Backend team
   - DevOps issues: DevOps team
   - Code/feature issues: Development team

---

**Last Updated**: 2026-07-16  
**Version**: 1.2.3  
**Status**: Active Maintenance
