IF DB_ID(N'QuanLyDuLich') IS NOT NULL
BEGIN
    ALTER DATABASE QuanLyDuLich SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE QuanLyDuLich;
END
GO

CREATE DATABASE QuanLyDuLich;
GO

USE QuanLyDuLich;
GO

/* =========================================================
   1. NGUOI DUNG
   ========================================================= */
CREATE TABLE dbo.NguoiDung (
    NguoiDungId BIGINT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    MatKhau NVARCHAR(255) NOT NULL,
    HoTen NVARCHAR(200) NOT NULL,
    SoDienThoai NVARCHAR(20) NULL,
    DiaChi NVARCHAR(300) NULL,
    AnhDaiDien NVARCHAR(500) NULL,
    VaiTro NVARCHAR(20) NOT NULL
        CONSTRAINT CK_NguoiDung_VaiTro CHECK (VaiTro IN (N'admin', N'khach_hang')),
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'hoat_dong'
        CONSTRAINT CK_NguoiDung_TrangThai CHECK (TrangThai IN (N'hoat_dong', N'bi_khoa')),
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE INDEX IdxNguoiDung_VaiTro_TrangThai
ON dbo.NguoiDung(VaiTro, TrangThai);
GO

CREATE TABLE dbo.PasswordResetToken (
    PasswordResetTokenId BIGINT IDENTITY(1,1) PRIMARY KEY,
    NguoiDungId BIGINT NOT NULL,
    TokenHash NVARCHAR(128) NOT NULL UNIQUE,
    ExpiresAt DATETIME2(0) NOT NULL,
    UsedAt DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_PasswordResetToken_NguoiDung FOREIGN KEY (NguoiDungId) REFERENCES dbo.NguoiDung(NguoiDungId) ON DELETE CASCADE
);
GO

CREATE INDEX IdxPasswordResetToken_NguoiDung_TrangThai
ON dbo.PasswordResetToken(NguoiDungId, UsedAt, ExpiresAt);
GO

/* =========================================================
   2. LOAI TOUR
   ========================================================= */
CREATE TABLE dbo.LoaiTour (
    LoaiTourId BIGINT IDENTITY(1,1) PRIMARY KEY,
    TenLoai NVARCHAR(100) NOT NULL UNIQUE,
    MoTa NVARCHAR(MAX) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'hoat_dong'
        CONSTRAINT CK_LoaiTour_TrangThai CHECK (TrangThai IN (N'hoat_dong', N'an')),
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME()
);
GO

/* =========================================================
   3. DIA DIEM
   ========================================================= */
CREATE TABLE dbo.DiaDiem (
    DiaDiemId BIGINT IDENTITY(1,1) PRIMARY KEY,
    TenDiaDiem NVARCHAR(200) NOT NULL,
    TinhThanh NVARCHAR(100) NULL,
    QuocGia NVARCHAR(100) NOT NULL DEFAULT N'Viet Nam',
    MoTa NVARCHAR(MAX) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'hoat_dong'
        CONSTRAINT CK_DiaDiem_TrangThai CHECK (TrangThai IN (N'hoat_dong', N'an')),
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME()
);
GO

CREATE INDEX IdxDiaDiem_TinhThanh_QuocGia
ON dbo.DiaDiem(TinhThanh, QuocGia);
GO

/* =========================================================
   4. TOUR
   ========================================================= */
CREATE TABLE dbo.Tour (
    TourId BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaTour NVARCHAR(50) NOT NULL UNIQUE,
    TenTour NVARCHAR(300) NOT NULL,
    LoaiTourId BIGINT NOT NULL,
    DiemXuatPhatId BIGINT NOT NULL,
    SoNgay TINYINT NOT NULL,
    SoDem TINYINT NOT NULL,
    PhuongTien NVARCHAR(100) NULL,
    GiaTuThamKhao DECIMAL(15,2) NOT NULL DEFAULT 0,
    MoTaNgan NVARCHAR(500) NULL,
    MoTaChiTiet NVARCHAR(MAX) NULL,
    DieuKienTour NVARCHAR(MAX) NULL,
    IsNoiBat BIT NOT NULL DEFAULT 0,
    TrangThai NVARCHAR(30) NOT NULL DEFAULT N'nhap'
        CONSTRAINT CK_Tour_TrangThai CHECK (
            TrangThai IN (N'nhap', N'dang_mo_ban', N'tam_ngung', N'an', N'ngung_kinh_doanh')
        ),
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT CK_Tour_SoDem CHECK (SoDem <= SoNgay),
    CONSTRAINT FK_Tour_LoaiTour FOREIGN KEY (LoaiTourId) REFERENCES dbo.LoaiTour(LoaiTourId),
    CONSTRAINT FK_Tour_DiemXuatPhat FOREIGN KEY (DiemXuatPhatId) REFERENCES dbo.DiaDiem(DiaDiemId)
);
GO

CREATE INDEX IdxTour_TimKiem
ON dbo.Tour(TrangThai, LoaiTourId, DiemXuatPhatId, IsNoiBat, GiaTuThamKhao);
GO

/* =========================================================
   5. TOUR DIEM DEN
   ========================================================= */
CREATE TABLE dbo.TourDiemDen (
    TourDiemDenId BIGINT IDENTITY(1,1) PRIMARY KEY,
    TourId BIGINT NOT NULL,
    DiaDiemId BIGINT NOT NULL,
    ThuTu SMALLINT NOT NULL,
    GhiChu NVARCHAR(300) NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_TourDiemDen UNIQUE (TourId, ThuTu),
    CONSTRAINT FK_TourDiemDen_Tour FOREIGN KEY (TourId) REFERENCES dbo.Tour(TourId),
    CONSTRAINT FK_TourDiemDen_DiaDiem FOREIGN KEY (DiaDiemId) REFERENCES dbo.DiaDiem(DiaDiemId)
);
GO

CREATE INDEX IdxTourDiemDen_DiaDiem
ON dbo.TourDiemDen(DiaDiemId, TourId);
GO

/* =========================================================
   6. ANH TOUR
   ========================================================= */
CREATE TABLE dbo.AnhTour (
    AnhTourId BIGINT IDENTITY(1,1) PRIMARY KEY,
    TourId BIGINT NOT NULL,
    LinkAnh NVARCHAR(500) NOT NULL,
    MoTa NVARCHAR(300) NULL,
    IsAvatar BIT NOT NULL DEFAULT 0,
    ThuTu SMALLINT NOT NULL DEFAULT 1,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_AnhTour_Tour FOREIGN KEY (TourId) REFERENCES dbo.Tour(TourId)
);
GO

CREATE UNIQUE INDEX UX_AnhTour_MotAvatarMoiTour
ON dbo.AnhTour(TourId)
WHERE IsAvatar = 1;
GO

CREATE INDEX IdxAnhTour_Tour
ON dbo.AnhTour(TourId, ThuTu);
GO

/* =========================================================
   7. LICH TRINH
   ========================================================= */
CREATE TABLE dbo.LichTrinh (
    LichTrinhId BIGINT IDENTITY(1,1) PRIMARY KEY,
    TourId BIGINT NOT NULL,
    NgayThu TINYINT NOT NULL,
    ThuTuTrongNgay SMALLINT NOT NULL DEFAULT 1,
    GioBatDau TIME NULL,
    GioKetThuc TIME NULL,
    TieuDe NVARCHAR(300) NULL,
    NoiDung NVARCHAR(MAX) NULL,
    DiaDiemId BIGINT NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_LichTrinh UNIQUE (TourId, NgayThu, ThuTuTrongNgay),
    CONSTRAINT CK_LichTrinh_Gio CHECK (
        GioKetThuc IS NULL OR GioBatDau IS NULL OR GioKetThuc >= GioBatDau
    ),
    CONSTRAINT FK_LichTrinh_Tour FOREIGN KEY (TourId) REFERENCES dbo.Tour(TourId),
    CONSTRAINT FK_LichTrinh_DiaDiem FOREIGN KEY (DiaDiemId) REFERENCES dbo.DiaDiem(DiaDiemId)
);
GO

CREATE INDEX IdxLichTrinh_Tour_Ngay
ON dbo.LichTrinh(TourId, NgayThu, ThuTuTrongNgay);
GO

/* =========================================================
   8. LICH KHOI HANH
   ========================================================= */
CREATE TABLE dbo.LichKhoiHanh (
    LichKhoiHanhId BIGINT IDENTITY(1,1) PRIMARY KEY,
    TourId BIGINT NOT NULL,
    MaDotTour NVARCHAR(50) NOT NULL UNIQUE,
    NgayKhoiHanh DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    NoiTapTrung NVARCHAR(300) NULL,
    SoChoToiDa SMALLINT NOT NULL,
    GhiChu NVARCHAR(500) NULL,
    LyDoHuy NVARCHAR(500) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'mo_ban'
        CONSTRAINT CK_LichKhoiHanh_TrangThai CHECK (
            TrangThai IN (N'mo_ban', N'het_cho', N'da_khoi_hanh', N'da_ket_thuc', N'da_huy')
        ),
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT CK_LichKhoiHanh_Ngay CHECK (NgayKetThuc >= NgayKhoiHanh),
    CONSTRAINT FK_LichKhoiHanh_Tour FOREIGN KEY (TourId) REFERENCES dbo.Tour(TourId)
);
GO

CREATE INDEX IdxLichKhoiHanh_TimKiem
ON dbo.LichKhoiHanh(TourId, NgayKhoiHanh, TrangThai);
GO

/* =========================================================
   9. BANG GIA LICH KHOI HANH
   ========================================================= */
CREATE TABLE dbo.BangGiaLichKhoiHanh (
    BangGiaLichKhoiHanhId BIGINT IDENTITY(1,1) PRIMARY KEY,
    LichKhoiHanhId BIGINT NOT NULL,
    LoaiKhach NVARCHAR(20) NOT NULL
        CONSTRAINT CK_BangGia_LoaiKhach CHECK (
            LoaiKhach IN (N'nguoi_lon', N'tre_em', N'em_be')
        ),
    LoaiGia NVARCHAR(20) NOT NULL
        CONSTRAINT CK_BangGia_LoaiGia CHECK (
            LoaiGia IN (N'ngay_thuong', N'cuoi_tuan')
        ),
    DonGia DECIMAL(15,2) NOT NULL,
    MoTa NVARCHAR(300) NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_BangGia UNIQUE (LichKhoiHanhId, LoaiKhach, LoaiGia),
    CONSTRAINT CK_BangGia_DonGia CHECK (DonGia >= 0),
    CONSTRAINT FK_BangGia_LichKhoiHanh FOREIGN KEY (LichKhoiHanhId) REFERENCES dbo.LichKhoiHanh(LichKhoiHanhId)
);
GO

CREATE INDEX IdxBangGia_LichKhoiHanh
ON dbo.BangGiaLichKhoiHanh(LichKhoiHanhId, LoaiKhach, LoaiGia);
GO

/* =========================================================
   10. VOUCHER
   ========================================================= */
CREATE TABLE dbo.Voucher (
    VoucherId BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaVoucher NVARCHAR(50) NOT NULL UNIQUE,
    TenVoucher NVARCHAR(200) NOT NULL,
    TourId BIGINT NULL,
    KieuGiam NVARCHAR(20) NOT NULL
        CONSTRAINT CK_Voucher_KieuGiam CHECK (KieuGiam IN (N'phan_tram', N'so_tien')),
    GiaTriGiam DECIMAL(15,2) NOT NULL,
    GiamToiDa DECIMAL(15,2) NULL,
    DonHangToiThieu DECIMAL(15,2) NOT NULL DEFAULT 0,
    NgayBatDau DATETIME2(0) NOT NULL,
    NgayKetThuc DATETIME2(0) NOT NULL,
    SoLuongToiDa INT NOT NULL DEFAULT 0,
    SoLuongDaDung INT NOT NULL DEFAULT 0,
    MoTa NVARCHAR(500) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'hoat_dong'
        CONSTRAINT CK_Voucher_TrangThai CHECK (TrangThai IN (N'hoat_dong', N'an')),
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT CK_Voucher_Ngay CHECK (NgayKetThuc >= NgayBatDau),
    CONSTRAINT CK_Voucher_SoLuong CHECK (SoLuongDaDung <= SoLuongToiDa),
    CONSTRAINT CK_Voucher_GiaTri CHECK (
        (KieuGiam = N'phan_tram' AND GiaTriGiam > 0 AND GiaTriGiam <= 100)
        OR
        (KieuGiam = N'so_tien' AND GiaTriGiam > 0)
    ),
    CONSTRAINT FK_Voucher_Tour FOREIGN KEY (TourId) REFERENCES dbo.Tour(TourId)
);
GO

/* =========================================================
   11. BOOKING
   ========================================================= */
CREATE TABLE dbo.Booking (
    BookingId BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaBooking NVARCHAR(50) NOT NULL UNIQUE,
    LichKhoiHanhId BIGINT NOT NULL,
    KhachHangId BIGINT NOT NULL,
    VoucherId BIGINT NULL,

    HoTenLienHe NVARCHAR(200) NOT NULL,
    EmailLienHe NVARCHAR(255) NOT NULL,
    SoDienThoaiLienHe NVARCHAR(20) NOT NULL,
    DiaChiLienHe NVARCHAR(300) NULL,

    NgayDat DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),

    SoNguoiLon SMALLINT NOT NULL DEFAULT 1,
    SoTreEm SMALLINT NOT NULL DEFAULT 0,
    SoEmBe SMALLINT NOT NULL DEFAULT 0,

    TongHanhKhach AS (
        ISNULL(SoNguoiLon, 0) + ISNULL(SoTreEm, 0) + ISNULL(SoEmBe, 0)
    ) PERSISTED,

    LoaiGiaApDung NVARCHAR(20) NOT NULL DEFAULT N'ngay_thuong'
        CONSTRAINT CK_Booking_LoaiGia CHECK (
            LoaiGiaApDung IN (N'ngay_thuong', N'cuoi_tuan')
        ),

    DonGiaNguoiLon DECIMAL(15,2) NOT NULL DEFAULT 0,
    DonGiaTreEm DECIMAL(15,2) NOT NULL DEFAULT 0,
    DonGiaEmBe DECIMAL(15,2) NOT NULL DEFAULT 0,

    TamTinh DECIMAL(15,2) NOT NULL DEFAULT 0,
    GiamGia DECIMAL(15,2) NOT NULL DEFAULT 0,
    TongTien DECIMAL(15,2) NOT NULL DEFAULT 0,
    SoTienDaThanhToan DECIMAL(15,2) NOT NULL DEFAULT 0,
    TienCocYeuCau DECIMAL(15,2) NOT NULL DEFAULT 0,

    PhuongThucThanhToanDuKien NVARCHAR(30) NULL
        CONSTRAINT CK_Booking_PhuongThucThanhToanDuKien CHECK (
            PhuongThucThanhToanDuKien IS NULL OR
            PhuongThucThanhToanDuKien IN (
                N'tien_mat', N'chuyen_khoan', N'the', N'vi_dien_tu', N'cong_thanh_toan'
            )
        ),

    TrangThaiBooking NVARCHAR(30) NOT NULL DEFAULT N'cho_thanh_toan'
        CONSTRAINT CK_Booking_TrangThaiBooking CHECK (
            TrangThaiBooking IN (
                N'moi_tao', N'cho_thanh_toan', N'da_coc', N'da_xac_nhan', N'da_huy', N'hoan_tat'
            )
        ),

    TrangThaiThanhToan NVARCHAR(30) NOT NULL DEFAULT N'chua_thanh_toan'
        CONSTRAINT CK_Booking_TrangThaiThanhToan CHECK (
            TrangThaiThanhToan IN (
                N'chua_thanh_toan', N'thanh_toan_mot_phan', N'da_thanh_toan_du', N'that_bai', N'da_hoan_tien'
            )
        ),

    HanThanhToan DATETIME2(0) NULL,
    GhiChu NVARCHAR(MAX) NULL,

    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT CK_Booking_SoNguoiLon CHECK (SoNguoiLon >= 1),
    CONSTRAINT CK_Booking_GiamGia CHECK (GiamGia <= TamTinh),
    CONSTRAINT CK_Booking_SoTienDaThanhToan CHECK (SoTienDaThanhToan <= TongTien),
    CONSTRAINT CK_Booking_TienCocYeuCau CHECK (TienCocYeuCau <= TongTien),

    CONSTRAINT FK_Booking_LichKhoiHanh FOREIGN KEY (LichKhoiHanhId) REFERENCES dbo.LichKhoiHanh(LichKhoiHanhId),
    CONSTRAINT FK_Booking_KhachHang FOREIGN KEY (KhachHangId) REFERENCES dbo.NguoiDung(NguoiDungId),
    CONSTRAINT FK_Booking_Voucher FOREIGN KEY (VoucherId) REFERENCES dbo.Voucher(VoucherId)
);
GO

