namespace BE_QuanLyDuLichVaDatTour.DTOs.YeuThich;

public class YeuThichResponseDto
{
    public long Id { get; set; }
    public long TourId { get; set; }
    public string MaTour { get; set; } = string.Empty;
    public string TenTour { get; set; } = string.Empty;
    public string TenLoaiTour { get; set; } = string.Empty;
    public int SoNgay { get; set; }
    public int SoDem { get; set; }
    public string? AnhDaiDien { get; set; }
    public decimal GiaTuThamKhao { get; set; }
    public string TrangThai { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}