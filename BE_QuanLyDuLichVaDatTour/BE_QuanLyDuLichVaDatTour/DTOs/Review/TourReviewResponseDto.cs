namespace BE_QuanLyDuLichVaDatTour.DTOs.Review;

public class TourReviewResponseDto
{
    public long Id { get; set; }

    public long TourId { get; set; }

    public string HoTenKhachHang { get; set; } = string.Empty;

    public string? AnhDaiDien { get; set; }

    public string TenTour { get; set; } = string.Empty;

    public int SoSao { get; set; }

    public string NoiDung { get; set; } = string.Empty;

    public string? PhanHoiAdmin { get; set; }

    public List<string>? HinhAnh { get; set; }

    public DateTime NgayDanhGia { get; set; }
}
