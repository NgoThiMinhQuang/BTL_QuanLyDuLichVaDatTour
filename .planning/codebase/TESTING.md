# Testing Patterns

**Analysis Date:** 2026-05-02

## Test Framework

**Runner:**
- Not detected in the current project root.
- No `vitest.config.*`, `jest.config.*`, or similar test runner config is present at `D:\BTL_QuanLyDuLichVaDatTour\FE_QuanLyDuLichVaDatTour`.

**Assertion Library:**
- Not detected.

**Run Commands:**
```bash
npm run lint            # Lint the codebase with ESLint
npm run build           # Type-check and build with Vite
npm run dev             # Start the Vite dev server
```

## Test File Organization

**Location:**
- No test file convention is established.
- `src/` currently contains no `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx` files in the application code.

**Naming:**
- Not detected.

**Structure:**
- Not applicable until a test runner is added.

## Test Structure

**Suite Organization:**
```typescript
// Not detected in the current codebase.
```

**Patterns:**
- Feature logic is currently validated through manual UI flows and runtime error handling instead of automated suites.
- React Query usage in `src/pages/MyBookingsPage.tsx`, `src/pages/MyReviewsPage.tsx`, and `src/services/tour/tour.hooks.ts` suggests future tests should focus on query states: loading, error, success, and empty data.

## Mocking

**Framework:**
- Not detected.

**Patterns:**
```typescript
// Not detected in the current codebase.
```

**What to Mock:**
- When tests are introduced, mock network boundaries in `src/services/booking/booking.ts`, `src/services/review/review.ts`, `src/services/tour/tour.api.ts`, and `src/services/auth/me.ts`.
- Mock browser storage access in `src/store/authStore.ts` and `src/store/favoriteTourStore.ts`.
- Mock router state for route guards in `src/app/router.tsx`.

**What NOT to Mock:**
- Keep pure helpers such as `formatDate` in `src/utils/formatDate.ts` and `formatMoney` in `src/utils/formatMoney.ts` as real implementations.
- Avoid mocking presentation components in `src/components/` unless they are direct external boundaries.

## Fixtures and Factories

**Test Data:**
```typescript
// Not detected in the current codebase.
```

**Location:**
- Not detected.

## Coverage

**Requirements:**
- No coverage threshold is enforced in the current repository.

**View Coverage:**
```bash
# Not available until a test runner is added.
```

## Test Types

**Unit Tests:**
- Best fit for pure helpers, mapping functions, and store logic.
- Good targets include `src/utils/formatDate.ts`, `src/services/tour/tour.api.ts` mapping helpers, and `src/store/favoriteTourStore.ts`.

**Integration Tests:**
- Best fit for request wrappers and page/query composition once a runner is added.
- Good targets include `src/services/booking/booking.ts`, `src/services/review/review.ts`, and page flows in `src/pages/MyBookingsPage.tsx` and `src/pages/MyReviewsPage.tsx`.

**E2E Tests:**
- Not used in the current repository.

## Common Patterns

**Async Testing:**
```typescript
// Not detected in the current codebase.
```

**Error Testing:**
```typescript
// Not detected in the current codebase.
```

## Current Quality Signals for Future Tests

**Reliable boundaries to test first:**
- Auth hydration and expiry handling in `src/store/authStore.ts`.
- Booking and review request flows in `src/services/booking/booking.ts` and `src/services/review/review.ts`.
- Route protection logic in `src/app/router.tsx`.
- List rendering and empty/error branches in `src/pages/MyBookingsPage.tsx` and `src/pages/MyReviewsPage.tsx`.

**Recommended test style when added:**
- Prefer co-located tests beside the implementation file, for example `src/utils/formatDate.test.ts` and `src/services/booking/booking.test.ts`.
- Use behavior-focused assertions over implementation details.
- Keep fixtures small and realistic, matching the API shapes used in `src/services/*`.

---

*Testing analysis: 2026-05-02*