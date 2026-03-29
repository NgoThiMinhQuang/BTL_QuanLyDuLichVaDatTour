using BE_QuanLyDuLichVaDatTour.Models.Enums;

namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class LichKhoiHanh
{
    public long Id { get; set; }

    public long TourId { get; set; }

    public string MaDotTour { get; set; } = string.Empty;

    public DateTime NgayKhoiHanh { get; set; }

    public DateTime NgayKetThuc { get; set; }

    public string? NoiTapTrung { get; set; }

    public short SoChoToiDa { get; set; }

    public string? GhiChu { get; set; }

    public string? LyDoHuy { get; set; }

    public TrangThaiLichKhoiHanh TrangThai { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Tour? Tour { get; set; }

    public ICollection<BangGiaLichKhoiHanh> BangGiaLichKhoiHanhs { get; set; } = new List<BangGiaLichKhoiHanh>();
}