CREATE INDEX IdxBooking_KhachHang
ON dbo.Booking(KhachHangId, NgayDat);
GO

CREATE INDEX IdxBooking_TrangThai
ON dbo.Booking(TrangThaiBooking, TrangThaiThanhToan, NgayDat);
GO

CREATE INDEX IdxBooking_LichKhoiHanh
ON dbo.Booking(LichKhoiHanhId);
GO

/* =========================================================
   12. HANH KHACH
   ========================================================= */
CREATE TABLE dbo.HanhKhach (
    HanhKhachId BIGINT IDENTITY(1,1) PRIMARY KEY,
    BookingId BIGINT NOT NULL,
    HoTen NVARCHAR(200) NOT NULL,
    LoaiKhach NVARCHAR(20) NOT NULL
        CONSTRAINT CK_HanhKhach_LoaiKhach CHECK (
            LoaiKhach IN (N'nguoi_lon', N'tre_em', N'em_be')
        ),
    NgaySinh DATE NULL,
    GioiTinh NVARCHAR(10) NULL
        CONSTRAINT CK_HanhKhach_GioiTinh CHECK (
            GioiTinh IS NULL OR GioiTinh IN (N'nam', N'nu', N'khac')
        ),
    SoGiayTo NVARCHAR(50) NULL,
    QuocTich NVARCHAR(100) NULL,
    GhiChu NVARCHAR(300) NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_HanhKhach_Booking FOREIGN KEY (BookingId) REFERENCES dbo.Booking(BookingId)
);
GO

