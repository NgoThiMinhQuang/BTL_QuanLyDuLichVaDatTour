using System.ComponentModel.DataAnnotations;

namespace BLL.DTOs.Auth;

public class LoginRequestDto
{
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string MatKhau { get; set; } = string.Empty;
}
