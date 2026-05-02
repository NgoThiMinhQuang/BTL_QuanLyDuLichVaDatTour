# Codebase Structure

**Analysis Date:** 2026-05-02

## Directory Layout

```text
FE_QuanLyDuLichVaDatTour/
├── index.html                # Vite HTML entry
├── package.json              # Frontend dependencies and scripts
├── package-lock.json         # Locked dependency tree
├── vite.config.js            # Vite dev server and proxy configuration
├── tsconfig.json             # TypeScript compiler settings
├── eslint.config.js          # ESLint configuration
├── README.md                 # Project overview
├── .env.local                # Local environment configuration present; do not read contents
├── src/                      # Application source code
│   ├── app/                  # App bootstrap, provider, and routing
│   ├── components/           # Reusable UI building blocks
│   ├── pages/                # Route-level screens
│   ├── services/             # API clients, query hooks, and data mappers
│   ├── store/                # Zustand client state
│   ├── constants/            # Paths, API base URL, and static values
│   ├── types/                # Shared TypeScript domain types
│   ├── utils/                # Pure helper functions
│   ├── styles/               # Global and shared stylesheet files
│   └── assets/               # Static images and media
└── node_modules/             # Installed dependencies
```

## Directory Purposes

**`src/app`:**
- Purpose: Central application bootstrap and route composition.
- Contains: `src/app/App.tsx`, `src/app/router.tsx`, `src/app/providers/AppProvider.tsx`.
- Key files: `src/app/router.tsx`, `src/app/providers/AppProvider.tsx`.

**`src/components`:**
- Purpose: Reusable UI and layout pieces shared across pages.
- Contains: `Header.tsx`, `Footer.tsx`, `AdminLayout/AdminLayout.tsx`, feature component folders such as `home/`, `tour/`, `booking/`, `review/`, `lich-khoi-hanh/`, `common/`.
- Key files: `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/AdminLayout/AdminLayout.tsx`.

**`src/pages`:**
- Purpose: Route targets and page-specific orchestration.
- Contains: public pages, auth pages, booking pages, favorites/reviews pages, and admin page folders.
- Key files: `src/pages/HomePage.tsx`, `src/pages/BookingPage.tsx`, `src/pages/LoginPage.tsx`, `src/pages/MyBookingsPage.tsx`, `src/pages/MyReviewsPage.tsx`.

**`src/services`:**
- Purpose: Backend integration, React Query hooks, and domain mapping.
- Contains: domain folders for `auth/`, `booking/`, `review/`, `tour/`, `admin/`, `home/`, `lich-khoi-hanh/`, `tin-tuc/`.
- Key files: `src/services/tour/tour.api.ts`, `src/services/tour/tour.hooks.ts`, `src/services/admin/admin.api.ts`, `src/services/admin/admin.hooks.ts`, `src/services/booking/booking.ts`, `src/services/review/review.ts`.

**`src/store`:**
- Purpose: Client-side persisted application state.
- Contains: Zustand stores for auth and favorites.
- Key files: `src/store/authStore.ts`, `src/store/favoriteTourStore.ts`.

**`src/constants`:**
- Purpose: Shared route names, API base URL resolution, and static configuration values.
- Contains: URL paths, API constants, schedule/tour constants.
- Key files: `src/constants/paths.ts`, `src/constants/api.ts`.

**`src/types`:**
- Purpose: Shared domain contracts consumed by pages and services.
- Contains: `tour.ts`, `admin.ts`, `tinTuc.ts`, and auth type definitions.
- Key files: `src/types/tour.ts`, `src/types/admin.ts`.

**`src/utils`:**
- Purpose: Pure formatting and helper functions.
- Contains: date/money formatting and admin helper utilities.
- Key files: `src/utils/formatDate.ts`, `src/utils/formatMoney.ts`, `src/utils/admin.ts`.

**`src/styles`:**
- Purpose: Global styles and shared page layout styling.
- Contains: app shell, auth styles, admin styles.
- Key files: `src/styles/app.css`, `src/styles/auth.css`, `src/styles/admin.css`.

**`src/assets`:**
- Purpose: Static images and media referenced by components and pages.
- Contains: image assets such as `Banner.jpg` and `image.png`.

## Key File Locations

**Entry Points:**
- `src/main.tsx`: Browser entry, mounts React into `#root`.
- `src/app/App.tsx`: Imports global app styles and delegates to router.
- `src/app/router.tsx`: Defines the public and admin route tree.
- `src/app/providers/AppProvider.tsx`: Wraps the app with `QueryClientProvider` and `BrowserRouter`.

**Configuration:**
- `package.json`: Scripts, dependency versions, and package metadata.
- `vite.config.js`: Dev server port and `/gateway` proxy target.
- `tsconfig.json`: TypeScript strict settings and `baseUrl`.
- `eslint.config.js`: Lint rules and project linting setup.
- `.env.local`: Environment override file; treat as configuration only.

**Core Logic:**
- `src/pages/HomePage.tsx`: Home screen composition.
- `src/pages/BookingPage.tsx`: Booking flow and passenger/contact form orchestration.
- `src/components/AdminLayout/AdminLayout.tsx`: Admin shell and navigation.
- `src/services/**`: API access and query hook implementations.
- `src/store/authStore.ts`: Auth session hydration, expiry checks, and persistence.

**Testing:**
- Not detected: no `src/**/*.test.*`, `src/**/*.spec.*`, or dedicated test directory is present.

## Naming Conventions

**Files:**
- Page components use PascalCase file names, for example `src/pages/HomePage.tsx` and `src/pages/BookingPage.tsx`.
- Feature folders group related files by domain, for example `src/pages/AdminTourListPage/AdminTourListPage.tsx` and `src/components/home/BannerTrangChu.tsx`.
- API and hook files use descriptive suffixes such as `.api.ts` and `.hooks.ts`, for example `src/services/admin/admin.api.ts` and `src/services/tour/tour.hooks.ts`.

**Directories:**
- Feature-oriented directories are used instead of broad technical buckets, for example `src/pages/AdminBookingListPage/` and `src/components/lich-khoi-hanh/`.
- Shared infrastructure directories stay shallow, for example `src/app/`, `src/store/`, `src/constants/`, and `src/utils/`.

## Where to Add New Code

**New Feature:**
- Primary code: `src/pages/<FeaturePage>.tsx` for the route screen, supported by `src/components/<feature>/` if reusable UI is needed.
- Tests: Co-locate under the feature path when tests are added, for example `src/pages/<FeaturePage>.test.tsx` or `src/components/<feature>/<Component>.test.tsx`.

**New Component/Module:**
- Implementation: `src/components/<domain>/` for reusable UI, or `src/services/<domain>/` for API/query logic.

**Utilities:**
- Shared helpers: `src/utils/` for pure functions and formatting helpers.

**State:**
- Client-persisted state: `src/store/`.
- Global route/auth/session behavior: `src/store/authStore.ts` and `src/app/router.tsx`.

## Special Directories

**`node_modules`:**
- Purpose: Installed third-party packages.
- Generated: Yes
- Committed: No

**`src/assets`:**
- Purpose: Static media assets used by the UI.
- Generated: No
- Committed: Yes

**`src/styles`:**
- Purpose: App-wide CSS and shared theme styles.
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-05-02*