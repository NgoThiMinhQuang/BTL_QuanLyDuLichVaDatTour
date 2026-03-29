# BÀI TẬP LỚN  
# XÂY DỰNG WEBSITE QUẢN LÝ DU LỊCH VÀ ĐẶT TOUR

---

## 1. Giới thiệu đề tài

Trong bối cảnh nhu cầu du lịch ngày càng tăng, các doanh nghiệp lữ hành cần một hệ thống giúp quản lý tour, lịch trình, lịch khởi hành, khách hàng, booking, thanh toán và phản hồi dịch vụ một cách tập trung, chính xác và thuận tiện. Nếu quản lý thủ công bằng sổ sách hoặc Excel thì dễ xảy ra các vấn đề như sai thông tin khách hàng, trùng booking, khó kiểm soát số chỗ còn lại, khó theo dõi doanh thu, khó thống kê khách hàng, và xử lý hủy tour không nhất quán.

Vì vậy, việc xây dựng một **website quản lý du lịch và đặt tour** là cần thiết. Website này không chỉ là nơi giới thiệu các tour du lịch đến khách hàng mà còn là hệ thống giúp quản trị toàn bộ quy trình kinh doanh tour từ lúc tạo tour, mở bán, đặt tour, thanh toán, xác nhận dịch vụ, đến đánh giá sau chuyến đi.

Trong phạm vi bài tập lớn này, hệ thống được xây dựng với **2 vai trò chính**:

- **Admin**: quản lý toàn bộ dữ liệu và hoạt động của hệ thống
- **Khách hàng**: tìm kiếm tour, đặt tour, thanh toán, theo dõi booking, đánh giá và gửi liên hệ hỗ trợ

Việc giới hạn hệ thống còn 2 vai trò giúp đề tài gọn hơn, phù hợp với quy mô sinh viên thực hiện, nhưng vẫn đảm bảo được đầy đủ nghiệp vụ cốt lõi của một website du lịch thực tế.

---

## 2. Lý do chọn đề tài

Đề tài website quản lý du lịch và đặt tour được chọn vì các lý do sau:

- Đây là một bài toán thực tế, phổ biến trong lĩnh vực du lịch và thương mại điện tử
- Đề tài có đủ cả phần quản trị và phần người dùng, giúp thể hiện rõ tư duy phân tích thiết kế hệ thống
- Nghiệp vụ rõ ràng, dễ mô hình hóa thành cơ sở dữ liệu, use case, activity diagram, ERD và giao diện
- Có thể triển khai được các chức năng quan trọng như đặt tour, thanh toán, hỗ trợ khách hàng, đánh giá và thống kê
- Đề tài phù hợp để áp dụng kiến thức về phân tích hệ thống, thiết kế cơ sở dữ liệu và xây dựng website

---

## 3. Mục tiêu đề tài

### 3.1. Mục tiêu tổng quát

Xây dựng một website hỗ trợ doanh nghiệp du lịch quản lý tour và hỗ trợ khách hàng đặt tour trực tuyến một cách nhanh chóng, thuận tiện, đúng nghiệp vụ và có khả năng theo dõi xuyên suốt quá trình từ khi tìm tour đến sau khi kết thúc chuyến đi.

### 3.2. Mục tiêu cụ thể

Hệ thống cần đạt được các mục tiêu sau:

- Quản lý danh mục tour, loại tour, địa điểm, lịch trình và hình ảnh tour
- Quản lý giá tour linh hoạt theo từng thời điểm, bao gồm **giá ngày thường** và **giá cuối tuần**
- Quản lý các đợt khởi hành và giá bán theo từng đợt
- Cho phép khách hàng tìm kiếm, xem chi tiết và đặt tour online
- Quản lý số lượng khách theo nhiều nhóm khác nhau như người lớn và trẻ em
- Quản lý danh sách hành khách đi cùng trong từng booking
- Ghi nhận thanh toán đầy đủ cho booking
- Hỗ trợ thanh toán trực tuyến thông qua bên thứ ba như cổng thanh toán điện tử
- Quản lý hóa đơn và phiếu xác nhận tour
- Hỗ trợ hủy booking và xử lý hoàn tiền theo chính sách
- Cho phép khách hàng đánh giá tour và để lại comment sau khi hoàn tất chuyến đi
- Thống kê số lượng người đánh giá, số comment và điểm đánh giá trung bình của tour
- Quản lý phần hỗ trợ khách hàng gồm liên hệ, góp ý, phản hồi và thông báo
- Cho phép **ẩn tour** thay vì xóa tour để đảm bảo toàn vẹn dữ liệu
- Cung cấp dashboard và báo cáo cho Admin về doanh thu, số khách, số booking và hiệu quả kinh doanh

---

## 4. Phạm vi hệ thống

### 4.1. Phạm vi chức năng

Hệ thống tập trung vào các nhóm chức năng chính sau:

- Quản lý tài khoản người dùng
- Quản lý tour và thông tin tour
- Quản lý giá tour và giá theo thời điểm
- Quản lý lịch trình tour
- Quản lý lịch khởi hành
- Tìm kiếm và xem tour
- Đặt tour trực tuyến
- Quản lý hành khách
- Thanh toán
- Hóa đơn và phiếu xác nhận tour
- Hủy booking và hoàn tiền
- Đánh giá và comment
- Hỗ trợ khách hàng
- Báo cáo thống kê

### 4.2. Phạm vi người dùng

Hệ thống chỉ có 2 tác nhân:

#### Admin
Là người quản trị toàn bộ hệ thống, có quyền quản lý dữ liệu và xử lý nghiệp vụ.

#### Khách hàng
Là người dùng website để tìm kiếm tour, đặt tour, thanh toán và tương tác với hệ thống.

---

## 5. Mô tả bài toán nghiệp vụ

Website quản lý du lịch và đặt tour cần giải quyết đầy đủ vòng đời nghiệp vụ của một doanh nghiệp du lịch, bao gồm:

