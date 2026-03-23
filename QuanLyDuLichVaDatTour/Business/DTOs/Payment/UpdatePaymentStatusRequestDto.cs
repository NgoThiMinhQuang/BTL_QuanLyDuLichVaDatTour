using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.Payment;

public class UpdatePaymentStatusRequestDto
{
    [Required]
    public TrangThaiGiaoDichThanhToan TrangThai { get; set; }

    [MaxLength(500)]
    public string? GhiChu { get; set; }
}