CREATE INDEX IdxHanhKhach_Booking
ON dbo.HanhKhach(BookingId, LoaiKhach);
GO

/* =========================================================
   13. THANH TOAN
   ========================================================= */
CREATE TABLE dbo.ThanhToan (
    ThanhToanId BIGINT IDENTITY(1,1) PRIMARY KEY,
    BookingId BIGINT NOT NULL,
    LoaiGiaoDich NVARCHAR(30) NOT NULL DEFAULT N'thanh_toan_toan_bo'
        CONSTRAINT CK_ThanhToan_LoaiGiaoDich CHECK (
            LoaiGiaoDich IN (N'dat_coc', N'thanh_toan_con_lai', N'thanh_toan_toan_bo', N'hoan_tien')
        ),
    KenhThanhToan NVARCHAR(20) NOT NULL DEFAULT N'noi_bo'
        CONSTRAINT CK_ThanhToan_KenhThanhToan CHECK (
            KenhThanhToan IN (N'noi_bo', N'ben_thu_ba')
        ),
    PhuongThucThanhToan NVARCHAR(30) NOT NULL
        CONSTRAINT CK_ThanhToan_PhuongThucThanhToan CHECK (
            PhuongThucThanhToan IN (
                N'tien_mat', N'chuyen_khoan', N'the', N'vi_dien_tu', N'cong_thanh_toan'
            )
        ),
    NhaCungCap NVARCHAR(100) NULL,
    SoTien DECIMAL(15,2) NOT NULL,
    MaGiaoDichNoiBo NVARCHAR(100) NULL,
    MaGiaoDichBenThuBa NVARCHAR(150) NULL,
    MaThamChieuBenThuBa NVARCHAR(150) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'cho_xu_ly'
        CONSTRAINT CK_ThanhToan_TrangThai CHECK (
            TrangThai IN (N'khoi_tao', N'cho_xu_ly', N'thanh_cong', N'that_bai', N'da_hoan_tien')
        ),
    DuLieuPhanHoi NVARCHAR(MAX) NULL,
    GhiChu NVARCHAR(500) NULL,
    ThoiGianTao DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT CK_ThanhToan_SoTien CHECK (SoTien > 0),
    CONSTRAINT CK_ThanhToan_DuLieuPhanHoi CHECK (DuLieuPhanHoi IS NULL OR ISJSON(DuLieuPhanHoi) = 1),
    CONSTRAINT FK_ThanhToan_Booking FOREIGN KEY (BookingId) REFERENCES dbo.Booking(BookingId)
);
GO

