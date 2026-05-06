using System.ComponentModel.DataAnnotations;

namespace BE_QuanLyDuLichVaDatTour.DTOs.KhachHang;

public class UpdateKhachHangStatusRequestDto
{
    [Required]
    public string TrangThai { get; set; } = string.Empty;
}