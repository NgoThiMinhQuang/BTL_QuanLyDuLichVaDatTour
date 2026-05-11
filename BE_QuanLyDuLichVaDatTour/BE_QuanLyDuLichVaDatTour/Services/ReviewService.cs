using BE_QuanLyDuLichVaDatTour.DTOs.Review;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Models.Enums;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly INguoiDungRepository _nguoiDungRepository;

    public ReviewService(
        IReviewRepository reviewRepository,
        IBookingRepository bookingRepository,
        INguoiDungRepository nguoiDungRepository)
    {
        _reviewRepository = reviewRepository;
        _bookingRepository = bookingRepository;
        _nguoiDungRepository = nguoiDungRepository;
    }

    public async Task<ReviewResponseDto> UpdateAsync(long currentUserId, long reviewId, UpdateReviewRequestDto request)
    {
        _ = await _nguoiDungRepository.GetByIdAsync(currentUserId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại.");

        var danhGia = await _reviewRepository.GetTrackedByIdAsync(reviewId)
            ?? throw new KeyNotFoundException("Đánh giá không tồn tại.");

        if (danhGia.KhachHangId != currentUserId)
            throw new KeyNotFoundException("Đánh giá không tồn tại.");

        danhGia.SoSao = request.SoSao;
        danhGia.NoiDung = request.NoiDung.Trim();
        danhGia.HinhAnh = request.HinhAnh != null && request.HinhAnh.Count > 0 ? System.Text.Json.JsonSerializer.Serialize(request.HinhAnh) : danhGia.HinhAnh;
        danhGia.UpdatedAt = DateTime.UtcNow;

        await _reviewRepository.SaveChangesAsync();
        return MapReviewResponse(danhGia);
    }

    public async Task DeleteAsync(long currentUserId, long reviewId)
    {
        _ = await _nguoiDungRepository.GetByIdAsync(currentUserId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại.");

        var danhGia = await _reviewRepository.GetTrackedByIdAsync(reviewId)
            ?? throw new KeyNotFoundException("Đánh giá không tồn tại.");

        if (danhGia.KhachHangId != currentUserId)
            throw new KeyNotFoundException("Đánh giá không tồn tại.");

        danhGia.TrangThai = "da_xoa";
        danhGia.UpdatedAt = DateTime.UtcNow;
        await _reviewRepository.SaveChangesAsync();
    }

    public async Task ApproveAsync(long adminUserId, long reviewId, string? phanHoi)
    {
        await UpdateAdminStatusCore(adminUserId, reviewId, "hien_thi", phanHoi);
    }

    public async Task HideAsync(long adminUserId, long reviewId, string? phanHoi)
    {
        await UpdateAdminStatusCore(adminUserId, reviewId, "an", phanHoi);
    }

    private async Task UpdateAdminStatusCore(long adminUserId, long reviewId, string trangThai, string? phanHoi)
    {
        _ = await _nguoiDungRepository.GetByIdAsync(adminUserId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại.");

        var review = await _reviewRepository.GetTrackedByIdAsync(reviewId)
            ?? throw new KeyNotFoundException("Đánh giá không tồn tại.");

        review.TrangThai = trangThai;
        if (!string.IsNullOrWhiteSpace(phanHoi))
            review.PhanHoiAdmin = phanHoi.Trim();
        review.NgayPhanHoi = DateTime.UtcNow;
        review.UpdatedAt = DateTime.UtcNow;

        await _reviewRepository.SaveChangesAsync();
    }

    public async Task<ReviewResponseDto> CreateAsync(long currentUserId, CreateReviewRequestDto request)
    {
        _ = await _nguoiDungRepository.GetByIdAsync(currentUserId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại.");

        var booking = await _bookingRepository.GetByIdAsync(request.BookingId)
            ?? throw new KeyNotFoundException("Booking không tồn tại.");

        if (booking.KhachHangId != currentUserId)
        {
            throw new KeyNotFoundException("Booking không tồn tại.");
        }

        if (booking.TrangThaiBooking != TrangThaiBooking.hoan_tat)
        {
            throw new InvalidOperationException("Chỉ có thể đánh giá booking đã hoàn tất.");
        }

        if (await _reviewRepository.ExistsByBookingIdAsync(booking.Id))
        {
            throw new InvalidOperationException("Booking này đã được đánh giá.");
        }

        var tourId = booking.LichKhoiHanh?.TourId ?? 0;
        if (tourId <= 0)
        {
            throw new InvalidOperationException("Không tìm thấy tour để đánh giá.");
        }

        var now = DateTime.UtcNow;
        var danhGia = new DanhGia
        {
            BookingId = booking.Id,
            TourId = tourId,
            KhachHangId = currentUserId,
            SoSao = request.SoSao,
            NoiDung = request.NoiDung.Trim(),
            HinhAnh = request.HinhAnh != null && request.HinhAnh.Count > 0 ? System.Text.Json.JsonSerializer.Serialize(request.HinhAnh) : null,
            TrangThai = "cho_duyet",
            NgayDanhGia = now,
            CreatedAt = now,
            UpdatedAt = now,
            Booking = booking,
            Tour = booking.LichKhoiHanh?.Tour
        };

        await _reviewRepository.AddAsync(danhGia);
        await _reviewRepository.SaveChangesAsync();

        return MapReviewResponse(danhGia);
    }

    public async Task<List<ReviewResponseDto>> GetMyReviewsAsync(long currentUserId)
    {
        _ = await _nguoiDungRepository.GetByIdAsync(currentUserId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại.");

        var reviews = await _reviewRepository.GetByKhachHangIdAsync(currentUserId);
        return reviews.Select(MapReviewResponse).ToList();
    }

    public async Task<List<TourReviewResponseDto>> GetApprovedReviewsByTourAsync(long tourId)
    {
        var reviews = await _reviewRepository.GetApprovedByTourIdAsync(tourId);
        return reviews.Select(MapTourReviewResponse).ToList();
    }

    public async Task<List<TourReviewResponseDto>> GetFeaturedReviewsAsync(int limit)
    {
        var reviews = await _reviewRepository.GetApprovedRecentAsync(limit <= 0 ? 3 : limit);
        return reviews.Select(MapTourReviewResponse).ToList();
    }

    public async Task<TourReviewSummaryDto> GetTourReviewSummaryAsync(long tourId)
    {
        var reviews = await _reviewRepository.GetApprovedByTourIdAsync(tourId);
        var totalReviews = reviews.Count;

        return new TourReviewSummaryDto
        {
            TotalReviews = totalReviews,
            AverageRating = totalReviews == 0 ? 0 : Math.Round((decimal)reviews.Average(x => x.SoSao), 1),
            FiveStar = reviews.Count(x => x.SoSao == 5),
            FourStar = reviews.Count(x => x.SoSao == 4),
            ThreeStar = reviews.Count(x => x.SoSao == 3),
            TwoStar = reviews.Count(x => x.SoSao == 2),
            OneStar = reviews.Count(x => x.SoSao == 1)
        };
    }

    public async Task<List<AdminReviewResponseDto>> GetPendingReviewsAsync(int limit)
    {
        var reviews = await _reviewRepository.GetPendingAsync(limit);
        return reviews.Select(MapAdminReviewResponse).ToList();
    }

    public async Task<List<AdminReviewResponseDto>> GetAllAdminReviewsAsync()
    {
        var reviews = await _reviewRepository.GetAllAsync();
        return reviews.Select(MapAdminReviewResponse).ToList();
    }

    public async Task UpdateAdminStatusAsync(long adminUserId, long reviewId, UpdateAdminReviewStatusRequestDto request)
    {
        _ = await _nguoiDungRepository.GetByIdAsync(adminUserId)
            ?? throw new KeyNotFoundException("Người dùng không tồn tại.");

        var review = await _reviewRepository.GetTrackedByIdAsync(reviewId)
            ?? throw new KeyNotFoundException("Đánh giá không tồn tại.");

        review.TrangThai = request.TrangThai.Trim();
        review.PhanHoiAdmin = string.IsNullOrWhiteSpace(request.PhanHoiAdmin) ? review.PhanHoiAdmin : request.PhanHoiAdmin.Trim();
        review.NgayPhanHoi = DateTime.UtcNow;
        review.UpdatedAt = DateTime.UtcNow;

        await _reviewRepository.SaveChangesAsync();
    }

    private static ReviewResponseDto MapReviewResponse(DanhGia danhGia)
    {
        return new ReviewResponseDto
        {
            Id = danhGia.Id,
            BookingId = danhGia.BookingId,
            TourId = danhGia.TourId,
            MaBooking = danhGia.Booking?.MaBooking ?? string.Empty,
            TenTour = danhGia.Tour?.TenTour ?? danhGia.Booking?.LichKhoiHanh?.Tour?.TenTour ?? string.Empty,
            NgayKhoiHanh = danhGia.Booking?.LichKhoiHanh?.NgayKhoiHanh ?? default,
            NgayKetThuc = danhGia.Booking?.LichKhoiHanh?.NgayKetThuc ?? default,
            SoSao = danhGia.SoSao,
            NoiDung = danhGia.NoiDung,
            HinhAnh = DeserializeImages(danhGia.HinhAnh),
            CreatedAt = danhGia.CreatedAt,
            UpdatedAt = danhGia.UpdatedAt
        };
    }

    private static TourReviewResponseDto MapTourReviewResponse(DanhGia danhGia)
    {
        return new TourReviewResponseDto
        {
            Id = danhGia.Id,
            TourId = danhGia.TourId,
            HoTenKhachHang = danhGia.KhachHang?.HoTen ?? "Khách hàng",
            AnhDaiDien = danhGia.KhachHang?.AnhDaiDien,
            TenTour = danhGia.Tour?.TenTour ?? danhGia.Booking?.LichKhoiHanh?.Tour?.TenTour ?? string.Empty,
            SoSao = danhGia.SoSao,
            NoiDung = danhGia.NoiDung,
            PhanHoiAdmin = danhGia.PhanHoiAdmin,
            HinhAnh = DeserializeImages(danhGia.HinhAnh),
            NgayDanhGia = danhGia.NgayDanhGia
        };
    }

    private static AdminReviewResponseDto MapAdminReviewResponse(DanhGia danhGia)
    {
        return new AdminReviewResponseDto
        {
            Id = danhGia.Id,
            BookingId = danhGia.BookingId,
            TourId = danhGia.TourId,
            KhachHangId = danhGia.KhachHangId,
            HoTenKhachHang = danhGia.KhachHang?.HoTen ?? string.Empty,
            MaBooking = danhGia.Booking?.MaBooking ?? string.Empty,
            TenTour = danhGia.Tour?.TenTour ?? danhGia.Booking?.LichKhoiHanh?.Tour?.TenTour ?? string.Empty,
            SoSao = danhGia.SoSao,
            NoiDung = danhGia.NoiDung,
            PhanHoiAdmin = danhGia.PhanHoiAdmin,
            TrangThai = danhGia.TrangThai,
            HinhAnh = DeserializeImages(danhGia.HinhAnh),
            NgayDanhGia = danhGia.NgayDanhGia,
            NgayPhanHoi = danhGia.NgayPhanHoi,
            CreatedAt = danhGia.CreatedAt,
            UpdatedAt = danhGia.UpdatedAt
        };
    }

    private static List<string>? DeserializeImages(string? json)
    {
        if (string.IsNullOrWhiteSpace(json)) return null;
        try
        {
            return System.Text.Json.JsonSerializer.Deserialize<List<string>>(json);
        }
        catch
        {
            return null;
        }
    }
}
