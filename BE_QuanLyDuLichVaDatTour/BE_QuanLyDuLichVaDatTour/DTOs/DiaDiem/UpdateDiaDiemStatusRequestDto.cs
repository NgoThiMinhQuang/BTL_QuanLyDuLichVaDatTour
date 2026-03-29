using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.DiaDiem;

public class UpdateDiaDiemStatusRequestDto
{
    [Required]
    public TrangThaiDiaDiem TrangThai { get; set; }
}
