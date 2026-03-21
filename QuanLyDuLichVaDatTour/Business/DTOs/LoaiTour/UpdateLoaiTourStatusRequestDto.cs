using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.LoaiTour;

public class UpdateLoaiTourStatusRequestDto
{
    [Required]
    public TrangThaiLoaiTour TrangThai { get; set; }
}
