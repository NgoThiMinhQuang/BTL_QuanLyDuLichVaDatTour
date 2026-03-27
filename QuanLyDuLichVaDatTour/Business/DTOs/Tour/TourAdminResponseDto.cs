namespace BLL.DTOs.Tour;

public class TourAdminResponseDto
{
    public long Id { get; set; }

    public string MaTour { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public long LoaiTourId { get; set; }

    public string TenLoaiTour { get; set; } = string.Empty;

    public long DiemXuatPhatId { get; set; }

    public string TenDiemXuatPhat { get; set; } = string.Empty;

    public int SoNgay { get; set; }

    public int SoDem { get; set; }

    public string? PhuongTien { get; set; }

    public decimal GiaTuThamKhao { get; set; }

    public string? MoTaNgan { get; set; }

    public string? MoTaChiTiet { get; set; }

    public string? DieuKienTour { get; set; }

    public bool IsNoiBat { get; set; }

    public List<TourDiemDenResponseDto> DiemDens { get; set; } = new();

    public List<AnhTourResponseDto> AnhTours { get; set; } = new();

    public string TrangThai { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
