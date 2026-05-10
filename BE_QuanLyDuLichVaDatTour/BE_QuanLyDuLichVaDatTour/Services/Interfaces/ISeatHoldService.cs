using BE_QuanLyDuLichVaDatTour.DTOs.Booking;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface ISeatHoldService
{
    Task<SeatHoldResponseDto> CreateHoldAsync(long currentUserId, CreateSeatHoldRequestDto request);
    Task<SeatHoldResponseDto?> GetHoldAsync(long currentUserId, string token);
    Task ReleaseHoldAsync(long currentUserId, string token);
    Task<SeatHoldResponseDto> ExtendHoldAsync(long currentUserId, string token);
    Task ConvertHoldToBookingAsync(long currentUserId, string token, int totalPassengers);
}