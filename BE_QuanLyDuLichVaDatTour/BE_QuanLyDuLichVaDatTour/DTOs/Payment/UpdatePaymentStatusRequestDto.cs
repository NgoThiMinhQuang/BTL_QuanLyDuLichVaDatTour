using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Payment;

public class UpdatePaymentStatusRequestDto
{
    [Required]
    public TrangThaiGiaoDichThanhToan TrangThai { get; set; }

    [MaxLength(500)]
    public string? GhiChu { get; set; }
}
