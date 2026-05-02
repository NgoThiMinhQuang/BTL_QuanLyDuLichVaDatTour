# Codebase Concerns

**Analysis Date:** 2026-05-02

## Tech Debt

**Large eager-loading graphs in booking and review reads:**
- Issue: Read paths pull large object graphs even when callers only need summary fields.
- Files: `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Repositories/BookingRepository.cs`, `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Repositories/ReviewRepository.cs`, `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Services/BookingService.cs`, `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Services/ReviewService.cs`
- Impact: `GetAllAsync`, `GetByIdAsync`, `GetMyBookingsAsync`, and review queries all load `LichKhoiHanh`, `Tour`, `KhachHang`, `Voucher`, `HanhKhachs`, and `DanhGias`, which increases SQL cost and memory usage for common screens.
- Fix approach: Split list/detail projections into lean query DTOs and only include navigation properties that each endpoint actually needs.

**String-based workflow states are spread across services and repositories:**
- Issue: Review status and other workflow values are compared with raw strings in several places.
- Files: `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Repositories/ReviewRepository.cs`, `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Services/ReviewService.cs`, `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Data/AppDbContext.cs`
- Impact: Typos or renamed values can silently break moderation filters and dashboard counts.
- Fix approach: Move review workflow states into a typed enum and map it consistently through the entity and DTO layer.

## Known Bugs

**Concurrent booking requests can oversell a departure:**
- Symptoms: Two customers can pass seat-availability checks at the same time and both create bookings against the same `LichKhoiHanh`.
- Files: `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Services/BookingService.cs`, `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Repositories/BookingRepository.cs`
- Trigger: Parallel `CreateAsync` calls that read the same remaining-seat count before either transaction commits.
- Workaround: None in code.

**Voucher usage count is updated without concurrency protection:**
- Symptoms: `SoLuongDaDung` can drift under simultaneous bookings using the same voucher.
- Files: `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Services/BookingService.cs`, `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Data/AppDbContext.cs`
- Trigger: Multiple bookings resolving the same voucher at once.
- Workaround: None in code.

**Forgot-password flow exposes the reset token in the API response:**
- Symptoms: The reset token and reset link are returned directly from `ForgotPasswordAsync`.
- Files: `BE_QuanLyDuLichVaDatTour/IdentityService/Services/AuthService.cs`
- Trigger: Any client that can call the endpoint receives the live reset secret.
- Workaround: Treat this as development-only behavior; do not expose it in production.

## Security Considerations

**Hardcoded database and JWT settings are committed in application config:**
- Risk: Production secrets and machine-specific connection details are stored in repo-tracked JSON instead of environment variables or secret storage.
- Files: `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/appsettings.json`, `BE_QuanLyDuLichVaDatTour/IdentityService/appsettings.json`
- Current mitigation: None beyond local development defaults.
- Recommendations: Move connection strings and JWT secrets into environment-specific configuration and secret managers, and keep only safe defaults in committed files.

**Password reset token is returned to callers:**
- Risk: A reset token should normally leave the system only through email or another verified channel; returning it from the API makes token disclosure trivial.
- Files: `BE_QuanLyDuLichVaDatTour/IdentityService/Services/AuthService.cs`
- Current mitigation: The message is generic, but the token is still present in the payload.
- Recommendations: Return only a generic success message in production and deliver the reset link through a trusted out-of-band channel.

**JWT and SQL Server secrets are embedded in source-controlled startup config:**
- Risk: Anyone with repo access can authenticate against the configured database and mint or validate tokens if the secret is reused.
- Files: `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/appsettings.json`, `BE_QuanLyDuLichVaDatTour/IdentityService/appsettings.json`, `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Program.cs`, `BE_QuanLyDuLichVaDatTour/IdentityService/Program.cs`
- Current mitigation: Startup validates missing values, but not secret hygiene.
- Recommendations: Rotate secrets and move them out of the repository.

## Performance Bottlenecks

**Admin and customer booking pages depend on expensive repository includes:**
- Problem: `GetAllAsync` and `GetByNguoiDungIdAsync` pull review, passenger, voucher, and departure graphs even when screens only need summary cards.
- Files: `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Repositories/BookingRepository.cs`, `FE_QuanLyDuLichVaDatTour/src/pages/MyBookingsPage.tsx`, `FE_QuanLyDuLichVaDatTour/src/pages/MyReviewsPage.tsx`
- Cause: Repository methods return fully hydrated entities and the UI maps them into list cards.
- Improvement path: Add list-specific query methods that project only the fields needed by the current page.

**Review statistics recompute from the full approved review set on every request:**
- Problem: `GetTourReviewSummaryAsync` counts and averages in-memory after fetching all approved reviews.
- Files: `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Services/ReviewService.cs`, `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Repositories/ReviewRepository.cs`
- Cause: Summary is derived from `GetApprovedByTourIdAsync` instead of using grouped SQL aggregation.
- Improvement path: Move the summary calculation into the database query so only aggregate values are transferred.

## Fragile Areas

