namespace BLL.DTOs.Tour;

public class TourAdminResponseDto
{
    public ulong Id { get; set; }

    public string MaTour { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public ulong LoaiTourId { get; set; }

    public string TenLoaiTour { get; set; } = string.Empty;

    public ulong DiemXuatPhatId { get; set; }

    public string TenDiemXuatPhat { get; set; } = string.Empty;

    public byte SoNgay { get; set; }

    public byte SoDem { get; set; }

    public string? PhuongTien { get; set; }

    public decimal GiaTuThamKhao { get; set; }

    public string? MoTaNgan { get; set; }

    public string? MoTaChiTiet { get; set; }

    public string? DieuKienTour { get; set; }

    public bool IsNoiBat { get; set; }

    public string TrangThai { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
