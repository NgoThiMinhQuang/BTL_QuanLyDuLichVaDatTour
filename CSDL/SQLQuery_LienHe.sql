-- ================================================
-- Bảng liên hệ / hỗ trợ (Admin Contact Management)
-- ================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LienHe')
BEGIN
    CREATE TABLE dbo.LienHe (
        LienHeId BIGINT IDENTITY(1,1) PRIMARY KEY,
        HoTen NVARCHAR(200) NOT NULL,
        Email NVARCHAR(255) NOT NULL,
        SoDienThoai NVARCHAR(20) NULL,
        ChuDe NVARCHAR(300) NOT NULL,
        NoiDung NVARCHAR(MAX) NOT NULL,
        TrangThai NVARCHAR(20) NOT NULL DEFAULT N'moi'
            CONSTRAINT CK_LienHe_TrangThai CHECK (TrangThai IN (N'moi', N'dang_xu_ly', N'da_xu_ly', N'bo_qua')),
        NguoiXuLyId BIGINT NULL,
        PhanHoi NVARCHAR(MAX) NULL,
        NgayGui DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
        NgayXuLy DATETIME2(0) NULL,
        CreatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
        UpdatedAt DATETIME2(0) NOT NULL DEFAULT SYSDATETIME(),
        CONSTRAINT FK_LienHe_NguoiXuLy FOREIGN KEY (NguoiXuLyId) REFERENCES dbo.NguoiDung(NguoiDungId)
    );
    CREATE INDEX IdxLienHe_TrangThai ON dbo.LienHe(TrangThai);
    CREATE INDEX IdxLienHe_NgayGui ON dbo.LienHe(NgayGui DESC);
END
GO