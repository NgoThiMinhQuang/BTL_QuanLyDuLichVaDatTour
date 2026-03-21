using Entity.Enums;

namespace Entity.Entities;

public class LoaiTour
{
    public ulong Id { get; set; }

    public string Ten { get; set; } = string.Empty;

    public string? MoTa { get; set; }

    public TrangThaiLoaiTour TrangThai { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
