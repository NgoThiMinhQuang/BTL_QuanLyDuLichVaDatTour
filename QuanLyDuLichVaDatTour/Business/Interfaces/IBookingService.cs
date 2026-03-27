using BLL.DTOs.Booking;

namespace BLL.Interfaces;

public interface IBookingService
{
    Task<BookingResponseDto> CreateAsync(long currentUserId, CreateBookingRequestDto request);

    Task<List<BookingListItemDto>> GetMyBookingsAsync(long currentUserId);

    Task<BookingResponseDto> GetMyBookingByIdAsync(long currentUserId, long id);

    Task<List<BookingAdminResponseDto>> GetAllAsync();

    Task<BookingAdminResponseDto> GetByIdAsync(long id);

    Task UpdateStatusAsync(long adminUserId, long id, UpdateBookingStatusRequestDto request);
}
