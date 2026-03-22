using Entity.Enums;

namespace Entity.Entities;

public class LichKhoiHanh
{
    public ulong Id { get; set; }

    public ulong TourId { get; set; }

    public string MaDotTour { get; set; } = string.Empty;

    public DateTime NgayKhoiHanh { get; set; }

    public DateTime NgayKetThuc { get; set; }

    public string? NoiTapTrung { get; set; }

    public ushort SoChoToiDa { get; set; }

    public string? GhiChu { get; set; }

    public string? LyDoHuy { get; set; }

    public TrangThaiLichKhoiHanh TrangThai { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Tour? Tour { get; set; }
}
