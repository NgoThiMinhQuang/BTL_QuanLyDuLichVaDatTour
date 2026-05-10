using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Booking;

public class CreateSeatHoldRequestDto
{
    [Required]
    public long LichKhoiHanhId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int SoNguoiLon { get; set; }

    [Range(0, int.MaxValue)]
    public int SoTreEm { get; set; }

    [Range(0, int.MaxValue)]
    public int SoEmBe { get; set; }
}