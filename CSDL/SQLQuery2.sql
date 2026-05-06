USE QuanLyDuLich;
GO


/* =========================================================
   SEED DATA - CHAY SAU KHI DA TAO BANG
   ========================================================= */

/* 1. NGUOI DUNG */
INSERT INTO dbo.NguoiDung
    (Email, MatKhau, HoTen, SoDienThoai, DiaChi, AnhDaiDien, VaiTro, TrangThai)
VALUES
    (N'admin@dulichviet.vn', N'123456', N'Quản trị hệ thống', N'0900000001', N'1 Nguyễn Huệ, Quận 1, TP.HCM', N'/images/users/admin.jpg', N'admin', N'hoat_dong'),
    (N'nguyenvana@gmail.com', N'123456', N'Nguyễn Văn A', N'0901111111', N'12 Lê Lợi, Quận 1, TP.HCM', N'/images/users/kh1.jpg', N'khach_hang', N'hoat_dong'),
    (N'tranthib@gmail.com', N'123456', N'Trần Thị B', N'0902222222', N'45 Hai Bà Trưng, Quận 3, TP.HCM', N'/images/users/kh2.jpg', N'khach_hang', N'hoat_dong'),
    (N'phamvan.c@gmail.com', N'123456', N'Phạm Văn C', N'0903333333', N'88 Võ Văn Tần, Quận 3, TP.HCM', N'/images/users/kh3.jpg', N'khach_hang', N'bi_khoa');
GO


/* 2. LOAI TOUR */
INSERT INTO dbo.LoaiTour
    (TenLoai, MoTa, TrangThai)
VALUES
    (N'Trong nước', N'Các tour du lịch nội địa Việt Nam', N'hoat_dong'),
    (N'Nghỉ dưỡng', N'Tour nghỉ dưỡng, resort, biển đảo', N'hoat_dong'),
    (N'Khám phá', N'Tour trải nghiệm và khám phá', N'hoat_dong');
GO


/* 3. DIA DIEM */
INSERT INTO dbo.DiaDiem
    (TenDiaDiem, TinhThanh, QuocGia, MoTa, TrangThai)
VALUES
    (N'TP. Hồ Chí Minh', N'TP. Hồ Chí Minh', N'Viet Nam', N'Điểm xuất phát chính của nhiều tour.', N'hoat_dong'),
    (N'Đà Nẵng', N'Đà Nẵng', N'Viet Nam', N'Thành phố biển miền Trung.', N'hoat_dong'),
    (N'Hội An', N'Quảng Nam', N'Viet Nam', N'Phố cổ nổi tiếng và di sản văn hóa.', N'hoat_dong'),
    (N'Bà Nà Hills', N'Đà Nẵng', N'Viet Nam', N'Khu du lịch nổi tiếng với Cầu Vàng.', N'hoat_dong'),
    (N'Phú Quốc', N'Kiên Giang', N'Viet Nam', N'Thành phố đảo nghỉ dưỡng nổi tiếng.', N'hoat_dong'),
    (N'Grand World Phú Quốc', N'Kiên Giang', N'Viet Nam', N'Khu vui chơi, mua sắm, giải trí.', N'hoat_dong'),
    (N'Nha Trang', N'Khánh Hòa', N'Viet Nam', N'Thành phố biển nổi tiếng với vịnh đẹp và nhiều đảo.', N'hoat_dong'),
    (N'VinWonders Nha Trang', N'Khánh Hòa', N'Viet Nam', N'Tổ hợp vui chơi giải trí nổi tiếng tại Nha Trang.', N'hoat_dong'),
    (N'Hòn Mun Nha Trang', N'Khánh Hòa', N'Viet Nam', N'Điểm lặn ngắm san hô nổi tiếng tại Nha Trang.', N'hoat_dong'),
    (N'Đà Lạt', N'Lâm Đồng', N'Viet Nam', N'Thành phố ngàn hoa, khí hậu mát mẻ quanh năm.', N'hoat_dong'),
    (N'Langbiang', N'Lâm Đồng', N'Viet Nam', N'Đỉnh núi nổi tiếng gắn với trải nghiệm săn mây.', N'hoat_dong'),
    (N'Hà Nội', N'Hà Nội', N'Viet Nam', N'Thủ đô nghìn năm văn hiến.', N'hoat_dong'),
    (N'Vịnh Hạ Long', N'Quảng Ninh', N'Viet Nam', N'Vịnh biển di sản thiên nhiên thế giới.', N'hoat_dong'),
    (N'Tràng An', N'Ninh Bình', N'Viet Nam', N'Vùng đất cố đô với Tràng An, Tam Cốc.', N'hoat_dong'),
    (N'Huế', N'Thừa Thiên Huế', N'Viet Nam', N'Cố đô với quần thể di tích triều Nguyễn.', N'hoat_dong');
GO


/* 4. TOUR */
INSERT INTO dbo.Tour
    (MaTour, TenTour, LoaiTourId, DiemXuatPhatId, SoNgay, SoDem, PhuongTien,
     GiaTuThamKhao, MoTaNgan, MoTaChiTiet, DieuKienTour, IsNoiBat, TrangThai)
