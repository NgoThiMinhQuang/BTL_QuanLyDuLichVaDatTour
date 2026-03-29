namespace BE_QuanLyDuLichVaDatTour.DTOs.Voucher;

public class VoucherAdminResponseDto
{
    public long Id { get; set; }

    public string MaVoucher { get; set; } = string.Empty;

    public string TenVoucher { get; set; } = string.Empty;

    public long? TourId { get; set; }

    public string? MaTour { get; set; }

    public string? TenTour { get; set; }

    public string KieuGiam { get; set; } = string.Empty;

    public decimal GiaTriGiam { get; set; }

    public decimal? GiamToiDa { get; set; }

    public decimal DonHangToiThieu { get; set; }

    public DateTime NgayBatDau { get; set; }

    public DateTime NgayKetThuc { get; set; }

    public int SoLuongToiDa { get; set; }

    public int SoLuongDaDung { get; set; }

    public string? MoTa { get; set; }

    public string TrangThai { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
