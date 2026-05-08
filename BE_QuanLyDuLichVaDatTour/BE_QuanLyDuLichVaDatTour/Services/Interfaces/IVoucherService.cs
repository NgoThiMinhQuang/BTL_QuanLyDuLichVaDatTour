using BE_QuanLyDuLichVaDatTour.DTOs.Voucher;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface IVoucherService
{
    Task<List<VoucherAdminResponseDto>> GetAllAsync();

    Task<VoucherAdminResponseDto> GetByIdAsync(long id);

    Task<VoucherAdminResponseDto> CreateAsync(CreateVoucherRequestDto request);

    Task<VoucherAdminResponseDto> UpdateAsync(long id, UpdateVoucherRequestDto request);

    Task UpdateStatusAsync(long id, UpdateVoucherStatusRequestDto request);

    Task<List<VoucherUserResponseDto>> GetAvailableForUserAsync(long userId);

    Task<List<VoucherHistoryResponseDto>> GetVoucherHistoryAsync(long userId);
}
