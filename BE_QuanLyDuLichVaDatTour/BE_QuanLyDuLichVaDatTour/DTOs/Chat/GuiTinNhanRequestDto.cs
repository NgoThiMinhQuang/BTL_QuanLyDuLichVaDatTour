using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Chat;

public class GuiTinNhanRequestDto
{
    public long BookingId { get; set; }

    [MaxLength(1000)]
    public string NoiDung { get; set; } = string.Empty;
}
