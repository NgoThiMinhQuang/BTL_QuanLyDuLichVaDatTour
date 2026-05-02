---
status: awaiting_human_verify
trigger: "investigate issue: customer-booking-redirect-login"
created: 2026-05-01T00:00:00Z
updated: 2026-05-01T00:00:00Z
---

## Current Focus
hypothesis: a 401 from one of the booking detail page's API requests clears the shared auth store, which then triggers RequireAuth to redirect the still-authenticated customer back to /login
test: verify the booking detail flow, the protected API handlers, and the redirect path used by RequireAuth
expecting: booking/order detail navigation should stay on the detail page unless the session is truly invalid
next_action: confirm the code path that clears auth on 401 and remove that side effect from the booking detail API layer

## Symptoms
expected: After login, clicking an existing booking/order should open the booking/order detail page without sending the customer back to login.
actual: Clicking the booking/order sends the user back to the login page.
errors: Not provided.
reproduction: Log in as a customer, then click an existing booking/order from the UI.
started: Not provided.

## Eliminated

## Evidence
- timestamp: 2026-05-01T00:00:00Z
  checked: FE route guard and login redirect logic
  found: RequireAuth only redirects to /login when accessToken is missing; LoginPage honors the redirect query/state after successful login
  implication: the redirect itself is not the origin of the bug; something is clearing auth before the detail route is rendered
- timestamp: 2026-05-01T00:00:00Z
  checked: booking detail page data loading
  found: MyBookingDetailPage uses layChiTietBooking and layThanhToanTheoBooking, both of which call getAuthHeaders()/requireAccessToken()
  implication: either request can trigger auth-session side effects when the backend returns 401
- timestamp: 2026-05-01T00:00:00Z
  checked: booking API response handling
  found: booking service had been clearing auth session immediately on any 401 before throwing SESSION_EXPIRED_MESSAGE
  implication: a single unauthorized booking/payment fetch would wipe the auth store and cause the route guard to send the user to login


## Resolution
root_cause: Booking detail/payment fetches were clearing the shared auth store on any 401 response. That side effect meant a temporary unauthorized response on the detail page immediately erased the logged-in session, and RequireAuth then redirected the customer back to /login.
fix: Stop clearing auth state inside the booking API response handler; let the request surface SESSION_EXPIRED_MESSAGE without mutating global auth state.
verification: Confirmed by code tracing that RequireAuth only redirects when accessToken is null, and by removing the auth-clearing side effect from booking API responses so detail-page fetch failures no longer invalidate the session.
files_changed: ["FE_QuanLyDuLichVaDatTour/src/services/booking/booking.ts"]
