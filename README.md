# Quản lý du lịch & đặt tour

## 1. Giới thiệu
Hệ thống **Quản lý du lịch & đặt tour** được xây dựng nhằm hỗ trợ doanh nghiệp du lịch quản lý tour, tiếp nhận booking và phục vụ khách hàng đặt tour trực tuyến.  
Hệ thống giúp **Admin** quản lý tour, lịch trình, booking, thanh toán, báo cáo doanh thu; đồng thời giúp **Khách hàng** tìm kiếm, đặt tour, thanh toán và gửi phản hồi sau chuyến đi.

---

## 2. Mục tiêu
- Quản lý danh sách tour, lịch trình và giá tour.
- Hỗ trợ khách hàng tìm kiếm tour phù hợp.
- Cho phép đặt tour và thanh toán online.
- Hỗ trợ hủy tour, hoàn tour theo chính sách.
- Quản lý doanh thu và số lượng khách.
- Thu thập và quản lý đánh giá từ khách hàng.

---

## 3. Actor của hệ thống
Hệ thống gồm **2 actor chính**:
- **Admin**
- **Khách hàng**

---

# 4. Chức năng chi tiết theo từng actor

## 4.1. Chức năng của Admin

Admin là người quản trị toàn bộ hệ thống, chịu trách nhiệm quản lý dữ liệu tour, booking, thanh toán, phản hồi và báo cáo.

## 4.1.1. Quản lý tour
Admin có quyền tạo và quản lý tất cả tour trong hệ thống.

### Chức năng:
- Thêm tour mới.
- Cập nhật thông tin tour.
- Xóa tour không còn hoạt động.
- Ẩn/hiện tour trên hệ thống.
- Xem danh sách tất cả tour.

### Thông tin tour cần quản lý:
- Mã tour
- Tên tour
- Điểm đến
- Thời gian tour
- Ngày khởi hành
- Giá tour
- Số lượng chỗ tối đa
- Mô tả tour
- Hình ảnh tour
- Trạng thái tour

---

## 4.1.2. Quản lý lịch trình tour
Admin quản lý lịch trình chi tiết của từng tour để khách hàng theo dõi.

### Chức năng:
- Thêm lịch trình cho tour.
- Chỉnh sửa nội dung lịch trình.
- Cập nhật thời gian, địa điểm tham quan.
- Xóa lịch trình cũ hoặc sai.
- Xem chi tiết lịch trình theo từng tour.

### Nội dung lịch trình có thể gồm:
- Ngày thứ mấy của chuyến đi
- Địa điểm tham quan
- Giờ khởi hành
- Hoạt động chính
- Khách sạn/lưu trú
- Phương tiện di chuyển
- Ghi chú thêm

---

## 4.1.3. Quản lý booking
Admin theo dõi và xử lý tất cả đơn đặt tour từ khách hàng.

### Chức năng:
- Xem danh sách booking.
- Tìm kiếm booking theo mã booking, tên khách hàng, tour.
- Xác nhận booking mới.
- Cập nhật trạng thái booking.
- Hủy booking khi cần.
- Kiểm tra số lượng khách đã đặt của từng tour.

### Trạng thái booking:
- Chờ xác nhận
- Đã xác nhận
- Đã thanh toán
- Đã hủy
- Đã hoàn tiền

---

## 4.1.4. Quản lý khách hàng
Admin quản lý thông tin khách hàng đã đăng ký và đặt tour.

### Chức năng:
- Xem danh sách khách hàng.
- Xem thông tin chi tiết khách hàng.
- Tìm kiếm khách hàng theo tên, số điện thoại, email.
- Theo dõi lịch sử đặt tour của khách hàng.
- Khóa/mở tài khoản khách hàng nếu cần.

### Thông tin khách hàng:
- Mã khách hàng
- Họ tên
- Số điện thoại
- Email
- Địa chỉ
- Lịch sử booking
- Trạng thái tài khoản

---

## 4.1.5. Quản lý thanh toán
Admin kiểm tra và xác nhận các giao dịch thanh toán của khách hàng.

### Chức năng:
- Xem danh sách hóa đơn.
- Kiểm tra trạng thái thanh toán.
- Xác nhận thanh toán thành công.
- Cập nhật trạng thái chưa thanh toán / đã thanh toán / hoàn tiền.
- Xử lý hoàn tiền khi khách hủy tour đúng điều kiện.
- Xuất hóa đơn hoặc voucher đặt tour.

