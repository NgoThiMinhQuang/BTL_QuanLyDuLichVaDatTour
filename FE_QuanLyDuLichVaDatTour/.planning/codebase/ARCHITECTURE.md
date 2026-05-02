# Architecture

**Analysis Date:** 2026-05-02

## Pattern Overview

**Overall:** Client-side React SPA with route-based feature pages, shared API service modules, React Query for server state, and Zustand for auth/favorites state.

**Key Characteristics:**
- Routing is centralized in `src/app/router.tsx` and split into public client routes and guarded admin routes.
- Server interaction is concentrated in `src/services/**` with thin fetch wrappers and domain-specific mapping functions.
- UI composition is page-first: route pages in `src/pages/**` assemble reusable components from `src/components/**`.

## Layers

**Bootstrap Layer:**
- Purpose: Initialize the React app, global CSS, and root providers.
- Location: `src/main.tsx`, `src/app/App.tsx`, `src/app/providers/AppProvider.tsx`
- Contains: ReactDOM mounting, `BrowserRouter`, `QueryClientProvider`, app shell setup.
- Depends on: `react`, `react-dom`, `react-router`, `@tanstack/react-query`.
- Used by: Every route and page component.

**Routing & Shell Layer:**
- Purpose: Define navigation, layout boundaries, and access control.
- Location: `src/app/router.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/AdminLayout/AdminLayout.tsx`
- Contains: Route definitions, auth guards, admin layout, page composition.
- Depends on: `src/constants/paths.ts`, `src/store/authStore.ts`.
- Used by: Public pages and admin pages.

**Feature UI Layer:**
- Purpose: Render feature screens and local interaction state.
- Location: `src/pages/**`, `src/components/**`
- Contains: Home, tour, booking, news, auth, favorites, reviews, and admin screens.
- Depends on: Services, constants, stores, utilities, Ant Design.
- Used by: Route layer only.

**Data Access Layer:**
- Purpose: Fetch, normalize, and submit domain data.
- Location: `src/services/**`
- Contains: API modules, React Query hooks, mapping helpers, request builders.
- Depends on: `src/constants/api.ts`, `src/store/authStore.ts`, `fetch`.
- Used by: Pages and components through hooks.

**State Layer:**
- Purpose: Persist client session state and local favorites across reloads.
- Location: `src/store/authStore.ts`, `src/store/favoriteTourStore.ts`
- Contains: Zustand stores, localStorage/sessionStorage hydration, token expiry handling.
- Depends on: `src/services/auth/me.ts`.
- Used by: Router guards, booking/review flows, admin layout.

## Data Flow

**Route-to-Data Flow:**
1. `src/main.tsx` mounts the app inside `src/app/providers/AppProvider.tsx`.
2. `src/app/router.tsx` decides which layout and page to render from `src/constants/paths.ts`.
3. Pages call React Query hooks from `src/services/**`.
4. Service modules call backend endpoints through `fetch` using `API_BASE_URL` from `src/constants/api.ts`.
5. Responses are normalized into app-specific types in `src/types/**` before returning to UI.

**Auth Hydration Flow:**
1. `src/app/router.tsx` triggers `hydrateAuth()` from `src/store/authStore.ts` on mount.
2. The store reads `localStorage` and `sessionStorage` under `travelviet.auth`.
3. If a session exists, `src/services/auth/me.ts` validates the token with `/auth/me`.
4. Authenticated state populates guarded routes and `src/components/AdminLayout/AdminLayout.tsx`.

**Booking Flow:**
1. `src/pages/BookingPage.tsx` reads `tourId` and `departureId` from the URL.
2. `src/services/booking/booking.ts` fetches tour details, departure data, and pricing.
3. The page builds local contact/passenger drafts and submits a `CreateBookingPayload`.
4. The booking request uses the current access token from `src/store/authStore.ts`.

**Review Flow:**
1. `src/pages/MyReviewsPage.tsx` and `src/components/review/ReviewForm.tsx` use `src/services/review/review.ts`.
2. Review submission uses the auth store token and refreshes local UI state on success.

**State Management:**
- Server state is managed with `@tanstack/react-query` in `src/services/**` hooks.
- Global session and favorites state are managed with Zustand in `src/store/**`.
- Component-local form, step, and filter state stays inside individual pages/components.

## Key Abstractions

**Route Guards:**
- Purpose: Protect authenticated pages and admin-only routes.
- Examples: `src/app/router.tsx` (`RequireAuth`, `RequireAdmin`)
- Pattern: Guard components read `src/store/authStore.ts` and return `Navigate` or loading placeholders.

**API Modules:**
- Purpose: Encapsulate endpoint paths, payload mapping, and response normalization.
- Examples: `src/services/tour/tour.api.ts`, `src/services/booking/booking.ts`, `src/services/admin/admin.api.ts`
- Pattern: Keep raw backend shapes private and map them into app types before returning.

**React Query Hooks:**
- Purpose: Bind data fetching/mutations to feature components.
- Examples: `src/services/tour/tour.hooks.ts`, `src/services/admin/admin.hooks.ts`, `src/services/home/useLichKhoiHanhGan.ts`
- Pattern: Derive query keys from domain and invalidate related keys after mutations.

**Client Stores:**
- Purpose: Persist cross-page client state.
- Examples: `src/store/authStore.ts`, `src/store/favoriteTourStore.ts`
- Pattern: Store serialized values in Web Storage and hydrate before route rendering.

## Entry Points

**Application Entry:**
- Location: `src/main.tsx`
- Triggers: Vite bootstraps the React DOM entry.
- Responsibilities: Import global styles, create the root, wrap the tree in providers.

**App Root:**
- Location: `src/app/App.tsx`
- Triggers: Rendered directly from `src/main.tsx`.
- Responsibilities: Import app-level styles and hand off to the router.

**Router Root:**
- Location: `src/app/router.tsx`
- Triggers: Rendered inside `BrowserRouter` from `src/app/providers/AppProvider.tsx`.
- Responsibilities: Define public routes, auth routes, and `/admin` nested routes.

**Admin Shell:**
- Location: `src/components/AdminLayout/AdminLayout.tsx`
- Triggers: Rendered by the admin route tree.
- Responsibilities: Provide sidebar, breadcrumb, account actions, and `<Outlet />` for admin pages.

## Error Handling

**Strategy:** Fail fast on invalid route/session state, show page-level alerts or skeletons, and surface backend messages where possible.

**Patterns:**
- Guard routes redirect unauthorized users to `PATHS.login` or `PATHS.home` in `src/app/router.tsx`.
- API modules throw `Error` with backend message fallback in `src/services/**`.
- Session expiry is centralized in `src/store/authStore.ts` and reused by booking, review, and admin calls.

## Cross-Cutting Concerns

**Logging:** Not detected; the app relies on UI feedback and thrown errors rather than a dedicated logging framework.
**Validation:** Form validation is handled in Ant Design forms inside pages such as `src/pages/BookingPage.tsx` and `src/pages/LoginPage.tsx`.
**Authentication:** JWT/session handling is centralized in `src/store/authStore.ts`, with protected API calls in `src/services/booking/booking.ts`, `src/services/review/review.ts`, and `src/services/admin/admin.api.ts`.

---

*Architecture analysis: 2026-05-02*