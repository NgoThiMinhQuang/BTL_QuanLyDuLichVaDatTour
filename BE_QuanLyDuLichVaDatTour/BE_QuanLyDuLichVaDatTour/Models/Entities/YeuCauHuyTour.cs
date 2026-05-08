namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class YeuCauHuyTour
{
    public long Id { get; set; }
    public long BookingId { get; set; }
    public long UserId { get; set; }
    public string LyDo { get; set; } = string.Empty;
    public string TrangThai { get; set; } = "cho_duyet";
    public string? GhiChuAdmin { get; set; }
    public long? NguoiXuLyId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public Booking? Booking { get; set; }
    public NguoiDung? User { get; set; }
    public NguoiDung? NguoiXuLy { get; set; }
}