VALUES
    (
        N'TOUR-DN-001',
        N'Đà Nẵng - Hội An - Bà Nà Hills 3N2Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Trong nước'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'TP. Hồ Chí Minh'),
        3, 2, N'Máy bay',
        3990000,
        N'Tour tham quan Đà Nẵng, Hội An và Bà Nà Hills trong 3 ngày 2 đêm.',
        N'Tour kết hợp nghỉ dưỡng và tham quan các điểm nổi bật miền Trung.',
        N'Giá không bao gồm chi phí cá nhân ngoài chương trình.',
        1,
        N'dang_mo_ban'
    ),
    (
        N'TOUR-PQ-001',
        N'Phú Quốc nghỉ dưỡng 4N3Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Nghỉ dưỡng'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'TP. Hồ Chí Minh'),
        4, 3, N'Máy bay',
        6490000,
        N'Tour nghỉ dưỡng biển đảo tại Phú Quốc 4 ngày 3 đêm.',
        N'Tour phù hợp gia đình, cặp đôi và nhóm bạn.',
        N'Khách mang theo giấy tờ tùy thân hợp lệ khi làm thủ tục.',
        1,
        N'dang_mo_ban'
    ),
    (
        N'TOUR-NT-001',
        N'Nha Trang - VinWonders - Hòn Mun 3N2Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Nghỉ dưỡng'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'TP. Hồ Chí Minh'),
        3, 2, N'Máy bay',
        4590000,
        N'Tour biển Nha Trang kết hợp vui chơi VinWonders và tham quan đảo.',
        N'Lịch trình phù hợp gia đình, nhóm bạn yêu biển và trải nghiệm nghỉ dưỡng.',
        N'Giá chưa bao gồm chi phí cá nhân và dịch vụ ngoài chương trình.',
        1,
        N'dang_mo_ban'
    ),
    (
        N'TOUR-DL-001',
        N'Đà Lạt săn mây - Langbiang 3N2Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Khám phá'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'TP. Hồ Chí Minh'),
        3, 2, N'Xe du lịch',
        2990000,
        N'Tour khám phá Đà Lạt, săn mây và trải nghiệm không khí cao nguyên.',
        N'Hành trình nhẹ nhàng với các điểm check-in nổi bật tại Đà Lạt.',
        N'Khách chuẩn bị áo ấm và giày thể thao để thuận tiện di chuyển.',
        1,
        N'dang_mo_ban'
    ),
    (
        N'TOUR-HL-001',
        N'Hà Nội - Hạ Long - Ninh Bình 4N3Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Khám phá'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'TP. Hồ Chí Minh'),
        4, 3, N'Máy bay',
        7190000,
        N'Tour miền Bắc tham quan Hà Nội, vịnh Hạ Long và Tràng An.',
        N'Hành trình kết hợp di sản văn hóa, thiên nhiên và ẩm thực miền Bắc.',
        N'Lịch trình có di chuyển nhiều, khách nên chuẩn bị sức khỏe phù hợp.',
        1,
        N'dang_mo_ban'
    ),
    (
        N'TOUR-HUE-001',
        N'Huế - Đà Nẵng - Hội An di sản 4N3Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Trong nước'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'TP. Hồ Chí Minh'),
        4, 3, N'Máy bay',
        5890000,
        N'Tour di sản miền Trung qua Huế, Đà Nẵng và Hội An.',
        N'Hành trình tham quan cố đô, phố cổ, biển và các điểm check-in nổi tiếng.',
        N'Giá áp dụng theo số lượng khách và thời điểm khởi hành.',
        1,
        N'dang_mo_ban'
    );
GO


/* 5. TOUR DIEM DEN */
INSERT INTO dbo.TourDiemDen
    (TourId, DiaDiemId, ThuTu, GhiChu)
VALUES
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Đà Nẵng'),
     1, N'Tham quan trung tâm thành phố Đà Nẵng'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hội An'),
     2, N'Tham quan phố cổ Hội An buổi tối'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Bà Nà Hills'),
     3, N'Tham quan Bà Nà Hills và Cầu Vàng'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-PQ-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Phú Quốc'),
     1, N'Tham quan các điểm biển nổi tiếng'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-PQ-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Grand World Phú Quốc'),
     2, N'Vui chơi và check-in Grand World'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Nha Trang'),
     1, N'Tham quan thành phố biển Nha Trang'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'VinWonders Nha Trang'),
     2, N'Vui chơi tại VinWonders Nha Trang'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hòn Mun Nha Trang'),
     3, N'Lặn ngắm san hô tại Hòn Mun'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Đà Lạt'),
     1, N'Tham quan trung tâm Đà Lạt'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Langbiang'),
     2, N'Khám phá Langbiang và săn mây'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hà Nội'),
     1, N'Tham quan phố cổ Hà Nội'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Vịnh Hạ Long'),
     2, N'Tham quan vịnh Hạ Long'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Tràng An'),
     3, N'Tham quan Tràng An - Ninh Bình'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Huế'),
     1, N'Tham quan Đại Nội và các lăng tẩm Huế'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Đà Nẵng'),
     2, N'Tham quan Đà Nẵng và biển Mỹ Khê'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-001'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hội An'),
     3, N'Dạo phố cổ Hội An');
GO


