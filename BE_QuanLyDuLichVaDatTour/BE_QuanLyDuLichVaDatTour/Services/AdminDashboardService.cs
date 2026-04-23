using BE_QuanLyDuLichVaDatTour.DTOs.Admin;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class AdminDashboardService : IAdminDashboardService
{
    private readonly ITourService _tourService;
    private readonly IBookingService _bookingService;
    private readonly IPaymentService _paymentService;
    private readonly IReviewService _reviewService;
    private readonly INguoiDungRepository _nguoiDungRepository;

    public AdminDashboardService(
        ITourService tourService,
        IBookingService bookingService,
        IPaymentService paymentService,
        IReviewService reviewService,
        INguoiDungRepository nguoiDungRepository)
    {
        _tourService = tourService;
        _bookingService = bookingService;
        _paymentService = paymentService;
        _reviewService = reviewService;
        _nguoiDungRepository = nguoiDungRepository;
    }

    public async Task<AdminDashboardSummaryDto> GetSummaryAsync()
    {
        var toursTask = _tourService.GetAllAsync();
        var bookingsTask = _bookingService.GetAllAsync();
        var paymentsTask = _paymentService.GetAllAsync();
        var pendingReviewsTask = _reviewService.GetPendingReviewsAsync(5);
        var allReviewsTask = _reviewService.GetAllAdminReviewsAsync();
        var usersTask = _nguoiDungRepository.GetAllAsync();

        await Task.WhenAll(toursTask, bookingsTask, paymentsTask, pendingReviewsTask, allReviewsTask, usersTask);

        var tours = toursTask.Result;
        var bookings = bookingsTask.Result;
        var payments = paymentsTask.Result;
        var pendingReviews = pendingReviewsTask.Result;
        var allReviews = allReviewsTask.Result;
        var users = usersTask.Result;

        var doanhThuTheoThang = BuildMonthlyRevenue(bookings);
        var bookingTheoThang = BuildMonthlyBookings(bookings);
        var topTours = BuildTopTours(bookings);
        var paymentStatus = BuildPaymentStatus(bookings);
        var pendingPayments = payments
            .Where(payment => payment.TrangThai == TrangThaiGiaoDichThanhToan.cho_xu_ly.ToString())
            .OrderByDescending(payment => payment.ThoiGianTao)
            .Take(5)
            .Select(payment => new AdminPendingPaymentDto
            {
                Id = payment.Id,
                MaGiaoDich = payment.MaGiaoDichBenThuBa ?? payment.MaGiaoDichNoiBo ?? $"PAY{payment.Id}",
                PhuongThucThanhToan = payment.PhuongThucThanhToan,
                HoTenKhachHang = payment.HoTenKhachHang,
                MaBooking = payment.MaBooking,
                SoTien = payment.SoTien,
                ThoiGianTao = payment.ThoiGianTao,
            })
            .ToList();

        var recentBookings = bookings
            .OrderByDescending(booking => booking.NgayDat)
            .Take(5)
            .Select(booking => new AdminRecentBookingDto
            {
                Id = booking.Id,
                MaBooking = booking.MaBooking,
                HoTenNguoiDat = booking.HoTenNguoiDat,
                TenTour = booking.TenTour,
                TrangThaiBooking = booking.TrangThaiBooking,
                TrangThaiThanhToan = booking.TrangThaiThanhToan,
                TongTien = booking.TongTien,
                NgayDat = booking.NgayDat,
            })
            .ToList();

        var tongKhachHang = users.Count(user => user.VaiTro == VaiTroNguoiDung.khach_hang && user.TrangThai == TrangThaiNguoiDung.hoat_dong);
        var paymentDuCount = bookings.Count(booking => booking.TrangThaiThanhToan == TrangThaiThanhToan.da_thanh_toan_du.ToString());
        var tyLeThanhToanDu = bookings.Count == 0 ? 0 : Math.Round((decimal)paymentDuCount * 100 / bookings.Count, 2);

        return new AdminDashboardSummaryDto
        {
            TongTour = tours.Count,
            TourDangMoBan = tours.Count(tour => tour.TrangThai == TrangThaiTour.dang_mo_ban.ToString()),
            TongBooking = bookings.Count,
            TongDoanhThu = bookings.Sum(booking => booking.TongTien),
            TongKhachHang = tongKhachHang,
            TyLeThanhToanDu = tyLeThanhToanDu,
            BookingChoXuLy = bookings.Count(booking => booking.TrangThaiBooking is "moi_tao" or "cho_thanh_toan"),
            DiemDanhGiaTrungBinh = allReviews.Count == 0 ? 0 : Math.Round(allReviews.Average(review => review.SoSao), 1),
            DoanhThuTheoThang = doanhThuTheoThang,
            BookingTheoThang = bookingTheoThang,
            TopTours = topTours,
            BookingMoi = recentBookings,
            ThanhToanChoXacNhan = pendingPayments,
            DanhGiaChoDuyet = pendingReviews.Select(review => new AdminPendingReviewDto
            {
                Id = review.Id,
                HoTenKhachHang = review.HoTenKhachHang,
                TenTour = review.TenTour,
                SoSao = review.SoSao,
                NoiDung = review.NoiDung,
                NgayDanhGia = review.NgayDanhGia,
            }).ToList(),
            TinhTrangThanhToan = paymentStatus,
        };
    }

    private static List<AdminChartPointDto> BuildMonthlyRevenue(List<BE_QuanLyDuLichVaDatTour.DTOs.Booking.BookingAdminResponseDto> bookings)
    {
        var now = DateTime.UtcNow;
        return Enumerable.Range(0, 6)
            .Select(offset => new DateTime(now.Year, now.Month, 1).AddMonths(-(5 - offset)))
            .Select(month => new AdminChartPointDto
            {
                Nhan = $"T{month.Month}",
                GiaTri = bookings
                    .Where(booking => booking.NgayDat.Year == month.Year && booking.NgayDat.Month == month.Month)
                    .Sum(booking => booking.TongTien),
            })
            .ToList();
    }

    private static List<AdminChartPointDto> BuildMonthlyBookings(List<BE_QuanLyDuLichVaDatTour.DTOs.Booking.BookingAdminResponseDto> bookings)
    {
        var now = DateTime.UtcNow;
        return Enumerable.Range(0, 6)
            .Select(offset => new DateTime(now.Year, now.Month, 1).AddMonths(-(5 - offset)))
            .Select(month => new AdminChartPointDto
            {
                Nhan = $"T{month.Month}",
                GiaTri = bookings.Count(booking => booking.NgayDat.Year == month.Year && booking.NgayDat.Month == month.Month),
            })
            .ToList();
    }

    private static List<AdminTopTourDto> BuildTopTours(List<BE_QuanLyDuLichVaDatTour.DTOs.Booking.BookingAdminResponseDto> bookings)
    {
        return bookings
            .GroupBy(booking => new { booking.TourId, booking.MaTour, booking.TenTour })
            .Select(group => new AdminTopTourDto
            {
                TourId = group.Key.TourId,
                MaTour = group.Key.MaTour,
                TenTour = group.Key.TenTour,
                SoBooking = group.Count(),
                DoanhThu = group.Sum(item => item.TongTien),
            })
            .OrderByDescending(item => item.SoBooking)
            .ThenByDescending(item => item.DoanhThu)
            .Take(5)
            .ToList();
    }

    private static List<AdminPaymentStatusItemDto> BuildPaymentStatus(List<BE_QuanLyDuLichVaDatTour.DTOs.Booking.BookingAdminResponseDto> bookings)
    {
        if (bookings.Count == 0)
        {
            return new List<AdminPaymentStatusItemDto>();
        }

        return bookings
            .GroupBy(booking => booking.TrangThaiThanhToan)
            .Select(group => new AdminPaymentStatusItemDto
            {
                TrangThai = group.Key,
                SoLuong = group.Count(),
                TyLe = Math.Round((decimal)group.Count() * 100 / bookings.Count, 2),
            })
            .OrderByDescending(item => item.SoLuong)
            .ToList();
    }
}
