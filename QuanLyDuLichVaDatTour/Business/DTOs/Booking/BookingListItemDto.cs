namespace BLL.DTOs.Booking;

public class BookingListItemDto
{
    public long Id { get; set; }

    public string MaBooking { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public string MaDotTour { get; set; } = string.Empty;

    public DateTime NgayKhoiHanh { get; set; }

    public int TongHanhKhach { get; set; }

    public decimal TongTien { get; set; }

    public string TrangThaiBooking { get; set; } = string.Empty;

    public string TrangThaiThanhToan { get; set; } = string.Empty;

    public DateTime NgayDat { get; set; }
}
