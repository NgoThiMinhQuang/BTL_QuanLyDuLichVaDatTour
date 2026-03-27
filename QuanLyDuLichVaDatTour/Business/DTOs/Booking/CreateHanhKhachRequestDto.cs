using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.Booking;

public class CreateHanhKhachRequestDto
{
    [Required]
    [MaxLength(200)]
    public string HoTen { get; set; } = string.Empty;

    [Required]
    public LoaiKhach LoaiKhach { get; set; }

    public DateTime? NgaySinh { get; set; }

    [MaxLength(10)]
    public string? GioiTinh { get; set; }

    [MaxLength(50)]
    public string? SoGiayTo { get; set; }

    [MaxLength(100)]
    public string? QuocTich { get; set; }

    [MaxLength(300)]
    public string? GhiChu { get; set; }
}
