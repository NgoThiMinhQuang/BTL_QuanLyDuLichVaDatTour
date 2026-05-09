-- =========================================================
-- Script bo sung 4 bang con thieu vao database QuanLyDuLich
-- Chay script nay truc tiep vao database hien tai
-- KHONG mat du lieu cu
-- =========================================================

USE QuanLyDuLich;
GO

/* =========================================================
   1. LIEN HE (Form lien he ho tro)
   ========================================================= */
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.LienHe') AND type = N'U')
BEGIN
    CREATE TABLE dbo.LienHe (
        LienHeId BIGINT IDENTITY(1,1) PRIMARY KEY,
        HoTen NVARCHAR(200) NOT NULL,
        Email NVARCHAR(255) NOT NULL,
        SoDienThoai NVARCHAR(20) NULL,
        ChuDe NVARCHAR(300) NOT NULL,
        NoiDung NVARCHAR(MAX) NOT NULL,
        TrangThai NVARCHAR(20) NOT NULL DEFAULT N'moi',
        NguoiXuLyId BIGINT NULL,
        PhanHoi NVARCHAR(MAX) NULL,
        NgayGui DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
        NgayXuLy DATETIME2(0) NULL,
        CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
        UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT CK_LienHe_TrangThai CHECK (
            TrangThai IN (N'moi', N'dang_xu_ly', N'da_xu_ly', N'bo_qua')
        ),
        CONSTRAINT FK_LienHe_NguoiXuLy FOREIGN KEY (NguoiXuLyId) REFERENCES dbo.NguoiDung(NguoiDungId) ON DELETE SET NULL
    );

    CREATE INDEX IdxLienHe_TrangThai ON dbo.LienHe(TrangThai);
    CREATE INDEX IdxLienHe_NgayGui ON dbo.LienHe(NgayGui);

    PRINT 'Da tao bang LienHe';
END
ELSE
    PRINT 'Bang LienHe da ton tai';
GO

/* =========================================================
   2. THONG BAO
   ========================================================= */
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.ThongBao') AND type = N'U')
BEGIN
    CREATE TABLE dbo.ThongBao (
        ThongBaoId BIGINT IDENTITY(1,1) PRIMARY KEY,
        NguoiDungId BIGINT NOT NULL,
        Loai NVARCHAR(50) NOT NULL,
        TieuDe NVARCHAR(300) NOT NULL,
        NoiDung NVARCHAR(MAX) NOT NULL,
        DuongDan NVARCHAR(500) NULL,
        DaDoc BIT NOT NULL DEFAULT 0,
        ThoiGian DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT FK_ThongBao_NguoiDung FOREIGN KEY (NguoiDungId) REFERENCES dbo.NguoiDung(NguoiDungId)
    );

    CREATE INDEX IdxThongBao_User_DaDoc_ThoiGian ON dbo.ThongBao(NguoiDungId, DaDoc, ThoiGian);

    PRINT 'Da tao bang ThongBao';
END
ELSE
    PRINT 'Bang ThongBao da ton tai';
GO

/* =========================================================
   3. YEU THICH (Tour yeu thich)
   ========================================================= */
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.YeuThich') AND type = N'U')
BEGIN
    CREATE TABLE dbo.YeuThich (
        YeuThichId BIGINT IDENTITY(1,1) PRIMARY KEY,
        NguoiDungId BIGINT NOT NULL,
        TourId BIGINT NOT NULL,
        CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT FK_YeuThich_NguoiDung FOREIGN KEY (NguoiDungId) REFERENCES dbo.NguoiDung(NguoiDungId),
        CONSTRAINT FK_YeuThich_Tour FOREIGN KEY (TourId) REFERENCES dbo.Tour(TourId)
    );

    CREATE UNIQUE INDEX UQ_YeuThich_User_Tour ON dbo.YeuThich(NguoiDungId, TourId);

    PRINT 'Da tao bang YeuThich';
END
ELSE
    PRINT 'Bang YeuThich da ton tai';
GO

/* =========================================================
   4. NHAT KY HE THONG
   ========================================================= */
IF NOT EXISTS (SELECT 1 FROM sys.objects WHERE object_id = OBJECT_ID(N'dbo.NhatKyHeThong') AND type = N'U')
BEGIN
    CREATE TABLE dbo.NhatKyHeThong (
        NhatKyId BIGINT IDENTITY(1,1) PRIMARY KEY,
        NguoiDungId BIGINT NULL,
        HoTenNguoiDung NVARCHAR(200) NULL,
        HanhDong NVARCHAR(100) NOT NULL,
        Bang NVARCHAR(100) NOT NULL,
        BanGhiId BIGINT NULL,
        ChiTiet NVARCHAR(MAX) NULL,
        DiaChiIp NVARCHAR(50) NULL,
        UserAgent NVARCHAR(500) NULL,
        ThoiGian DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT FK_NhatKyHeThong_NguoiDung FOREIGN KEY (NguoiDungId) REFERENCES dbo.NguoiDung(NguoiDungId) ON DELETE SET NULL
    );

    CREATE INDEX IdxNhatKy_ThoiGian ON dbo.NhatKyHeThong(ThoiGian);
    CREATE INDEX IdxNhatKy_Bang ON dbo.NhatKyHeThong(Bang);
    CREATE INDEX IdxNhatKy_HanhDong ON dbo.NhatKyHeThong(HanhDong);

    PRINT 'Da tao bang NhatKyHeThong';
END
ELSE
    PRINT 'Bang NhatKyHeThong da ton tai';
GO

PRINT 'Hoan tat bo sung 4 bang thieu!';
GO