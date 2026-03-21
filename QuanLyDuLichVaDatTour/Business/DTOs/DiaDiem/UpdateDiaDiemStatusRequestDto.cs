using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.DiaDiem;

public class UpdateDiaDiemStatusRequestDto
{
    [Required]
    public TrangThaiDiaDiem TrangThai { get; set; }
}
