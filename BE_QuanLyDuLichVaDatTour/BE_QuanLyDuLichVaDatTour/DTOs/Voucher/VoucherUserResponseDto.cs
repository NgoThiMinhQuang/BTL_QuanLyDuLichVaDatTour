namespace BE_QuanLyDuLichVaDatTour.DTOs.Voucher;

public class VoucherUserResponseDto
{
    public long Id { get; set; }
    public string MaVoucher { get; set; } = string.Empty;
    public string TenVoucher { get; set; } = string.Empty;
    public string KieuGiam { get; set; } = string.Empty;
    public decimal GiaTriGiam { get; set; }
    public decimal? GiamToiDa { get; set; }
    public decimal DonHangToiThieu { get; set; }
    public DateTime NgayBatDau { get; set; }
    public DateTime NgayKetThuc { get; set; }
    public string? MoTa { get; set; }
    public int SoLuongConLai { get; set; }
}