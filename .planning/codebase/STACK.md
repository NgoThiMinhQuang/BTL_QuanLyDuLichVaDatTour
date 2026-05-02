# Technology Stack

**Analysis Date:** 2026-05-02

## Languages

**Primary:**
- TypeScript 5.9.3 - All application source in `src/` uses TypeScript (`src/app/App.tsx`, `src/services/**`, `src/pages/**`).
- TSX / JSX - React UI components in `src/components/**` and `src/pages/**`.

**Secondary:**
- JavaScript - Tooling/config files such as `vite.config.js` and `eslint.config.js`.
- CSS - Global and feature styles in `src/index.css`, `src/styles/**`, `src/pages/**.css`, `src/components/**.css`.

## Runtime

**Environment:**
- Node.js runtime - required for Vite dev/build scripts; exact version is not pinned in the repository.

**Package Manager:**
- npm - `package-lock.json` is present.
- Lockfile: present

## Frameworks

**Core:**
- React 19.2.4 - UI framework used throughout `src/app/App.tsx`, `src/main.tsx`, and feature pages/components.
- Vite 8.0.0 - build tool and dev server configured in `vite.config.js`.
- React Router 7.13.1 - routing and navigation in `src/app/router.tsx`, `src/app/providers/AppProvider.tsx`, `src/components/Header.tsx`.

**Testing:**
- Not detected - no Jest/Vitest test runner config is present in the repository root.

**Build/Dev:**
- ESLint 9.39.4 - configured in `eslint.config.js` and exposed through `npm run lint`.
- TanStack Query 5.91.0 - data fetching/cache layer used in `src/app/providers/AppProvider.tsx`, `src/services/**` hooks, and page hooks.
- Zustand 5.0.12 - client state stores in `src/store/authStore.ts` and `src/store/favoriteTourStore.ts`.
- Ant Design 6.3.3 - UI component library used across the application.

## Key Dependencies

**Critical:**
- `react`, `react-dom` - render the SPA.
- `react-router` - drives public routes, admin routes, and auth redirects in `src/app/router.tsx`.
- `@tanstack/react-query` - wraps API calls and invalidation patterns in `src/services/admin/admin.hooks.ts`, `src/services/tour/tour.hooks.ts`.
- `zustand` - persists auth and favorites across browser storage.

**Infrastructure:**
- `antd` - forms, tables, layouts, dialogs, alerts, and pagination.
- `@vitejs/plugin-react` - React transform inside `vite.config.js`.
- `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals` - linting stack from `eslint.config.js`.
- `typescript` - type-checking with `tsconfig.json` set to strict mode.

## Configuration

**Environment:**
- Runtime configuration is read from `import.meta.env` in `src/constants/api.ts` and `vite.config.js`.
- `src/constants/api.ts` reads `VITE_API_BASE_URL` and `VITE_ASSET_BASE_URL`.
- `vite.config.js` reads `VITE_API_TARGET` for the dev proxy target.
- `.env.local` is present in the project root and is used for local environment configuration.

**Build:**
- `vite.config.js` - dev server port/proxy configuration.
- `tsconfig.json` - TypeScript compiler options (`strict: true`, `noEmit: true`, `moduleResolution: "Bundler"`).
- `eslint.config.js` - flat ESLint config with browser globals and React hook/refresh rules.
- `scripts/ensure-port.mjs` - pre-dev script used by `npm run dev` to reserve port 5173.

## Platform Requirements

**Development:**
- Node.js with npm.
- A browser environment for React Router, TanStack Query, and browser storage APIs (`localStorage`, `sessionStorage`).
- Backend API reachable through `/gateway` or `VITE_API_BASE_URL`.

**Production:**
- SPA build output from Vite (`dist/`).
- Deployment target is not explicitly declared in repository config; application behaves as a browser-hosted front end.

---

*Stack analysis: 2026-05-02*