CREATE INDEX IdxThanhToan_Booking
ON dbo.ThanhToan(BookingId, TrangThai, ThoiGianTao);
GO

CREATE INDEX IdxThanhToan_MaGiaoDichBenThuBa
ON dbo.ThanhToan(MaGiaoDichBenThuBa);
GO

/* =========================================================
   14. HOA DON
   ========================================================= */
CREATE TABLE dbo.HoaDon (
    HoaDonId BIGINT IDENTITY(1,1) PRIMARY KEY,
    BookingId BIGINT NOT NULL UNIQUE,
    SoHoaDon NVARCHAR(50) NOT NULL UNIQUE,
    NgayLap DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    TongTienTruocThue DECIMAL(15,2) NOT NULL DEFAULT 0,
    ThueVat DECIMAL(15,2) NOT NULL DEFAULT 0,
    TongThanhToan DECIMAL(15,2) NOT NULL DEFAULT 0,
    EmailNhanHoaDon NVARCHAR(255) NULL,
    FilePdf NVARCHAR(500) NULL,
    GhiChu NVARCHAR(500) NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT CK_HoaDon_Tien CHECK (
        TongTienTruocThue >= 0 AND ThueVat >= 0 AND TongThanhToan >= 0
    ),
    CONSTRAINT FK_HoaDon_Booking FOREIGN KEY (BookingId) REFERENCES dbo.Booking(BookingId)
);
GO

