using System.ComponentModel.DataAnnotations;

namespace IdentityService.DTOs.Auth;

public class UpdateCurrentUserRequestDto
{
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
