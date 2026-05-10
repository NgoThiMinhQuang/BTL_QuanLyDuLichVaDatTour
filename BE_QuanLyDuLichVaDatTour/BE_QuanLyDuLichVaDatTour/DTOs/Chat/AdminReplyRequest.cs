using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Chat;

public class AdminReplyRequest
{
    [Required]
    public long KhachHangId { get; set; }

    [MaxLength(1000)]
    public string NoiDung { get; set; } = string.Empty;
}
