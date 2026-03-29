using BE_QuanLyDuLichVaDatTour.Models.Enums;

namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class LoaiTour
{
    public long Id { get; set; }

    public string Ten { get; set; } = string.Empty;

    public string? MoTa { get; set; }

    public TrangThaiLoaiTour TrangThai { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
