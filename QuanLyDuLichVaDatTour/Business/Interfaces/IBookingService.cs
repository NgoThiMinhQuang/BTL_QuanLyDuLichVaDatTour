using BLL.DTOs.Booking;

namespace BLL.Interfaces;

public interface IBookingService
{
    Task<BookingResponseDto> CreateAsync(ulong currentUserId, CreateBookingRequestDto request);

    Task<List<BookingListItemDto>> GetMyBookingsAsync(ulong currentUserId);

    Task<BookingResponseDto> GetMyBookingByIdAsync(ulong currentUserId, ulong id);

    Task<List<BookingAdminResponseDto>> GetAllAsync();

    Task<BookingAdminResponseDto> GetByIdAsync(ulong id);

    Task UpdateStatusAsync(ulong adminUserId, ulong id, UpdateBookingStatusRequestDto request);
}
