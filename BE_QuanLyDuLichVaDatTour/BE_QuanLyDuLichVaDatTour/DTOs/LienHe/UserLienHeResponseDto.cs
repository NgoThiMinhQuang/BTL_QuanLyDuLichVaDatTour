namespace BE_QuanLyDuLichVaDatTour.DTOs.LienHe;

public class UserLienHeResponseDto
{
    public long Id { get; set; }
    public string ChuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
    public string TrangThai { get; set; } = string.Empty;
    public string? PhanHoi { get; set; }
    public DateTime NgayGui { get; set; }
    public DateTime? NgayXuLy { get; set; }
}

public class UserContactRequestDto
{
    public string HoTen { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? SoDienThoai { get; set; }
    public string ChuDe { get; set; } = string.Empty;
    public string NoiDung { get; set; } = string.Empty;
}