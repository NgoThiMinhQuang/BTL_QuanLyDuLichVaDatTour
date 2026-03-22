using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.LichKhoiHanh;

public class UpdateLichKhoiHanhRequestDto
{
    [Required]
    public ulong TourId { get; set; }

    [Required]
    [MaxLength(50)]
    public string MaDotTour { get; set; } = string.Empty;

    [Required]
    public DateTime NgayKhoiHanh { get; set; }

    [Required]
    public DateTime NgayKetThuc { get; set; }

    [MaxLength(300)]
    public string? NoiTapTrung { get; set; }

    [Required]
    [Range(1, ushort.MaxValue)]
    public ushort SoChoToiDa { get; set; }

    [MaxLength(500)]
    public string? GhiChu { get; set; }

    [MaxLength(500)]
    public string? LyDoHuy { get; set; }

    [Required]
    public TrangThaiLichKhoiHanh TrangThai { get; set; }
}
