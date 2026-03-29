using System.ComponentModel.DataAnnotations;

namespace IdentityService.DTOs.Auth;

public class RegisterRequestDto
{
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string MatKhau { get; set; } = string.Empty;

    [Required]
    [MaxLength(200)]
    public string HoTen { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? SoDienThoai { get; set; }

    [MaxLength(300)]
    public string? DiaChi { get; set; }

    [MaxLength(500)]
    public string? AnhDaiDien { get; set; }
}
