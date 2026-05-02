# Coding Conventions

**Analysis Date:** 2026-05-02

## Naming Patterns

**Files:**
- React pages use `PascalCase.tsx` in `src/pages/`, for example `src/pages/MyBookingsPage.tsx`, `src/pages/MyReviewsPage.tsx`, and `src/pages/AdminDashboardPage/AdminDashboardPage.tsx`.
- Component files use `PascalCase.tsx` in `src/components/`, for example `src/components/review/ReviewForm.tsx`, `src/components/booking/BookingListItem.tsx`, and `src/components/Header.tsx`.
- Service modules use feature-based names in `src/services/`, often lowercase with dots or feature folders, such as `src/services/booking/booking.ts`, `src/services/review/review.ts`, and `src/services/tour/tour.api.ts`.
- Shared utilities and constants live in `src/utils/` and `src/constants/`, for example `src/utils/formatDate.ts`, `src/utils/formatMoney.ts`, and `src/constants/paths.ts`.

**Functions:**
- Use `camelCase` for functions and hooks, including query hooks such as `useTourNoiBat` in `src/services/tour/tour.hooks.ts` and utility functions such as `formatDate` in `src/utils/formatDate.ts`.
- Use verb-first names for async operations: `layDanhSachBookingCuaToi`, `layDanhGiaCuaToi`, `taoBooking`, `taoDanhGia` in `src/services/booking/booking.ts` and `src/services/review/review.ts`.
- Prefix React hooks with `use`, including feature hooks like `useAuthStore`, `useFavoriteTourStore`, `useTourSearch`, and `useSearchParams` usage in pages such as `src/pages/MyReviewsPage.tsx`.

**Variables:**
- Local state and derived values use `camelCase`, for example `isHydrated`, `isHydrating`, `accessToken`, `bookingId`, and `hasBookingId` in `src/store/authStore.ts` and `src/pages/MyReviewsPage.tsx`.
- Boolean flags use `is...`, `has...`, `can...`, or `da...` conventions, as seen in `src/store/authStore.ts`, `src/pages/MyReviewsPage.tsx`, and `src/services/booking/booking.ts`.

**Types:**
- TypeScript interfaces are used for API contracts and props, for example `BookingResponse`, `BookingListItem`, `ReviewFormProps`, and `SearchTourParams` in `src/services/booking/booking.ts`, `src/components/review/ReviewForm.tsx`, and `src/types/tour`.
- Domain types are kept in shared type files and imported into services/components rather than duplicated locally, as seen in `src/services/booking/booking.ts` and `src/services/tour/tour.api.ts`.

## Code Style

**Formatting:**
- The project relies on Prettier-style formatting conventions even though no project-level `.prettierrc` is present.
- JSX uses multiline props for larger components and keeps short expressions inline where readable, as in `src/components/review/ReviewForm.tsx` and `src/pages/MyReviewsPage.tsx`.
- The codebase uses single quotes, trailing commas in multiline structures, and consistent indentation aligned with the existing TypeScript/React style in `src/app/router.tsx` and `src/services/booking/booking.ts`.

**Linting:**
- ESLint is configured in `eslint.config.js` with `@eslint/js`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.
- `no-unused-vars` is enforced as an error with `varsIgnorePattern: '^[A-Z_]'`, which allows unused uppercase constants and imported identifiers intended for JSX or framework use.
- Browser globals are enabled through `globals.browser`, and JSX parsing is enabled in `eslint.config.js`.
- TypeScript compiler strictness is enabled in `tsconfig.json` (`strict: true`, `noEmit: true`, `isolatedModules: true`), so prefer explicit, narrow types when state or API payloads cross module boundaries.

## Import Organization

**Order:**
1. Side-effect and stylesheet imports.
2. External packages such as `react`, `react-router`, `antd`, `@tanstack/react-query`, and `@ant-design/icons`.
3. Absolute/relative internal imports from `src/`.
4. Type-only imports where appropriate, usually placed with related internal imports.

**Path Aliases:**
- No TypeScript path aliases are configured in `tsconfig.json`; imports are relative across the codebase.
- Use explicit relative paths such as `../services/booking/booking` or `../../utils/formatDate`.

## Error Handling

