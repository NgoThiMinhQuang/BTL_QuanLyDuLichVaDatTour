namespace BE_QuanLyDuLichVaDatTour.DTOs.Admin;

public class AdminRecentBookingDto
{
    public long Id { get; set; }

    public string MaBooking { get; set; } = string.Empty;

    public string HoTenNguoiDat { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public string TrangThaiBooking { get; set; } = string.Empty;

    public string TrangThaiThanhToan { get; set; } = string.Empty;

    public decimal TongTien { get; set; }

    public DateTime NgayDat { get; set; }
}
