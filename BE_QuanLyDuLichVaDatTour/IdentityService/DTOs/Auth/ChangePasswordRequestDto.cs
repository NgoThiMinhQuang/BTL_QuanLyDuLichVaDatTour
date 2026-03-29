using System.ComponentModel.DataAnnotations;

namespace IdentityService.DTOs.Auth;

public class ChangePasswordRequestDto
{
    [Required]
    [MaxLength(100)]
    public string MatKhauHienTai { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string MatKhauMoi { get; set; } = string.Empty;
}