/* 6. ANH TOUR */
INSERT INTO dbo.AnhTour
    (TourId, LinkAnh, MoTa, IsAvatar, ThuTu)
VALUES
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     N'https://ik.imagekit.io/tvlk/blog/2022/09/dia-diem-check-in-da-nang-cover.jpeg', N'Ảnh đại diện tour Đà Nẵng - Hội An', 1, 1),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     N'https://cdn-images.vtv.vn/2019/8/28/hoi-an-1-15669737585991662159115.jpg', N'Phố cổ Hội An', 0, 2),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     N'/images/tours/danang/bana.jpg', N'Bà Nà Hills và Cầu Vàng', 0, 3),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-PQ-001'),
     N'https://i1-dulich.vnecdn.net/2022/04/08/dulichPhuQuoc-1649392573-9234-1649405369.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=SU6n3IvJxW1Sla0xqg31Kg', N'Ảnh đại diện tour Phú Quốc', 1, 1),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-PQ-001'),
     N'https://i1-dulich.vnecdn.net/2022/04/08/du-lich-Phu-Quoc-03-1254-1649405349.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=L3hmY-ilsuGlFWPrVQF4Gg', N'Grand World Phú Quốc', 0, 2),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-001'),
     N'https://baokhanhhoa.vn/file/e7837c02857c8ca30185a8c39b582c03/102023/nh3_20231020164026.jpg', N'Ảnh đại diện tour Nha Trang', 1, 1),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-001'),
     N'https://static.vinwonders.com/production/2025/05/tro-choi-cam-giac-manh-vinwonders-phu-quoc.jpg', N'VinWonders trong hành trình Nha Trang', 0, 2),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-001'),
     N'https://statics.vinpearl.com/hon-mun-nha-trang-2_1627541859.jpg', N'Hòn Mun Nha Trang', 0, 3),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-001'),
     N'https://samtenhills.vn/wp-content/uploads/2024/01/top-20-cac-diem-du-lich-da-lat.jpg', N'Ảnh đại diện tour Đà Lạt săn mây', 1, 1),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-001'),
     N'https://samtenhills.vn/wp-content/uploads/2024/01/top-20-cac-diem-du-lich-da-lat.jpg', N'Đà Lạt săn mây', 0, 2),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-001'),
     N'https://statics.vinpearl.com/dia-diem-chup-anh-dep-o-ha-noi-1_1680675425.jpg', N'Ảnh đại diện tour Hà Nội', 1, 1),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-001'),
     N'https://cdn-media.sforum.vn/storage/app/media/ctv_seo3/anh-vinh-ha-long-thumbnail.jpg', N'Vịnh Hạ Long', 0, 2),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-001'),
     N'https://cdn-images.vtv.vn/2019/8/28/hoi-an-1-15669737585991662159115.jpg', N'Ảnh đại diện tour Huế - Đà Nẵng - Hội An', 1, 1),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-001'),
     N'https://cdn-images.vtv.vn/2019/8/28/hoi-an-1-15669737585991662159115.jpg', N'Phố cổ Hội An trong hành trình di sản', 0, 2);
GO


/* 7. LICH TRINH */
INSERT INTO dbo.LichTrinh
    (TourId, NgayThu, ThuTuTrongNgay, GioBatDau, GioKetThuc, TieuDe, NoiDung, DiaDiemId)
VALUES
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     1, 1, '08:00', '10:00', N'Khởi hành từ TP.HCM',
     N'Tập trung tại sân bay và làm thủ tục bay.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'TP. Hồ Chí Minh')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     1, 2, '14:00', '17:00', N'Tham quan Đà Nẵng',
     N'Tham quan cầu Rồng, biển Mỹ Khê.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Đà Nẵng')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     2, 1, '09:00', '17:00', N'Tham quan Bà Nà Hills',
     N'Đi cáp treo và tham quan Cầu Vàng.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Bà Nà Hills')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     3, 1, '08:00', '11:00', N'Tham quan Hội An',
     N'Dạo phố cổ, mua sắm quà lưu niệm.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hội An')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-PQ-001'),
     1, 1, '09:00', '11:00', N'Bay đến Phú Quốc',
     N'Tập trung và khởi hành đến Phú Quốc.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Phú Quốc')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-PQ-001'),
     2, 1, '08:30', '15:30', N'Tắm biển và nghỉ dưỡng',
     N'Tự do nghỉ ngơi tại resort, tắm biển.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Phú Quốc')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-PQ-001'),
     3, 1, '14:00', '18:00', N'Tham quan Grand World',
     N'Check-in các khu vui chơi giải trí.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Grand World Phú Quốc')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-001'),
     1, 1, '08:00', '11:00', N'Bay đến Nha Trang',
     N'Tập trung tại sân bay và khởi hành đến Nha Trang.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Nha Trang')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-001'),
     2, 1, '09:00', '16:00', N'Vui chơi VinWonders',
     N'Trải nghiệm các khu vui chơi và công viên nước tại VinWonders.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'VinWonders Nha Trang')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-001'),
     3, 1, '08:30', '12:00', N'Lặn ngắm san hô Hòn Mun',
     N'Tham quan đảo và lặn ngắm san hô tại Hòn Mun.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hòn Mun Nha Trang')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-001'),
     1, 1, '06:00', '13:00', N'Khởi hành đi Đà Lạt',
     N'Di chuyển bằng xe du lịch từ TP.HCM đến Đà Lạt.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Đà Lạt')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-001'),
     2, 1, '05:00', '10:00', N'Săn mây và Langbiang',
     N'Săn mây sáng sớm và tham quan khu du lịch Langbiang.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Langbiang')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-001'),
     3, 1, '08:30', '11:30', N'Tham quan trung tâm Đà Lạt',
     N'Check-in quảng trường, hồ Xuân Hương và mua đặc sản.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Đà Lạt')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-001'),
     1, 1, '08:00', '12:00', N'Bay ra Hà Nội',
     N'Khởi hành từ TP.HCM đến Hà Nội và tham quan phố cổ.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hà Nội')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-001'),
     2, 1, '08:00', '16:00', N'Du thuyền vịnh Hạ Long',
     N'Tham quan vịnh Hạ Long, hang động và cảnh quan biển đảo.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Vịnh Hạ Long')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-001'),
     3, 1, '08:30', '15:30', N'Tràng An - Ninh Bình',
     N'Ngồi thuyền tham quan Tràng An và khám phá cố đô.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Tràng An')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-001'),
     1, 1, '08:00', '15:00', N'Tham quan cố đô Huế',
     N'Tham quan Đại Nội, chùa Thiên Mụ và các lăng tẩm.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Huế')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-001'),
     2, 1, '09:00', '16:00', N'Đà Nẵng biển Mỹ Khê',
     N'Di chuyển về Đà Nẵng, tham quan cầu Rồng và biển Mỹ Khê.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Đà Nẵng')),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-001'),
     3, 1, '15:00', '20:00', N'Phố cổ Hội An',
     N'Dạo phố cổ Hội An, thưởng thức ẩm thực và thả hoa đăng.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hội An'));
