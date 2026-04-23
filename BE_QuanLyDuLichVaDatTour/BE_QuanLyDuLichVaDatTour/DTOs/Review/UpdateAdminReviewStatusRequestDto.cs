using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Review;

public class UpdateAdminReviewStatusRequestDto
{
    [Required]
    public string TrangThai { get; set; } = string.Empty;

    public string? PhanHoiAdmin { get; set; }
}
