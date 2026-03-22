namespace BLL.DTOs.Booking;

public class BookingResponseDto
{
    public ulong Id { get; set; }

    public string MaBooking { get; set; } = string.Empty;

    public ulong LichKhoiHanhId { get; set; }

    public string MaDotTour { get; set; } = string.Empty;

    public DateTime NgayKhoiHanh { get; set; }

    public DateTime NgayKetThuc { get; set; }

    public ulong TourId { get; set; }

    public string MaTour { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public string HoTenLienHe { get; set; } = string.Empty;

    public string EmailLienHe { get; set; } = string.Empty;

    public string SoDienThoaiLienHe { get; set; } = string.Empty;

    public string? DiaChiLienHe { get; set; }

    public DateTime NgayDat { get; set; }

    public ushort SoNguoiLon { get; set; }

    public ushort SoTreEm { get; set; }

    public ushort SoEmBe { get; set; }

    public ushort TongHanhKhach { get; set; }

    public string LoaiGiaApDung { get; set; } = string.Empty;

    public decimal DonGiaNguoiLon { get; set; }

    public decimal DonGiaTreEm { get; set; }

    public decimal DonGiaEmBe { get; set; }

    public decimal TamTinh { get; set; }

    public decimal GiamGia { get; set; }

    public decimal TongTien { get; set; }

    public decimal SoTienDaThanhToan { get; set; }

    public decimal TienCocYeuCau { get; set; }

    public string? PhuongThucThanhToanDuKien { get; set; }

    public string TrangThaiBooking { get; set; } = string.Empty;

    public string TrangThaiThanhToan { get; set; } = string.Empty;

    public DateTime? HanThanhToan { get; set; }

    public string? GhiChu { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
