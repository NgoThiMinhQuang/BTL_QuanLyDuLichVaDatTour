CREATE DATABASE IF NOT EXISTS QuanLyDuLich
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE QuanLyDuLich;

-- =========================================================
-- 1. NGUOI DUNG
-- =========================================================
CREATE TABLE NguoiDung (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    MatKhau VARCHAR(255) NOT NULL,
    HoTen VARCHAR(200) NOT NULL,
    SoDienThoai VARCHAR(20) NULL,
    DiaChi VARCHAR(300) NULL,
    AnhDaiDien VARCHAR(500) NULL,
    VaiTro ENUM('admin', 'khach_hang') NOT NULL DEFAULT 'khach_hang',
    TrangThai ENUM('hoat_dong', 'bi_khoa') NOT NULL DEFAULT 'hoat_dong',
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE INDEX IdxNguoiDungVaiTroTrangThai
ON NguoiDung(VaiTro, TrangThai);

-- =========================================================
-- 2. LOAI TOUR
-- =========================================================
CREATE TABLE LoaiTour (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    TenLoai VARCHAR(100) NOT NULL UNIQUE,
    MoTa TEXT NULL,
    TrangThai ENUM('hoat_dong', 'an') NOT NULL DEFAULT 'hoat_dong',
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =========================================================
-- 3. DIA DIEM
-- =========================================================
CREATE TABLE DiaDiem (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    TenDiaDiem VARCHAR(200) NOT NULL,
    TinhThanh VARCHAR(100) NULL,
    QuocGia VARCHAR(100) NOT NULL DEFAULT 'Viet Nam',
    MoTa TEXT NULL,
    TrangThai ENUM('hoat_dong', 'an') NOT NULL DEFAULT 'hoat_dong',
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE INDEX IdxDiaDiemTinhThanhQuocGia
ON DiaDiem(TinhThanh, QuocGia);

-- =========================================================
-- 4. TOUR
-- =========================================================
CREATE TABLE Tour (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    MaTour VARCHAR(50) NOT NULL UNIQUE,
    TenTour VARCHAR(300) NOT NULL,
    LoaiTourId BIGINT UNSIGNED NOT NULL,
    DiemXuatPhatId BIGINT UNSIGNED NOT NULL,
    SoNgay TINYINT UNSIGNED NOT NULL,
    SoDem TINYINT UNSIGNED NOT NULL,
    PhuongTien VARCHAR(100) NULL,
    GiaTuThamKhao DECIMAL(15,2) NOT NULL DEFAULT 0,
    MoTaNgan VARCHAR(500) NULL,
    MoTaChiTiet LONGTEXT NULL,
    DieuKienTour LONGTEXT NULL,
    IsNoiBat BOOLEAN NOT NULL DEFAULT FALSE,
    TrangThai ENUM('nhap', 'dang_mo_ban', 'tam_ngung', 'an', 'ngung_kinh_doanh') NOT NULL DEFAULT 'nhap',
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT ChkTourSoDem CHECK (SoDem <= SoNgay),
    CONSTRAINT FkTourLoaiTour FOREIGN KEY (LoaiTourId) REFERENCES LoaiTour(Id),
    CONSTRAINT FkTourDiemXuatPhat FOREIGN KEY (DiemXuatPhatId) REFERENCES DiaDiem(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxTourTimKiem
ON Tour(TrangThai, LoaiTourId, DiemXuatPhatId, IsNoiBat, GiaTuThamKhao);

-- =========================================================
-- 5. TOUR DIEM DEN
-- =========================================================
CREATE TABLE TourDiemDen (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    TourId BIGINT UNSIGNED NOT NULL,
    DiaDiemId BIGINT UNSIGNED NOT NULL,
    ThuTu SMALLINT UNSIGNED NOT NULL,
    GhiChu VARCHAR(300) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY UkTourDiemDenThuTu (TourId, ThuTu),
    CONSTRAINT FkTourDiemDenTour FOREIGN KEY (TourId) REFERENCES Tour(Id),
    CONSTRAINT FkTourDiemDenDiaDiem FOREIGN KEY (DiaDiemId) REFERENCES DiaDiem(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxTourDiemDenDiaDiem
ON TourDiemDen(DiaDiemId, TourId);

-- =========================================================
-- 6. ANH TOUR
-- =========================================================
CREATE TABLE AnhTour (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    TourId BIGINT UNSIGNED NOT NULL,
    LinkAnh VARCHAR(500) NOT NULL,
    MoTa VARCHAR(300) NULL,
    IsAvatar BOOLEAN NOT NULL DEFAULT FALSE,
    ThuTu SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    AvatarTourId BIGINT UNSIGNED GENERATED ALWAYS AS (
        CASE WHEN IsAvatar = 1 THEN TourId ELSE NULL END
    ) STORED,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY UkAnhTourMotAvatar (AvatarTourId),
    CONSTRAINT FkAnhTourTour FOREIGN KEY (TourId) REFERENCES Tour(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxAnhTourTour
ON AnhTour(TourId, ThuTu);

-- =========================================================
-- 7. LICH TRINH
-- =========================================================
CREATE TABLE LichTrinh (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    TourId BIGINT UNSIGNED NOT NULL,
    NgayThu TINYINT UNSIGNED NOT NULL,
    ThuTuTrongNgay SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    GioBatDau TIME NULL,
    GioKetThuc TIME NULL,
    TieuDe VARCHAR(300) NULL,
    NoiDung TEXT NULL,
    DiaDiemId BIGINT UNSIGNED NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY UkLichTrinh (TourId, NgayThu, ThuTuTrongNgay),
    CONSTRAINT ChkLichTrinhGio CHECK (
        GioKetThuc IS NULL OR GioBatDau IS NULL OR GioKetThuc >= GioBatDau
    ),
    CONSTRAINT FkLichTrinhTour FOREIGN KEY (TourId) REFERENCES Tour(Id),
    CONSTRAINT FkLichTrinhDiaDiem FOREIGN KEY (DiaDiemId) REFERENCES DiaDiem(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxLichTrinhTourNgay
ON LichTrinh(TourId, NgayThu, ThuTuTrongNgay);

-- =========================================================
-- 8. LICH KHOI HANH
-- =========================================================
CREATE TABLE LichKhoiHanh (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    TourId BIGINT UNSIGNED NOT NULL,
    MaDotTour VARCHAR(50) NOT NULL UNIQUE,
    NgayKhoiHanh DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    NoiTapTrung VARCHAR(300) NULL,
    SoChoToiDa SMALLINT UNSIGNED NOT NULL,
    GhiChu VARCHAR(500) NULL,
    LyDoHuy VARCHAR(500) NULL,
    TrangThai ENUM('mo_ban', 'het_cho', 'da_khoi_hanh', 'da_ket_thuc', 'da_huy') NOT NULL DEFAULT 'mo_ban',
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT ChkLichKhoiHanhNgay CHECK (NgayKetThuc >= NgayKhoiHanh),
    CONSTRAINT FkLichKhoiHanhTour FOREIGN KEY (TourId) REFERENCES Tour(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxLichKhoiHanhTimKiem
ON LichKhoiHanh(TourId, NgayKhoiHanh, TrangThai);

-- =========================================================
-- 9. BANG GIA LICH KHOI HANH
-- =========================================================
CREATE TABLE BangGiaLichKhoiHanh (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    LichKhoiHanhId BIGINT UNSIGNED NOT NULL,
    LoaiKhach ENUM('nguoi_lon', 'tre_em', 'em_be') NOT NULL,
    LoaiGia ENUM('ngay_thuong', 'cuoi_tuan') NOT NULL,
    DonGia DECIMAL(15,2) NOT NULL,
    MoTa VARCHAR(300) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY UkBangGiaLichKhoiHanh (LichKhoiHanhId, LoaiKhach, LoaiGia),
    CONSTRAINT ChkBangGiaDuong CHECK (DonGia >= 0),
    CONSTRAINT FkBangGiaLichKhoiHanh FOREIGN KEY (LichKhoiHanhId) REFERENCES LichKhoiHanh(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxBangGiaLichKhoiHanh
ON BangGiaLichKhoiHanh(LichKhoiHanhId, LoaiKhach, LoaiGia);

-- =========================================================
-- 10. VOUCHER
-- =========================================================
CREATE TABLE Voucher (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    MaVoucher VARCHAR(50) NOT NULL UNIQUE,
    TenVoucher VARCHAR(200) NOT NULL,
    TourId BIGINT UNSIGNED NULL,
    KieuGiam ENUM('phan_tram', 'so_tien') NOT NULL,
    GiaTriGiam DECIMAL(15,2) NOT NULL,
    GiamToiDa DECIMAL(15,2) NULL,
    DonHangToiThieu DECIMAL(15,2) NOT NULL DEFAULT 0,
    NgayBatDau DATETIME NOT NULL,
    NgayKetThuc DATETIME NOT NULL,
    SoLuongToiDa INT UNSIGNED NOT NULL DEFAULT 0,
    SoLuongDaDung INT UNSIGNED NOT NULL DEFAULT 0,
    MoTa VARCHAR(500) NULL,
    TrangThai ENUM('hoat_dong', 'an') NOT NULL DEFAULT 'hoat_dong',
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT ChkVoucherNgay CHECK (NgayKetThuc >= NgayBatDau),
    CONSTRAINT ChkVoucherSoLuong CHECK (SoLuongDaDung <= SoLuongToiDa),
    CONSTRAINT ChkVoucherGiaTri CHECK (
        (KieuGiam = 'phan_tram' AND GiaTriGiam > 0 AND GiaTriGiam <= 100)
        OR
        (KieuGiam = 'so_tien' AND GiaTriGiam > 0)
    ),
    CONSTRAINT FkVoucherTour FOREIGN KEY (TourId) REFERENCES Tour(Id)
) ENGINE=InnoDB;

-- =========================================================
-- 11. BOOKING
-- =========================================================
CREATE TABLE Booking (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    MaBooking VARCHAR(50) NOT NULL UNIQUE,
    LichKhoiHanhId BIGINT UNSIGNED NOT NULL,
    NguoiDungId BIGINT UNSIGNED NOT NULL,
    VoucherId BIGINT UNSIGNED NULL,

    HoTenLienHe VARCHAR(200) NOT NULL,
    EmailLienHe VARCHAR(255) NOT NULL,
    SoDienThoaiLienHe VARCHAR(20) NOT NULL,
    DiaChiLienHe VARCHAR(300) NULL,

    NgayDat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    SoNguoiLon SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    SoTreEm SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    SoEmBe SMALLINT UNSIGNED NOT NULL DEFAULT 0,

    TongHanhKhach SMALLINT UNSIGNED GENERATED ALWAYS AS (
        SoNguoiLon + SoTreEm + SoEmBe
    ) STORED,

    LoaiGiaApDung ENUM('ngay_thuong', 'cuoi_tuan') NOT NULL DEFAULT 'ngay_thuong',

    DonGiaNguoiLon DECIMAL(15,2) NOT NULL DEFAULT 0,
    DonGiaTreEm DECIMAL(15,2) NOT NULL DEFAULT 0,
    DonGiaEmBe DECIMAL(15,2) NOT NULL DEFAULT 0,

    TamTinh DECIMAL(15,2) NOT NULL DEFAULT 0,
    GiamGia DECIMAL(15,2) NOT NULL DEFAULT 0,
    TongTien DECIMAL(15,2) NOT NULL DEFAULT 0,
    SoTienDaThanhToan DECIMAL(15,2) NOT NULL DEFAULT 0,
    TienCocYeuCau DECIMAL(15,2) NOT NULL DEFAULT 0,

    PhuongThucThanhToanDuKien ENUM('tien_mat', 'chuyen_khoan', 'the', 'vi_dien_tu', 'cong_thanh_toan') NULL,

    TrangThaiBooking ENUM('moi_tao', 'cho_thanh_toan', 'da_coc', 'da_xac_nhan', 'da_huy', 'hoan_tat') NOT NULL DEFAULT 'cho_thanh_toan',
    TrangThaiThanhToan ENUM('chua_thanh_toan', 'thanh_toan_mot_phan', 'da_thanh_toan_du', 'that_bai', 'da_hoan_tien') NOT NULL DEFAULT 'chua_thanh_toan',

    HanThanhToan DATETIME NULL,
    GhiChu TEXT NULL,

    NguoiXacNhanId BIGINT UNSIGNED NULL,
    ThoiGianXacNhan DATETIME NULL,

    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT ChkBookingKhach CHECK (SoNguoiLon >= 1),
    CONSTRAINT ChkBookingGiamGia CHECK (GiamGia <= TamTinh),
    CONSTRAINT ChkBookingTienDaTt CHECK (SoTienDaThanhToan <= TongTien),
    CONSTRAINT ChkBookingTienCoc CHECK (TienCocYeuCau <= TongTien),

    CONSTRAINT FkBookingLichKhoiHanh FOREIGN KEY (LichKhoiHanhId) REFERENCES LichKhoiHanh(Id),
    CONSTRAINT FkBookingNguoiDung FOREIGN KEY (NguoiDungId) REFERENCES NguoiDung(Id),
    CONSTRAINT FkBookingVoucher FOREIGN KEY (VoucherId) REFERENCES Voucher(Id),
    CONSTRAINT FkBookingNguoiXacNhan FOREIGN KEY (NguoiXacNhanId) REFERENCES NguoiDung(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxBookingNguoiDung
ON Booking(NguoiDungId, NgayDat);

CREATE INDEX IdxBookingTrangThai
ON Booking(TrangThaiBooking, TrangThaiThanhToan, NgayDat);

CREATE INDEX IdxBookingLichKhoiHanh
ON Booking(LichKhoiHanhId);

-- =========================================================
-- 12. HANH KHACH
-- =========================================================
CREATE TABLE HanhKhach (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    BookingId BIGINT UNSIGNED NOT NULL,
    HoTen VARCHAR(200) NOT NULL,
    LoaiKhach ENUM('nguoi_lon', 'tre_em', 'em_be') NOT NULL,
    NgaySinh DATE NULL,
    GioiTinh ENUM('nam', 'nu', 'khac') NULL,
    SoGiayTo VARCHAR(50) NULL,
    QuocTich VARCHAR(100) NULL,
    GhiChu VARCHAR(300) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FkHanhKhachBooking FOREIGN KEY (BookingId) REFERENCES Booking(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxHanhKhachBooking
ON HanhKhach(BookingId, LoaiKhach);

-- =========================================================
-- 13. THANH TOAN
-- =========================================================
CREATE TABLE ThanhToan (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    BookingId BIGINT UNSIGNED NOT NULL,

    LoaiGiaoDich ENUM('dat_coc', 'thanh_toan_con_lai', 'thanh_toan_toan_bo', 'hoan_tien') NOT NULL DEFAULT 'thanh_toan_toan_bo',
    KenhThanhToan ENUM('noi_bo', 'ben_thu_ba') NOT NULL DEFAULT 'noi_bo',
    PhuongThucThanhToan ENUM('tien_mat', 'chuyen_khoan', 'the', 'vi_dien_tu', 'cong_thanh_toan') NOT NULL,

    NhaCungCap VARCHAR(100) NULL,
    SoTien DECIMAL(15,2) NOT NULL,
    MaGiaoDichNoiBo VARCHAR(100) NULL,
    MaGiaoDichBenThuBa VARCHAR(150) NULL,
    MaThamChieuBenThuBa VARCHAR(150) NULL,

    TrangThai ENUM('khoi_tao', 'cho_xu_ly', 'thanh_cong', 'that_bai', 'da_hoan_tien') NOT NULL DEFAULT 'cho_xu_ly',

    DuLieuPhanHoi JSON NULL,
    GhiChu VARCHAR(500) NULL,

    NguoiXacNhanId BIGINT UNSIGNED NULL,
    ThoiGianTao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ThoiGianXacNhan DATETIME NULL,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT ChkThanhToanSoTien CHECK (SoTien > 0),
    CONSTRAINT FkThanhToanBooking FOREIGN KEY (BookingId) REFERENCES Booking(Id),
    CONSTRAINT FkThanhToanNguoiXacNhan FOREIGN KEY (NguoiXacNhanId) REFERENCES NguoiDung(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxThanhToanBooking
ON ThanhToan(BookingId, TrangThai, ThoiGianTao);

CREATE INDEX IdxThanhToanMaGiaoDichBenThuBa
ON ThanhToan(MaGiaoDichBenThuBa);

-- =========================================================
-- 14. HOA DON
-- =========================================================
CREATE TABLE HoaDon (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    BookingId BIGINT UNSIGNED NOT NULL UNIQUE,
    SoHoaDon VARCHAR(50) NOT NULL UNIQUE,
    NgayLap DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    TongTienTruocThue DECIMAL(15,2) NOT NULL DEFAULT 0,
    ThueVat DECIMAL(15,2) NOT NULL DEFAULT 0,
    TongThanhToan DECIMAL(15,2) NOT NULL DEFAULT 0,
    EmailNhanHoaDon VARCHAR(255) NULL,
    FilePdf VARCHAR(500) NULL,
    GhiChu VARCHAR(500) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT ChkHoaDonTien CHECK (
        TongTienTruocThue >= 0 AND ThueVat >= 0 AND TongThanhToan >= 0
    ),
    CONSTRAINT FkHoaDonBooking FOREIGN KEY (BookingId) REFERENCES Booking(Id)
) ENGINE=InnoDB;

-- =========================================================
-- 15. PHIEU XAC NHAN TOUR
-- =========================================================
CREATE TABLE PhieuXacNhanTour (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    BookingId BIGINT UNSIGNED NOT NULL UNIQUE,
    MaPhieu VARCHAR(50) NOT NULL UNIQUE,
    NgayPhatHanh DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FilePdf VARCHAR(500) NULL,
    GhiChu VARCHAR(300) NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FkPhieuXacNhanBooking FOREIGN KEY (BookingId) REFERENCES Booking(Id)
) ENGINE=InnoDB;

-- =========================================================
-- 16. HUY BOOKING
-- =========================================================
CREATE TABLE HuyBooking (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    BookingId BIGINT UNSIGNED NOT NULL UNIQUE,
    NgayYeuCau DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    LyDo VARCHAR(500) NOT NULL,
    PhiHuy DECIMAL(15,2) NOT NULL DEFAULT 0,
    SoTienHoan DECIMAL(15,2) NOT NULL DEFAULT 0,
    TrangThaiXuLy ENUM('cho_xu_ly', 'da_duyet', 'tu_choi', 'da_hoan_tien') NOT NULL DEFAULT 'cho_xu_ly',
    NguoiXuLyId BIGINT UNSIGNED NULL,
    NgayXuLy DATETIME NULL,
    GhiChu TEXT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT ChkHuyBookingTien CHECK (PhiHuy >= 0 AND SoTienHoan >= 0),
    CONSTRAINT FkHuyBookingBooking FOREIGN KEY (BookingId) REFERENCES Booking(Id),
    CONSTRAINT FkHuyBookingNguoiXuLy FOREIGN KEY (NguoiXuLyId) REFERENCES NguoiDung(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxHuyBookingTrangThai
ON HuyBooking(TrangThaiXuLy, NgayYeuCau);

-- =========================================================
-- 17. DANH GIA TOUR
-- =========================================================
CREATE TABLE DanhGiaTour (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    BookingId BIGINT UNSIGNED NOT NULL UNIQUE,
    TourId BIGINT UNSIGNED NOT NULL,
    NguoiDungId BIGINT UNSIGNED NOT NULL,
    SoSao TINYINT UNSIGNED NOT NULL,
    NoiDungComment TEXT NULL,
    PhanHoiAdmin TEXT NULL,
    TrangThai ENUM('cho_duyet', 'hien_thi', 'an') NOT NULL DEFAULT 'hien_thi',
    NguoiDuyetId BIGINT UNSIGNED NULL,
    NgayDuyet DATETIME NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT ChkDanhGiaSoSao CHECK (SoSao BETWEEN 1 AND 5),
    CONSTRAINT FkDanhGiaBooking FOREIGN KEY (BookingId) REFERENCES Booking(Id),
    CONSTRAINT FkDanhGiaTour FOREIGN KEY (TourId) REFERENCES Tour(Id),
    CONSTRAINT FkDanhGiaNguoiDung FOREIGN KEY (NguoiDungId) REFERENCES NguoiDung(Id),
    CONSTRAINT FkDanhGiaNguoiDuyet FOREIGN KEY (NguoiDuyetId) REFERENCES NguoiDung(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxDanhGiaTour
ON DanhGiaTour(TourId, TrangThai, CreatedAt);

-- =========================================================
-- 18. TIN TUC
-- =========================================================
CREATE TABLE TinTuc (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    TieuDe VARCHAR(300) NOT NULL,
    Slug VARCHAR(320) NULL UNIQUE,
    TomTat VARCHAR(500) NULL,
    NoiDung LONGTEXT NULL,
    AnhDaiDien VARCHAR(500) NULL,
    TrangThai ENUM('nhap', 'hien_thi', 'an') NOT NULL DEFAULT 'nhap',
    NguoiDangId BIGINT UNSIGNED NOT NULL,
    NgayDang DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FkTinTucNguoiDang FOREIGN KEY (NguoiDangId) REFERENCES NguoiDung(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxTinTucTrangThaiNgay
ON TinTuc(TrangThai, NgayDang);

-- =========================================================
-- 19. HO TRO KHACH HANG
-- =========================================================
CREATE TABLE HoTroKhachHang (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    MaHoTro VARCHAR(50) NOT NULL UNIQUE,
    NguoiDungId BIGINT UNSIGNED NULL,
    BookingId BIGINT UNSIGNED NULL,
    HoTen VARCHAR(200) NULL,
    Email VARCHAR(255) NULL,
    SoDienThoai VARCHAR(20) NULL,
    LoaiYeuCau ENUM('tu_van_tour', 'ho_tro_booking', 'thanh_toan', 'khieu_nai', 'gop_y', 'khac') NOT NULL DEFAULT 'khac',
    TieuDe VARCHAR(300) NOT NULL,
    NoiDung TEXT NOT NULL,
    TrangThai ENUM('moi', 'dang_xu_ly', 'da_phan_hoi', 'da_dong') NOT NULL DEFAULT 'moi',
    MucDoUuTien ENUM('thap', 'trung_binh', 'cao') NOT NULL DEFAULT 'trung_binh',
    NguoiXuLyId BIGINT UNSIGNED NULL,
    PhanHoiAdmin TEXT NULL,
    NgayXuLy DATETIME NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT FkHoTroNguoiDung FOREIGN KEY (NguoiDungId) REFERENCES NguoiDung(Id),
    CONSTRAINT FkHoTroBooking FOREIGN KEY (BookingId) REFERENCES Booking(Id),
    CONSTRAINT FkHoTroNguoiXuLy FOREIGN KEY (NguoiXuLyId) REFERENCES NguoiDung(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxHoTroTrangThai
ON HoTroKhachHang(TrangThai, LoaiYeuCau, CreatedAt);

-- =========================================================
-- 20. YEU THICH TOUR
-- =========================================================
CREATE TABLE YeuThichTour (
    NguoiDungId BIGINT UNSIGNED NOT NULL,
    TourId BIGINT UNSIGNED NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (NguoiDungId, TourId),
    CONSTRAINT FkYeuThichNguoiDung FOREIGN KEY (NguoiDungId) REFERENCES NguoiDung(Id),
    CONSTRAINT FkYeuThichTour FOREIGN KEY (TourId) REFERENCES Tour(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxYeuThichTourTour
ON YeuThichTour(TourId);

-- =========================================================
-- 21. LICH SU TRANG THAI BOOKING
-- =========================================================
CREATE TABLE LichSuTrangThaiBooking (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    BookingId BIGINT UNSIGNED NOT NULL,
    TrangThaiBookingCu VARCHAR(50) NULL,
    TrangThaiBookingMoi VARCHAR(50) NOT NULL,
    TrangThaiThanhToanCu VARCHAR(50) NULL,
    TrangThaiThanhToanMoi VARCHAR(50) NULL,
    ThoiGian DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    NguoiThucHienId BIGINT UNSIGNED NULL,
    GhiChu VARCHAR(300) NULL,
    CONSTRAINT FkLsBooking FOREIGN KEY (BookingId) REFERENCES Booking(Id),
    CONSTRAINT FkLsNguoiThucHien FOREIGN KEY (NguoiThucHienId) REFERENCES NguoiDung(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxLichSuTrangThaiBooking
ON LichSuTrangThaiBooking(BookingId, ThoiGian);

-- =========================================================
-- 22. THONG BAO
-- =========================================================
CREATE TABLE ThongBao (
    Id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    NguoiDungId BIGINT UNSIGNED NOT NULL,
    TieuDe VARCHAR(200) NOT NULL,
    NoiDung VARCHAR(500) NOT NULL,
    LoaiThongBao ENUM('booking', 'payment', 'support', 'news', 'system') NOT NULL DEFAULT 'system',
    LinkDieuHuong VARCHAR(500) NULL,
    DaDoc BOOLEAN NOT NULL DEFAULT FALSE,
    CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FkThongBaoNguoiDung FOREIGN KEY (NguoiDungId) REFERENCES NguoiDung(Id)
) ENGINE=InnoDB;

CREATE INDEX IdxThongBaoNguoiDung
ON ThongBao(NguoiDungId, DaDoc, CreatedAt);

