using BLL.DTOs.Payment;

namespace BLL.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponseDto> CreateAsync(long currentUserId, CreatePaymentRequestDto request);

    Task<List<PaymentResponseDto>> GetByBookingIdAsync(long currentUserId, long bookingId);

    Task<PaymentResponseDto> GetByIdAsync(long currentUserId, long id);

    Task<List<PaymentResponseDto>> GetAllAsync();

    Task<PaymentResponseDto> GetAdminByIdAsync(long id);

    Task UpdateStatusAsync(long adminUserId, long id, UpdatePaymentStatusRequestDto request);
}
