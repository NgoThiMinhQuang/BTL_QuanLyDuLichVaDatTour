namespace BE_QuanLyDuLichVaDatTour.Models.Entities;

public class SeatHold
{
    public long Id { get; set; }
    public long LichKhoiHanhId { get; set; }
    public long KhachHangId { get; set; }
    public short SoCho { get; set; }
    public string HoldToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public string TrangThai { get; set; } = "active";
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public LichKhoiHanh? LichKhoiHanh { get; set; }
    public NguoiDung? KhachHang { get; set; }
}