namespace BE_QuanLyDuLichVaDatTour.DTOs.Chat;

public class TinNhanDto
{
    public long Id { get; set; }
    public long? BookingId { get; set; }
    public long NguoiGuiId { get; set; }
    public string HoTenNguoiGui { get; set; } = string.Empty;
    public string VaiTro { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public bool DaDoc { get; set; }
    public DateTime ThoiGianGui { get; set; }
}