### Dữ liệu thanh toán:
- Mã hóa đơn
- Mã booking
- Tên khách hàng
- Số tiền
- Phương thức thanh toán
- Thời gian thanh toán
- Trạng thái thanh toán

---

## 4.1.6. Quản lý hủy tour / hoàn tour
Admin là người duyệt hoặc xử lý yêu cầu hủy tour từ khách hàng.

### Chức năng:
- Xem yêu cầu hủy tour.
- Kiểm tra điều kiện hủy tour.
- Duyệt yêu cầu hủy.
- Từ chối yêu cầu hủy nếu không hợp lệ.
- Cập nhật trạng thái hoàn tiền.
- Thông báo kết quả xử lý cho khách hàng.

---

## 4.1.7. Quản lý feedback và đánh giá
Admin tiếp nhận phản hồi từ khách hàng sau chuyến đi.

### Chức năng:
- Xem tất cả đánh giá của khách hàng.
- Lọc đánh giá theo tour.
- Phản hồi lại đánh giá nếu cần.
- Ẩn hoặc xóa các nội dung không phù hợp.
- Thống kê mức độ hài lòng của khách hàng.

### Nội dung đánh giá:
- Tên khách hàng
- Tour đã tham gia
- Số sao đánh giá
- Nội dung nhận xét
- Thời gian gửi đánh giá

---

## 4.1.8. Xem báo cáo và thống kê
Admin sử dụng báo cáo để theo dõi hoạt động kinh doanh.

### Chức năng:
- Thống kê số lượng booking theo tour.
- Thống kê doanh thu theo ngày, tháng, năm.
- Thống kê số lượng khách theo từng tour.
- Xem tour được đặt nhiều nhất.
- Xem tour bị hủy nhiều nhất.
- Theo dõi hiệu quả hoạt động của hệ thống.

### Kết quả báo cáo có thể gồm:
- Tổng số tour
- Tổng số booking
- Tổng doanh thu
- Tổng số khách hàng
- Top tour nổi bật
- Tỷ lệ hủy tour

---

# 4.2. Chức năng của Khách hàng

Khách hàng là người sử dụng hệ thống để tìm kiếm tour, đặt tour, thanh toán và theo dõi lịch sử giao dịch của mình.

## 4.2.1. Đăng ký, đăng nhập và quản lý tài khoản
Khách hàng cần có tài khoản để đặt tour và theo dõi thông tin booking.

### Chức năng:
- Đăng ký tài khoản mới.
- Đăng nhập hệ thống.
- Đăng xuất tài khoản.
- Quên mật khẩu.
- Đổi mật khẩu.
- Cập nhật thông tin cá nhân.

### Thông tin tài khoản:
- Họ tên
- Email
- Số điện thoại
- Địa chỉ
- Mật khẩu

---

## 4.2.2. Xem danh sách tour
Khách hàng có thể xem toàn bộ tour đang mở bán trên hệ thống.

### Chức năng:
- Xem danh sách tour.
- Xem tour nổi bật.
- Xem tour theo địa điểm.
- Xem tour theo mức giá.
- Xem thông tin cơ bản của tour.

### Thông tin hiển thị:
- Tên tour
- Địa điểm
- Thời gian tour
- Giá tour
- Ảnh tour
- Ngày khởi hành
- Số chỗ còn lại

---

## 4.2.3. Tìm kiếm và lọc tour
Khách hàng có thể tìm tour phù hợp với nhu cầu.

### Chức năng:
- Tìm kiếm tour theo tên tour.
- Tìm kiếm theo địa điểm.
- Lọc theo khoảng giá.
- Lọc theo thời gian khởi hành.
- Lọc theo số ngày đi.
- Sắp xếp tour theo giá tăng/giảm hoặc phổ biến.

---

## 4.2.4. Xem chi tiết tour
Khách hàng có thể xem đầy đủ thông tin trước khi quyết định đặt tour.

### Chức năng:
- Xem mô tả chi tiết tour.
- Xem lịch trình từng ngày.
- Xem giá tour.
- Xem dịch vụ bao gồm / không bao gồm.
- Xem chính sách hủy tour.
- Xem đánh giá từ khách hàng trước.

---

## 4.2.5. Đặt tour
Đây là chức năng chính của khách hàng trong hệ thống.

### Chức năng:
- Chọn tour muốn đặt.
- Chọn ngày khởi hành.
- Nhập số lượng người tham gia.
- Nhập thông tin người đi tour.
- Xác nhận thông tin booking.
- Gửi yêu cầu đặt tour.

