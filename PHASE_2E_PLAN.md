# Phase 2E: Component Expansion & Integration Testing

**Status:** In Progress  
**Branch:** `phase-2e/component-expansion`  
**Start Date:** 2026-07-16  
**Target Coverage:** 60% (from 39.47%)

---

## Phase 2E Strategy

### **High-Level Goals**
1. **Expand component test coverage** from 39.47% to 60%+
2. **Build integration tests** for critical user flows
3. **Optimize performance** through code splitting & lazy loading
4. **Add type safety** with JSDoc annotations
5. **Complete context testing** for all application state

---

## Coverage Gap Analysis

### **Zero Coverage Components** (Priority: CRITICAL)

These 5 component groups have 0% coverage and are blocking overall metrics:

#### 1. **Authentication Components** (0% - 2 files)
- `src/components/auth/ProtectedRoute.jsx` - Route guard
- `src/components/auth/SuperAdminRoute.jsx` - Role-based routing
- **Impact:** Route protection not tested
- **Effort:** Low (simple HOCs)
- **Test Plan:** Mock React Router, verify role checking

#### 2. **Campaign Components** (0% - 3 files)
- `src/components/campaigns/CampaignCard.jsx` - Card display
- `src/components/campaigns/CampaignForm.jsx` - Form for creation/edit
- `src/components/campaigns/CampaignList.jsx` - List container
- **Impact:** Campaign feature blind spot
- **Effort:** Medium (forms, state)
- **Test Plan:** Mock useCampaignContext, test form interactions

#### 3. **Exchange Components** (0% - 5 files)
- `src/components/exchange/CreateExchangeProviderModal.jsx`
- `src/components/exchange/EditExchangeProviderModal.jsx`
- `src/components/exchange/ExchangeProviderCard.jsx`
- `src/components/exchange/ExchangeProviderGrid.jsx`
- `src/components/exchange/ExchangeRequestsTable.jsx`
- **Impact:** Points exchange feature untested
- **Effort:** Medium (modals, tables)
- **Test Plan:** Mock useExchangeContext, test CRUD operations

#### 4. **Gift Components** (0% - 2 files)
- `src/components/gifts/GiftForm.jsx` - Form for gift creation
- `src/components/gifts/GiftRulesPanel.jsx` - Rules management
- **Impact:** Gift management feature untested
- **Effort:** High (complex rules logic)
- **Test Plan:** Mock context, test form & rule interactions

#### 5. **Institution Components** (0% - 6 files)
- `src/components/institutions/CreateInstitutionModal.jsx`
- `src/components/institutions/EditBrandingModal.jsx`
- `src/components/institutions/EditInstitutionModal.jsx`
- `src/components/institutions/FeatureFlagsModal.jsx`
- `src/components/institutions/InstitutionCard.jsx`
- `src/components/institutions/InstitutionGrid.jsx`
- **Impact:** Institution management not tested
- **Effort:** Medium-High (6 modals, form validation)
- **Test Plan:** Mock API & context, test modal flows

#### 6. **Ledger Components** (0% - 4 files)
- `src/components/ledger/ApiUsageCard.jsx`
- `src/components/ledger/LedgerTable.jsx`
- `src/components/ledger/MetricsGrid.jsx`
- `src/components/ledger/ValuePreview.jsx`
- **Impact:** Transaction display untested
- **Effort:** Low (mostly display)
- **Test Plan:** Mock data, verify rendering

#### 7. **API Client** (0% - core file!)
- `src/api/client.js` - All API endpoints
- **Impact:** No API call coverage
- **Effort:** High (many endpoints)
- **Test Plan:** Mock fetch, test error handling

---

### **Low Coverage Contexts** (Priority: HIGH)

#### Context Coverage Summary
| Context | Current | Target | Gap |
|---------|---------|--------|-----|
| AdminContext | 0% | 100% | 100% |
| AuthContext | 50% | 100% | 50% |
| CampaignContext | 52% | 100% | 48% |
| ExchangeContext | 43% | 100% | 57% |
| PartnerContext | 45% | 100% | 55% |
| ProfileContext | 44% | 100% | 56% |

**Common Issue:** Context providers not tested, only hooks
**Solution:** Create context integration tests

---

### **Partial Coverage Views** (Priority: MEDIUM)

| View | Current | Target | Type |
|------|---------|--------|------|
| GiftManagerView | 46% | 80% | Async ops |
| GlobalSettingsView | 63% | 85% | Form interactions |
| InstitutionManagerView | 45% | 85% | CRUD flows |
| PointsExchangeView | 80% | 95% | Modal interactions |
| WalletDetailView | 78% | 90% | Nested components |

**Common Issue:** Async operations, error cases, form interactions not covered
**Solution:** Add waitFor tests, error scenarios

---

## Phase 2E Sprint Plan

### **Sprint 1: Auth & Ledger Components** (Week 1)
**Objective:** Quick wins on simple components (10 files, low-medium effort)

#### Priority Order:
1. **ProtectedRoute & SuperAdminRoute** (2 files)
   - Effort: LOW
   - Tests: 8 tests (mocks, role verification)
   - Expected result: 100% coverage