- Tạo và quản lý thông tin tour
- Tổ chức tour thành nhiều đợt khởi hành khác nhau
- Thiết lập giá bán linh hoạt theo từng thời điểm, đặc biệt là **ngày thường** và **cuối tuần**
- Cho khách hàng tra cứu, xem chi tiết và lựa chọn tour phù hợp
- Hỗ trợ khách hàng tạo booking theo từng lịch khởi hành cụ thể
- Quản lý thông tin liên hệ và danh sách hành khách đi tour
- Ghi nhận thanh toán đầy đủ cho booking
- Hỗ trợ thanh toán qua bên thứ ba
- Phát hành hóa đơn và phiếu xác nhận tour
- Xử lý yêu cầu hủy booking, tính phí hủy và số tiền hoàn
- Thu thập đánh giá và comment khách hàng sau chuyến đi
- Thống kê số lượng người đánh giá và số lượng comment của mỗi tour
- Quản lý phần hỗ trợ khách hàng như liên hệ, góp ý, phản hồi và thông báo
- Quản lý trạng thái hiển thị tour bằng cách **ẩn tour** thay vì xóa dữ liệu
- Thống kê doanh thu, số lượng khách và hiệu quả kinh doanh

Điểm quan trọng trong bài toán này là **khách hàng không đặt một tour chung chung mà đặt theo một lịch khởi hành cụ thể**. Ngoài ra, hệ thống cũng cần **phân biệt rõ giữa thời gian và thời điểm trong tour**:

- **Thời gian tour** là tổng thời lượng của tour, ví dụ: 3 ngày 2 đêm
- **Thời điểm trong tour** là các mốc chi tiết bên trong lịch trình, ví dụ: 07:00 tập trung, 08:30 khởi hành, 12:00 ăn trưa, 14:00 tham quan

Việc tách rõ hai khái niệm này giúp hệ thống đúng nghiệp vụ hơn và hiển thị lịch trình chính xác hơn.

---

## 6. Vai trò người dùng trong hệ thống

### 6.1. Admin

Admin là người có quyền cao nhất trong hệ thống, chịu trách nhiệm quản lý và vận hành toàn bộ website.

Các công việc chính của Admin gồm:

- Quản lý tài khoản người dùng
- Quản lý loại tour và địa điểm
- Quản lý tour, điểm đến, ảnh tour và lịch trình
- Quản lý giá tour, bao gồm giá ngày thường và giá cuối tuần
- Quản lý lịch khởi hành, số chỗ và giá tour
- Quản lý voucher khuyến mãi
- Quản lý booking và danh sách hành khách
- Quản lý giao dịch thanh toán
- Theo dõi thanh toán đầy đủ của khách hàng
- Tạo hóa đơn và phiếu xác nhận tour
- Xử lý yêu cầu hủy booking
- Quản lý đánh giá và comment của khách hàng
- Quản lý nội dung hỗ trợ khách hàng
- Ẩn hoặc ngừng hiển thị tour khi cần
- Xem dashboard và báo cáo thống kê

### 6.2. Khách hàng

Khách hàng là người trực tiếp sử dụng website để tìm kiếm và đặt tour.

Các công việc chính của Khách hàng gồm:

- Đăng ký tài khoản
- Đăng nhập, đăng xuất
- Cập nhật thông tin cá nhân
- Xem danh sách tour
- Tìm kiếm tour theo nhu cầu
- Xem chi tiết tour, lịch trình và lịch khởi hành
- Xem giá tour theo từng thời điểm
- Lưu tour yêu thích
- Đặt tour
- Thanh toán booking
- Theo dõi trạng thái thanh toán
- Xem lịch sử booking
- Xem chi tiết booking
- Gửi yêu cầu hủy booking
- Đánh giá tour và để lại comment sau chuyến đi
- Gửi liên hệ hoặc yêu cầu hỗ trợ
- Xem thông báo từ hệ thống

---

## 7. Phân tích nghiệp vụ hệ thống

### 7.1. Nghiệp vụ quản lý tour

Tour là sản phẩm trung tâm của hệ thống. Mỗi tour chứa các thông tin tổng quát như mã tour, tên tour, loại tour, điểm xuất phát, số ngày số đêm, phương tiện, mô tả ngắn, mô tả chi tiết, điều kiện tour và trạng thái hoạt động.

Một tour có thể có nhiều thành phần liên quan như:

- Danh sách điểm đến
- Danh sách ảnh tour
- Lịch trình chi tiết theo từng ngày
- Nhiều lịch khởi hành khác nhau
- Thông tin đánh giá và comment
- Số lượt đánh giá và phản hồi của khách hàng

Admin là người tạo và cập nhật các thông tin này. Khi tour hoàn chỉnh, Admin có thể chuyển trạng thái sang **Đang mở bán** để hiển thị cho khách hàng. Nếu không muốn tour xuất hiện trên website nữa, Admin sẽ **ẩn tour** hoặc chuyển trạng thái sang ngừng hiển thị, chứ không xóa khỏi cơ sở dữ liệu.

### 7.2. Nghiệp vụ quản lý giá tour

Giá tour không nên được hiểu là một con số cố định duy nhất. Trong thực tế, giá có thể thay đổi theo từng thời điểm, đặc biệt là:

- Giá ngày thường
- Giá cuối tuần
- Giá theo từng đợt khởi hành
- Giá người lớn
- Giá trẻ em
- Giá sau khuyến mãi nếu có voucher

Do đó, hệ thống cần quản lý giá theo hướng linh hoạt. Khi khách hàng chọn lịch khởi hành, hệ thống phải xác định đúng mức giá áp dụng tại thời điểm đó. Điều này giúp bài toán sát thực tế hơn và đúng góp ý về phần giá cuối tuần.

### 7.3. Nghiệp vụ quản lý lịch trình

Lịch trình là phần mô tả chi tiết các hoạt động của tour theo từng ngày. Đây là thông tin rất quan trọng đối với khách hàng khi quyết định đặt tour.

Hệ thống cần phân biệt rõ:

- **Thời gian tổng thể** của tour: số ngày, số đêm
- **Thời điểm cụ thể** của từng hoạt động trong lịch trình: giờ tập trung, giờ xuất phát, giờ ăn, giờ tham quan, giờ nhận phòng,...

Mỗi mục lịch trình có thể gồm:

