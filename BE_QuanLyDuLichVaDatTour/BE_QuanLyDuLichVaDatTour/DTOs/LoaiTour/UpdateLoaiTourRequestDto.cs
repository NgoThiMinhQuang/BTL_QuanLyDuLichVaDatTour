using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.LoaiTour;

public class UpdateLoaiTourRequestDto
{
    [Required]
    [MaxLength(100)]
    public string Ten { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? MoTa { get; set; }

    [Required]
    public TrangThaiLoaiTour TrangThai { get; set; }
}
