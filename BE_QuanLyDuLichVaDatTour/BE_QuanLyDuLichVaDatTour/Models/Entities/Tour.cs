using BE_QuanLyDuLichVaDatTour.Models.Enums;

namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class Tour
{
    public long Id { get; set; }

    public string MaTour { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public long LoaiTourId { get; set; }

    public long DiemXuatPhatId { get; set; }

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

    public ICollection<TourDiemDen> TourDiemDens { get; set; } = new List<TourDiemDen>();

    public ICollection<AnhTour> AnhTours { get; set; } = new List<AnhTour>();

    public ICollection<LichTrinh> LichTrinhs { get; set; } = new List<LichTrinh>();

    public ICollection<LichKhoiHanh> LichKhoiHanhs { get; set; } = new List<LichKhoiHanh>();
}
