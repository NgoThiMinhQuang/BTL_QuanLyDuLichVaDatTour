using System.ComponentModel.DataAnnotations;

namespace IdentityService.DTOs.Auth;

public class ResetPasswordRequestDto
{
    [Required]
    [MaxLength(512)]
    public string Token { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    [MaxLength(100)]
    public string MatKhauMoi { get; set; } = string.Empty;
}
