using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.DiaDiem;

public class CreateDiaDiemRequestDto
{
    [Required]
    [MaxLength(200)]
    public string TenDiaDiem { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? TinhThanh { get; set; }

    [MaxLength(100)]
    public string? QuocGia { get; set; }

    public string? MoTa { get; set; }

    public TrangThaiDiaDiem? TrangThai { get; set; }
}
