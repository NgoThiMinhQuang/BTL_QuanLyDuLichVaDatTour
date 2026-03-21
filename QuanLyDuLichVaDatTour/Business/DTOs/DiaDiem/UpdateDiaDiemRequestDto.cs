using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.DiaDiem;

public class UpdateDiaDiemRequestDto
{
    [Required]
    [MaxLength(200)]
    public string TenDiaDiem { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? TinhThanh { get; set; }

    [Required]
    [MaxLength(100)]
    public string QuocGia { get; set; } = string.Empty;

    public string? MoTa { get; set; }

    [Required]
    public TrangThaiDiaDiem TrangThai { get; set; }
}