/* =========================================================
   15. PHIEU XAC NHAN TOUR
   ========================================================= */
CREATE TABLE dbo.PhieuXacNhanTour (
    PhieuXacNhanTourId BIGINT IDENTITY(1,1) PRIMARY KEY,
    BookingId BIGINT NOT NULL UNIQUE,
    MaPhieu NVARCHAR(50) NOT NULL UNIQUE,
    NgayPhatHanh DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    FilePdf NVARCHAR(500) NULL,
    GhiChu NVARCHAR(300) NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_PhieuXacNhanTour_Booking FOREIGN KEY (BookingId) REFERENCES dbo.Booking(BookingId)
);
GO

/* =========================================================
   16. DANH GIA TOUR
   ========================================================= */
CREATE TABLE dbo.DanhGiaTour (
    DanhGiaTourId BIGINT IDENTITY(1,1) PRIMARY KEY,
    BookingId BIGINT NOT NULL UNIQUE,
    TourId BIGINT NOT NULL,
    KhachHangId BIGINT NOT NULL,
    SoSao TINYINT NOT NULL,
    NoiDungComment NVARCHAR(MAX) NULL,
    PhanHoiAdmin NVARCHAR(MAX) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'hien_thi'
        CONSTRAINT CK_DanhGiaTour_TrangThai CHECK (
            TrangThai IN (N'cho_duyet', N'hien_thi', N'an')
        ),
    NgayDanhGia DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    NgayPhanHoi DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT CK_DanhGiaTour_SoSao CHECK (SoSao BETWEEN 1 AND 5),
    CONSTRAINT FK_DanhGiaTour_Booking FOREIGN KEY (BookingId) REFERENCES dbo.Booking(BookingId),
    CONSTRAINT FK_DanhGiaTour_Tour FOREIGN KEY (TourId) REFERENCES dbo.Tour(TourId),
    CONSTRAINT FK_DanhGiaTour_KhachHang FOREIGN KEY (KhachHangId) REFERENCES dbo.NguoiDung(NguoiDungId)
);
GO

