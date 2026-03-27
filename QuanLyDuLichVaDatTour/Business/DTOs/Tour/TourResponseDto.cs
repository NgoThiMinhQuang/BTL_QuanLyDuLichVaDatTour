namespace BLL.DTOs.Tour;

public class TourResponseDto
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

    public string? MoTaNgan { get; set; }

    public decimal GiaTuThamKhao { get; set; }

    public bool IsNoiBat { get; set; }

    public string TrangThai { get; set; } = string.Empty;
}
