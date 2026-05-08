namespace BE_QuanLyDuLichVaDatTour.DTOs.Review;

public class AdminReviewResponseDto
{
    public long Id { get; set; }

    public long BookingId { get; set; }

    public long TourId { get; set; }

    public long KhachHangId { get; set; }

    public string HoTenKhachHang { get; set; } = string.Empty;

    public string MaBooking { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public int SoSao { get; set; }

    public string NoiDung { get; set; } = string.Empty;

    public string? PhanHoiAdmin { get; set; }

    public string TrangThai { get; set; } = string.Empty;

    public DateTime NgayDanhGia { get; set; }

    public DateTime? NgayPhanHoi { get; set; }

    public List<string>? HinhAnh { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
