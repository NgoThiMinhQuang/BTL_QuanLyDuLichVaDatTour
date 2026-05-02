# External Integrations

**Analysis Date:** 2026-05-02

## APIs & External Services

**Backend REST API:**
- Tourism backend API - provides authentication, tours, bookings, payments, reviews, admin CRUD, and news data
  - SDK/Client: native `fetch` calls in `src/services/**`
  - Auth: bearer token from `src/store/authStore.ts`
  - Base URL: `API_BASE_URL` from `src/constants/api.ts` (`/gateway` fallback or `VITE_API_BASE_URL`)

**Public data source:**
- Vietnam provinces API - used on the booking form for location selection
  - SDK/Client: native `fetch` in `src/pages/BookingPage.tsx`
  - Auth: none
  - Endpoint: `https://provinces.open-api.vn/api/?depth=2`

## Data Storage

**Databases:**
- Primary backend database - not configured in this front-end repository, but heavily assumed by API endpoints such as `src/services/admin/admin.api.ts`, `src/services/booking/booking.ts`, and `src/services/review/review.ts`.
  - Connection: through backend API only; no direct DB client in this repo
  - Client: not applicable on the front end

**File Storage:**
- Backend-managed asset storage - image URLs are resolved through `src/constants/api.ts` and `resolveApiAssetUrl()`.
  - Client-side handling: `VITE_ASSET_BASE_URL` or direct `/images/...` paths
  - Front-end usage: `src/services/tour/layTourChiTiet.ts`, `src/services/tour/tour.api.ts`, `src/services/tin-tuc/layTatCaTinTuc.ts`
- Local filesystem only for static assets in `public/` and built output in `dist/`.

**Caching:**
- Client-side query cache via TanStack Query in `src/app/providers/AppProvider.tsx` and `src/services/**/hooks` files.
- Browser storage caching for user preferences and session state in `src/store/authStore.ts` and `src/store/favoriteTourStore.ts`.

## Authentication & Identity

**Auth Provider:**
- Custom backend authentication - login/register/password reset flows in `src/services/auth/login.ts`, `src/services/auth/register.ts`, `src/services/auth/forgotPassword.ts`, `src/services/auth/resetPassword.ts`, and `src/services/auth/me.ts`.
  - Implementation: bearer token session stored in `localStorage` or `sessionStorage` by `src/store/authStore.ts`
  - Session validation: JWT expiry decoding in `src/store/authStore.ts`
  - Protected routes: `RequireAuth` and `RequireAdmin` in `src/app/router.tsx`
  - Role checks: admin access gated by `currentUser?.vaiTro?.toLowerCase() === 'admin'`

## Monitoring & Observability

**Error Tracking:**
- None detected - no Sentry, LogRocket, or similar client-side monitoring library is present.

**Logs:**
- No structured client logging detected; error handling is done through thrown `Error` objects and UI alerts/messages.

## CI/CD & Deployment

**Hosting:**
- Not explicitly declared in repository config.
- Vite production build is the primary deployment artifact (`npm run build`).

**CI Pipeline:**
- None detected in the repository root.

## Environment Configuration

**Required env vars:**
- `VITE_API_BASE_URL` - overrides the backend base URL in `src/constants/api.ts`.
- `VITE_ASSET_BASE_URL` - prefixes asset URLs in `src/constants/api.ts`.
- `VITE_API_TARGET` - dev server proxy target in `vite.config.js`.

**Secrets location:**
- `.env.local` is present in `FE_QuanLyDuLichVaDatTour/`; contents are not read here.
- Session tokens and auth payloads are persisted client-side in browser storage by `src/store/authStore.ts`.

## Webhooks & Callbacks

**Incoming:**
- None detected in the front-end repository.

**Outgoing:**
- REST calls to backend endpoints under `/auth`, `/tour`, `/loai-tour`, `/dia-diem`, `/lich-khoi-hanh`, `/lich-trinh`, `/booking`, `/payment`, `/review`, `/tin-tuc`, and `/admin`.
- Dev-only proxy traffic to `/gateway` configured in `vite.config.js`.

---

*Integration audit: 2026-05-02*