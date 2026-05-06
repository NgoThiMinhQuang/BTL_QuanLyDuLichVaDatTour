namespace BE_QuanLyDuLichVaDatTour.DTOs.Admin;

public class InvoiceExportDto
{
    public long BookingId { get; set; }
    public string MaBooking { get; set; } = string.Empty;
    public string TenTour { get; set; } = string.Empty;
    public string MaTour { get; set; } = string.Empty;
    public string MaDotTour { get; set; } = string.Empty;
    public string NgayKhoiHanh { get; set; } = string.Empty;
    public string NgayKetThuc { get; set; } = string.Empty;

    public string HoTenLienHe { get; set; } = string.Empty;
    public string EmailLienHe { get; set; } = string.Empty;
    public string SoDienThoaiLienHe { get; set; } = string.Empty;
    public string? DiaChiLienHe { get; set; }

    public int SoNguoiLon { get; set; }
    public int SoTreEm { get; set; }
    public int SoEmBe { get; set; }
    public int TongHanhKhach { get; set; }

    public string LoaiGiaApDung { get; set; } = string.Empty;
    public decimal DonGiaNguoiLon { get; set; }
    public decimal DonGiaTreEm { get; set; }
    public decimal DonGiaEmBe { get; set; }
    public decimal TamTinh { get; set; }
    public decimal GiamGia { get; set; }
    public string? MaVoucher { get; set; }
    public decimal TongTien { get; set; }

    public string TrangThaiBooking { get; set; } = string.Empty;
    public string TrangThaiThanhToan { get; set; } = string.Empty;

    public DateTime NgayDat { get; set; }
    public string NgayIn { get; set; } = string.Empty;

    public List<InvoiceTravelerDto> HanhKhachs { get; set; } = new();
    public List<InvoicePaymentDto> ThanhToans { get; set; } = new();
}

public class InvoiceTravelerDto
{
    public string HoTen { get; set; } = string.Empty;
    public string LoaiKhach { get; set; } = string.Empty;
    public string? NgaySinh { get; set; }
    public string? GioiTinh { get; set; }
    public string? SoGiayTo { get; set; }
}

public class InvoicePaymentDto
{
    public string MaGiaoDich { get; set; } = string.Empty;
    public string LoaiGiaoDich { get; set; } = string.Empty;
    public string PhuongThuc { get; set; } = string.Empty;
    public decimal SoTien { get; set; }
    public string TrangThai { get; set; } = string.Empty;
    public string ThoiGian { get; set; } = string.Empty;
}