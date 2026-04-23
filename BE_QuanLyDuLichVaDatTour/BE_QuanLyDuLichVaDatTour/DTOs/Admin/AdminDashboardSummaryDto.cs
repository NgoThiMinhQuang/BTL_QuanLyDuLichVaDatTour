namespace BE_QuanLyDuLichVaDatTour.DTOs.Admin;

public class AdminDashboardSummaryDto
{
    public int TongTour { get; set; }

    public int TourDangMoBan { get; set; }

    public int TongBooking { get; set; }

    public decimal TongDoanhThu { get; set; }

    public int TongKhachHang { get; set; }

    public decimal TyLeThanhToanDu { get; set; }

    public int BookingChoXuLy { get; set; }

    public double DiemDanhGiaTrungBinh { get; set; }

    public List<AdminChartPointDto> DoanhThuTheoThang { get; set; } = new();

    public List<AdminChartPointDto> BookingTheoThang { get; set; } = new();

    public List<AdminTopTourDto> TopTours { get; set; } = new();

    public List<AdminRecentBookingDto> BookingMoi { get; set; } = new();

    public List<AdminPendingPaymentDto> ThanhToanChoXacNhan { get; set; } = new();

    public List<AdminPendingReviewDto> DanhGiaChoDuyet { get; set; } = new();

    public List<AdminPaymentStatusItemDto> TinhTrangThanhToan { get; set; } = new();
}
