namespace BE_QuanLyDuLichVaDatTour.DTOs.Voucher;

public class VoucherStatisticsResponseDto
{
    public long Id { get; set; }
    public string MaVoucher { get; set; } = string.Empty;
    public string TenVoucher { get; set; } = string.Empty;
    public string KieuGiam { get; set; } = string.Empty;
    public decimal GiaTriGiam { get; set; }
    public int SoLuotDaDung { get; set; }
    public int SoLuongToiDa { get; set; }
    public decimal TongDoanhThuTuVoucher { get; set; }
    public decimal TongGiamGia { get; set; }
    public string TrangThai { get; set; } = string.Empty;
}