CREATE INDEX IdxDanhGiaTour
ON dbo.DanhGiaTour(TourId, TrangThai, NgayDanhGia);
GO

/* =========================================================
   17. TIN TUC
   ========================================================= */
CREATE TABLE dbo.TinTuc (
    TinTucId BIGINT IDENTITY(1,1) PRIMARY KEY,
    TieuDe NVARCHAR(300) NOT NULL,
    Slug NVARCHAR(320) NULL,
    TomTat NVARCHAR(500) NULL,
    NoiDung NVARCHAR(MAX) NULL,
    AnhDaiDien NVARCHAR(500) NULL,
    DanhMuc NVARCHAR(100) NULL,
    TrangThai NVARCHAR(20) NOT NULL DEFAULT N'nhap'
        CONSTRAINT CK_TinTuc_TrangThai CHECK (
            TrangThai IN (N'nhap', N'hien_thi', N'an')
        ),
    AdminId BIGINT NOT NULL,
    NgayDang DATETIME2(0) NULL,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_TinTuc_Admin FOREIGN KEY (AdminId) REFERENCES dbo.NguoiDung(NguoiDungId)
);
GO

CREATE UNIQUE INDEX UX_TinTuc_Slug
ON dbo.TinTuc(Slug)
WHERE Slug IS NOT NULL;
GO

