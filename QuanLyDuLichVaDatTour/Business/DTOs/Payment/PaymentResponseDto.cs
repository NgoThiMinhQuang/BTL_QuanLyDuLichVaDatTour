namespace BLL.DTOs.Payment;

public class PaymentResponseDto
{
    public ulong Id { get; set; }

    public ulong BookingId { get; set; }

    public string MaBooking { get; set; } = string.Empty;

    public string LoaiGiaoDich { get; set; } = string.Empty;

    public string KenhThanhToan { get; set; } = string.Empty;

    public string PhuongThucThanhToan { get; set; } = string.Empty;

    public string? NhaCungCap { get; set; }

    public decimal SoTien { get; set; }

    public string? MaGiaoDichNoiBo { get; set; }

    public string? MaGiaoDichBenThuBa { get; set; }

    public string? MaThamChieuBenThuBa { get; set; }

    public string? DuLieuPhanHoi { get; set; }

    public string? GhiChu { get; set; }

    public string TrangThai { get; set; } = string.Empty;

    public ulong? NguoiXacNhanId { get; set; }

    public string? HoTenNguoiXacNhan { get; set; }

    public DateTime ThoiGianTao { get; set; }

    public DateTime? ThoiGianXacNhan { get; set; }

    public DateTime UpdatedAt { get; set; }
}