GO


/* 8. LICH KHOI HANH */
INSERT INTO dbo.LichKhoiHanh
    (TourId, MaDotTour, NgayKhoiHanh, NgayKetThuc, NoiTapTrung, SoChoToiDa, GhiChu, LyDoHuy, TrangThai)
VALUES
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     N'DOT-DN-20260510', '2026-05-10', '2026-05-12',
     N'Sân bay Tân Sơn Nhất - Ga quốc nội', 30, N'Khởi hành đúng giờ', NULL, N'mo_ban'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-PQ-001'),
     N'DOT-PQ-20260620', '2026-06-20', '2026-06-23',
     N'Sân bay Tân Sơn Nhất - Ga quốc nội', 25, N'Bao gồm xe đưa đón sân bay', NULL, N'mo_ban'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-001'),
     N'DOT-NT-20260705', '2026-07-05', '2026-07-07',
     N'Sân bay Tân Sơn Nhất - Ga quốc nội', 32, N'Bao gồm vé VinWonders theo chương trình', NULL, N'mo_ban'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-001'),
     N'DOT-DL-20260612', '2026-06-12', '2026-06-14',
     N'Nhà văn hóa Thanh Niên TP.HCM', 28, N'Khởi hành bằng xe giường nằm du lịch', NULL, N'mo_ban'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-001'),
     N'DOT-HL-20260808', '2026-08-08', '2026-08-11',
     N'Sân bay Tân Sơn Nhất - Ga quốc nội', 24, N'Bao gồm vé máy bay khứ hồi và du thuyền tham quan vịnh', NULL, N'mo_ban'),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-001'),
     N'DOT-HUE-20260718', '2026-07-18', '2026-07-21',
     N'Sân bay Tân Sơn Nhất - Ga quốc nội', 30, N'Lịch trình di sản miền Trung', NULL, N'mo_ban');
GO


/* 9. BANG GIA LICH KHOI HANH */
INSERT INTO dbo.BangGiaLichKhoiHanh
    (LichKhoiHanhId, LoaiKhach, LoaiGia, DonGia, MoTa)
