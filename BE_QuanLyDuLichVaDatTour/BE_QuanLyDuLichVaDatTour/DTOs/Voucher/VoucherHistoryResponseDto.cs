namespace BE_QuanLyDuLichVaDatTour.DTOs.Voucher;

public class VoucherHistoryResponseDto
{
    public long Id { get; set; }
    public string MaVoucher { get; set; } = string.Empty;
    public string TenVoucher { get; set; } = string.Empty;
    public string KieuGiam { get; set; } = string.Empty;
    public decimal GiaTriGiam { get; set; }
    public string MaBooking { get; set; } = string.Empty;
    public long BookingId { get; set; }
    public DateTime NgayDat { get; set; }
    public decimal TongTien { get; set; }
    public string TrangThaiBooking { get; set; } = string.Empty;
}