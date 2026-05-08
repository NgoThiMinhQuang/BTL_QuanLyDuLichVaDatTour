namespace BE_QuanLyDuLichVaDatTour.DTOs.Cancellation;

public class AdminCancellationResponseDto
{
    public long Id { get; set; }
    public long BookingId { get; set; }
    public string MaBooking { get; set; } = string.Empty;
    public string TenTour { get; set; } = string.Empty;
    public string HoTenKhachHang { get; set; } = string.Empty;
    public string EmailKhachHang { get; set; } = string.Empty;
    public string LyDo { get; set; } = string.Empty;
    public string TrangThai { get; set; } = string.Empty;
    public string? GhiChuAdmin { get; set; }
    public string? HoTenNguoiXuLy { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}