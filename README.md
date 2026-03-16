# Quản lý du lịch & đặt tour

## 1. Giới thiệu
Dự án **Quản lý du lịch & đặt tour** là hệ thống hỗ trợ quản lý tour, khách hàng và quá trình booking tour trực tuyến.  
Hệ thống giúp khách hàng dễ dàng tìm kiếm, đặt tour và thanh toán online, đồng thời hỗ trợ quản trị viên quản lý danh mục tour, lịch trình, doanh thu và phản hồi khách hàng.

---

## 2. Mục tiêu
- Quản lý thông tin tour du lịch, lịch trình và giá tour.
- Hỗ trợ khách hàng tìm kiếm tour theo địa điểm và chi phí.
- Cho phép đặt tour trực tuyến và thanh toán online.
- Hỗ trợ hủy/hoàn tour.
- Thống kê báo cáo số lượng khách và doanh thu.
- Quản lý đánh giá, phản hồi từ khách hàng.

---

## 3. Actor của hệ thống
Hệ thống gồm **2 actor chính**:

### 3.1. Admin
- Quản lý danh mục tour.
- Quản lý lịch trình và giá tour.
- Quản lý booking của khách hàng.
- Theo dõi doanh thu và số lượng khách.
- Quản lý phản hồi, đánh giá của khách hàng.

### 3.2. Khách hàng
- Xem danh sách tour.
- Tìm kiếm tour theo địa điểm, giá.
- Xem chi tiết lịch trình tour.
- Đặt tour trực tuyến.
- Thanh toán online.
- Hủy tour hoặc yêu cầu hoàn tour.
- Gửi đánh giá và phản hồi sau chuyến đi.

---

## 4. Chức năng bắt buộc

### 4.1. Quản lý danh mục tour
- Thêm, sửa, xóa tour.
- Quản lý thông tin tour: tên tour, điểm đến, thời gian, giá, mô tả.
- Cập nhật lịch trình chi tiết cho từng tour.

### 4.2. Tìm kiếm tour
- Tìm kiếm tour theo:
  - Địa điểm
  - Mức chi phí
  - Thời gian khởi hành
- Hiển thị danh sách tour phù hợp.

### 4.3. Đặt tour online
- Khách hàng chọn tour và nhập thông tin booking.
- Lưu thông tin số lượng người tham gia.
- Xác nhận đơn đặt tour.
- Gửi thông báo booking thành công.

### 4.4. Thanh toán
- Hỗ trợ thanh toán online.
- Quản lý trạng thái thanh toán:
  - Chưa thanh toán
  - Đã thanh toán
  - Hoàn tiền

### 4.5. Hủy / hoàn tour
- Khách hàng gửi yêu cầu hủy tour.
- Hệ thống cập nhật trạng thái booking.
- Xử lý hoàn tiền theo chính sách.

### 4.6. Báo cáo thống kê
- Thống kê số lượng khách theo tour.
- Thống kê doanh thu theo thời gian.
- Theo dõi các tour được đặt nhiều nhất.

### 4.7. Quản lý feedback khách hàng
- Khách hàng gửi đánh giá, nhận xét.
- Admin xem và quản lý phản hồi.
- Hỗ trợ cải thiện chất lượng dịch vụ.

---

## 5. Dữ liệu chính
Hệ thống quản lý các dữ liệu sau:
- **Tours**: thông tin tour
- **Itineraries**: lịch trình tour
- **Bookings**: thông tin đặt tour
- **Customers**: thông tin khách hàng
- **Invoices**: hóa đơn thanh toán
- **Reviews**: đánh giá, phản hồi

---

## 6. Tích hợp
- **Google Maps**: hỗ trợ hiển thị địa điểm du lịch.
- **Xuất voucher PDF**: in/xuất phiếu xác nhận đặt tour.

---

## 7. Yêu cầu phi chức năng (NFR)
- Giao diện thân thiện, dễ sử dụng.
- Hệ thống phản hồi nhanh khi tìm kiếm và đặt tour.
- Bảo mật thông tin khách hàng và thanh toán.
- Dữ liệu lưu trữ chính xác, ổn định.
- Hỗ trợ nhiều thiết bị: máy tính, điện thoại.

---

## 8. Quy trình nghiệp vụ chính

### 8.1. Quy trình đặt tour
1. Khách hàng đăng nhập / đăng ký tài khoản.
2. Khách hàng tìm kiếm tour phù hợp.
3. Khách hàng xem chi tiết tour và lịch trình.
4. Khách hàng nhập thông tin đặt tour.
5. Hệ thống tạo booking.
6. Khách hàng thực hiện thanh toán.
7. Hệ thống xác nhận booking và xuất voucher.

### 8.2. Quy trình hủy tour
1. Khách hàng gửi yêu cầu hủy tour.
2. Hệ thống kiểm tra điều kiện hủy.
3. Cập nhật trạng thái booking.
4. Xử lý hoàn tiền nếu đủ điều kiện.

---

## 9. Bàn giao
Sản phẩm bàn giao gồm:
- **Flow booking – thanh toán**
- **Template quản lý tour**
- **Dashboard doanh thu**
- **Chức năng xuất voucher PDF**

---

## 10. Kết luận
Hệ thống **Quản lý du lịch & đặt tour** giúp số hóa toàn bộ quy trình quản lý tour và đặt tour trực tuyến.  
Với 2 actor chính là **Admin** và **Khách hàng**, hệ thống vẫn đảm bảo đầy đủ các chức năng cốt lõi như quản lý tour, booking, thanh toán, báo cáo doanh thu và phản hồi khách hàng.
