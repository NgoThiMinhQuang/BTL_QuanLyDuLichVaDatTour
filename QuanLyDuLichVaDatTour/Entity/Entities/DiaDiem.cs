using Entity.Enums;

namespace Entity.Entities;

public class DiaDiem
{
    public ulong Id { get; set; }

    public string TenDiaDiem { get; set; } = string.Empty;

    public string? TinhThanh { get; set; }

    public string QuocGia { get; set; } = string.Empty;

    public string? MoTa { get; set; }

    public TrangThaiDiaDiem TrangThai { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
