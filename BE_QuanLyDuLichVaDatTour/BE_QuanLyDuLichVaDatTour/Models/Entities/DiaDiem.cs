using BE_QuanLyDuLichVaDatTour.Models.Enums;

namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class DiaDiem
{
    public long Id { get; set; }

    public string TenDiaDiem { get; set; } = string.Empty;

    public string? TinhThanh { get; set; }

    public string QuocGia { get; set; } = string.Empty;

    public string? MoTa { get; set; }

    public TrangThaiDiaDiem TrangThai { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
