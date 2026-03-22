using Entity.Enums;

namespace Entity.Entities;

public class Booking
{
    public ulong Id { get; set; }

    public string MaBooking { get; set; } = string.Empty;

    public ulong LichKhoiHanhId { get; set; }

    public ulong NguoiDungId { get; set; }

    public ulong? VoucherId { get; set; }

    public string HoTenLienHe { get; set; } = string.Empty;

    public string EmailLienHe { get; set; } = string.Empty;

    public string SoDienThoaiLienHe { get; set; } = string.Empty;

    public string? DiaChiLienHe { get; set; }

    public DateTime NgayDat { get; set; }

    public ushort SoNguoiLon { get; set; }

    public ushort SoTreEm { get; set; }

    public ushort SoEmBe { get; set; }

    public LoaiGiaApDung LoaiGiaApDung { get; set; }

    public decimal DonGiaNguoiLon { get; set; }

    public decimal DonGiaTreEm { get; set; }

    public decimal DonGiaEmBe { get; set; }

    public decimal TamTinh { get; set; }

    public decimal GiamGia { get; set; }

    public decimal TongTien { get; set; }

    public decimal SoTienDaThanhToan { get; set; }

    public decimal TienCocYeuCau { get; set; }

    public PhuongThucThanhToan? PhuongThucThanhToanDuKien { get; set; }

    public TrangThaiBooking TrangThaiBooking { get; set; }

    public TrangThaiThanhToan TrangThaiThanhToan { get; set; }

    public DateTime? HanThanhToan { get; set; }

    public string? GhiChu { get; set; }

    public ulong? NguoiXacNhanId { get; set; }

    public DateTime? ThoiGianXacNhan { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public LichKhoiHanh? LichKhoiHanh { get; set; }

    public NguoiDung? NguoiDung { get; set; }

    public NguoiDung? NguoiXacNhan { get; set; }
}
