using BE_QuanLyDuLichVaDatTour.DTOs.Cancellation;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface IYeuCauHuyTourService
{
    Task<CancellationResponseDto> CreateAsync(long userId, CreateCancellationRequestDto request);
    Task<CancellationResponseDto?> GetByBookingIdAsync(long userId, long bookingId);
    Task<List<CancellationResponseDto>> GetMyCancellationRequestsAsync(long userId);
    Task<List<AdminCancellationResponseDto>> GetPendingAsync();
    Task<AdminCancellationResponseDto> GetByIdAsync(long id);
    Task UpdateStatusAsync(long adminUserId, long id, UpdateCancellationRequestDto request);
}