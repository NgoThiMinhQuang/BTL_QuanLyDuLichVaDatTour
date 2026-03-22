namespace BLL.DTOs.LichKhoiHanh;

public class LichKhoiHanhResponseDto
{
    public ulong Id { get; set; }

    public ulong TourId { get; set; }

    public string MaTour { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public string MaDotTour { get; set; } = string.Empty;

    public DateTime NgayKhoiHanh { get; set; }

    public DateTime NgayKetThuc { get; set; }

    public string? NoiTapTrung { get; set; }

    public ushort SoChoToiDa { get; set; }

    public string TrangThai { get; set; } = string.Empty;
}
