namespace BE_QuanLyDuLichVaDatTour.DTOs.Admin;

public class AdminSupportTicketDto
{
    public long Id { get; set; }
    public string Source { get; set; } = string.Empty;
    public long KhachHangId { get; set; }
    public string HoTen { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? SoDienThoai { get; set; }
    public string ChuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public string TrangThai { get; set; } = string.Empty;
    public string? PhanHoi { get; set; }
    public DateTime NgayGui { get; set; }
    public DateTime? NgayXuLy { get; set; }
}
