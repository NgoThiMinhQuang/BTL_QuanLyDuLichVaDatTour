using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.YeuThich;

public class AddYeuThichRequestDto
{
    [Required]
    public long TourId { get; set; }
}