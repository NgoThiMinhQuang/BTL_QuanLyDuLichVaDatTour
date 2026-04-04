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
            CreatedAt = danhGia.CreatedAt,
            UpdatedAt = danhGia.UpdatedAt
        };
    }
}