CREATE INDEX IdxTinTuc_TrangThai_Ngay
ON dbo.TinTuc(TrangThai, NgayDang);
GO

/* =========================================================
   18. LICH SU TRANG THAI BOOKING
   ========================================================= */
CREATE TABLE dbo.LichSuTrangThaiBooking (
    LichSuTrangThaiBookingId BIGINT IDENTITY(1,1) PRIMARY KEY,
    BookingId BIGINT NOT NULL,
    TrangThaiBookingCu NVARCHAR(50) NULL,
    TrangThaiBookingMoi NVARCHAR(50) NOT NULL,
    TrangThaiThanhToanCu NVARCHAR(50) NULL,
    TrangThaiThanhToanMoi NVARCHAR(50) NULL,
    ThoiGian DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    GhiChu NVARCHAR(300) NULL,
    CONSTRAINT FK_LichSuTrangThaiBooking_Booking FOREIGN KEY (BookingId) REFERENCES dbo.Booking(BookingId)
);
GO

CREATE INDEX IdxLichSuTrangThaiBooking
ON dbo.LichSuTrangThaiBooking(BookingId, ThoiGian);
GO

/* =========================================================
   19. THONG BAO
   ========================================================= */
CREATE TABLE dbo.ThongBao (
    ThongBaoId BIGINT IDENTITY(1,1) PRIMARY KEY,
    NguoiNhanId BIGINT NOT NULL,
    TieuDe NVARCHAR(200) NOT NULL,
    NoiDung NVARCHAR(500) NOT NULL,
    LoaiThongBao NVARCHAR(20) NOT NULL DEFAULT N'system'
        CONSTRAINT CK_ThongBao_LoaiThongBao CHECK (
            LoaiThongBao IN (N'booking', N'payment', N'news', N'system')
        ),
    LinkDieuHuong NVARCHAR(500) NULL,
    DaDoc BIT NOT NULL DEFAULT 0,
    CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT FK_ThongBao_NguoiNhan FOREIGN KEY (NguoiNhanId) REFERENCES dbo.NguoiDung(NguoiDungId)
);
GO

CREATE INDEX IdxThongBao_NguoiNhan
ON dbo.ThongBao(NguoiNhanId, DaDoc, CreatedAt);
GO