- Ngày thứ mấy trong tour
- Thứ tự hoạt động trong ngày
- Thời điểm bắt đầu
- Thời điểm kết thúc
- Tiêu đề hoạt động
- Nội dung chi tiết
- Địa điểm tương ứng

Việc bổ sung thời điểm cụ thể trong lịch trình giúp tour rõ ràng hơn, đúng nghiệp vụ hơn và phù hợp với góp ý của cô về việc phân biệt thời gian và thời điểm trong tour.

### 7.4. Nghiệp vụ quản lý lịch khởi hành

Một tour có thể được mở bán nhiều lần theo các đợt khác nhau. Vì vậy, cần có phần quản lý lịch khởi hành để theo dõi riêng từng đợt.

Mỗi lịch khởi hành bao gồm:

- Mã đợt tour
- Tour tương ứng
- Ngày khởi hành
- Ngày kết thúc
- Nơi tập trung
- Số chỗ tối đa
- Số chỗ đã đặt
- Giá người lớn
- Giá trẻ em
- Trạng thái đợt tour

Đây là phần rất đúng nghiệp vụ vì khách hàng đặt tour theo **một đợt khởi hành cụ thể**, chứ không phải đặt một tour trừu tượng.

### 7.5. Nghiệp vụ quản lý khách hàng và số lượng khách

Trong mỗi booking, khách hàng không chỉ đặt cho một người mà có thể đặt cho nhiều người với số lượng khác nhau. Hệ thống cần quản lý rõ:

- Số lượng người lớn
- Số lượng trẻ em
- Danh sách chi tiết từng hành khách

Việc quản lý số lượng khách theo từng nhóm là rất quan trọng vì ảnh hưởng trực tiếp đến:

- Tính tổng tiền booking
- Kiểm soát số chỗ còn lại
- Quản lý danh sách đoàn
- Báo cáo số lượng khách đi tour

Ngoài ra, hệ thống cũng cần lưu snapshot thông tin liên hệ tại thời điểm đặt để tránh thay đổi dữ liệu sau này.

### 7.6. Nghiệp vụ đặt tour

Khi khách hàng chọn được tour phù hợp, họ sẽ tiến hành đặt tour theo quy trình:

1. Chọn tour
2. Xem các đợt khởi hành đang mở bán
3. Chọn một lịch khởi hành cụ thể
4. Nhập thông tin liên hệ
5. Chọn số lượng người lớn và trẻ em
6. Nhập danh sách hành khách
7. Áp dụng voucher nếu có
8. Hệ thống tính tiền
9. Tạo booking

Thông tin booking cần lưu cả **snapshot** tại thời điểm đặt như:

- Họ tên liên hệ
- Email liên hệ
- Số điện thoại liên hệ
- Đơn giá người lớn, trẻ em
- Tạm tính, giảm giá, tổng tiền, tiền cọc hoặc số tiền đã thanh toán

Thiết kế như vậy là hợp lý vì sau này nếu giá tour thay đổi thì booking cũ vẫn giữ nguyên số liệu ban đầu.

### 7.7. Nghiệp vụ thanh toán

Thanh toán là một phân hệ rất quan trọng. Hệ thống cần hỗ trợ cho khách hàng thanh toán đầy đủ cho booking, đồng thời có khả năng tích hợp thanh toán thông qua bên thứ ba.

Các phương thức thanh toán có thể gồm:

- Tiền mặt
- Chuyển khoản
- Thẻ
- Ví điện tử
- Cổng thanh toán bên thứ ba

Hệ thống cần lưu lại giao dịch với các thông tin:

- Booking tương ứng
- Số tiền thanh toán
- Phương thức thanh toán
- Mã giao dịch
- Trạng thái thanh toán
- Thời gian thanh toán
- Đơn vị trung gian nếu có

Để đúng nghiệp vụ hơn, hệ thống cần theo dõi rõ:

- Chưa thanh toán
- Đã thanh toán một phần
- Đã thanh toán đầy đủ
- Thanh toán thất bại
- Hoàn tiền

Góp ý “thanh toán hết” được hiểu là hệ thống phải có khả năng xác định khách hàng đã thanh toán đủ hay chưa, không chỉ lưu một trạng thái chung chung.

### 7.8. Nghiệp vụ hóa đơn và phiếu xác nhận tour

Sau khi khách hàng thanh toán hợp lệ và booking được xác nhận, hệ thống có thể sinh:

- **Hóa đơn**: thể hiện thông tin tài chính của booking
- **Phiếu xác nhận tour**: xác nhận khách hàng đã đăng ký tour thành công

Bảng hóa đơn và phiếu xác nhận giúp hệ thống thể hiện quy trình sau bán đầy đủ và chuyên nghiệp hơn.

### 7.9. Nghiệp vụ hủy booking và hoàn tiền

Trong thực tế, khách hàng có thể hủy booking sau khi đã đặt tour. Hệ thống cần hỗ trợ quy trình này một cách có kiểm soát.

Quy trình nghiệp vụ gồm:

1. Khách hàng gửi yêu cầu hủy booking
2. Hệ thống lưu lý do hủy
3. Admin xem yêu cầu hủy
4. Admin nhập phí hủy và số tiền hoàn
5. Duyệt hoặc từ chối yêu cầu
6. Nếu duyệt thì cập nhật trạng thái booking
7. Nếu có hoàn tiền thì cập nhật giao dịch tương ứng
8. Cập nhật lại số chỗ của lịch khởi hành

### 7.10. Nghiệp vụ đánh giá và comment

Sau khi khách hoàn tất chuyến đi, họ có thể gửi đánh giá và comment cho tour. Hệ thống cần hỗ trợ:

- Chấm điểm sao
- Viết comment nhận xét
- Lưu thời điểm đánh giá
- Quản lý trạng thái duyệt
- Thống kê số lượng người đánh giá
- Thống kê tổng số comment
- Tính điểm đánh giá trung bình của tour

Việc tách rõ **đánh giá** và **comment** làm cho hệ thống sát thực tế hơn. Một đánh giá có thể bao gồm:

- Điểm số định lượng, ví dụ 1 đến 5 sao
- Comment định tính, thể hiện ý kiến của khách hàng

Thông tin này rất quan trọng khi hiển thị ở trang chi tiết tour, ví dụ:

