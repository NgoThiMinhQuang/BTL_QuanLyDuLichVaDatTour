using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.Payment;

public class CreatePaymentRequestDto
{
    [Required]
    public ulong BookingId { get; set; }

    [Required]
    public LoaiGiaoDichThanhToan LoaiGiaoDich { get; set; }

    [Required]
    public PhuongThucThanhToan PhuongThucThanhToan { get; set; }

    [Required]
    [Range(0.01, double.MaxValue)]
    public decimal SoTien { get; set; }

    [MaxLength(100)]
    public string? NhaCungCap { get; set; }

    [MaxLength(150)]
    public string? MaGiaoDichBenThuBa { get; set; }

    [MaxLength(150)]
    public string? MaThamChieuBenThuBa { get; set; }

    public string? DuLieuPhanHoi { get; set; }

    [MaxLength(500)]
    public string? GhiChu { get; set; }
}
