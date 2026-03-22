using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.Tour;

public class UpdateTourRequestDto
{
    [Required]
    [MaxLength(50)]
    public string MaTour { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string TenTour { get; set; } = string.Empty;

    [Required]
    public ulong LoaiTourId { get; set; }

    [Required]
    public ulong DiaDiemKhoiHanhId { get; set; }

    [Required]
    public int SoNgay { get; set; }

    [Required]
    public int SoDem { get; set; }

    [MaxLength(100)]
    public string? PhuongTien { get; set; }

    [MaxLength(500)]
    public string? MoTaNgan { get; set; }

    public string? MoTaChiTiet { get; set; }

    public string? DieuKienTour { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? GiaNguoiLonMacDinh { get; set; }

    [Range(0, double.MaxValue)]
    public decimal? GiaTreEmMacDinh { get; set; }

    [Required]
    public TrangThaiTour TrangThai { get; set; }
}