- 4.7/5 sao
- 128 lượt đánh giá
- 96 comment từ khách hàng

### 7.11. Nghiệp vụ hỗ trợ khách hàng

Ngoài các phân hệ chính, hệ thống cần có phần hỗ trợ khách hàng để xử lý các vấn đề phát sinh. Phần hỗ trợ bao gồm:

- Gửi liên hệ/góp ý
- Gửi câu hỏi về tour
- Nhận phản hồi từ hệ thống
- Nhận thông báo liên quan đến booking và thanh toán

Việc bổ sung phân hệ hỗ trợ giúp hệ thống hoàn chỉnh hơn, đồng thời đúng với góp ý về “phần hỗ trợ”.

---

## 8. Chức năng hệ thống

## 8.1. Chức năng dành cho Khách hàng

### Quản lý tài khoản
- Đăng ký tài khoản
- Đăng nhập
- Đăng xuất
- Cập nhật hồ sơ cá nhân
- Đổi mật khẩu

### Tìm kiếm và xem tour
- Xem danh sách tour
- Xem chi tiết tour
- Tìm kiếm tour theo tên, địa điểm, loại tour, giá
- Xem giá ngày thường và giá cuối tuần
- Xem lịch trình tour
- Xem lịch khởi hành
- Lưu tour yêu thích

### Đặt tour
- Chọn lịch khởi hành
- Nhập thông tin liên hệ
- Nhập số lượng người lớn, trẻ em
- Nhập danh sách hành khách
- Áp dụng voucher
- Tạo booking

### Thanh toán
- Chọn phương thức thanh toán
- Thanh toán booking
- Thanh toán qua cổng thanh toán bên thứ ba
- Theo dõi trạng thái giao dịch
- Xem tình trạng đã thanh toán đủ hay chưa

### Theo dõi booking
- Xem lịch sử booking
- Xem chi tiết booking
- Xem thông tin hành khách
- Xem hóa đơn và phiếu xác nhận tour

### Hủy và đánh giá
- Gửi yêu cầu hủy booking
- Theo dõi trạng thái xử lý hủy
- Đánh giá tour
- Gửi comment sau chuyến đi

### Hỗ trợ khác
- Xem tin tức
- Gửi liên hệ/góp ý
- Gửi yêu cầu hỗ trợ
- Xem thông báo từ hệ thống

## 8.2. Chức năng dành cho Admin

### Quản lý người dùng
- Xem danh sách người dùng
- Khóa/mở khóa tài khoản
- Tạo tài khoản Admin nếu cần

### Quản lý danh mục
- Quản lý loại tour
- Quản lý địa điểm

### Quản lý tour
- Thêm tour mới
- Cập nhật tour
- Ẩn tour
- Cập nhật trạng thái tour
- Quản lý điểm đến của tour
- Quản lý ảnh tour
- Quản lý lịch trình tour
- Quản lý thời điểm chi tiết trong lịch trình

> Lưu ý: hệ thống **không cần chức năng xóa tour**. Khi tour không còn sử dụng, Admin chỉ cần ẩn tour hoặc chuyển sang trạng thái ngừng hiển thị.

### Quản lý giá tour
- Thiết lập giá tour
- Thiết lập giá cuối tuần
- Thiết lập giá theo từng lịch khởi hành
- Thiết lập giá người lớn và trẻ em

### Quản lý lịch khởi hành
- Tạo lịch khởi hành
- Cập nhật giá
- Cập nhật số chỗ
- Hủy đợt tour nếu cần

### Quản lý voucher
- Tạo voucher
- Cập nhật voucher
- Bật/tắt voucher

### Quản lý booking
- Xem danh sách booking
- Xem chi tiết booking
- Xem số lượng khách từng booking
- Xem danh sách hành khách
- Xác nhận booking
- Cập nhật trạng thái booking

### Quản lý thanh toán
- Xem giao dịch thanh toán
- Xác nhận giao dịch
- Theo dõi thanh toán đầy đủ
- Quản lý giao dịch thanh toán qua bên thứ ba
- Cập nhật trạng thái thanh toán

### Quản lý hóa đơn và phiếu xác nhận
- Tạo hóa đơn
- Tạo phiếu xác nhận tour

### Quản lý hủy booking
- Xem yêu cầu hủy
- Tính phí hủy
- Tính số tiền hoàn
- Duyệt hoặc từ chối yêu cầu hủy

### Quản lý đánh giá và comment
- Xem đánh giá
- Xem comment
- Duyệt/ẩn đánh giá
- Thống kê số người đánh giá
- Thống kê số lượng comment

### Quản lý hỗ trợ khách hàng
- Xem liên hệ/góp ý
- Phản hồi khách hàng
- Gửi thông báo hỗ trợ

### Báo cáo
- Xem dashboard tổng quan
- Xem báo cáo doanh thu
- Xem báo cáo số khách
- Xem top tour bán chạy
- Xem số lượng đánh giá và comment theo tour

---

## 9. Quy trình nghiệp vụ chính

### 9.1. Quy trình quản lý tour

1. Admin đăng nhập hệ thống
2. Admin tạo tour mới
3. Nhập loại tour, điểm xuất phát, số ngày, mô tả
4. Thêm các điểm đến
5. Thêm ảnh tour
6. Xây dựng lịch trình chi tiết
7. Khai báo thời điểm cụ thể cho từng hoạt động nếu cần
8. Thiết lập giá ngày thường và giá cuối tuần
9. Tạo một hoặc nhiều lịch khởi hành
10. Cập nhật giá bán, số chỗ
11. Chuyển tour sang trạng thái mở bán

### 9.2. Quy trình đặt tour

1. Khách hàng truy cập website
2. Tìm kiếm tour phù hợp
3. Xem chi tiết tour, lịch trình, giá và lịch khởi hành
4. Chọn một lịch khởi hành
5. Nhập thông tin liên hệ
6. Nhập số lượng người lớn, trẻ em
7. Nhập danh sách hành khách
8. Áp dụng voucher nếu có
9. Hệ thống tính tạm tính, giảm giá và tổng tiền
10. Hệ thống tạo booking

