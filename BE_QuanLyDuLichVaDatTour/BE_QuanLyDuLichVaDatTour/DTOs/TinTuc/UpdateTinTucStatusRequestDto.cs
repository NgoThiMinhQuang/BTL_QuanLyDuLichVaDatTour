using BE_QuanLyDuLichVaDatTour.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.TinTuc;

public class UpdateTinTucStatusRequestDto
{
    [Required]
    public TrangThaiTinTuc TrangThai { get; set; }
}
