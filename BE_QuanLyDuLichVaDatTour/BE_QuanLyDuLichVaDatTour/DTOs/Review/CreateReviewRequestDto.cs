using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Review;

public class CreateReviewRequestDto
{
    [Required]
    public long BookingId { get; set; }

    [Required]
    [Range(1, 5)]
    public int SoSao { get; set; }

    [Required]
    [MaxLength(2000)]
    public string NoiDung { get; set; } = string.Empty;

    public List<string>? HinhAnh { get; set; }
}