### 9.3. Quy trình thanh toán

1. Khách chọn booking cần thanh toán
2. Chọn phương thức thanh toán
3. Nếu thanh toán nội bộ, hệ thống ghi nhận giao dịch
4. Nếu thanh toán qua bên thứ ba, hệ thống chuyển qua cổng thanh toán
5. Nhận kết quả thanh toán
6. Cập nhật trạng thái giao dịch
7. Xác định khách hàng đã thanh toán đủ hay chưa
8. Nếu hợp lệ thì Admin xác nhận booking
9. Hệ thống có thể sinh hóa đơn và phiếu xác nhận tour

### 9.4. Quy trình hủy booking

1. Khách chọn booking cần hủy
2. Nhập lý do hủy
3. Hệ thống tạo yêu cầu hủy
4. Admin xem danh sách yêu cầu hủy
5. Nhập phí hủy và số tiền hoàn
6. Duyệt hoặc từ chối yêu cầu
7. Nếu duyệt, booking chuyển sang đã hủy
8. Cập nhật trạng thái hoàn tiền nếu có
9. Trả lại số chỗ cho lịch khởi hành

### 9.5. Quy trình đánh giá và comment

1. Booking hoàn tất
2. Khách hàng truy cập trang booking
3. Gửi số sao và comment
4. Hệ thống lưu đánh giá
5. Cập nhật tổng số người đánh giá và tổng số comment của tour
6. Admin xem và duyệt đánh giá
7. Đánh giá hợp lệ được hiển thị trên website

### 9.6. Quy trình hỗ trợ khách hàng

1. Khách hàng gửi câu hỏi hoặc góp ý
2. Hệ thống lưu yêu cầu hỗ trợ
3. Admin xem danh sách hỗ trợ
4. Admin xử lý và phản hồi
5. Hệ thống gửi thông báo cho khách hàng

---

## 10. Quy tắc nghiệp vụ

Hệ thống phải tuân thủ các quy tắc sau:

1. Mỗi người dùng có một email duy nhất.
2. Mỗi người dùng chỉ thuộc một vai trò là Admin hoặc Khách hàng.
3. Mỗi tour có một mã tour duy nhất.
4. Mỗi tour thuộc một loại tour.
5. Mỗi tour có một điểm xuất phát nhưng có thể có nhiều điểm đến.
6. Một tour có thể có nhiều ảnh và nhiều mục lịch trình.
7. Một tour có thể có nhiều lịch khởi hành.
8. Mỗi lịch khởi hành có mã đợt tour duy nhất.
9. Số chỗ đã đặt của lịch khởi hành không được lớn hơn số chỗ tối đa.
10. Mỗi booking thuộc về một khách hàng và một lịch khởi hành.
11. Mỗi booking có thể có nhiều hành khách.
12. Hệ thống phải quản lý được số lượng người lớn và trẻ em.
13. Đơn giá tại thời điểm đặt phải được lưu lại để tránh thay đổi khi giá tour cập nhật.
14. Tour có thể áp dụng giá khác nhau theo thời điểm, bao gồm giá ngày thường và giá cuối tuần.
15. Voucher chỉ được áp dụng khi còn hiệu lực và còn số lượng sử dụng.
16. Mỗi booking chỉ có tối đa một hóa đơn.
17. Mỗi booking chỉ có tối đa một phiếu xác nhận tour.
18. Mỗi booking chỉ có tối đa một yêu cầu hủy booking.
19. Mỗi booking chỉ được đánh giá một lần.
20. Mỗi đánh giá có thể đi kèm comment.
21. Hệ thống phải thống kê được số lượng người đánh giá và số lượng comment của mỗi tour.
22. Chỉ Admin mới có quyền xác nhận booking, xác nhận thanh toán, xử lý hủy và duyệt đánh giá.
23. Chỉ booking hợp lệ mới được tạo hóa đơn và phiếu xác nhận.
24. Việc cập nhật số chỗ lịch khởi hành phải đồng bộ với trạng thái booking.
25. Hệ thống không xóa cứng tour; chỉ ẩn tour hoặc chuyển trạng thái ngừng hiển thị.
26. Hệ thống phải phân biệt giữa thời gian tổng thể của tour và thời điểm cụ thể của từng hoạt động trong lịch trình.
27. Hệ thống phải quản lý được việc thanh toán đã đủ hay chưa.
28. Hệ thống cần hỗ trợ thanh toán thông qua bên thứ ba.

---

## 11. Phân tích cơ sở dữ liệu theo nghiệp vụ

Cơ sở dữ liệu của hệ thống được xây dựng khá đầy đủ, bám đúng nghiệp vụ và có thể sử dụng tốt cho bài tập lớn. Tuy nhiên, để phù hợp hơn với góp ý của cô, phần trình bày cần nhấn mạnh thêm một số điểm sau:

### 11.1. Phân hệ người dùng
Bảng `NguoiDung` lưu thông tin tài khoản của cả Admin và Khách hàng, bao gồm email, mật khẩu, họ tên, số điện thoại, địa chỉ, ảnh đại diện, vai trò và trạng thái.

### 11.2. Phân hệ tour
Các bảng `LoaiTour`, `DiaDiem`, `Tour`, `TourDiemDen`, `AnhTour`, `LichTrinh`, `LichKhoiHanh` hỗ trợ mô hình hóa tour đầy đủ.

Đặc biệt:
- `Tour` lưu thông tin tổng quát
- `LichTrinh` lưu chi tiết hoạt động theo ngày
- `LichKhoiHanh` lưu từng đợt bán thực tế

Nếu muốn phù hợp hơn với góp ý về thời điểm trong tour, phần `LichTrinh` nên có thể mở rộng thêm:
- thời điểm bắt đầu
- thời điểm kết thúc

### 11.3. Phân hệ giá
Hiện hệ thống có giá ở tour và giá ở lịch khởi hành. Khi trình bày báo cáo, cần bổ sung giải thích rằng hệ thống có thể mở rộng để quản lý:
- giá ngày thường
- giá cuối tuần
- giá theo lịch khởi hành

