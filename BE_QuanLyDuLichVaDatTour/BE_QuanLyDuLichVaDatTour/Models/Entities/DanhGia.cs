namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class DanhGia
{
    public long Id { get; set; }

    public long BookingId { get; set; }

    public long TourId { get; set; }

    public long KhachHangId { get; set; }

    public int SoSao { get; set; }

    public string NoiDung { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }

    public Booking? Booking { get; set; }

    public Tour? Tour { get; set; }

    public NguoiDung? KhachHang { get; set; }
}
