using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Tour;

public class CreateTourRequestDto
{
    [Required]
    [MaxLength(50)]
    public string MaTour { get; set; } = string.Empty;

    [Required]
    [MaxLength(300)]
    public string TenTour { get; set; } = string.Empty;

    [Required]
    public long LoaiTourId { get; set; }

    [Required]
    public long DiemXuatPhatId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int SoNgay { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int SoDem { get; set; }

    [MaxLength(100)]
    public string? PhuongTien { get; set; }

    [Range(0, double.MaxValue)]
    public decimal GiaTuThamKhao { get; set; }

    [MaxLength(500)]
    public string? MoTaNgan { get; set; }

    public string? MoTaChiTiet { get; set; }

    public string? DieuKienTour { get; set; }

    public bool IsNoiBat { get; set; }

    public List<long>? DiemDenIds { get; set; }

    public List<string>? AnhTours { get; set; }

    public TrangThaiTour? TrangThai { get; set; }
}
