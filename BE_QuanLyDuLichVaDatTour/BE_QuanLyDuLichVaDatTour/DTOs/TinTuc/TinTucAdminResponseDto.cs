namespace BE_QuanLyDuLichVaDatTour.DTOs.TinTuc;

public class TinTucAdminResponseDto
{
    public long Id { get; set; }

    public string TieuDe { get; set; } = string.Empty;

    public string Slug { get; set; } = string.Empty;

    public string? TomTat { get; set; }

    public string NoiDung { get; set; } = string.Empty;

    public string? AnhDaiDien { get; set; }

    public string? DanhMuc { get; set; }

    public DateTime NgayDang { get; set; }

    public string TrangThai { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
