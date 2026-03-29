using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Voucher;

public class UpdateVoucherRequestDto
{
    [Required]
    [MaxLength(50)]
    public string MaVoucher { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string TenVoucher { get; set; } = string.Empty;

    public long? TourId { get; set; }

    [Required]
    public KieuGiamVoucher KieuGiam { get; set; }

    [Range(typeof(decimal), "0.01", "9999999999999")]
    public decimal GiaTriGiam { get; set; }

    public decimal? GiamToiDa { get; set; }

    [Range(typeof(decimal), "0", "9999999999999")]
    public decimal DonHangToiThieu { get; set; }

    [Required]
    public DateTime NgayBatDau { get; set; }

    [Required]
    public DateTime NgayKetThuc { get; set; }

    [Range(0, int.MaxValue)]
    public int SoLuongToiDa { get; set; }

    [Range(0, int.MaxValue)]
    public int SoLuongDaDung { get; set; }

    [MaxLength(500)]
    public string? MoTa { get; set; }

    [Required]
    public TrangThaiVoucher TrangThai { get; set; }
}
