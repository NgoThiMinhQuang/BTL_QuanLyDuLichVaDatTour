namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class NhatKyHeThong
{
    public long Id { get; set; }

    public long? NguoiDungId { get; set; }

    public string? HoTenNguoiDung { get; set; }

    public string HanhDong { get; set; } = string.Empty;

    public string Bang { get; set; } = string.Empty;

    public long? BanGhiId { get; set; }

    public string? ChiTiet { get; set; }

    public string? DiaChiIp { get; set; }

    public string? UserAgent { get; set; }

    public DateTime ThoiGian { get; set; }
}