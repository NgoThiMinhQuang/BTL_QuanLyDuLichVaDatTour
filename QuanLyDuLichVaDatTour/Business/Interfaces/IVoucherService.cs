using BLL.DTOs.Voucher;

namespace BLL.Interfaces;

public interface IVoucherService
{
    Task<List<VoucherAdminResponseDto>> GetAllAsync();

    Task<VoucherAdminResponseDto> GetByIdAsync(long id);

    Task<VoucherAdminResponseDto> CreateAsync(CreateVoucherRequestDto request);

    Task<VoucherAdminResponseDto> UpdateAsync(long id, UpdateVoucherRequestDto request);

    Task UpdateStatusAsync(long id, UpdateVoucherStatusRequestDto request);
}
