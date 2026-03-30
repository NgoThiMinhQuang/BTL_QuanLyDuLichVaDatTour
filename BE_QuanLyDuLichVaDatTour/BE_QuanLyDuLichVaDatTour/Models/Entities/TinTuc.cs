using BE_QuanLyDuLichVaDatTour.Models.Enums;

namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class TinTuc
{
    public long Id { get; set; }

    public string TieuDe { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string? TomTat { get; set; }

    public string NoiDung { get; set; } = string.Empty;

    public string? AnhDaiDien { get; set; }

    public string? DanhMuc { get; set; }

    public DateTime NgayDang { get; set; }

    public TrangThaiTinTuc TrangThai { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
