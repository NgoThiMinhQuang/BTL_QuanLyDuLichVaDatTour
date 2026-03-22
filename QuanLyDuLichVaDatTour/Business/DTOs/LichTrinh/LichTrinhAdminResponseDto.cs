namespace BLL.DTOs.LichTrinh;

public class LichTrinhAdminResponseDto
{
    public ulong Id { get; set; }

    public ulong TourId { get; set; }

    public string TenTour { get; set; } = string.Empty;

    public byte NgayThu { get; set; }

    public ushort ThuTuTrongNgay { get; set; }

    public TimeSpan? GioBatDau { get; set; }

    public TimeSpan? GioKetThuc { get; set; }

    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public ulong? DiaDiemId { get; set; }

    public string? TenDiaDiem { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
