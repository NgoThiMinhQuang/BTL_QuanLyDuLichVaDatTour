using BE_QuanLyDuLichVaDatTour.DTOs.Review;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface IReviewService
{
    Task<ReviewResponseDto> CreateAsync(long currentUserId, CreateReviewRequestDto request);

    Task<List<ReviewResponseDto>> GetMyReviewsAsync(long currentUserId);

    Task<List<TourReviewResponseDto>> GetApprovedReviewsByTourAsync(long tourId);

    Task<List<TourReviewResponseDto>> GetFeaturedReviewsAsync(int limit);

    Task<TourReviewSummaryDto> GetTourReviewSummaryAsync(long tourId);

    Task<List<AdminReviewResponseDto>> GetPendingReviewsAsync(int limit);

    Task<List<AdminReviewResponseDto>> GetAllAdminReviewsAsync();

    Task UpdateAdminStatusAsync(long adminUserId, long reviewId, UpdateAdminReviewStatusRequestDto request);
}