### 11.4. Phân hệ booking và khách hàng
Bảng `Booking` và `HanhKhach` đã đúng hướng vì:
- lưu thông tin liên hệ
- lưu số lượng khách khác nhau
- lưu danh sách người đi thực tế
- lưu đơn giá tại thời điểm đặt

Đây là phần quan trọng để xử lý nghiệp vụ “quản lý khách: số lượng khác nhau”.

### 11.5. Phân hệ thanh toán
Bảng `ThanhToan` đã phù hợp để lưu:
- số tiền
- phương thức thanh toán
- mã giao dịch
- trạng thái giao dịch
- thời gian giao dịch

Khi viết báo cáo, cần bổ sung rằng hệ thống hỗ trợ:
- thanh toán nội bộ
- thanh toán bên thứ ba
- theo dõi thanh toán đầy đủ

### 11.6. Phân hệ đánh giá và comment
Bảng `DanhGia` hiện đang phù hợp để lưu:
- số sao
- bình luận
- ngày đánh giá
- trạng thái duyệt

Khi mô tả nghiệp vụ, cần nhấn mạnh rằng:
- bình luận chính là phần comment của khách hàng
- hệ thống có thể thống kê số lượng người đánh giá
- hệ thống có thể thống kê số comment hiển thị theo tour

### 11.7. Phân hệ hỗ trợ
Các bảng `LienHe` và `ThongBao` là nền tảng cho phần hỗ trợ khách hàng. Đây là điểm cần được giữ trong bài vì cô có góp ý về phần hỗ trợ.

### 11.8. Phân hệ trạng thái và ẩn tour
Do hệ thống không yêu cầu xóa cứng dữ liệu, trạng thái tour cần được dùng để:
- hiển thị tour
- tạm ngưng tour
- ẩn tour
- ngừng kinh doanh tour

Đây là hướng đúng nghiệp vụ hơn so với cho phép xóa trực tiếp.

---

## 12. Use Case tổng quát

### 12.1. Use Case của Khách hàng

- Đăng ký tài khoản
- Đăng nhập
- Đăng xuất
- Cập nhật hồ sơ cá nhân
- Đổi mật khẩu
- Xem danh sách tour
- Xem chi tiết tour
- Tìm kiếm tour
- Xem lịch khởi hành
- Xem giá theo thời điểm
- Thêm tour yêu thích
- Bỏ tour yêu thích
- Đặt tour
- Thanh toán booking
- Thanh toán qua bên thứ ba
- Xem lịch sử booking
- Xem chi tiết booking
- Hủy booking
- Đánh giá tour
- Gửi comment
- Xem tin tức
- Gửi liên hệ/góp ý
- Xem thông báo

### 12.2. Use Case của Admin

- Đăng nhập
- Quản lý tài khoản người dùng
- Quản lý loại tour
- Quản lý địa điểm
- Quản lý tour
- Quản lý điểm đến của tour
- Quản lý ảnh tour
- Quản lý lịch trình tour
- Quản lý thời điểm hoạt động trong lịch trình
- Quản lý lịch khởi hành
- Quản lý giá ngày thường và giá cuối tuần
- Quản lý voucher
- Quản lý booking
- Quản lý thanh toán
- Quản lý thanh toán bên thứ ba
- Tạo hóa đơn
- Tạo phiếu xác nhận tour
- Xử lý yêu cầu hủy booking
- Quản lý đánh giá và comment
- Quản lý hỗ trợ khách hàng
- Gửi thông báo
- Ẩn tour
- Xem dashboard
- Xem báo cáo doanh thu
- Xem báo cáo số khách
- Xem báo cáo số lượng đánh giá và comment

---

## 13. Yêu cầu phi chức năng

### 13.1. Hiệu năng
- Hệ thống phải có khả năng phản hồi nhanh khi tìm kiếm tour
- Các trang danh sách và chi tiết cần tải ổn định
- Các truy vấn thống kê cần được tối ưu bằng index

### 13.2. Bảo mật
- Phân quyền rõ ràng giữa Admin và Khách hàng
- Khách hàng không được truy cập trang quản trị
- Trong thực tế mật khẩu cần được mã hóa
- Dữ liệu người dùng cần được bảo vệ
- Giao dịch thanh toán bên thứ ba cần được xác thực an toàn

### 13.3. Tính chính xác
- Không cho đặt vượt số chỗ của lịch khởi hành
- Đơn giá tại thời điểm đặt phải được lưu chính xác
- Dữ liệu booking, thanh toán và hủy booking phải đồng bộ
- Hệ thống phải xác định chính xác khách hàng đã thanh toán đủ hay chưa

### 13.4. Tính dễ sử dụng
- Giao diện thân thiện, dễ thao tác
- Quy trình đặt tour rõ ràng
- Thông tin tour hiển thị đầy đủ
- Có thể dùng tốt trên cả máy tính và điện thoại

### 13.5. Khả năng mở rộng
- Có thể tích hợp thêm nhiều cổng thanh toán online
- Có thể tích hợp gửi email xác nhận
- Có thể sinh voucher PDF
- Có thể mở rộng phần hỗ trợ khách hàng
- Có thể mở rộng thống kê chuyên sâu về đánh giá và comment

---

## 14. Báo cáo và dashboard

Từ cơ sở dữ liệu hiện tại, hệ thống có thể xây dựng các báo cáo sau:

- Tổng số tour
- Tổng số khách hàng
- Tổng số booking
- Booking theo trạng thái
- Doanh thu theo ngày/tháng/năm
- Doanh thu theo tour
- Số lượng khách theo tour
- Số lượng khách theo lịch khởi hành
- Top tour được đặt nhiều nhất
- Số lượng yêu cầu hủy booking
- Số lượng đánh giá theo tour
- Số lượng comment theo tour
- Điểm đánh giá trung bình theo tour

Dashboard của Admin có thể hiển thị:

- Tổng số tour đang mở bán
- Tổng số khách hàng
- Tổng số booking
- Tổng doanh thu
- Booking chờ thanh toán
- Booking đã thanh toán đủ
- Booking đã hủy
- Top tour bán chạy
- Biểu đồ doanh thu theo tháng
- Biểu đồ số lượng booking theo trạng thái
- Biểu đồ số lượng đánh giá và comment theo tour

---

## 15. Kết luận

