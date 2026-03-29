using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Booking;

public class UpdateBookingStatusRequestDto
{
    [Required]
    public TrangThaiBooking TrangThaiBooking { get; set; }

    public TrangThaiThanhToan? TrangThaiThanhToan { get; set; }

    public string? GhiChu { get; set; }
}
