namespace BE_QuanLyDuLichVaDatTour.DTOs.LichKhoiHanh;

public class LichKhoiHanhAdminResponseDto
{
    public long Id { get; set; }

    public long TourId { get; set; }

    public string MaTour { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public string MaDotTour { get; set; } = string.Empty;

    public DateTime NgayKhoiHanh { get; set; }

    public DateTime NgayKetThuc { get; set; }

    public string? NoiTapTrung { get; set; }

    public int SoChoToiDa { get; set; }

    public string? GhiChu { get; set; }

    public string? LyDoHuy { get; set; }

    public string TrangThai { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
