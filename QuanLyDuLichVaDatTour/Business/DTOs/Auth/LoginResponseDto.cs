namespace BLL.DTOs.Auth;

public class LoginResponseDto
{
    public string AccessToken { get; set; } = string.Empty;

    public string TokenType { get; set; } = "Bearer";

    public int ExpiresIn { get; set; }

    public long Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string HoTen { get; set; } = string.Empty;

    public string VaiTro { get; set; } = string.Empty;

    public string TrangThai { get; set; } = string.Empty;
}
