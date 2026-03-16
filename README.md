1. Mục tiêu của hệ thống
- Hệ thống được xây dựng với các mục tiêu sau:
- Quản lý danh sách các tour du lịch một cách tập trung và khoa học.
- Hỗ trợ khách hàng tìm kiếm, xem thông tin và đặt tour trực tuyến.
- Quản lý thông tin booking, thanh toán và trạng thái đơn đặt.
- Hỗ trợ xử lý các yêu cầu hủy tour.
- Quản lý đánh giá và phản hồi của khách hàng.
- Thống kê doanh thu và số lượng khách đăng ký theo từng tour.

2. Phạm vi đề tài
2.1. Admin
- Admin là người quản lý toàn bộ hoạt động của hệ thống, bao gồm quản lý tour, lịch trình, booking, khách hàng, thanh toán, phản hồi và báo cáo thống kê.
2.2. Khách hàng
- Khách hàng là người sử dụng hệ thống để tìm kiếm tour, xem thông tin chi tiết, đặt tour, thanh toán, theo dõi đơn đặt và gửi đánh giá sau chuyến đi.

3. Chức năng của hệ thống
3.1. Chức năng dành cho Admin
3.1.1. Quản lý tour du lịch
-Admin có quyền quản lý toàn bộ thông tin liên quan đến tour du lịch. Cụ thể:
-Thêm mới tour du lịch.
-Chỉnh sửa thông tin tour.
-Xóa tour không còn hoạt động.
-Cập nhật tên tour, địa điểm, thời gian khởi hành, thời lượng, giá tour, mô tả tour.
-Cập nhật số lượng chỗ tối đa của từng tour.
-Quản lý hình ảnh minh họa cho tour.
-Phân loại tour theo khu vực, địa điểm hoặc loại hình du lịch.

3.1.2. Quản lý lịch trình tour
-Mỗi tour sẽ có lịch trình chi tiết để khách hàng dễ theo dõi. Admin thực hiện:
-Tạo lịch trình cho từng tour.
-Cập nhật các điểm tham quan trong lịch trình.
-Cập nhật thời gian khởi hành và thời gian kết thúc.
-Quản lý thông tin dịch vụ đi kèm trong tour như khách sạn, phương tiện, ăn uống.
-Điều chỉnh lịch trình khi có thay đổi.

3.1.3. Quản lý booking
-Chức năng này giúp Admin theo dõi và xử lý các đơn đặt tour của khách hàng:
-Xem danh sách các booking.
-Xem chi tiết từng đơn đặt tour.
-Kiểm tra số lượng khách đăng ký cho từng tour.
-Xác nhận đơn đặt tour.
-Cập nhật trạng thái booking: chờ xác nhận, đã xác nhận, đã thanh toán, đã hủy, hoàn tất.
-Theo dõi số lượng chỗ còn lại của từng tour.

3.1.4. Quản lý thông tin khách hàng
Admin có thể quản lý dữ liệu khách hàng để phục vụ cho việc chăm sóc và hỗ trợ:
Xem danh sách khách hàng đã đăng ký tài khoản.
Xem thông tin cá nhân của khách hàng.
Tra cứu lịch sử đặt tour của từng khách hàng.
Hỗ trợ xử lý các vấn đề phát sinh liên quan đến booking của khách hàng.

3.1.5. Quản lý thanh toán
Chức năng thanh toán giúp Admin kiểm soát các giao dịch trong hệ thống:
Kiểm tra thông tin thanh toán của khách hàng.
Xác nhận trạng thái thanh toán thành công hoặc thất bại.
Quản lý hóa đơn hoặc phiếu xác nhận đặt tour.
Theo dõi các booking chưa thanh toán hoặc thanh toán chưa hoàn tất.

3.1.6. Quản lý hủy tour
Trong trường hợp khách hàng không tiếp tục tham gia tour, Admin có thể:
Tiếp nhận yêu cầu hủy tour từ khách hàng.
Xác nhận việc hủy tour.
Cập nhật trạng thái booking sau khi hủy.
Kiểm tra điều kiện hoàn tiền theo chính sách của hệ thống.
Ghi nhận thông tin lý do hủy tour để phục vụ thống kê.

