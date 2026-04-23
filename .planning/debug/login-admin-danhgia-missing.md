---
status: awaiting_human_verify
trigger: "login-admin-danhgia-missing"
created: 2026-04-23T00:00:00Z
updated: 2026-04-23T00:00:00Z
---

## Current Focus
hypothesis: EF Core is mapping `DanhGia` to the wrong table name (`DanhGia`) while the actual schema uses `DanhGiaTour`, so any admin dashboard query that includes bookings crashes on the missing table.
test: Inspect entity mapping and bootstrap SQL, then align them to the real database table name.
expecting: Fixing the mapping should make `BookingRepository.GetAllAsync` generate SQL against `DanhGiaTour` instead of `DanhGia`.
next_action: Ask the user to verify the admin login/dashboard flow now that the ORM mapping matches the real table name.

## Symptoms
expected: Đăng nhập admin xong vào dashboard bình thường.
actual: Backend crash khi login admin.
errors: Microsoft.Data.SqlClient.SqlException: Invalid object name 'DanhGia'. Ảnh cho thấy lỗi phát sinh tại BookingRepository.GetAllAsync.
reproduction: Mở app và đăng nhập bằng tài khoản admin, sau đó backend ném exception.
started: Mới xuất hiện sau các thay đổi gần đây ở admin/dashboard.

## Eliminated

## Evidence
- timestamp: 2026-04-23T00:00:00Z
  checked: BookingRepository and Booking entity includes
  found: Admin dashboard loads bookings with `.Include(x => x.DanhGias)`, which forces EF to join the review table during `GetAllAsync`.
  implication: The crash can happen before the dashboard renders, during the admin booking query.
- timestamp: 2026-04-23T00:00:00Z
  checked: AppDbContext mapping and schema script
  found: The code mapped `DanhGia` to table `DanhGia`, but the actual database script defines `DanhGiaTour`.
  implication: EF generated SQL against a non-existent table name, matching the reported SqlException.
- timestamp: 2026-04-23T00:00:00Z
  checked: Program.cs bootstrap SQL
  found: Bootstrap SQL also created `DanhGia`, which did not match the schema file's `DanhGiaTour` table.
  implication: Fresh databases would also be bootstrapped inconsistently, so the bug was systemic rather than a one-off data issue.

## Resolution
root_cause: EF Core was mapped to the wrong review table name (`DanhGia`) while the actual database/schema uses `DanhGiaTour`, so the admin booking query in `BookingRepository.GetAllAsync` crashed when it eagerly loaded `booking.DanhGias`.
fix: Updated `AppDbContext` to map `DanhGia` to `DanhGiaTour` / `DanhGiaTourId` / `NoiDungComment`, and updated startup bootstrap SQL to create `DanhGiaTour` instead of `DanhGia`.
verification: Static verification confirmed the ORM mapping now targets `DanhGiaTour`, matching the schema and eliminating the prior table-name mismatch. A full backend build could not complete because the executable/DLL was locked by a running process (`BE_QuanLyDuLichVaDatTour.exe` / Visual Studio).

files_changed: ["/d/BTL_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Data/AppDbContext.cs", "/d/BTL_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/BE_QuanLyDuLichVaDatTour/Program.cs"]