VALUES
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DN-20260510'),
     N'nguoi_lon', N'ngay_thuong', 3990000, N'Giá ngày thường cho người lớn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DN-20260510'),
     N'tre_em', N'ngay_thuong', 2990000, N'Giá ngày thường cho trẻ em'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DN-20260510'),
     N'em_be', N'ngay_thuong', 800000, N'Giá ngày thường cho em bé'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DN-20260510'),
     N'nguoi_lon', N'cuoi_tuan', 4200000, N'Giá cuối tuần cho người lớn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DN-20260510'),
     N'tre_em', N'cuoi_tuan', 3200000, N'Giá cuối tuần cho trẻ em'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DN-20260510'),
     N'em_be', N'cuoi_tuan', 900000, N'Giá cuối tuần cho em bé'),

    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-PQ-20260620'),
     N'nguoi_lon', N'ngay_thuong', 6490000, N'Giá ngày thường cho người lớn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-PQ-20260620'),
     N'tre_em', N'ngay_thuong', 4990000, N'Giá ngày thường cho trẻ em'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-PQ-20260620'),
     N'em_be', N'ngay_thuong', 1200000, N'Giá ngày thường cho em bé'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-PQ-20260620'),
     N'nguoi_lon', N'cuoi_tuan', 6900000, N'Giá cuối tuần cho người lớn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-PQ-20260620'),
     N'tre_em', N'cuoi_tuan', 5200000, N'Giá cuối tuần cho trẻ em'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-PQ-20260620'),
     N'em_be', N'cuoi_tuan', 1500000, N'Giá cuối tuần cho em bé'),

    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-NT-20260705'),
     N'nguoi_lon', N'ngay_thuong', 4590000, N'Giá ngày thường cho người lớn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-NT-20260705'),
     N'tre_em', N'ngay_thuong', 3490000, N'Giá ngày thường cho trẻ em'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-NT-20260705'),
     N'em_be', N'ngay_thuong', 900000, N'Giá ngày thường cho em bé'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-NT-20260705'),
     N'nguoi_lon', N'cuoi_tuan', 4890000, N'Giá cuối tuần cho người lớn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-NT-20260705'),
     N'tre_em', N'cuoi_tuan', 3690000, N'Giá cuối tuần cho trẻ em'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-NT-20260705'),
     N'em_be', N'cuoi_tuan', 1000000, N'Giá cuối tuần cho em bé'),

    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DL-20260612'),
     N'nguoi_lon', N'ngay_thuong', 2990000, N'Giá ngày thường cho người lớn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DL-20260612'),
     N'tre_em', N'ngay_thuong', 2290000, N'Giá ngày thường cho trẻ em'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DL-20260612'),
     N'em_be', N'ngay_thuong', 600000, N'Giá ngày thường cho em bé'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DL-20260612'),
     N'nguoi_lon', N'cuoi_tuan', 3290000, N'Giá cuối tuần cho người lớn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DL-20260612'),
     N'tre_em', N'cuoi_tuan', 2490000, N'Giá cuối tuần cho trẻ em'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DL-20260612'),
     N'em_be', N'cuoi_tuan', 700000, N'Giá cuối tuần cho em bé'),

    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HL-20260808'),
     N'nguoi_lon', N'ngay_thuong', 7190000, N'Giá ngày thường cho người lớn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HL-20260808'),
     N'tre_em', N'ngay_thuong', 5590000, N'Giá ngày thường cho trẻ em'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HL-20260808'),
     N'em_be', N'ngay_thuong', 1400000, N'Giá ngày thường cho em bé'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HL-20260808'),
     N'nguoi_lon', N'cuoi_tuan', 7590000, N'Giá cuối tuần cho người lớn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HL-20260808'),
     N'tre_em', N'cuoi_tuan', 5890000, N'Giá cuối tuần cho trẻ em'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HL-20260808'),
     N'em_be', N'cuoi_tuan', 1600000, N'Giá cuối tuần cho em bé'),

    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HUE-20260718'),
     N'nguoi_lon', N'ngay_thuong', 5890000, N'Giá ngày thường cho người lớn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HUE-20260718'),
     N'tre_em', N'ngay_thuong', 4490000, N'Giá ngày thường cho trẻ em'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HUE-20260718'),
     N'em_be', N'ngay_thuong', 1100000, N'Giá ngày thường cho em bé'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HUE-20260718'),
     N'nguoi_lon', N'cuoi_tuan', 6290000, N'Giá cuối tuần cho người lớn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HUE-20260718'),
     N'tre_em', N'cuoi_tuan', 4790000, N'Giá cuối tuần cho trẻ em'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HUE-20260718'),
     N'em_be', N'cuoi_tuan', 1300000, N'Giá cuối tuần cho em bé');
GO


/* 10. VOUCHER */
INSERT INTO dbo.Voucher
    (MaVoucher, TenVoucher, TourId, KieuGiam, GiaTriGiam, GiamToiDa, DonHangToiThieu,
     NgayBatDau, NgayKetThuc, SoLuongToiDa, SoLuongDaDung, MoTa, TrangThai)
