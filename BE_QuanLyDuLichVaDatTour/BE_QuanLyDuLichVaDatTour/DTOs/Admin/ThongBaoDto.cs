namespace BE_QuanLyDuLichVaDatTour.DTOs.Admin;

public class ThongBaoDto
{
    public long Id { get; set; }
    public string Loai { get; set; } = string.Empty;
    public string TieuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public string? DuongDan { get; set; }
    public bool DaDoc { get; set; }
    public DateTime ThoiGian { get; set; }
}

public class ThongBaoListDto
{
    public List<ThongBaoDto> Items { get; set; } = new();
    public int TongSoChuaDoc { get; set; }
}