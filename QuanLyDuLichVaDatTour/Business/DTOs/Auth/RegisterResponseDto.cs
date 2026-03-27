namespace BLL.DTOs.Auth;

public class RegisterResponseDto
{
    public long Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string HoTen { get; set; } = string.Empty;

    public string VaiTro { get; set; } = string.Empty;

    public string TrangThai { get; set; } = string.Empty;
}
