using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.Booking;

public class UpdateBookingStatusRequestDto
{
    [Required]
    public TrangThaiBooking TrangThaiBooking { get; set; }

    public TrangThaiThanhToan? TrangThaiThanhToan { get; set; }

    public string? GhiChu { get; set; }
}
