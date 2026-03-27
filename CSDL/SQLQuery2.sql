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
    (N'Grand World Phú Quốc', N'Kiên Giang', N'Viet Nam', N'Khu vui chơi, mua sắm, giải trí.', N'hoat_dong');
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
     2, N'Vui chơi và check-in Grand World');
GO

/* 6. ANH TOUR */
INSERT INTO dbo.AnhTour
    (TourId, LinkAnh, MoTa, IsAvatar, ThuTu)
VALUES
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     N'/images/tours/danang/avatar.jpg', N'Ảnh đại diện tour Đà Nẵng', 1, 1),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     N'/images/tours/danang/hoi-an.jpg', N'Phố cổ Hội An về đêm', 0, 2),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
     N'/images/tours/danang/bana.jpg', N'Bà Nà Hills và Cầu Vàng', 0, 3),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-PQ-001'),
     N'/images/tours/phuquoc/avatar.jpg', N'Ảnh đại diện tour Phú Quốc', 1, 1),

    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-PQ-001'),
     N'/images/tours/phuquoc/grandworld.jpg', N'Grand World Phú Quốc', 0, 2);
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
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Grand World Phú Quốc'));
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
     N'Sân bay Tân Sơn Nhất - Ga quốc nội', 25, N'Bao gồm xe đưa đón sân bay', NULL, N'mo_ban');
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
     N'em_be', N'cuoi_tuan', 1500000, N'Giá cuối tuần cho em bé');
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

/* 16. HUY BOOKING */
INSERT INTO dbo.HuyBooking
    (BookingId, NgayYeuCau, LyDo, TrangThaiXuLy, PhiHuy, SoTienHoan, PhanHoiAdmin, NgayXuLy, GhiChu)
VALUES
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260320001'),
        '2026-03-24T08:30:00',
        N'Khách bận việc gia đình đột xuất nên không thể tham gia tour.',
        N'da_hoan_tien',
        500000,
        5490000,
        N'Đã hỗ trợ hoàn tiền sau khi trừ phí theo chính sách.',
        '2026-03-25T10:30:00',
        N'Hoàn tiền về ví điện tử.'
    );
GO

/* 17. DANH GIA TOUR */
INSERT INTO dbo.DanhGiaTour
    (BookingId, TourId, KhachHangId, SoSao, NoiDungComment, PhanHoiAdmin, TrangThai, NgayDanhGia, NgayPhanHoi)
VALUES
    (
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
        (SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001'),
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        5,
        N'Tour rất tốt, lịch trình hợp lý, hướng dẫn viên nhiệt tình.',
        N'Cảm ơn anh đã tin tưởng và sử dụng dịch vụ.',
        N'hien_thi',
        '2026-05-15T20:00:00',
        '2026-05-16T09:00:00'
    );
GO

/* 18. TIN TUC */
INSERT INTO dbo.TinTuc
    (TieuDe, Slug, TomTat, NoiDung, AnhDaiDien, TrangThai, AdminId, NgayDang)
VALUES
    (
        N'Khai trương tour hè 2026',
        N'khai-truong-tour-he-2026',
        N'Giới thiệu các chương trình tour hấp dẫn mùa hè 2026.',
        N'Chúng tôi ra mắt nhiều tour mới với mức giá ưu đãi cho mùa hè 2026.',
        N'/images/news/tour-he-2026.jpg',
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
        N'hien_thi',
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'admin@dulichviet.vn'),
        '2026-03-18T09:30:00'
    );
GO

/* 19. HO TRO KHACH HANG */
INSERT INTO dbo.HoTroKhachHang
    (MaHoTro, KhachHangId, BookingId, HoTen, Email, SoDienThoai, LoaiYeuCau, TieuDe, NoiDung,
     TrangThai, MucDoUuTien, PhanHoiAdmin, NgayXuLy)
VALUES
    (
        N'HT-20260324001',
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'tranthib@gmail.com'),
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260320001'),
        N'Trần Thị B',
        N'tranthib@gmail.com',
        N'0902222222',
        N'khieu_nai',
        N'Hỗ trợ hủy booking và hoàn tiền',
        N'Tôi cần được hỗ trợ xác nhận số tiền hoàn và thời gian nhận tiền.',
        N'da_phan_hoi',
        N'cao',
        N'Đã xác nhận hoàn tiền thành công trong ngày 25/03/2026.',
        '2026-03-25T10:45:00'
    ),
    (
        N'HT-20260326001',
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        (SELECT BookingId FROM dbo.Booking WHERE MaBooking = N'BK-20260315001'),
        N'Nguyễn Văn A',
        N'nguyenvana@gmail.com',
        N'0901111111',
        N'gop_y',
        N'Góp ý sau chuyến đi',
        N'Tôi hài lòng với dịch vụ, đề xuất thêm lựa chọn bữa chay.',
        N'da_dong',
        N'trung_binh',
        N'Cảm ơn góp ý của anh, công ty sẽ cập nhật cho các tour sau.',
        '2026-05-16T10:00:00'
    );
GO

/* 20. YEU THICH TOUR */
INSERT INTO dbo.YeuThichTour
    (KhachHangId, TourId)
VALUES
    (
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'nguyenvana@gmail.com'),
        (SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-PQ-001')
    ),
    (
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'tranthib@gmail.com'),
        (SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DN-001')
    );
GO

/* 21. LICH SU TRANG THAI BOOKING */
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

/* 22. THONG BAO */
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
        (SELECT NguoiDungId FROM dbo.NguoiDung WHERE Email = N'tranthib@gmail.com'),
        N'Yêu cầu hỗ trợ đã được phản hồi',
        N'Bộ phận CSKH đã phản hồi yêu cầu hỗ trợ của bạn.',
        N'support',
        N'/support/HT-20260324001',
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