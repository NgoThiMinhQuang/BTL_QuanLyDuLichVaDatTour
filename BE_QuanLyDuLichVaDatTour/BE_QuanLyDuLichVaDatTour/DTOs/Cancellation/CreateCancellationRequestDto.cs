using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Cancellation;

public class CreateCancellationRequestDto
{
    [Required]
    public long BookingId { get; set; }

    [Required]
    [MaxLength(1000)]
    public string LyDo { get; set; } = string.Empty;
}