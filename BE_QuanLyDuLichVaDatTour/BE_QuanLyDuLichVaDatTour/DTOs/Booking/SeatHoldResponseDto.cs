namespace BE_QuanLyDuLichVaDatTour.DTOs.Booking;

public class SeatHoldResponseDto
{
    public string HoldToken { get; set; } = string.Empty;
    public long LichKhoiHanhId { get; set; }
    public int SoCho { get; set; }
    public string TrangThai { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public int RemainingSeconds { get; set; }
}