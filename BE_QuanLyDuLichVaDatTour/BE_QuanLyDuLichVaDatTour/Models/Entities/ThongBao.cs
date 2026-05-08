namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class ThongBao
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string Loai { get; set; } = string.Empty;
    public string TieuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public string? DuongDan { get; set; }
    public bool DaDoc { get; set; }
    public DateTime ThoiGian { get; set; }
    public NguoiDung? User { get; set; }
}