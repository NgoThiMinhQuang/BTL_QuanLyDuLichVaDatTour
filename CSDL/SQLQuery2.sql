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

/* 23. DIA DIEM BO SUNG */
INSERT INTO dbo.DiaDiem
    (TenDiaDiem, TinhThanh, QuocGia, MoTa, TrangThai)
VALUES
    (N'Hà Nội', N'Hà Nội', N'Viet Nam', N'Thủ đô và trung tâm du lịch phía Bắc.', N'hoat_dong'),
    (N'Ninh Bình', N'Ninh Bình', N'Viet Nam', N'Điểm đến nổi bật với cảnh quan karst.', N'hoat_dong'),
    (N'Tràng An', N'Ninh Bình', N'Viet Nam', N'Quần thể danh thắng Tràng An.', N'hoat_dong'),
    (N'Tam Cốc - Bích Động', N'Ninh Bình', N'Viet Nam', N'Khu du lịch sông núi nổi tiếng.', N'hoat_dong'),
    (N'Hạ Long', N'Quảng Ninh', N'Viet Nam', N'Thành phố biển và trung tâm du lịch Quảng Ninh.', N'hoat_dong'),
    (N'Vịnh Hạ Long', N'Quảng Ninh', N'Viet Nam', N'Di sản thiên nhiên thế giới.', N'hoat_dong'),
    (N'Cát Bà', N'Hải Phòng', N'Viet Nam', N'Quần đảo và điểm nghỉ dưỡng nổi tiếng.', N'hoat_dong'),
    (N'Đà Lạt', N'Lâm Đồng', N'Viet Nam', N'Thành phố sương mù và du lịch nghỉ dưỡng.', N'hoat_dong'),
    (N'Hồ Tuyền Lâm', N'Lâm Đồng', N'Viet Nam', N'Hồ sinh thái nổi tiếng tại Đà Lạt.', N'hoat_dong'),
    (N'Langbiang', N'Lâm Đồng', N'Viet Nam', N'Đỉnh núi biểu tượng của Đà Lạt.', N'hoat_dong'),
    (N'Nha Trang', N'Khánh Hòa', N'Viet Nam', N'Thành phố biển sôi động.', N'hoat_dong'),
    (N'VinWonders Nha Trang', N'Khánh Hòa', N'Viet Nam', N'Khu vui chơi giải trí nổi tiếng.', N'hoat_dong'),
    (N'Bãi Dài', N'Khánh Hòa', N'Viet Nam', N'Bãi biển dài và đẹp của Nha Trang.', N'hoat_dong');
GO


/* 24. TOUR BO SUNG */
INSERT INTO dbo.Tour
    (MaTour, TenTour, LoaiTourId, DiemXuatPhatId, SoNgay, SoDem, PhuongTien,
     GiaTuThamKhao, MoTaNgan, MoTaChiTiet, DieuKienTour, IsNoiBat, TrangThai)
VALUES
    (
        N'TOUR-DL-002',
        N'Đà Lạt - Hồ Tuyền Lâm - Langbiang 3N2Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Nghỉ dưỡng'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'TP. Hồ Chí Minh'),
        3, 2, N'Xe giường nằm',
        2990000,
        N'Tour nghỉ dưỡng nhẹ nhàng tại Đà Lạt.',
        N'Khám phá hồ Tuyền Lâm, Langbiang và các điểm check-in nổi bật.',
        N'Giá chưa bao gồm chi phí cá nhân ngoài chương trình.',
        1,
        N'dang_mo_ban'
    ),
    (
        N'TOUR-NT-002',
        N'Nha Trang - VinWonders - Bãi Dài 3N2Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Nghỉ dưỡng'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'TP. Hồ Chí Minh'),
        3, 2, N'Máy bay',
        3490000,
        N'Tour biển đảo và giải trí tại Nha Trang.',
        N'Kết hợp nghỉ dưỡng biển, vui chơi và tham quan khu giải trí lớn.',
        N'Khách mang theo giấy tờ tùy thân hợp lệ khi làm thủ tục.',
        1,
        N'dang_mo_ban'
    ),
    (
        N'TOUR-HL-002',
        N'Hạ Long - Vịnh Hạ Long - Cát Bà 4N3Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Khám phá'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hà Nội'),
        4, 3, N'Ô tô + Tàu',
        4890000,
        N'Tour tham quan di sản biển phía Bắc.',
        N'Trải nghiệm Vịnh Hạ Long, Cát Bà và các điểm ngắm cảnh đẹp.',
        N'Giá chưa bao gồm đồ uống và chi phí cá nhân.',
        1,
        N'dang_mo_ban'
    ),
    (
        N'TOUR-NB-002',
        N'Hà Nội - Ninh Bình - Tràng An 3N2Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Khám phá'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hà Nội'),
        3, 2, N'Ô tô',
        2790000,
        N'Tour ngắn ngày khám phá cảnh quan Ninh Bình.',
        N'Tham quan Tràng An, Tam Cốc và các thắng cảnh nổi bật.',
        N'Giá áp dụng cho đoàn khởi hành theo lịch mở bán.',
        1,
        N'dang_mo_ban'
    );
