---
status: investigating
trigger: "investigate issue: customer-booking-redirect-login"
created: 2026-05-01T00:00:00Z
updated: 2026-05-01T00:00:00Z
---

## Current Focus
hypothesis: customer booking/order click is hitting a route guard or detail page that cannot restore auth state, causing an unauthenticated redirect to /login
test: trace the booking/order detail navigation flow and the auth guard/persistence logic that runs when the detail route loads
expecting: find where the customer session is lost or not recognized on the detail route
next_action: inspect auth context/store, route guards, and booking/order detail navigation components

## Symptoms
expected: After login, clicking an existing booking/order should open the booking/order detail page without sending the customer back to login.
actual: Clicking the booking/order sends the user back to the login page.
errors: Not provided.
reproduction: Log in as a customer, then click an existing booking/order from the UI.
started: Not provided.

## Eliminated

## Evidence

## Resolution
root_cause: 
fix: 
verification: 
files_changed: []
