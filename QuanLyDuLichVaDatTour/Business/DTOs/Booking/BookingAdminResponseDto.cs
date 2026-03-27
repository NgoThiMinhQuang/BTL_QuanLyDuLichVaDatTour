namespace BLL.DTOs.Booking;

public class BookingAdminResponseDto : BookingResponseDto
{
    public long NguoiDungId { get; set; }

    public string HoTenNguoiDat { get; set; } = string.Empty;

    public string EmailNguoiDat { get; set; } = string.Empty;

    public long? NguoiXacNhanId { get; set; }

    public DateTime? ThoiGianXacNhan { get; set; }
}