**Booking creation depends on many side effects in one service method:**
- Files: `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Services/BookingService.cs`
- Why fragile: `CreateAsync` validates seat counts, resolves prices, applies vouchers, creates passengers, updates departure state, and persists everything in one path. Small changes to one rule can break booking creation or availability updates.
- Safe modification: Keep validation and pricing rules isolated in helper methods and add tests before changing booking state transitions.
- Test coverage: No automated tests are present for these flows.

**Review visibility is coupled to booking completion state:**
- Files: `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Services/ReviewService.cs`, `FE_QuanLyDuLichVaDatTour/src/pages/MyReviewsPage.tsx`, `FE_QuanLyDuLichVaDatTour/src/components/review/ReviewForm.tsx`
- Why fragile: The form appears only when `coTheDanhGia` is true, which depends on backend booking status and whether a review already exists. Any status change or filtering bug can hide the form entirely.
- Safe modification: Preserve backend status checks and treat the frontend as presentation only.
- Test coverage: No component or API tests cover the full "completed booking -> review form -> submit review" path.

**Authentication flows are split across backend and frontend state helpers:**
- Files: `BE_QuanLyDuLichVaDatTour/IdentityService/Services/AuthService.cs`, `BE_QuanLyDuLichVaDatTour/IdentityService/Services/TokenGenerator.cs`, `FE_QuanLyDuLichVaDatTour/src/store/authStore.ts`, `FE_QuanLyDuLichVaDatTour/src/services/booking/booking.ts`, `FE_QuanLyDuLichVaDatTour/src/services/review/review.ts`
- Why fragile: Several request helpers independently decide how to react to `401`, and some paths clear auth state while others only throw an error.
- Safe modification: Centralize session-expiry handling in one client helper and keep request functions side-effect free.
- Test coverage: No automated regression tests exist for auth expiry behavior.

## Scaling Limits

**Single-database, synchronous request flow limits horizontal growth:**
- Current capacity: All backend services share one SQL Server database and synchronous controller/service calls.
- Limit: High booking and review traffic can concentrate load on the database and make seat/voucher races more likely.
- Scaling path: Add transactional guarantees, optimistic concurrency, and read-optimized projections before introducing cache or async processing.

## Dependencies at Risk

**Entity Framework query shape depends on exact schema names:**
- Risk: The ORM mapping is tightly coupled to the SQL schema in `CSDL/QuanLyDuLichVaDatTour.sql` and the runtime mappings in `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Data/AppDbContext.cs`.
- Impact: Table or column name drift can break admin or customer flows at runtime.
- Migration plan: Keep schema scripts and `AppDbContext` changes in lockstep and verify generated SQL against the live database.

**Ocelot gateway depends on external JSON config at startup:**
- Risk: `ApiGateway` fails fast when `ocelot.json` is missing or misconfigured.
- Files: `BE_QuanLyDuLichVaDatTour/ApiGateway/Program.cs`, `BE_QuanLyDuLichVaDatTour/ApiGateway/ocelot.json`
- Impact: The gateway cannot start if routing config is absent or malformed.
- Migration plan: Validate routing config in CI and keep route changes versioned alongside service endpoints.

## Missing Critical Features

**No observable transactional boundary around booking, voucher, and seat updates:**
- Problem: Booking persistence, seat availability changes, and voucher usage counters are not wrapped in an explicit unit-of-work boundary in service code.
- Blocks: Safe handling of parallel booking traffic.

**No production-safe password reset delivery path:**
- Problem: The reset token is generated server-side but returned to the caller instead of being sent through a user-verifiable channel.
- Blocks: Secure password recovery in a deployed environment.

## Test Coverage Gaps

**Backend booking and review flows are untested:**
- What's not tested: Booking creation, seat-limit enforcement, voucher selection, review submission, review moderation, and summary calculations.
- Files: `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Services/BookingService.cs`, `BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Services/ReviewService.cs`
- Risk: Concurrency bugs and rule regressions can ship unnoticed.
- Priority: High

**Identity flows have no regression suite:**
- What's not tested: Register, login, change password, forgot password, and reset password behaviors.
- Files: `BE_QuanLyDuLichVaDatTour/IdentityService/Services/AuthService.cs`, `BE_QuanLyDuLichVaDatTour/IdentityService/Services/TokenGenerator.cs`
- Risk: Token, password, and account-state regressions can break all authentication.
- Priority: High

**Frontend customer booking/review screens have no component tests:**
- What's not tested: `MyBookingsPage`, `MyReviewsPage`, and `ReviewForm` loading, empty, error, and submit states.
- Files: `FE_QuanLyDuLichVaDatTour/src/pages/MyBookingsPage.tsx`, `FE_QuanLyDuLichVaDatTour/src/pages/MyReviewsPage.tsx`, `FE_QuanLyDuLichVaDatTour/src/components/review/ReviewForm.tsx`
- Risk: UI regressions can hide review actions or misreport booking state.
- Priority: Medium

---

*Concerns audit: 2026-05-02*
