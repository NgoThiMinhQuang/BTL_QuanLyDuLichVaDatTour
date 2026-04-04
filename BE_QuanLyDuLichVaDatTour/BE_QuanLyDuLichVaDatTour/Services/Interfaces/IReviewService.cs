using BE_QuanLyDuLichVaDatTour.DTOs.Review;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface IReviewService
{
    Task<ReviewResponseDto> CreateAsync(long currentUserId, CreateReviewRequestDto request);

    Task<List<ReviewResponseDto>> GetMyReviewsAsync(long currentUserId);
}
