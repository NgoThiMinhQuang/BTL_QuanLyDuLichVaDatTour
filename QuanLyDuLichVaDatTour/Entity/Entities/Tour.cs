using Entity.Enums;

namespace Entity.Entities;

public class Tour
{
    public ulong Id { get; set; }

    public string MaTour { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public ulong LoaiTourId { get; set; }

    public ulong DiaDiemKhoiHanhId { get; set; }

    public int SoNgay { get; set; }

    public int SoDem { get; set; }

    public string? PhuongTien { get; set; }

    public string? MoTaNgan { get; set; }

    public string? MoTaChiTiet { get; set; }

    public string? DieuKienTour { get; set; }

    public decimal? GiaNguoiLonMacDinh { get; set; }

    public decimal? GiaTreEmMacDinh { get; set; }

    public TrangThaiTour TrangThai { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public LoaiTour? LoaiTour { get; set; }

    public DiaDiem? DiaDiemKhoiHanh { get; set; }
}
