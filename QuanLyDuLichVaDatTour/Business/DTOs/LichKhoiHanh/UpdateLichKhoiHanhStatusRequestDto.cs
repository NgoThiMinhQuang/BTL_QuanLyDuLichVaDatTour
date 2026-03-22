using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.LichKhoiHanh;

public class UpdateLichKhoiHanhStatusRequestDto
{
    [Required]
    public TrangThaiLichKhoiHanh TrangThai { get; set; }
}