2. **Ledger Components** (4 files: ApiUsageCard, LedgerTable, MetricsGrid, ValuePreview)
   - Effort: LOW
   - Tests: 12 tests (rendering, data display)
   - Expected result: 100% coverage

3. **Campaign Components** (3 files: CampaignCard, CampaignList, CampaignForm)
   - Effort: MEDIUM
   - Tests: 20 tests (rendering, form, context)
   - Expected result: 100% coverage

**Target Metrics After Sprint 1:**
- +25 new test files created
- +40 tests added
- Coverage increase: 39.47% → ~45%

---

### **Sprint 2: Exchange & Gift Components** (Week 2)
**Objective:** Test complex modal flows (7 files, medium-high effort)

#### Priority Order:
1. **Exchange Components** (5 files: modals, grid, table)
   - Effort: MEDIUM
   - Tests: 30 tests (modals, CRUD, table)
   - Expected result: 100% coverage

2. **Gift Components** (2 files: form, rules panel)
   - Effort: HIGH
   - Tests: 25 tests (form, rules logic, async)
   - Expected result: 100% coverage

**Target Metrics After Sprint 2:**
- +7 new component test files
- +55 tests added
- Coverage increase: ~45% → ~50%

---

### **Sprint 3: Institutions & Contexts** (Week 3)
**Objective:** Complete institution management & context testing (9 files)

#### Priority Order:
1. **Institution Components** (6 files: modals, grid, card)
   - Effort: MEDIUM-HIGH
   - Tests: 40 tests (6 modals, validation, flows)
   - Expected result: 100% coverage

2. **Context Integration Tests** (6 contexts)
   - Effort: MEDIUM
   - Tests: 36 tests (provider rendering, hook behavior, updates)
   - Expected result: 100% coverage for all

**Target Metrics After Sprint 3:**
- +6 institution component test files
- +6 context test files
- +76 tests added
- Coverage increase: ~50% → ~55%

---

### **Sprint 4: API Client & Integration Tests** (Week 4)
**Objective:** Test API layer & critical user flows (multi-file)

#### Priority Order:
1. **API Client Testing** (1 file: client.js)
   - Effort: HIGH
   - Tests: 50 tests (endpoints, error handling, auth)
   - Expected result: 80%+ coverage

2. **Integration Tests** (cross-component flows)
   - Effort: MEDIUM-HIGH
   - Tests: Login → Dashboard → View Data flow
   - Tests: Create Entity → List → Edit → Delete flow
   - Expected result: 3-5 critical paths covered

**Target Metrics After Sprint 4:**
- +1 API test file
- +5 integration test suites
- +50+ integration tests
- Coverage increase: ~55% → ~58%

---

### **Sprint 5: Type Safety & Documentation** (Week 5)
**Objective:** Add JSDoc annotations & improve developer experience

#### Tasks:
1. **Add JSDoc to Components** (11 files)
   - @component, @param, @returns annotations
   - Effort: LOW
   - Impact: IDE autocomplete, type safety

2. **Add JSDoc to Hooks** (7 files)
   - Hook signatures, return types
   - Effort: LOW
   - Impact: Hook contract clarity

3. **API Documentation** (1 file)
   - Endpoint descriptions, params, responses
   - Effort: MEDIUM
   - Impact: API client usability

4. **Testing Guide** (1 file)
   - Component test patterns, best practices
   - Effort: LOW
   - Impact: Phase 3 onboarding

**Target Metrics After Sprint 5:**
- +100+ JSDoc annotations
- +1 API documentation file
- +1 testing guide
- Coverage: ~59% → 60%+

---

## Daily Execution Checklist

### **Before Starting Each Component Test:**
- [ ] Read source file to understand logic
- [ ] Identify hooks/context used
- [ ] List main code paths to test
- [ ] Plan mock strategy

### **While Writing Tests:**
- [ ] Follow Phase 2 mocking pattern
- [ ] Use data-testid for element selection
- [ ] Test rendering, prop passing, hook calls
- [ ] Add loading/error states
- [ ] Use waitFor for async operations

### **After Tests Pass:**
- [ ] Run full test suite (npm test)
- [ ] Check coverage increased
- [ ] Update PHASE_2E_PROGRESS.md
- [ ] Commit with clear message

---

## Coverage Target Breakdown

### **Current State (Phase 2 Complete)**
- Overall: 39.47%
- Zero coverage: 20 files
- Low coverage: 6 contexts + 5 views

### **Sprint 1 Target (45%)**
- Auth routes: 100% (2 files)
- Ledger: 100% (4 files)
- Campaigns: 100% (3 files)

### **Sprint 2 Target (50%)**
- Exchange: 100% (5 files)
- Gifts: 100% (2 files)

### **Sprint 3 Target (55%)**
- Institutions: 100% (6 files)
- Contexts: 100% (6 files)

### **Sprint 4 Target (58%)**
- API Client: 80%+ (1 file)
- Integration: multiple flows tested

### **Sprint 5 Target (60%+)**
- Documentation complete
- Type safety improved
- Testing patterns documented

