namespace BE_QuanLyDuLichVaDatTour.DTOs.Admin;

public class AdminPendingPaymentDto
{
    public long Id { get; set; }

    public string MaGiaoDich { get; set; } = string.Empty;

    public string PhuongThucThanhToan { get; set; } = string.Empty;

    public string HoTenKhachHang { get; set; } = string.Empty;

    public string MaBooking { get; set; } = string.Empty;

    public decimal SoTien { get; set; }

    public DateTime ThoiGianTao { get; set; }
}
