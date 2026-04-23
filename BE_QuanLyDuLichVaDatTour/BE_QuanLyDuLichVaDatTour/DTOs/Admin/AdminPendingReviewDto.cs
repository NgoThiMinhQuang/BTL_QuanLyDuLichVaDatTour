namespace BE_QuanLyDuLichVaDatTour.DTOs.Admin;

public class AdminPendingReviewDto
{
    public long Id { get; set; }

    public string HoTenKhachHang { get; set; } = string.Empty;

    public string TenTour { get; set; } = string.Empty;

    public int SoSao { get; set; }

    public string NoiDung { get; set; } = string.Empty;

    public DateTime NgayDanhGia { get; set; }
}