VALUES
    (
        N'HELLODN10',
        N'Giảm 10% tour Đà Nẵng',
        (SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
        N'phan_tram',
        10,
        1500000,
        3000000,
        '2026-03-01T00:00:00',
        '2026-06-30T23:59:59',
        100,
        1,
        N'Áp dụng cho tour Đà Nẵng - Hội An - Bà Nà Hills.',
        N'hoat_dong'
    ),
    (
        N'PQ500K',
        N'Giảm 500K tour Phú Quốc',
        (SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-PQ-001'),
        N'so_tien',
        500000,
        NULL,
        5000000,
        '2026-03-01T00:00:00',
        '2026-07-31T23:59:59',
        50,
        1,
        N'Áp dụng cho tour nghỉ dưỡng Phú Quốc.',
        N'hoat_dong'
    );
GO


/* 11. BOOKING */
INSERT INTO dbo.Booking
    (MaBooking, LichKhoiHanhId, KhachHangId, VoucherId,
     HoTenLienHe, EmailLienHe, SoDienThoaiLienHe, DiaChiLienHe,
     NgayDat, SoNguoiLon, SoTreEm, SoEmBe, LoaiGiaApDung,
     DonGiaNguoiLon, DonGiaTreEm, DonGiaEmBe,
     TamTinh, GiamGia, TongTien, SoTienDaThanhToan, TienCocYeuCau,
     PhuongThucThanhToanDuKien, TrangThaiBooking, TrangThaiThanhToan, HanThanhToan, GhiChu)
VALUES
    (
        N'BK-20260315001',
        (SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DN-20260510'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        (SELECT VoucherId FROM dbo.Voucher WHERE MaVoucher = N'HELLODN10'),
        N'Nguyễn Văn A', N'nguyenvana@gmail.com', N'0901111111', N'12 Lê Lợi, Quận 1, TP.HCM',
        '2026-03-15T09:00:00',
        2, 1, 0, N'cuoi_tuan',
        4200000, 3200000, 900000,
        11600000, 1160000, 10440000, 10440000, 3000000,
        N'chuyen_khoan', N'hoan_tat', N'da_thanh_toan_du', '2026-04-15T23:59:59',
        N'Khách đã hoàn tất chuyến đi và thanh toán đầy đủ.'
    ),
    (
        N'BK-20260320001',
        (SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-PQ-20260620'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'tranthib@gmail.com'),
        (SELECT VoucherId FROM dbo.Voucher WHERE MaVoucher = N'PQ500K'),
        N'Trần Thị B', N'tranthib@gmail.com', N'0902222222', N'45 Hai Bà Trưng, Quận 3, TP.HCM',
        '2026-03-20T14:30:00',
        1, 0, 0, N'ngay_thuong',
        6490000, 4990000, 1200000,
        6490000, 500000, 5990000, 5990000, 2000000,
        N'cong_thanh_toan', N'da_huy', N'da_hoan_tien', '2026-05-20T23:59:59',
        N'Khách đã yêu cầu hủy tour và đã hoàn tiền một phần.'
    ),
    (
        N'BK-20260402001',
        (SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-PQ-20260620'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        NULL,
        N'Nguyễn Văn A', N'nguyenvana@gmail.com', N'0901111111', N'12 Lê Lợi, Quận 1, TP.HCM',
        '2026-04-02T09:00:00',
        1, 0, 0, N'ngay_thuong',
        6490000, 0, 0,
        6490000, 0, 6490000, 6490000, 1000000,
        N'chuyen_khoan', N'hoan_tat', N'da_thanh_toan_du', '2026-05-25T23:59:59',
        N'Khách đã hoàn tất chuyến đi và thanh toán đầy đủ.'
    ),
    (
        N'BK-20260403001',
        (SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-NT-20260705'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'tranthib@gmail.com'),
        NULL,
        N'Trần Thị B', N'tranthib@gmail.com', N'0902222222', N'45 Hai Bà Trưng, Quận 3, TP.HCM',
        '2026-04-03T09:15:00',
        1, 0, 0, N'ngay_thuong',
        4590000, 0, 0,
        4590000, 0, 4590000, 4590000, 1000000,
        N'chuyen_khoan', N'hoan_tat', N'da_thanh_toan_du', '2026-06-20T23:59:59',
        N'Khách đã hoàn tất chuyến đi và thanh toán đầy đủ.'
    ),
    (
        N'BK-20260404001',
        (SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DL-20260612'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        NULL,
        N'Nguyễn Văn A', N'nguyenvana@gmail.com', N'0901111111', N'12 Lê Lợi, Quận 1, TP.HCM',
        '2026-04-04T09:30:00',
        1, 0, 0, N'ngay_thuong',
        2990000, 0, 0,
        2990000, 0, 2990000, 2990000, 1000000,
        N'chuyen_khoan', N'hoan_tat', N'da_thanh_toan_du', '2026-05-18T23:59:59',
        N'Khách đã hoàn tất chuyến đi và thanh toán đầy đủ.'
    ),
    (
        N'BK-20260405001',
        (SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HL-20260808'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'tranthib@gmail.com'),
        NULL,
        N'Trần Thị B', N'tranthib@gmail.com', N'0902222222', N'45 Hai Bà Trưng, Quận 3, TP.HCM',
        '2026-04-05T10:00:00',
        1, 0, 0, N'ngay_thuong',
        7190000, 0, 0,
        7190000, 0, 7190000, 7190000, 1000000,
        N'chuyen_khoan', N'hoan_tat', N'da_thanh_toan_du', '2026-07-20T23:59:59',
        N'Khách đã hoàn tất chuyến đi và thanh toán đầy đủ.'
    ),
    (
        N'BK-20260406001',
        (SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HUE-20260718'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        NULL,
        N'Nguyễn Văn A', N'nguyenvana@gmail.com', N'0901111111', N'12 Lê Lợi, Quận 1, TP.HCM',
        '2026-04-06T10:30:00',
        1, 0, 0, N'ngay_thuong',
        5890000, 0, 0,
        5890000, 0, 5890000, 5890000, 1000000,
        N'chuyen_khoan', N'hoan_tat', N'da_thanh_toan_du', '2026-06-30T23:59:59',
        N'Khách đã hoàn tất chuyến đi và thanh toán đầy đủ.'
    );
GO


/* 12. HANH KHACH */
INSERT INTO dbo.HanhKhach
    (BookingId, HoTen, LoaiKhach, NgaySinh, GioiTinh, SoGiayTo, QuocTich, GhiChu)
VALUES
    ((SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
     N'Nguyễn Văn A', N'nguoi_lon', '1995-01-10', N'nam', N'079095001111', N'Việt Nam', N'Trưởng đoàn liên hệ'),

    ((SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
     N'Lê Thị Mai', N'nguoi_lon', '1996-05-20', N'nu', N'079096002222', N'Việt Nam', N'Đi cùng gia đình'),

    ((SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
     N'Nguyễn Gia Hân', N'tre_em', '2016-09-05', N'nu', N'KS2016001', N'Việt Nam', N'Trẻ em đi cùng bố mẹ'),

    ((SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260320001'),
     N'Trần Thị B', N'nguoi_lon', '1998-11-30', N'nu', N'079098003333', N'Việt Nam', N'Khách hủy tour sau khi đã thanh toán');
GO


/* 13. THANH TOAN */
INSERT INTO dbo.ThanhToan
    (BookingId, LoaiGiaoDich, KenhThanhToan, PhuongThucThanhToan, NhaCungCap, SoTien,
     MaGiaoDichNoiBo, MaGiaoDichBenThuBa, MaThamChieuBenThuBa,
     TrangThai, DuLieuPhanHoi, GhiChu, ThoiGianTao)
VALUES
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
        N'dat_coc', N'noi_bo', N'chuyen_khoan', N'VCB',
        3000000,
        N'NB-DN-0001', NULL, NULL,
        N'thanh_cong',
        N'{"status":"success","step":"deposit"}',
        N'Khách thanh toán tiền cọc.',
        '2026-03-15T10:00:00'
    ),
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
        N'thanh_toan_con_lai', N'noi_bo', N'chuyen_khoan', N'VCB',
        7440000,
        N'NB-DN-0002', NULL, NULL,
        N'thanh_cong',
        N'{"status":"success","step":"final"}',
        N'Khách thanh toán phần còn lại.',
        '2026-04-01T09:00:00'
    ),
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260320001'),
        N'thanh_toan_toan_bo', N'ben_thu_ba', N'cong_thanh_toan', N'MoMo',
        5990000,
        N'NB-PQ-0001', N'MOMO-TXN-20260320001', N'REF-PQ-001',
        N'thanh_cong',
        N'{"status":"success","provider":"momo"}',
        N'Khách thanh toán toàn bộ booking.',
        '2026-03-20T15:00:00'
    ),
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260320001'),
        N'hoan_tien', N'ben_thu_ba', N'cong_thanh_toan', N'MoMo',
        5490000,
        N'NB-PQ-0002', N'MOMO-REFUND-20260325001', N'REFUND-PQ-001',
        N'da_hoan_tien',
        N'{"status":"refund_success","provider":"momo"}',
        N'Hoàn tiền sau khi trừ phí hủy 500.000.',
        '2026-03-25T11:00:00'
    );
GO


/* 14. HOA DON */
INSERT INTO dbo.HoaDon
    (BookingId, SoHoaDon, NgayLap, TongTienTruocThue, ThueVat, TongThanhToan, EmailNhanHoaDon, FilePdf, GhiChu)
VALUES
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
        N'HD-20260401001',
        '2026-04-01T10:00:00',
        9490909.09,
        949090.91,
        10440000,
        N'nguyenvana@gmail.com',
        N'/files/invoices/HD-20260401001.pdf',
        N'Hóa đơn cho booking tour Đà Nẵng'
    );
GO


/* 15. PHIEU XAC NHAN TOUR */
INSERT INTO dbo.PhieuXacNhanTour
    (BookingId, MaPhieu, NgayPhatHanh, FilePdf, GhiChu)
VALUES
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
        N'PXT-20260401001',
        '2026-04-01T11:00:00',
        N'/files/confirmations/PXT-20260401001.pdf',
        N'Phiếu xác nhận đã gửi email cho khách'
    );
GO



/* 16. DANH GIA TOUR */
INSERT INTO dbo.DanhGiaTour
    (BookingId, TourId, KhachHangId, SoSao, NoiDungComment, PhanHoiAdmin, TrangThai, NgayDanhGia, NgayPhanHoi)
VALUES
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
        (SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        5,
        N'Tour Đà Nẵng - Hội An - Bà Nà Hills 3N2Đ có lịch trình hợp lý, dịch vụ ổn và hướng dẫn viên nhiệt tình.',
        N'Cảm ơn anh đã chia sẻ trải nghiệm.',
        N'hien_thi',
        '2026-05-15T20:00:00',
        '2026-05-16T09:00:00'
    ),
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260402001'),
        (SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-PQ-001'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        5,
        N'Phú Quốc nghỉ dưỡng rất thoải mái, resort đẹp và các điểm tham quan được sắp xếp hợp lý.',
        N'Rất vui khi anh hài lòng với chuyến đi.',
        N'hien_thi',
        '2026-05-25T20:00:00',
        '2026-05-26T09:00:00'
    ),
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260403001'),
        (SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-001'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'tranthib@gmail.com'),
        4,
        N'Nha Trang phù hợp cho gia đình, lịch trình nhẹ nhàng và nhiều trải nghiệm biển.',
        N'Xin cảm ơn chị đã tin tưởng.',
        N'hien_thi',
        '2026-06-20T18:30:00',
        '2026-06-21T08:30:00'
    ),
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260404001'),
        (SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-001'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        5,
        N'Đà Lạt mát mẻ, cảnh đẹp và phần săn mây rất đáng nhớ.',
        N'Cảm ơn anh, hy vọng sớm gặp lại.',
        N'hien_thi',
        '2026-05-18T19:00:00',
        '2026-05-19T08:00:00'
    ),
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260405001'),
        (SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-001'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'tranthib@gmail.com'),
        4,
        N'Hà Nội - Hạ Long - Ninh Bình mang lại nhiều trải nghiệm đẹp, xe và hướng dẫn viên đều ổn.',
        NULL,
        N'hien_thi',
        '2026-07-20T20:00:00',
        NULL
    ),
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260406001'),
        (SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-001'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        5,
        N'Huế - Đà Nẵng - Hội An rất đáng đi, đặc biệt là phần di sản và ẩm thực.',
        N'Cảm ơn anh đã tin tưởng hệ thống.',
        N'hien_thi',
        '2026-06-30T20:30:00',
        '2026-07-01T09:00:00'
    );
GO


/* 17. TIN TUC */
INSERT INTO dbo.TinTuc
    (TieuDe, Slug, TomTat, NoiDung, AnhDaiDien, DanhMuc, TrangThai, AdminId, NgayDang)
VALUES
    (
        N'Khai trương tour hè 2026',
        N'khai-truong-tour-he-2026',
        N'Giới thiệu các chương trình tour hấp dẫn mùa hè 2026.',
        N'Chúng tôi ra mắt nhiều tour mới với mức giá ưu đãi cho mùa hè 2026.',
        N'/images/news/tour-he-2026.jpg',
        N'Khuyến mãi',
        N'hien_thi',
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'admin@dulichviet.vn'),
        '2026-03-10T08:00:00'
    ),
    (
        N'Ưu đãi đặc biệt cho khách đặt sớm',
        N'uu-dai-dat-som-2026',
        N'Chương trình giảm giá cho khách hàng đặt tour sớm.',
        N'Khách hàng đặt tour trước 30 ngày sẽ nhận được nhiều ưu đãi hấp dẫn.',
        N'/images/news/uu-dai-dat-som.jpg',
        N'Ưu đãi',
        N'hien_thi',
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'admin@dulichviet.vn'),
        '2026-03-18T09:30:00'
    );
GO



/* 18. LICH SU TRANG THAI BOOKING */
INSERT INTO dbo.LichSuTrangThaiBooking
    (BookingId, TrangThaiBookingCu, TrangThaiBookingMoi, TrangThaiThanhToanCu, TrangThaiThanhToanMoi, ThoiGian, GhiChu)
VALUES
    ((SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
     NULL, N'moi_tao', NULL, N'chua_thanh_toan', '2026-03-15T09:00:00', N'Tạo booking ban đầu'),

    ((SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
     N'moi_tao', N'da_coc', N'chua_thanh_toan', N'thanh_toan_mot_phan', '2026-03-15T10:05:00', N'Khách đã thanh toán cọc'),

    ((SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
     N'da_coc', N'da_xac_nhan', N'thanh_toan_mot_phan', N'da_thanh_toan_du', '2026-04-01T09:05:00', N'Xác nhận booking sau khi thanh toán đủ'),

    ((SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
     N'da_xac_nhan', N'hoan_tat', N'da_thanh_toan_du', N'da_thanh_toan_du', '2026-05-12T18:00:00', N'Khách đã hoàn tất chuyến đi'),

    ((SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260320001'),
     NULL, N'moi_tao', NULL, N'chua_thanh_toan', '2026-03-20T14:30:00', N'Tạo booking ban đầu'),

    ((SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260320001'),
     N'moi_tao', N'da_xac_nhan', N'chua_thanh_toan', N'da_thanh_toan_du', '2026-03-20T15:05:00', N'Khách thanh toán toàn bộ'),

    ((SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260320001'),
     N'da_xac_nhan', N'da_huy', N'da_thanh_toan_du', N'da_hoan_tien', '2026-03-25T11:10:00', N'Booking đã hủy và hoàn tiền');
GO


/* 19. THONG BAO */
INSERT INTO dbo.ThongBao
    (NguoiNhanId, TieuDe, NoiDung, LoaiThongBao, LinkDieuHuong, DaDoc)
VALUES
    (
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        N'Xác nhận thanh toán thành công',
        N'Booking BK-20260315001 đã được thanh toán đầy đủ.',
        N'payment',
        N'/booking/BK-20260315001',
        1
    ),
    (
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        N'Phiếu xác nhận tour đã được phát hành',
        N'Vui lòng kiểm tra email để tải phiếu xác nhận tour.',
        N'booking',
        N'/booking/BK-20260315001/confirmation',
        0
    ),
    (
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'tranthib@gmail.com'),
        N'Hoàn tiền booking thành công',
        N'Booking BK-20260320001 đã được hoàn tiền sau khi trừ phí hủy.',
        N'payment',
        N'/booking/BK-20260320001',
        0
    ),
    (
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        N'Tin tức mới từ hệ thống',
        N'Đã có bài viết mới về chương trình tour hè 2026.',
        N'news',
        N'/news/khai-truong-tour-he-2026',
        0
    );
GO
