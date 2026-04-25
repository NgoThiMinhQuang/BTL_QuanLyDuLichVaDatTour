namespace IdentityService.Models.Entities;

public class PasswordResetToken
{
    public long Id { get; set; }

    public long NguoiDungId { get; set; }

    public string TokenHash { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public DateTime? UsedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public NguoiDung NguoiDung { get; set; } = null!;
}