3.1.7. Quản lý đánh giá và phản hồi
Sau khi sử dụng dịch vụ, khách hàng có thể gửi đánh giá. Admin sẽ:
Xem các đánh giá, nhận xét của khách hàng.
Quản lý nội dung phản hồi.
Ẩn hoặc xóa các phản hồi không phù hợp.
Theo dõi mức độ hài lòng của khách hàng đối với từng tour.

3.1.8. Thống kê và báo cáo
Đây là chức năng quan trọng hỗ trợ Admin quản lý hiệu quả hoạt động kinh doanh:
Thống kê số lượng tour hiện có.
Thống kê số lượng booking theo ngày, tháng, năm.
Thống kê doanh thu theo từng khoảng thời gian.
Thống kê số lượng khách tham gia từng tour.
Thống kê các tour được đặt nhiều nhất.
Xuất báo cáo phục vụ công tác quản lý.

3.2. Chức năng dành cho Khách hàng
3.2.1. Đăng ký tài khoản
Khách hàng có thể tạo tài khoản để sử dụng hệ thống:
Nhập thông tin đăng ký như họ tên, email, số điện thoại, mật khẩu.
Kiểm tra tính hợp lệ của dữ liệu nhập vào.
Lưu thông tin tài khoản vào hệ thống.

3.2.2. Đăng nhập và đăng xuất
Chức năng này giúp khách hàng truy cập vào tài khoản cá nhân:
Đăng nhập bằng email và mật khẩu.
Đăng xuất khỏi hệ thống.
Bảo mật thông tin đăng nhập.

3.2.3. Quản lý thông tin cá nhân
Sau khi đăng nhập, khách hàng có thể:
Xem thông tin cá nhân.
Cập nhật họ tên, số điện thoại, địa chỉ liên hệ.
Đổi mật khẩu tài khoản.

3.2.4. Xem danh sách tour
Khách hàng có thể xem toàn bộ các tour đang được mở bán:
Xem danh sách tour theo từng danh mục.
Xem thông tin cơ bản của tour như tên tour, giá, địa điểm, thời gian.
Xem hình ảnh minh họa của tour.

3.2.5. Xem chi tiết tour
Đây là chức năng giúp khách hàng hiểu rõ trước khi đặt:
Xem mô tả chi tiết của tour.
Xem lịch trình cụ thể của tour.
Xem thời gian khởi hành, thời lượng tour.
Xem giá tour và các dịch vụ bao gồm.
Xem số lượng chỗ còn lại.
Xem đánh giá từ khách hàng khác.

3.2.6. Tìm kiếm và lọc tour
Để dễ dàng lựa chọn tour phù hợp, khách hàng có thể:
Tìm tour theo địa điểm.
Tìm tour theo khoảng giá.
Tìm tour theo thời gian khởi hành.
Lọc tour theo thời lượng hoặc loại hình du lịch.

3.2.7. Đặt tour trực tuyến
Khách hàng có thể thực hiện đặt tour ngay trên hệ thống:
Chọn tour mong muốn.
Nhập số lượng người tham gia.
Nhập thông tin liên hệ cần thiết.
Kiểm tra lại thông tin booking.
Xác nhận đặt tour.

3.2.8. Thanh toán
Sau khi đặt tour, khách hàng có thể thực hiện thanh toán:
Thanh toán trực tuyến cho đơn đặt tour.
Nhận thông báo kết quả thanh toán.
Xem lại thông tin hóa đơn hoặc phiếu xác nhận đặt tour.

3.2.9. Theo dõi lịch sử đặt tour
Khách hàng có thể quản lý các booking cá nhân:
Xem danh sách các tour đã đặt.
Xem trạng thái từng đơn đặt.
Xem chi tiết đơn đặt tour.
Theo dõi các đơn đã thanh toán, chưa thanh toán hoặc đã hủy.

3.2.10. Hủy tour
Trong trường hợp không thể tham gia, khách hàng có thể:
Gửi yêu cầu hủy tour.
Xem trạng thái xử lý yêu cầu hủy.
Theo dõi tình trạng hoàn tiền nếu có.

3.2.11. Gửi đánh giá và phản hồi
Sau khi hoàn thành chuyến đi, khách hàng có thể:
Gửi đánh giá chất lượng tour.
Viết nhận xét về dịch vụ.
Gửi ý kiến đóng góp để hệ thống cải thiện chất lượng phục vụ.
