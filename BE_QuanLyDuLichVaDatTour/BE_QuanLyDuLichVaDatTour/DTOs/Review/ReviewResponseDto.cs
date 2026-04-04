namespace BE_QuanLyDuLichVaDatTour.DTOs.Review;

public class ReviewResponseDto
{
    public long Id { get; set; }

    public long BookingId { get; set; }

    public long TourId { get; set; }

    public string MaBooking { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public DateTime NgayKhoiHanh { get; set; }

    public DateTime NgayKetThuc { get; set; }

    public int SoSao { get; set; }

    public string NoiDung { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
