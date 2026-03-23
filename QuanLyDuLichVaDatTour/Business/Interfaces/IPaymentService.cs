using BLL.DTOs.Payment;

namespace BLL.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponseDto> CreateAsync(ulong currentUserId, CreatePaymentRequestDto request);

    Task<List<PaymentResponseDto>> GetByBookingIdAsync(ulong currentUserId, ulong bookingId);

    Task<PaymentResponseDto> GetByIdAsync(ulong currentUserId, ulong id);

    Task<List<PaymentResponseDto>> GetAllAsync();

    Task<PaymentResponseDto> GetAdminByIdAsync(ulong id);

    Task UpdateStatusAsync(ulong adminUserId, ulong id, UpdatePaymentStatusRequestDto request);
}
