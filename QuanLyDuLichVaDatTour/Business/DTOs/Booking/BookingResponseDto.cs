namespace BLL.DTOs.Booking;

public class BookingResponseDto
{
    public long Id { get; set; }

    public string MaBooking { get; set; } = string.Empty;

    public long LichKhoiHanhId { get; set; }

    public string MaDotTour { get; set; } = string.Empty;

    public DateTime NgayKhoiHanh { get; set; }

    public DateTime NgayKetThuc { get; set; }

    public long TourId { get; set; }

    public string MaTour { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public string HoTenLienHe { get; set; } = string.Empty;

    public string EmailLienHe { get; set; } = string.Empty;

    public string SoDienThoaiLienHe { get; set; } = string.Empty;

    public string? DiaChiLienHe { get; set; }

    public DateTime NgayDat { get; set; }

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

    public long? VoucherId { get; set; }

    public string? MaVoucher { get; set; }

    public string? TenVoucher { get; set; }

    public decimal TongTien { get; set; }

    public decimal SoTienDaThanhToan { get; set; }

    public decimal TienCocYeuCau { get; set; }

    public string? PhuongThucThanhToanDuKien { get; set; }

    public string TrangThaiBooking { get; set; } = string.Empty;

    public string TrangThaiThanhToan { get; set; } = string.Empty;

    public DateTime? HanThanhToan { get; set; }

    public string? GhiChu { get; set; }

    public List<HanhKhachResponseDto> HanhKhachs { get; set; } = new();

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
