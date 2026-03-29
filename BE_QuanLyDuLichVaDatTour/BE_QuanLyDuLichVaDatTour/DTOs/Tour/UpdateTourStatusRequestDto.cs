using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.Tour;

public class UpdateTourStatusRequestDto
{
    [Required]
    public TrangThaiTour TrangThai { get; set; }
}