GO


/* 25. TOUR DIEM DEN BO SUNG */
INSERT INTO dbo.TourDiemDen
    (TourId, DiaDiemId, ThuTu, GhiChu)
VALUES
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-002'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Đà Lạt'),
     1, N'Nhận phòng và tham quan trung tâm Đà Lạt'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-002'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hồ Tuyền Lâm'),
     2, N'Tham quan hồ Tuyền Lâm'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-002'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Langbiang'),
     3, N'Check-in đỉnh Langbiang'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-002'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Nha Trang'),
     1, N'Tham quan trung tâm thành phố biển'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-002'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'VinWonders Nha Trang'),
     2, N'Vui chơi tại VinWonders'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-002'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Bãi Dài'),
     3, N'Tắm biển và nghỉ dưỡng'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-002'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hạ Long'),
     1, N'Tham quan khu vực Hạ Long'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-002'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Vịnh Hạ Long'),
     2, N'Du thuyền trên vịnh'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-002'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Cát Bà'),
     3, N'Tham quan quần đảo Cát Bà'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NB-002'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Ninh Bình'),
     1, N'Tham quan cảnh quan Ninh Bình'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NB-002'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Tràng An'),
     2, N'Khám phá Tràng An bằng thuyền'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NB-002'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Tam Cốc - Bích Động'),
     3, N'Tham quan Tam Cốc - Bích Động');
GO


/* 26. ANH TOUR BO SUNG */
INSERT INTO dbo.AnhTour
    (TourId, LinkAnh, MoTa, IsAvatar, ThuTu)
VALUES
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-002'),
     N'/images/tours/dalat/avatar.jpg', N'Ảnh đại diện tour Đà Lạt', 1, 1),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-002'),
     N'/images/tours/nhatrang/avatar.jpg', N'Ảnh đại diện tour Nha Trang', 1, 1),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-002'),
     N'/images/tours/halong/avatar.jpg', N'Ảnh đại diện tour Hạ Long', 1, 1),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NB-002'),
     N'/images/tours/ninhbinh/avatar.jpg', N'Ảnh đại diện tour Ninh Bình', 1, 1);
GO


/* 27. LICH TRINH BO SUNG */
INSERT INTO dbo.LichTrinh
    (TourId, NgayThu, ThuTuTrongNgay, GioBatDau, GioKetThuc, TieuDe, NoiDung, DiaDiemId)
VALUES
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-002'),
     1, 1, '07:00', '10:00', N'Khởi hành đến Đà Lạt',
     N'Khởi hành và nhận phòng khách sạn.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Đà Lạt')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-002'),
     2, 1, '08:00', '16:00', N'Tham quan Hồ Tuyền Lâm',
     N'Đi thuyền và nghỉ ngơi tại khu hồ sinh thái.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hồ Tuyền Lâm')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-002'),
     1, 1, '08:00', '11:00', N'Đến Nha Trang',
     N'Nhận phòng và nghỉ ngơi tại khách sạn.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Nha Trang')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-002'),
     2, 1, '09:00', '17:00', N'Vui chơi VinWonders',
     N'Tham gia các hoạt động giải trí tại VinWonders.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'VinWonders Nha Trang')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-002'),
     1, 1, '06:30', '12:00', N'Khởi hành Hà Nội - Hạ Long',
     N'Xuất phát từ Hà Nội và nhận phòng tại Hạ Long.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hạ Long')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-002'),
     2, 1, '08:00', '16:00', N'Du thuyền Vịnh Hạ Long',
     N'Tham quan vịnh và đảo Cát Bà.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Vịnh Hạ Long')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NB-002'),
     1, 1, '07:30', '12:00', N'Khởi hành đi Ninh Bình',
     N'Nhận phòng và bắt đầu hành trình.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Ninh Bình')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NB-002'),
     2, 1, '08:00', '16:30', N'Tham quan Tràng An',
     N'Du ngoạn bằng thuyền giữa núi đá vôi.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Tràng An'));
