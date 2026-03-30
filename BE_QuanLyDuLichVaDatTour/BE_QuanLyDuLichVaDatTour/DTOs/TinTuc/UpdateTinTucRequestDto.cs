using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.TinTuc;

public class UpdateTinTucRequestDto
{
    [Required]
    [MaxLength(300)]
    public string TieuDe { get; set; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? TomTat { get; set; }

    [Required]
    public string NoiDung { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? AnhDaiDien { get; set; }

    [MaxLength(100)]
    public string? DanhMuc { get; set; }

    [Required]
    public DateTime NgayDang { get; set; }

    [Required]
    public TrangThaiTinTuc TrangThai { get; set; }
}