Đề tài **Xây dựng website quản lý du lịch và đặt tour** là một đề tài có tính thực tế cao, phù hợp với kiến thức phân tích thiết kế hệ thống và xây dựng website. Hệ thống được giới hạn ở 2 vai trò là **Admin** và **Khách hàng**, giúp phạm vi triển khai hợp lý nhưng vẫn đảm bảo đầy đủ nghiệp vụ chính.

Sau khi tiếp thu góp ý và chỉnh sửa, hệ thống đã được hoàn thiện hơn ở các điểm quan trọng như:

- Quản lý giá theo thời điểm, đặc biệt là **giá cuối tuần**
- Bổ sung phần **hỗ trợ khách hàng**
- Quản lý **thanh toán đầy đủ** và **thanh toán qua bên thứ ba**
- Quản lý **số lượng khách khác nhau**
- Bổ sung **đánh giá và comment**
- Thống kê **số lượng người đánh giá** và **số lượng comment**
- Áp dụng nguyên tắc **ẩn tour thay vì xóa**
- Phân biệt rõ giữa **thời gian tổng thể** và **thời điểm chi tiết** trong tour

Nhìn chung, hệ thống đã bao quát được toàn bộ quy trình nghiệp vụ cơ bản của một website du lịch: từ quản lý tour, quản lý giá, tìm kiếm tour, đặt tour, thanh toán, xác nhận, hủy/hoàn đến đánh giá và hỗ trợ sau chuyến đi. Đây là nền tảng tốt để tiếp tục triển khai các phần tiếp theo như sơ đồ ERD, use case diagram, activity diagram, class diagram, truy vấn SQL chức năng và thiết kế giao diện.

---

## 16. API hiện tại của hệ thống

Hiện tại frontend sử dụng mô hình gọi API thông qua **API Gateway**. Trong file `FE_QuanLyDuLichVaDatTour/src/constant/api.ts`, biến `API_BASE_URL` mặc định là `/gateway`, nghĩa là phía frontend sẽ gọi các API qua gateway trước khi chuyển tiếp sang backend thực tế.

Ví dụ:
- Frontend gọi `/gateway/tour/get-all`
- Gateway sẽ chuyển tiếp sang backend theo cấu hình Ocelot

Cách tổ chức này giúp frontend chỉ cần dùng một đầu mối thống nhất để truy cập các dịch vụ phía sau như hệ thống nghiệp vụ chính và dịch vụ xác thực.

### 16.1. Nhóm API công khai đang có

#### API tour
- `GET /tour/get-all`
  Dùng để lấy danh sách tour đang hiển thị.
- `GET /tour/search`
  Dùng để tìm kiếm tour theo từ khóa, loại tour, địa điểm, khoảng giá và số ngày.
- `GET /tour/get-by-id/{id}`
  Dùng để lấy chi tiết một tour theo id.

#### API loại tour
- `GET /loai-tour/get-all`
  Dùng để lấy toàn bộ loại tour đang hoạt động.
- `GET /loai-tour/get-by-id/{id}`
  Dùng để lấy chi tiết loại tour.

#### API địa điểm
- `GET /dia-diem/get-all`
  Dùng để lấy danh sách địa điểm.
- `GET /dia-diem/get-by-id/{id}`
  Dùng để lấy chi tiết địa điểm.

#### API lịch khởi hành
- `GET /lich-khoi-hanh/get-by-tour/{tourId}`
  Dùng để lấy danh sách lịch khởi hành của một tour cụ thể.

#### API lịch trình
- `GET /lich-trinh/get-by-tour/{tourId}`
  Dùng để lấy lịch trình chi tiết của một tour.

#### API booking
- `POST /booking/create`
  Dùng để tạo booking mới.
- `GET /booking/my-bookings`
  Dùng để lấy danh sách booking của khách hàng hiện tại.
- `GET /booking/get-by-id/{id}`
  Dùng để lấy chi tiết booking theo id.

#### API thanh toán
- `POST /payment/create`
  Dùng để tạo giao dịch thanh toán.
- `GET /payment/booking/{bookingId}`
  Dùng để lấy danh sách giao dịch theo booking.
- `GET /payment/{id}`
  Dùng để lấy chi tiết một giao dịch thanh toán.

### 16.2. Nhóm API quản trị đang có

Hệ thống backend cũng đã có sẵn một số API quản trị cho Admin, tiêu biểu như:

- `GET /admin/tour/get-all`
- `GET /admin/tour/get-by-id/{id}`
- `POST /admin/tour/create`
- `PUT /admin/tour/update/{id}`
- `PATCH /admin/tour/update-status/{id}`
- `PATCH /admin/tour/hide/{id}`
- `GET /admin/loai-tour/get-all`
- `POST /admin/loai-tour/create`
- `PUT /admin/loai-tour/update/{id}`
- `PATCH /admin/loai-tour/update-status/{id}`
- `GET /admin/dia-diem/get-all`
- `POST /admin/dia-diem/create`
- `PUT /admin/dia-diem/update/{id}`
- `PATCH /admin/dia-diem/update-status/{id}`
- `GET /admin/lich-khoi-hanh/get-all`
- `GET /admin/lich-khoi-hanh/get-by-tour/{tourId}`
- `POST /admin/lich-khoi-hanh/create`
- `PUT /admin/lich-khoi-hanh/update/{id}`
- `PATCH /admin/lich-khoi-hanh/update-status/{id}`
- `GET /admin/booking/get-all`
- `GET /admin/booking/get-by-id/{id}`
- `PATCH /admin/booking/update-status/{id}`
- `GET /admin/payment/get-all`
- `GET /admin/payment/get-by-id/{id}`
- `PATCH /admin/payment/update-status/{id}`

Các API này là nền tảng để hoàn thiện dashboard và giao diện quản trị cho Admin trong các giai đoạn tiếp theo.

---

## 17. API frontend đang sử dụng

Qua kiểm tra phần code frontend hiện tại, các API đang được dùng trực tiếp gồm:

### 17.1. Ở trang chủ và trang tour
- `GET /tour/get-all`
  Được dùng để lấy danh sách tour nổi bật và danh sách tour tổng quát.
