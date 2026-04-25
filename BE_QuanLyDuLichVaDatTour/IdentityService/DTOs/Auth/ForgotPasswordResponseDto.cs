namespace IdentityService.DTOs.Auth;

public class ForgotPasswordResponseDto
{
    public string Message { get; set; } = string.Empty;

    public string? ResetToken { get; set; }

    public string? ResetLink { get; set; }

    public DateTime? ExpiresAt { get; set; }
}
