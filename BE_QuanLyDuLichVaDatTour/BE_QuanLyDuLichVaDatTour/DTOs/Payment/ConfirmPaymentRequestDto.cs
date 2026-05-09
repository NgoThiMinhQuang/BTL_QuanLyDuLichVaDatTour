using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Payment;

public class ConfirmPaymentRequestDto
{
    [MaxLength(500)]
    public string? GhiChu { get; set; }
}