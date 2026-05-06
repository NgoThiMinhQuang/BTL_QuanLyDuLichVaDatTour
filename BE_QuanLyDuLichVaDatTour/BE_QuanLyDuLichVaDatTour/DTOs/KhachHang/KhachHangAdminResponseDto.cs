namespace BE_QuanLyDuLichVaDatTour.DTOs.KhachHang;

public class KhachHangAdminResponseDto
{
    public long Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string HoTen { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public string? DiaChi { get; set; }
    public string? AnhDaiDien { get; set; }
    public string VaiTro { get; set; } = string.Empty;
    public string TrangThai { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public int TongSoDon { get; set; }
    public decimal TongChiTieu { get; set; }
    public int SoDanhGia { get; set; }
    public double? DanhGiaTrungBinh { get; set; }
}