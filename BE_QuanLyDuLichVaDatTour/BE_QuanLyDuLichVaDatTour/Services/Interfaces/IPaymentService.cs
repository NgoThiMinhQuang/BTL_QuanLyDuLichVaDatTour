using BE_QuanLyDuLichVaDatTour.DTOs.Payment;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponseDto> CreateAsync(long currentUserId, CreatePaymentRequestDto request);

    Task<List<PaymentResponseDto>> GetByBookingIdAsync(long currentUserId, long bookingId);

    Task<PaymentResponseDto> GetByIdAsync(long currentUserId, long id);

    Task<List<PaymentResponseDto>> GetAllAsync();

    Task<PaymentResponseDto> GetAdminByIdAsync(long id);

    Task UpdateStatusAsync(long adminUserId, long id, UpdatePaymentStatusRequestDto request);

    Task<PaymentResponseDto> ConfirmAsync(long adminUserId, long id, ConfirmPaymentRequestDto request);

    Task<PaymentResponseDto> RefundAsync(long adminUserId, long id, RefundRequestDto request);

    Task<object> PreviewPriceAsync(long currentUserId, PricePreviewRequestDto request);
}
