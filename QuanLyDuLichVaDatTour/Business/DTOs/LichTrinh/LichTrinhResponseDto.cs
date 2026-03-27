namespace BLL.DTOs.LichTrinh;

public class LichTrinhResponseDto
{
    public long Id { get; set; }

    public long TourId { get; set; }

    public int NgayThu { get; set; }

    public int ThuTuTrongNgay { get; set; }

    public TimeSpan? GioBatDau { get; set; }

    public TimeSpan? GioKetThuc { get; set; }

    public string? TieuDe { get; set; }

    public string? NoiDung { get; set; }

    public long? DiaDiemId { get; set; }

    public string? TenDiaDiem { get; set; }
}
