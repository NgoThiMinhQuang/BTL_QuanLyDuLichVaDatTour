namespace BLL.DTOs.Tour;

public class TourAdminResponseDto
{
    public ulong Id { get; set; }

    public string MaTour { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public ulong LoaiTourId { get; set; }

    public string TenLoaiTour { get; set; } = string.Empty;

    public ulong DiaDiemKhoiHanhId { get; set; }

    public string TenDiaDiemKhoiHanh { get; set; } = string.Empty;

    public int SoNgay { get; set; }

    public int SoDem { get; set; }

    public string? PhuongTien { get; set; }

    public string? MoTaNgan { get; set; }

    public string? MoTaChiTiet { get; set; }

    public string? DieuKienTour { get; set; }

    public decimal? GiaNguoiLonMacDinh { get; set; }

    public decimal? GiaTreEmMacDinh { get; set; }

    public string TrangThai { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
