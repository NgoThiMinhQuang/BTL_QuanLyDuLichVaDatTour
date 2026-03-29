using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.LichKhoiHanh;

public class UpdateLichKhoiHanhStatusRequestDto
{
    [Required]
    public TrangThaiLichKhoiHanh TrangThai { get; set; }
}