GO


/* 28. LICH KHOI HANH BO SUNG */
INSERT INTO dbo.LichKhoiHanh
    (TourId, MaDotTour, NgayKhoiHanh, NgayKetThuc, NoiTapTrung, SoChoToiDa, GhiChu, LyDoHuy, TrangThai)
VALUES
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-DL-002'),
     N'DOT-DL-20260518', '2026-05-18', '2026-05-20',
     N'Sân bay Tân Sơn Nhất - Ga quốc nội', 28, N'Khởi hành buổi sáng', NULL, N'mo_ban'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NT-002'),
     N'DOT-NT-20260605', '2026-06-05', '2026-06-07',
     N'Sân bay Tân Sơn Nhất - Ga quốc nội', 32, N'Có vé máy bay khứ hồi', NULL, N'mo_ban'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HL-002'),
     N'DOT-HL-20260622', '2026-06-22', '2026-06-25',
     N'Bến xe Mỹ Đình', 35, N'Xe đời mới, điều hòa', NULL, N'mo_ban'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-NB-002'),
     N'DOT-NB-20260710', '2026-07-10', '2026-07-12',
     N'Ga Hà Nội', 30, N'Khởi hành cuối tuần', NULL, N'mo_ban');
GO


/* 29. BANG GIA LICH KHOI HANH BO SUNG */
INSERT INTO dbo.BangGiaLichKhoiHanh
    (LichKhoiHanhId, LoaiKhach, LoaiGia, DonGia, MoTa)
VALUES
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DL-20260518'),
     N'nguoi_lon', N'ngay_thuong', 2990000, N'Giá người lớn tour Đà Lạt'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DL-20260518'),
     N'tre_em', N'ngay_thuong', 2390000, N'Giá trẻ em tour Đà Lạt'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-DL-20260518'),
     N'em_be', N'ngay_thuong', 600000, N'Giá em bé tour Đà Lạt'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-NT-20260605'),
     N'nguoi_lon', N'ngay_thuong', 3490000, N'Giá người lớn tour Nha Trang'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-NT-20260605'),
     N'tre_em', N'ngay_thuong', 2890000, N'Giá trẻ em tour Nha Trang'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-NT-20260605'),
     N'em_be', N'ngay_thuong', 700000, N'Giá em bé tour Nha Trang'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HL-20260622'),
     N'nguoi_lon', N'ngay_thuong', 4890000, N'Giá người lớn tour Hạ Long'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HL-20260622'),
     N'tre_em', N'ngay_thuong', 3890000, N'Giá trẻ em tour Hạ Long'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HL-20260622'),
     N'em_be', N'ngay_thuong', 900000, N'Giá em bé tour Hạ Long'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-NB-20260710'),
     N'nguoi_lon', N'ngay_thuong', 2790000, N'Giá người lớn tour Ninh Bình'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-NB-20260710'),
     N'tre_em', N'ngay_thuong', 2190000, N'Giá trẻ em tour Ninh Bình'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-NB-20260710'),
     N'em_be', N'ngay_thuong', 500000, N'Giá em bé tour Ninh Bình');
GO

/* 30. DIA DIEM BO SUNG THEM */
INSERT INTO dbo.DiaDiem
    (TenDiaDiem, TinhThanh, QuocGia, MoTa, TrangThai)
