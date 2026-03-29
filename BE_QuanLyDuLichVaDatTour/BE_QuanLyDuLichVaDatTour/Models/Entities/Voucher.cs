using BE_QuanLyDuLichVaDatTour.Models.Enums;

namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class Voucher
{
    public long Id { get; set; }

    public string MaVoucher { get; set; } = string.Empty;

    public string TenVoucher { get; set; } = string.Empty;

    public long? TourId { get; set; }

    public KieuGiamVoucher KieuGiam { get; set; }

    public decimal GiaTriGiam { get; set; }

    public decimal? GiamToiDa { get; set; }

    public decimal DonHangToiThieu { get; set; }

    public DateTime NgayBatDau { get; set; }

    public DateTime NgayKetThuc { get; set; }

    public int SoLuongToiDa { get; set; }

    public int SoLuongDaDung { get; set; }

    public string? MoTa { get; set; }

    public TrangThaiVoucher TrangThai { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Tour? Tour { get; set; }

    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
