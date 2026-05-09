using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.ThongBao;

public class BroadcastNotificationRequestDto
{
    [Required]
    [MaxLength(200)]
    public string TieuDe { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string NoiDung { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? DuongDan { get; set; }

    public string Loai { get; set; } = "he_thong";

    public long? UserId { get; set; }
}