VALUES
    (N'Cần Thơ', N'Cần Thơ', N'Viet Nam', N'Trung tâm du lịch miền Tây sông nước.', N'hoat_dong'),
    (N'Bến Ninh Kiều', N'Cần Thơ', N'Viet Nam', N'Biểu tượng du lịch nổi tiếng của Cần Thơ.', N'hoat_dong'),
    (N'Chợ nổi Cái Răng', N'Cần Thơ', N'Viet Nam', N'Điểm trải nghiệm văn hóa sông nước miền Tây.', N'hoat_dong'),
    (N'Huế', N'Thừa Thiên Huế', N'Viet Nam', N'Thành phố di sản với nhiều công trình lịch sử.', N'hoat_dong'),
    (N'Đại Nội Huế', N'Thừa Thiên Huế', N'Viet Nam', N'Quần thể di tích cố đô Huế.', N'hoat_dong'),
    (N'Chùa Thiên Mụ', N'Thừa Thiên Huế', N'Viet Nam', N'Ngôi chùa cổ nổi tiếng bên sông Hương.', N'hoat_dong'),
    (N'Sa Pa', N'Lào Cai', N'Viet Nam', N'Thị trấn vùng cao nổi tiếng với khí hậu mát mẻ.', N'hoat_dong'),
    (N'Bản Cát Cát', N'Lào Cai', N'Viet Nam', N'Bản làng du lịch đặc trưng của Sa Pa.', N'hoat_dong'),
    (N'Fansipan', N'Lào Cai', N'Viet Nam', N'Nóc nhà Đông Dương và điểm đến nổi bật.', N'hoat_dong'),
    (N'Quy Nhơn', N'Bình Định', N'Viet Nam', N'Thành phố biển yên bình với nhiều bãi tắm đẹp.', N'hoat_dong'),
    (N'Kỳ Co', N'Bình Định', N'Viet Nam', N'Bãi biển xanh trong nổi tiếng tại Quy Nhơn.', N'hoat_dong'),
    (N'Eo Gió', N'Bình Định', N'Viet Nam', N'Điểm ngắm biển và hoàng hôn nổi bật.', N'hoat_dong');
GO

/* 31. TOUR BO SUNG THEM */
INSERT INTO dbo.Tour
    (MaTour, TenTour, LoaiTourId, DiemXuatPhatId, SoNgay, SoDem, PhuongTien,
     GiaTuThamKhao, MoTaNgan, MoTaChiTiet, DieuKienTour, IsNoiBat, TrangThai)
VALUES
    (
        N'TOUR-CT-003',
        N'Cần Thơ - Chợ nổi Cái Răng - Bến Ninh Kiều 2N1Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Trong nước'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'TP. Hồ Chí Minh'),
        2, 1, N'Xe du lịch',
        1890000,
        N'Tour miền Tây ngắn ngày với trải nghiệm chợ nổi và bến Ninh Kiều.',
        N'Phù hợp cho nhóm bạn và gia đình muốn đổi gió cuối tuần tại miền Tây.',
        N'Giá chưa bao gồm chi phí cá nhân ngoài chương trình.',
        1,
        N'dang_mo_ban'
    ),
    (
        N'TOUR-HUE-003',
        N'Huế - Đại Nội - Chùa Thiên Mụ 3N2Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Khám phá'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Đà Nẵng'),
        3, 2, N'Ô tô',
        2690000,
        N'Tour khám phá di sản cố đô Huế trong 3 ngày 2 đêm.',
        N'Hành trình tham quan Đại Nội, chùa Thiên Mụ và trải nghiệm ẩm thực Huế.',
        N'Khách mang theo giấy tờ tùy thân hợp lệ khi tham gia tour.',
        1,
        N'dang_mo_ban'
    ),
    (
        N'TOUR-SP-003',
        N'Sa Pa - Bản Cát Cát - Fansipan 3N2Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Khám phá'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hà Nội'),
        3, 2, N'Xe giường nằm',
        3590000,
        N'Tour vùng cao Sa Pa với lịch trình tham quan bản làng và Fansipan.',
        N'Phù hợp cho du khách yêu thích khí hậu mát mẻ và cảnh sắc núi rừng Tây Bắc.',
        N'Giá chưa bao gồm chi phí thuê trang phục và vé dịch vụ ngoài chương trình.',
        1,
        N'dang_mo_ban'
    ),
    (
        N'TOUR-QN-003',
        N'Quy Nhơn - Kỳ Co - Eo Gió 3N2Đ',
        (SELECT LoaiTourId FROM dbo.LoaiTour WHERE TenLoai = N'Nghỉ dưỡng'),
        (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'TP. Hồ Chí Minh'),
        3, 2, N'Máy bay',
        3290000,
        N'Tour biển Quy Nhơn kết hợp nghỉ dưỡng và tham quan cảnh đẹp.',
        N'Trải nghiệm biển xanh, cát trắng tại Kỳ Co và ngắm cảnh tại Eo Gió.',
        N'Khách nên chuẩn bị đồ bơi và kem chống nắng.',
        1,
        N'dang_mo_ban'
    );
