using BE_QuanLyDuLichVaDatTour.Models.Enums;

namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class NguoiDung
{
    public long Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string MatKhau { get; set; } = string.Empty;

    public string HoTen { get; set; } = string.Empty;

    public string? SoDienThoai { get; set; }

    public string? DiaChi { get; set; }

    public string? AnhDaiDien { get; set; }

    public VaiTroNguoiDung VaiTro { get; set; }

    public TrangThaiNguoiDung TrangThai { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
