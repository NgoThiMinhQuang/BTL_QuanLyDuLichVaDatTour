using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Payment;

public class PricePreviewRequestDto
{
    [Required]
    public long LichKhoiHanhId { get; set; }

    [Required]
    [Range(1, 100)]
    public int SoNguoiLon { get; set; }

    [Range(0, 100)]
    public int SoTreEm { get; set; }

    [Range(0, 100)]
    public int SoEmBe { get; set; }

    public long? VoucherId { get; set; }

    public string? MaVoucher { get; set; }
}