### Kết quả sau khi đặt:
- Hệ thống tạo mã booking.
- Lưu booking vào tài khoản khách hàng.
- Chuyển sang bước thanh toán.

---

## 4.2.6. Thanh toán online
Sau khi đặt tour, khách hàng thực hiện thanh toán.

### Chức năng:
- Xem số tiền cần thanh toán.
- Chọn phương thức thanh toán.
- Thực hiện thanh toán trực tuyến.
- Nhận thông báo thanh toán thành công/thất bại.
- Xem hóa đơn hoặc voucher điện tử.

---

## 4.2.7. Quản lý booking cá nhân
Khách hàng có thể theo dõi các tour mình đã đặt.

### Chức năng:
- Xem danh sách booking của bản thân.
- Xem chi tiết từng booking.
- Theo dõi trạng thái booking.
- Theo dõi trạng thái thanh toán.
- Tải voucher xác nhận đặt tour.

### Trạng thái khách hàng có thể xem:
- Chờ xác nhận
- Đã xác nhận
- Đã thanh toán
- Đã hủy
- Đã hoàn tiền

---

## 4.2.8. Hủy tour
Khách hàng có thể gửi yêu cầu hủy tour nếu không thể tham gia.

### Chức năng:
- Gửi yêu cầu hủy tour.
- Xem chính sách hủy tour.
- Theo dõi kết quả xử lý hủy tour.
- Theo dõi trạng thái hoàn tiền nếu có.

---

## 4.2.9. Gửi feedback và đánh giá
Sau chuyến đi, khách hàng có thể gửi đánh giá về tour đã tham gia.

### Chức năng:
- Đánh giá số sao cho tour.
- Viết nhận xét về chất lượng chuyến đi.
- Gửi phản hồi về dịch vụ.
- Xem lại đánh giá đã gửi.

---

## 4.2.10. Xem thông báo từ hệ thống
Khách hàng nhận thông tin liên quan đến booking và tour.

### Chức năng:
- Nhận thông báo xác nhận booking.
- Nhận thông báo thanh toán.
- Nhận thông báo hủy tour / hoàn tiền.
- Nhận thông báo nhắc lịch khởi hành.

---

## 5. Chức năng chung của hệ thống
Ngoài chức năng riêng của từng actor, hệ thống còn có các chức năng chung:

- Phân quyền người dùng theo vai trò.
- Tìm kiếm dữ liệu nhanh chóng.
- Lưu trữ và bảo mật thông tin khách hàng.
- Tích hợp Google Maps để hiển thị địa điểm.
- Xuất voucher hoặc hóa đơn PDF.
- Hiển thị giao diện thân thiện trên máy tính và điện thoại.

---

## 6. Dữ liệu chính
Hệ thống quản lý các dữ liệu chính sau:
- **Tours**: lưu thông tin tour
- **Itineraries**: lưu lịch trình tour
- **Bookings**: lưu đơn đặt tour
- **Customers**: lưu thông tin khách hàng
- **Invoices**: lưu thông tin thanh toán
- **Reviews**: lưu đánh giá, phản hồi

---

## 7. Quy trình nghiệp vụ chính

## 7.1. Quy trình đặt tour
1. Khách hàng đăng nhập hệ thống.
2. Khách hàng tìm kiếm tour phù hợp.
3. Khách hàng xem chi tiết tour.
4. Khách hàng nhập thông tin đặt tour.
5. Hệ thống tạo booking.
6. Khách hàng thanh toán online.
7. Admin kiểm tra và xác nhận booking.
8. Hệ thống gửi voucher cho khách hàng.

## 7.2. Quy trình hủy tour
1. Khách hàng gửi yêu cầu hủy tour.
2. Hệ thống chuyển yêu cầu cho Admin.
3. Admin kiểm tra điều kiện hủy.
4. Admin duyệt hoặc từ chối yêu cầu.
5. Hệ thống cập nhật trạng thái booking.
6. Nếu đủ điều kiện, hệ thống xử lý hoàn tiền.

---



## 9. Kết luận
Hệ thống **Quản lý du lịch & đặt tour** với 2 actor chính là **Admin** và **Khách hàng** đáp ứng đầy đủ nhu cầu quản lý tour và đặt tour trực tuyến.  
Việc phân chia chức năng rõ ràng giữa hai actor giúp hệ thống dễ xây dựng, dễ quản lý và phù hợp cho đồ án phân tích thiết kế hệ thống thông tin.
