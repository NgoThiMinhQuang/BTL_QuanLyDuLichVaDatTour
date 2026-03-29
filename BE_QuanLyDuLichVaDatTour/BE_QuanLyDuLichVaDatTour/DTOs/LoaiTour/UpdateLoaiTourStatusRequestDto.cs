using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.LoaiTour;

public class UpdateLoaiTourStatusRequestDto
{
    [Required]
    public TrangThaiLoaiTour TrangThai { get; set; }
}