**Patterns:**
- Data-fetching modules convert failed requests into user-facing `Error` messages instead of returning sentinel values, as shown in `src/services/booking/booking.ts`, `src/services/review/review.ts`, and `src/services/tour/tour.api.ts`.
- Service helpers usually parse the JSON body with `response.json().catch(() => null)` and then throw `new Error(...)` using either a server message or a fallback string.
- Session-expiry logic is centralized in `src/store/authStore.ts` with `SESSION_EXPIRED_MESSAGE`; API helpers reuse that message when a 401 is detected in `src/services/booking/booking.ts` and `src/services/review/review.ts`.
- UI components handle errors locally with Ant Design `Alert` components and `refetch()` retry actions, as seen in `src/pages/MyBookingsPage.tsx`.

## Logging

**Framework:**
- No dedicated logging framework is detected.
- The codebase favors throwing errors and rendering UI error states instead of logging to console in feature code.

**Patterns:**
- Do not add console logging for routine request failures unless debugging a specific issue; prefer typed errors and visible alerts in pages such as `src/pages/MyBookingsPage.tsx`.
- If diagnostic output is needed temporarily, keep it out of committed code paths.

## Comments

**When to Comment:**
- Prefer self-documenting names over inline comments.
- Add comments only when a transformation, guard, or mapping is non-obvious, such as the payment method normalization in `src/services/booking/booking.ts`.

**JSDoc/TSDoc:**
- No JSDoc/TSDoc convention is established in the current codebase.
- Use inline TypeScript interfaces and descriptive function names instead of comment-heavy documentation.

## Function Design

**Size:**
- Keep functions small and focused on a single data transformation, request, or UI concern.
- Split API mapping logic out of request functions when the data shape is complex, as seen in `src/services/tour/tour.api.ts` with `mapTour` and `mapDestination`.

**Parameters:**
- Prefer object parameters for multi-field payloads and props, for example `ReviewFormProps`, `CreateBookingPayload`, and `CreateReviewPayload`.
- Use optional properties for fields that may be omitted, and normalize them before sending requests, as in `src/services/booking/booking.ts`.

**Return Values:**
- Return typed domain objects from service functions instead of raw API payloads where mapping is needed.
- Return React elements directly from components and guard loading/error branches with early conditional blocks, as in `src/pages/MyReviewsPage.tsx` and `src/pages/MyBookingsPage.tsx`.

## Module Design

**Exports:**
- Default export page components in `src/pages/` when the file represents a route entry, for example `src/pages/HomePage.tsx`, `src/pages/MyBookingsPage.tsx`, and `src/pages/MyReviewsPage.tsx`.
- Use named exports for reusable components and helpers, such as `ReviewForm` in `src/components/review/ReviewForm.tsx` and `BookingListItemCard` in `src/components/booking/BookingListItem.tsx`.
- Keep service modules focused and export only the operations that the rest of the app needs.

**Barrel Files:**
- No barrel-file pattern is detected in the current codebase.
- Import directly from the defining module to keep dependencies explicit.

## UI Composition

**Pages:**
- Route-level components live in `src/pages/` and compose cards, lists, and forms from feature components and services.
- Pages are responsible for page-level query orchestration, state guards, and empty/error handling, as in `src/pages/MyBookingsPage.tsx` and `src/pages/MyReviewsPage.tsx`.

**Feature Components:**
- Feature components are organized by domain folder under `src/components/`, such as `booking`, `review`, `tour`, `home`, and `lich-khoi-hanh`.
- Keep feature components presentational where possible and pass data in through props.

## State and Data Access

**Client State:**
- Use Zustand stores for cross-page session and favorites state in `src/store/authStore.ts` and `src/store/favoriteTourStore.ts`.
- Keep browser-storage access inside the store module instead of scattering `localStorage`/`sessionStorage` calls through components.

**Server State:**
- Use React Query for fetching and refetching server data in pages and hooks, as shown in `src/pages/MyBookingsPage.tsx`, `src/pages/MyReviewsPage.tsx`, and `src/services/tour/tour.hooks.ts`.
- Query keys should be stable and descriptive, typically array-based and feature-scoped.

---

*Convention analysis: 2026-05-02*