using BE_QuanLyDuLichVaDatTour.Models.Enums;

namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class Booking
{
    public long Id { get; set; }

    public string MaBooking { get; set; } = string.Empty;

    public long LichKhoiHanhId { get; set; }

    public long KhachHangId { get; set; }

    public long? VoucherId { get; set; }

    public string HoTenLienHe { get; set; } = string.Empty;

    public string EmailLienHe { get; set; } = string.Empty;

    public string SoDienThoaiLienHe { get; set; } = string.Empty;

    public string? DiaChiLienHe { get; set; }

    public DateTime NgayDat { get; set; }

    public int SoNguoiLon { get; set; }

    public int SoTreEm { get; set; }

    public int SoEmBe { get; set; }

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

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public LichKhoiHanh? LichKhoiHanh { get; set; }

    public NguoiDung? KhachHang { get; set; }

    public Voucher? Voucher { get; set; }

    public ICollection<HanhKhach> HanhKhachs { get; set; } = new List<HanhKhach>();

    public ICollection<ThanhToan> ThanhToans { get; set; } = new List<ThanhToan>();
}
