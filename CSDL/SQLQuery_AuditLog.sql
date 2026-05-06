-- ================================================
-- Bảng nhật ký hệ thống (Admin Audit Log)
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'NhatKyHeThong')
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
        ThoiGian DATETIME2(0) NOT NULL DEFAULT SYSDATETIME()
    );
    CREATE INDEX IdxNhatKy_ThoiGian ON dbo.NhatKyHeThong(ThoiGian DESC);
    CREATE INDEX IdxNhatKy_Bang ON dbo.NhatKyHeThong(Bang);
    CREATE INDEX IdxNhatKy_HanhDong ON dbo.NhatKyHeThong(HanhDong);
END
GO