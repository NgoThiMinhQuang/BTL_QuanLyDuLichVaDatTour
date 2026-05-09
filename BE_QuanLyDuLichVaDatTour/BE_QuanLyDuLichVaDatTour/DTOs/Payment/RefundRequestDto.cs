using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Payment;

public class RefundRequestDto
{
    [Required]
    [Range(0.01, double.MaxValue, ErrorMessage = "Số tiền hoàn phải lớn hơn 0.")]
    public decimal SoTien { get; set; }

    [Required]
    [MaxLength(1000)]
    public string LyDo { get; set; } = string.Empty;

    public bool HoanToanBo { get; set; }
}