namespace BE_QuanLyDuLichVaDatTour.DTOs.LichTrinh;

public class LichTrinhAdminResponseDto
{
    public long Id { get; set; }

    public long TourId { get; set; }

    public string TenTour { get; set; } = string.Empty;

    public int NgayThu { get; set; }

    public int ThuTuTrongNgay { get; set; }

    public TimeSpan? GioBatDau { get; set; }

    public TimeSpan? GioKetThuc { get; set; }

    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public long? DiaDiemId { get; set; }

    public string? TenDiaDiem { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
