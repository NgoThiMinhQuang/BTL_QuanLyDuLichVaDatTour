namespace BE_QuanLyDuLichVaDatTour.DTOs.ThongBao;

public class ThongBaoResponseDto
{
    public long Id { get; set; }
    public string Loai { get; set; } = string.Empty;
    public string TieuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public string? DuongDan { get; set; }
    public bool DaDoc { get; set; }
    public DateTime ThoiGian { get; set; }
}