---

## Risk Mitigation

### **Potential Blockers**
1. **Complex Modal Logic** - Solution: Break into smaller test suites, test one modal at a time
2. **Async Form Submissions** - Solution: Use waitFor, mock useAsyncAction
3. **Context Provider Chains** - Solution: Create minimal test providers
4. **API Error Scenarios** - Solution: Mock fetch with error responses

### **Testing Patterns to Reuse**
- Use `jest.mock()` at module level for dependencies
- Mock hooks with `jest.fn()` returning test data
- Use `container.textContent` for text that's split across elements
- Call `jest.clearAllMocks()` in beforeEach
- Wrap async expectations in `waitFor()`

---

## Success Criteria

**Phase 2E is complete when:**
- ✅ 60%+ overall code coverage
- ✅ Zero coverage components: 20 → 0 files
- ✅ Context coverage: 33% → 100%
- ✅ API client: 0% → 80%+
- ✅ 3-5 integration test scenarios documented
- ✅ All components have JSDoc annotations
- ✅ Testing guide created for Phase 3

---

## Files to Create (Phase 2E)

### **Component Tests** (25 files)
```
src/components/auth/__tests__/
  ProtectedRoute.test.js
  SuperAdminRoute.test.js
src/components/campaigns/__tests__/
  CampaignCard.test.js
  CampaignForm.test.js
  CampaignList.test.js
src/components/exchange/__tests__/
  CreateExchangeProviderModal.test.js
  EditExchangeProviderModal.test.js
  ExchangeProviderCard.test.js
  ExchangeProviderGrid.test.js
  ExchangeRequestsTable.test.js
src/components/gifts/__tests__/
  GiftForm.test.js
  GiftRulesPanel.test.js
src/components/institutions/__tests__/
  CreateInstitutionModal.test.js
  EditBrandingModal.test.js
  EditInstitutionModal.test.js
  FeatureFlagsModal.test.js
  InstitutionCard.test.js
  InstitutionGrid.test.js
src/components/ledger/__tests__/
  ApiUsageCard.test.js
  LedgerTable.test.js
  MetricsGrid.test.js
  ValuePreview.test.js
```

### **Context Tests** (6 files)
```
src/context/__tests__/
  AdminContext.test.js
  AuthContext.test.js (extended)
  CampaignContext.test.js
  ExchangeContext.test.js
  PartnerContext.test.js
  ProfileContext.test.js
```

### **API Tests** (1 file)
```
src/api/__tests__/
  client.test.js (50+ endpoint tests)
```

### **Integration Tests** (5 files)
```
src/__tests__/integration/
  authentication-flow.test.js
  entity-crud-flow.test.js
  data-propagation.test.js
  error-handling.test.js
  state-persistence.test.js
```

### **Documentation Files** (3 files)
```
PHASE_2E_PROGRESS.md (daily progress tracking)
API_CLIENT_GUIDE.md (endpoint reference)
TESTING_PATTERNS_GUIDE.md (component test best practices)
```

---

## Next Immediate Steps

1. **Today:** Create Sprint 1 test files (auth, ledger, campaigns)
2. **This week:** Complete Sprint 1, reach 45% coverage
3. **Ongoing:** Update PHASE_2E_PROGRESS.md daily
4. **Weekly:** Run coverage report, adjust sprint plan if needed

---

## Quick Reference: Test Count Estimates

| Component | Estimated Tests | Priority |
|-----------|-----------------|----------|
| ProtectedRoute | 4 | HIGH |
| SuperAdminRoute | 4 | HIGH |
| CampaignCard | 6 | HIGH |
| CampaignForm | 8 | HIGH |
| CampaignList | 6 | HIGH |
| ApiUsageCard | 4 | HIGH |
| LedgerTable | 5 | HIGH |
| MetricsGrid | 4 | HIGH |
| ValuePreview | 3 | HIGH |
| **Sprint 1 Total** | **44** | |
| | | |
| Exchange Modals | 15 | MEDIUM |
| ExchangeProviderGrid | 8 | MEDIUM |
| ExchangeRequestsTable | 7 | MEDIUM |
| GiftForm | 12 | MEDIUM |
| GiftRulesPanel | 13 | MEDIUM |
| **Sprint 2 Total** | **55** | |
| | | |
| Institution Modals | 25 | MEDIUM |
| InstitutionCard | 8 | MEDIUM |
| InstitutionGrid | 7 | MEDIUM |
| Contexts | 36 | MEDIUM |
| **Sprint 3 Total** | **76** | |
| | | |
| API Client | 50 | HIGH |
| Integration Tests | 50 | HIGH |
| **Sprint 4 Total** | **100** | |
| | | |
| **PHASE 2E TOTAL** | **275+ new tests** | |

---

## Go/No-Go Checklist

Before starting Sprint 1:
- [x] Phase 2 merged to main
- [x] All Phase 2 tests passing
- [x] Coverage report generated
- [x] Phase 2E plan documented
- [x] Sprint 1 priorities identified
- [ ] **Sprint 1 START: Create first component test files**

Let's begin! 🚀