- `GET /tour/search`
  Được dùng ở trang tìm kiếm / lọc tour.
- `GET /loai-tour/get-all`
  Được dùng để lấy bộ lọc loại tour.
- `GET /dia-diem/get-all`
  Được dùng để lấy bộ lọc địa điểm.
- `GET /lich-khoi-hanh/get-by-tour/{tourId}`
  Được dùng để lấy lịch khởi hành gần theo từng tour hiển thị ở trang chủ.

### 17.2. Ở phần xác thực
Frontend cũng đã kết nối với các API xác thực thông qua gateway, phục vụ cho đăng nhập và đăng ký tài khoản.

---

## 18. API còn thiếu / chưa tích hợp

Mặc dù backend hiện đã có khá nhiều endpoint, nhưng frontend vẫn chưa sử dụng hết các API quan trọng. Những API còn thiếu hoặc chưa được tích hợp đầy đủ gồm:

### 18.1. Chi tiết tour
- `GET /tour/get-by-id/{id}`
- `GET /lich-trinh/get-by-tour/{tourId}`

Hiện frontend chưa có trang chi tiết tour riêng, nên các API này vẫn chưa được tận dụng để hiển thị thông tin đầy đủ như ảnh, lịch trình, danh sách điểm đến và lịch khởi hành của từng tour.

### 18.2. Booking
- `POST /booking/create`
- `GET /booking/my-bookings`
- `GET /booking/get-by-id/{id}`

Backend đã hỗ trợ tạo booking và xem thông tin booking, nhưng frontend chưa hoàn thiện đầy đủ luồng đặt tour thực tế cho khách hàng.

### 18.3. Thanh toán
- `POST /payment/create`
- `GET /payment/booking/{bookingId}`
- `GET /payment/{id}`

Các API thanh toán đã có ở backend nhưng phía frontend chưa triển khai đầy đủ giao diện thanh toán, tra cứu giao dịch và theo dõi trạng thái thanh toán.

### 18.4. API quản trị
Nhóm API admin đã có khá nhiều endpoint, nhưng frontend hiện chưa hoàn thiện giao diện quản trị tương ứng cho các chức năng như:
- quản lý tour
- quản lý loại tour
- quản lý địa điểm
- quản lý lịch khởi hành
- quản lý booking
- quản lý thanh toán

### 18.5. API nên bổ sung thêm trong tương lai
Ngoài các API đã có, trong tương lai hệ thống nên mở rộng thêm một số API chuyên biệt để frontend dễ sử dụng hơn, ví dụ:

- API lấy **chi tiết tour đầy đủ** gồm thông tin tour, ảnh, lịch trình và lịch khởi hành trong một lần gọi
- API lấy **danh sách lịch khởi hành tổng hợp** thay vì phải gọi riêng từng tour
- API lấy **tour nổi bật thực sự** theo tiêu chí như nhiều lượt đặt, đánh giá cao hoặc được đánh dấu nổi bật
- API thống kê cho dashboard Admin như doanh thu, booking theo trạng thái, top tour bán chạy

---

## 19. Kết luận về hiện trạng API

Có thể thấy rằng backend của hệ thống đã xây dựng được nền tảng API khá tốt cho các nghiệp vụ cốt lõi như tour, lịch khởi hành, booking, thanh toán và quản trị. Tuy nhiên, frontend hiện mới chỉ tích hợp một phần các API công khai cho việc hiển thị và tìm kiếm tour.

Vì vậy, giai đoạn tiếp theo của dự án nên tập trung vào:
- hoàn thiện trang chi tiết tour
- hoàn thiện luồng đặt tour
- tích hợp thanh toán
- xây dựng giao diện quản trị sử dụng các API admin đã có
- bổ sung thêm các API tổng hợp để giảm số lần gọi từ frontend

---

## 20. Phụ lục: Gợi ý thứ tự ưu tiên tích hợp API

### Mức ưu tiên cao
- API chi tiết tour
- API lịch trình tour
- API tạo booking
- API lấy booking của khách hàng
- API tạo thanh toán

### Mức ưu tiên trung bình
- API chi tiết thanh toán
- API quản lý booking cho Admin
- API quản lý lịch khởi hành cho Admin
- API quản lý tour cho Admin

### Mức ưu tiên mở rộng
- API báo cáo dashboard
- API tour nổi bật theo thống kê
- API lịch khởi hành tổng hợp

---

## 21. Ghi chú triển khai frontend

Trong code frontend hiện tại, dữ liệu hiển thị của phần tour nổi bật đang được lấy từ API `GET /tour/get-all`, sau đó map sang model dùng cho UI card. Điều này giúp phần giao diện đã có dữ liệu thật để hiển thị, nhưng cũng cho thấy rằng frontend hiện vẫn đang phải tự xử lý và kết hợp dữ liệu ở phía client.

Vì vậy, nếu tiếp tục mở rộng hệ thống, nên thiết kế thêm các API trả về dữ liệu gần với đúng nhu cầu giao diện hơn, giúp giảm xử lý ở frontend và làm cho luồng dữ liệu rõ ràng, ổn định hơn.

---

## 22. Tổng kết

Phần API của hệ thống hiện đã đủ nền tảng để phát triển hoàn chỉnh cả website khách hàng và trang quản trị. Việc cần làm tiếp không phải là xây lại từ đầu mà là:
- tích hợp dần các API backend đã có vào frontend
- bổ sung thêm các API tổng hợp còn thiếu
- chuẩn hóa tài liệu API để việc phát triển các phần sau được thuận lợi hơn

---

## 23. Kết luận cuối cùng

Hệ thống website quản lý du lịch và đặt tour hiện đã có đầy đủ cơ sở nghiệp vụ, cơ sở dữ liệu và nền tảng API để tiếp tục phát triển thành một sản phẩm hoàn chỉnh hơn. Việc tiếp tục hoàn thiện giao diện, bổ sung các luồng nghiệp vụ còn thiếu và tích hợp toàn bộ API sẽ giúp đề tài trở nên chặt chẽ, thực tế và có tính ứng dụng cao hơn.

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---
n
---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---
n
---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---
n
---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---
---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---
n
---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---
---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---
---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---

---
