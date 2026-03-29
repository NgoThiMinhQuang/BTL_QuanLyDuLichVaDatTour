namespace IdentityService.DTOs.Auth;

public class CurrentUserResponseDto
{
    public long Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string HoTen { get; set; } = string.Empty;

    public string? SoDienThoai { get; set; }

    public string? DiaChi { get; set; }

    public string? AnhDaiDien { get; set; }

    public string VaiTro { get; set; } = string.Empty;

    public string TrangThai { get; set; } = string.Empty;
}
