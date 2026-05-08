using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Cancellation;

public class UpdateCancellationRequestDto
{
    [Required]
    [MaxLength(50)]
    public string TrangThai { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? GhiChuAdmin { get; set; }
}