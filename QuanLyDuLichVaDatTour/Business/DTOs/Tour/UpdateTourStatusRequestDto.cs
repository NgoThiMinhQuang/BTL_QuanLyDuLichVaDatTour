using Entity.Enums;
using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.Tour;

public class UpdateTourStatusRequestDto
{
    [Required]
    public TrangThaiTour TrangThai { get; set; }
}
