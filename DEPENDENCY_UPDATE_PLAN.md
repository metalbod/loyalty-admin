# Dependency Update Plan

**Created**: 2026-07-16  
**Status**: Not yet executed (Phase 1 work)  
**Estimated Effort**: 4 hours (test after each category)

## Current vs Latest Versions

| Package | Current | Latest | Gap | Priority | Notes |
|---------|---------|--------|-----|----------|-------|
| **Babel** |
| @babel/preset-env | 7.29.7 | 8.0.2 | +0.7 major | HIGH | Major version, breaking changes possible |
| @babel/preset-react | 7.29.7 | 8.0.1 | +0.7 major | HIGH | Ships with preset-env |
| **Jest & Testing** |
| jest | 29.7.0 | 30.4.2 | +1.0 major | HIGH | Major version, new matchers |
| babel-jest | 29.7.0 | 30.4.1 | +1.0 major | HIGH | Matches jest version |
| jest-environment-jsdom | 29.7.0 | 30.4.1 | +1.0 major | HIGH | Matches jest version |
| @testing-library/react | 14.3.1 | 16.3.2 | +1.0 major | MEDIUM | Major version bump |
| **React & Router** |
| react | 18.3.1 | 19.2.7 | +1.0 major | MEDIUM | Major version, potential breaking |
| react-dom | 18.3.1 | 19.2.7 | +1.0 major | MEDIUM | Matches react version |
| react-router-dom | 6.30.4 | 7.18.1 | +0.8 major | MEDIUM | Breaking changes in v7 |
| **Build & CSS** |
| vite | 5.4.21 | 8.1.4 | +2.6 major | HIGH | 30-50% faster builds claimed |
| @vitejs/plugin-react | 4.7.0 | 6.0.3 | +1.0 major | HIGH | Matches vite changes |
| tailwindcss | 3.4.19 | 4.3.2 | +0.9 major | MEDIUM | CSS framework update |
| autoprefixer | 10.5.2 | 10.5.3 | +0.0 patch | LOW | Patch version |
| postcss | 8.5.16 | 8.5.19 | +0.0 patch | LOW | Patch version |
| **UI Library** |
| lucide-react | 0.446.0 | 1.24.0 | +0.8 major | LOW | Icon library, backwards compat usually good |
| **Linting** (just installed) |
| eslint | 9.39.5 | 10.7.0 | +1.0 major | LOW | Can wait for next cycle |

## Security Audit

```bash
npm audit
```

**Current Status**: 2 vulnerabilities (1 moderate, 1 high) in transitive dependencies
- Review after each update to track improvement

## Update Strategy

### Phase 1: Category-based Updates (4 hours)

**Why category-based?** Allows testing after each logical group to isolate breakage.

```bash
# Branch: deps/2026-q3-update

# 1. Babel (30 mins)
npm update @babel/preset-env @babel/preset-react --save-dev
npm test                          # Verify transpilation works
npm run lint                      # Check for any linting changes
git commit -m "deps: update Babel to v8"

# 2. Jest (30 mins)
npm update jest babel-jest @testing-library/react @testing-library/jest-dom --save-dev
npm test                          # Verify all tests pass
npm run lint                      # Check for warnings
git commit -m "deps: update Jest to v30, testing libraries"

# 3. React (30 mins)
npm update react react-dom react-router-dom --save
npm test                          # May have breaking changes, key step
npm run build                     # Verify build succeeds
npm run dev                       # Quick smoke test
git commit -m "deps: update React to v19, Router to v7"

# 4. Vite & Build (30 mins)
npm update vite @vitejs/plugin-react --save-dev
npm run build                     # Verify faster build
npm run dev                       # Check dev server
git commit -m "deps: update Vite to v8"

# 5. CSS & UI (15 mins)
npm update tailwindcss lucide-react autoprefixer postcss --save
npm run build                     # Verify styling works
npm test                          # Ensure no test failures
git commit -m "deps: update Tailwind, lucide-react, postcss"
```

## Testing Checklist

After each update:
- [ ] `npm test` passes (all 463 tests)
- [ ] `npm run lint` shows no new warnings
- [ ] `npm run build` succeeds
- [ ] `npm run dev` starts and loads without errors
- [ ] App loads at http://localhost:5173
- [ ] Manual smoke test: login, navigate to 2-3 views

## Known Breaking Changes

### Babel 8
- ESM-first approach
- Some plugins may need updates
- Usually transparent for our setup

### Jest 30
- New test environment semantics
- New matchers available
- Likely backwards compatible with our tests

### React 19
- **Key change**: React.createElement behavior
- **Our impact**: Using JSX, so minimal
- May see deprecation warnings (use React.forwardRef, etc.)

### React Router 7
- URL behavior changes
- Navigate API updates
- May need code adjustments in routes

### Vite 8
- Rollup 4.x
- Faster builds
- Possible config changes needed

## Rollback Plan

If update breaks tests:
```bash
git reset --hard <previous-commit>
npm ci                            # Reinstall exact versions
npm test                          # Verify rollback works
```

## Post-Update Verification

1. **Coverage Check**
   ```bash
   npm run test:coverage
   ```
   Should maintain ~52% coverage (no regressions)

2. **Security Audit**
   ```bash
   npm audit
   ```
   Should reduce vulnerabilities

3. **Performance Check**
   ```bash
   npm run build
   # Compare build time (Vite 8 should be faster)
   time npm run dev
   ```

## Timeline

- **When**: Phase 1 (Week 1-2 after Phase 0 complete)
- **Who**: Kenneth (4 hours, can be split across 2 sessions)
- **Blocker**: None - backwards compatibility usually good for patch/minor versions
- **Risk Level**: MEDIUM (breaking changes possible, especially React v19 and Router v7)

## Next Steps

1. **Smoke test** each category after update
2. **Commit incrementally** (one per category) for easy bisecting if issues arise
3. **Create PR** with all commits, description explains what changed
4. **Code review** before merging
5. **Deploy** to staging first, then prod after verification

---

**Note**: This plan prioritizes safety over speed. Updates are done incrementally with full test suite runs after each step to catch regressions early.
