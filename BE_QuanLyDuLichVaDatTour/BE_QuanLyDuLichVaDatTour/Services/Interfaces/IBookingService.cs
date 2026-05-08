using BE_QuanLyDuLichVaDatTour.DTOs.Booking;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface IBookingService
{
    Task<BookingResponseDto> CreateAsync(long currentUserId, CreateBookingRequestDto request);

    Task<List<BookingListItemDto>> GetMyBookingsAsync(long currentUserId);
    Task<List<BookingListItemDto>> GetMyBookingsFilteredAsync(long currentUserId, string? status, DateTime? fromDate, DateTime? toDate, string? sortBy, bool? ascending);

    Task<BookingResponseDto> GetMyBookingByIdAsync(long currentUserId, long id);

    Task<List<BookingAdminResponseDto>> GetAllAsync();

    Task<BookingAdminResponseDto> GetByIdAsync(long id);

    Task UpdateStatusAsync(long adminUserId, long id, UpdateBookingStatusRequestDto request);
}