GO

/* 32. TOUR DIEM DEN BO SUNG THEM */
INSERT INTO dbo.TourDiemDen
    (TourId, DiaDiemId, ThuTu, GhiChu)
VALUES
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-CT-003'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Cần Thơ'),
     1, N'Tham quan trung tâm thành phố Cần Thơ'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-CT-003'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Bến Ninh Kiều'),
     2, N'Dạo bến Ninh Kiều buổi chiều tối'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-CT-003'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Chợ nổi Cái Răng'),
     3, N'Trải nghiệm chợ nổi buổi sáng sớm'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-003'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Huế'),
     1, N'Tham quan thành phố Huế'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-003'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Đại Nội Huế'),
     2, N'Khám phá quần thể Đại Nội'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-003'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Chùa Thiên Mụ'),
     3, N'Tham quan chùa Thiên Mụ bên sông Hương'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-SP-003'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Sa Pa'),
     1, N'Nhận phòng và tham quan trung tâm Sa Pa'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-SP-003'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Bản Cát Cát'),
     2, N'Tham quan bản làng truyền thống'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-SP-003'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Fansipan'),
     3, N'Chinh phục Fansipan bằng cáp treo'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-QN-003'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Quy Nhơn'),
     1, N'Tham quan trung tâm thành phố biển Quy Nhơn'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-QN-003'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Kỳ Co'),
     2, N'Tắm biển và vui chơi tại Kỳ Co'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-QN-003'),
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Eo Gió'),
     3, N'Ngắm biển và check-in tại Eo Gió');
GO

/* 33. ANH TOUR BO SUNG THEM */
INSERT INTO dbo.AnhTour
    (TourId, LinkAnh, MoTa, IsAvatar, ThuTu)
VALUES
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-CT-003'),
     N'/images/tours/phuquoc/avatar.jpg', N'Ảnh đại diện tour Cần Thơ', 1, 1),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-003'),
     N'/images/tours/danang/hoi-an.jpg', N'Ảnh đại diện tour Huế', 1, 1),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-SP-003'),
     N'/images/tour-ha-001-main.jpg', N'Ảnh đại diện tour Sa Pa', 1, 1),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-QN-003'),
     N'/images/tours/danang/avatar.jpg', N'Ảnh đại diện tour Quy Nhơn', 1, 1);
GO

/* 34. LICH TRINH BO SUNG THEM */
INSERT INTO dbo.LichTrinh
    (TourId, NgayThu, ThuTuTrongNgay, GioBatDau, GioKetThuc, TieuDe, NoiDung, DiaDiemId)
VALUES
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-CT-003'),
     1, 1, '06:00', '10:00', N'Khởi hành đi Cần Thơ',
     N'Di chuyển từ TP. Hồ Chí Minh đến Cần Thơ và nhận phòng.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Cần Thơ')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-CT-003'),
     2, 1, '05:30', '09:00', N'Tham quan chợ nổi Cái Răng',
     N'Đi thuyền tham quan và dùng bữa sáng trên chợ nổi.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Chợ nổi Cái Răng')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-003'),
     1, 1, '08:00', '11:30', N'Khởi hành đến Huế',
     N'Di chuyển từ Đà Nẵng đến Huế qua hầm Hải Vân.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Huế')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-003'),
     2, 1, '08:30', '15:30', N'Tham quan Đại Nội Huế',
     N'Khám phá quần thể kiến trúc cố đô và nghe thuyết minh.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Đại Nội Huế')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-SP-003'),
     1, 1, '22:00', '05:30', N'Khởi hành từ Hà Nội đi Sa Pa',
     N'Lên xe giường nằm và nghỉ đêm trên đường.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Hà Nội')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-SP-003'),
     2, 1, '08:00', '16:30', N'Khám phá Bản Cát Cát',
     N'Tản bộ tham quan bản làng và chụp ảnh lưu niệm.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Bản Cát Cát')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-QN-003'),
     1, 1, '07:00', '10:00', N'Bay đến Quy Nhơn',
     N'Làm thủ tục bay và nhận phòng khách sạn tại Quy Nhơn.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Quy Nhơn')),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-QN-003'),
     2, 1, '08:30', '16:00', N'Tham quan Kỳ Co - Eo Gió',
     N'Tắm biển, ăn hải sản và tham quan các điểm check-in nổi tiếng.',
     (SELECT DiaDiemId FROM dbo.DiaDiem WHERE TenDiaDiem = N'Kỳ Co'));
