using Entity.Enums;

namespace Entity.Entities;

public class ThanhToan
{
    public ulong Id { get; set; }

    public ulong BookingId { get; set; }

    public LoaiGiaoDichThanhToan LoaiGiaoDich { get; set; }

    public KenhThanhToan KenhThanhToan { get; set; }

    public PhuongThucThanhToan PhuongThucThanhToan { get; set; }

    public string? NhaCungCap { get; set; }

    public decimal SoTien { get; set; }

    public string? MaGiaoDichNoiBo { get; set; }

    public string? MaGiaoDichBenThuBa { get; set; }

    public string? MaThamChieuBenThuBa { get; set; }

    public string? DuLieuPhanHoi { get; set; }

    public string? GhiChu { get; set; }

    public TrangThaiGiaoDichThanhToan TrangThai { get; set; }

    public ulong? NguoiXacNhanId { get; set; }

    public DateTime ThoiGianTao { get; set; }

    public DateTime? ThoiGianXacNhan { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Booking? Booking { get; set; }

    public NguoiDung? NguoiXacNhan { get; set; }
}
