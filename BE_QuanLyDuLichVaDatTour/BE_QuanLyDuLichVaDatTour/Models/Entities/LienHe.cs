using BE_QuanLyDuLichVaDatTour.Models.Enums;

namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class LienHe
{
    public long Id { get; set; }

    public string HoTen { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? SoDienThoai { get; set; }

    public string ChuDe { get; set; } = string.Empty;

    public string NoiDung { get; set; } = string.Empty;

    public TrangThaiLienHe TrangThai { get; set; }

    public long? NguoiXuLyId { get; set; }

    public string? PhanHoi { get; set; }

    public DateTime NgayGui { get; set; }

    public DateTime? NgayXuLy { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public NguoiDung? NguoiXuLy { get; set; }
}