GO

/* 35. LICH KHOI HANH BO SUNG THEM */
INSERT INTO dbo.LichKhoiHanh
    (TourId, MaDotTour, NgayKhoiHanh, NgayKetThuc, NoiTapTrung, SoChoToiDa, GhiChu, LyDoHuy, TrangThai)
VALUES
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-CT-003'),
     N'DOT-CT-20260524', '2026-05-24', '2026-05-25',
     N'Nhà văn hóa Thanh Niên', 26, N'Phù hợp tour cuối tuần', NULL, N'mo_ban'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-HUE-003'),
     N'DOT-HUE-20260614', '2026-06-14', '2026-06-16',
     N'Bến xe trung tâm Đà Nẵng', 28, N'Khởi hành buổi sáng', NULL, N'mo_ban'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-SP-003'),
     N'DOT-SP-20260628', '2026-06-28', '2026-06-30',
     N'Bến xe Mỹ Đình', 30, N'Xe giường nằm chất lượng cao', NULL, N'mo_ban'),
    ((SELECT TourId FROM dbo.Tour WHERE MaTour = N'TOUR-QN-003'),
     N'DOT-QN-20260705', '2026-07-05', '2026-07-07',
     N'Sân bay Tân Sơn Nhất - Ga quốc nội', 32, N'Bao gồm hành lý ký gửi 20kg', NULL, N'mo_ban');
GO

/* 36. BANG GIA LICH KHOI HANH BO SUNG THEM */
INSERT INTO dbo.BangGiaLichKhoiHanh
    (LichKhoiHanhId, LoaiKhach, LoaiGia, DonGia, MoTa)
VALUES
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-CT-20260524'),
     N'nguoi_lon', N'ngay_thuong', 1890000, N'Giá người lớn tour Cần Thơ'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-CT-20260524'),
     N'tre_em', N'ngay_thuong', 1490000, N'Giá trẻ em tour Cần Thơ'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-CT-20260524'),
     N'em_be', N'ngay_thuong', 400000, N'Giá em bé tour Cần Thơ'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HUE-20260614'),
     N'nguoi_lon', N'ngay_thuong', 2690000, N'Giá người lớn tour Huế'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HUE-20260614'),
     N'tre_em', N'ngay_thuong', 2190000, N'Giá trẻ em tour Huế'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-HUE-20260614'),
     N'em_be', N'ngay_thuong', 500000, N'Giá em bé tour Huế'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-SP-20260628'),
     N'nguoi_lon', N'ngay_thuong', 3590000, N'Giá người lớn tour Sa Pa'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-SP-20260628'),
     N'tre_em', N'ngay_thuong', 2890000, N'Giá trẻ em tour Sa Pa'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-SP-20260628'),
     N'em_be', N'ngay_thuong', 700000, N'Giá em bé tour Sa Pa'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-QN-20260705'),
     N'nguoi_lon', N'ngay_thuong', 3290000, N'Giá người lớn tour Quy Nhơn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-QN-20260705'),
     N'tre_em', N'ngay_thuong', 2690000, N'Giá trẻ em tour Quy Nhơn'),
    ((SELECT LichKhoiHanhId FROM dbo.LichKhoiHanh WHERE MaDotTour = N'DOT-QN-20260705'),
     N'em_be', N'ngay_thuong', 600000, N'Giá em bé tour Quy Nhơn');
GO

