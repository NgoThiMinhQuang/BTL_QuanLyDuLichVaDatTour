using Entity.Enums;

namespace Entity.Entities;

public class Tour
{
    public ulong Id { get; set; }

    public string MaTour { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public ulong LoaiTourId { get; set; }

    public ulong DiemXuatPhatId { get; set; }

    public byte SoNgay { get; set; }

    public byte SoDem { get; set; }

    public string? PhuongTien { get; set; }

    public decimal GiaTuThamKhao { get; set; }

    public string? MoTaNgan { get; set; }

    public string? MoTaChiTiet { get; set; }

    public string? DieuKienTour { get; set; }

    public bool IsNoiBat { get; set; }

    public TrangThaiTour TrangThai { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public LoaiTour? LoaiTour { get; set; }

    public DiaDiem? DiemXuatPhat { get; set; }
}
