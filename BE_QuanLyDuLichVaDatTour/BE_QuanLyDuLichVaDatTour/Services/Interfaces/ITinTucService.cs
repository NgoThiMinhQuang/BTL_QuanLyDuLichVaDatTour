using BE_QuanLyDuLichVaDatTour.DTOs.TinTuc;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface ITinTucService
{
    Task<List<TinTucResponseDto>> GetVisibleAsync();

    Task<TinTucResponseDto> GetVisibleByIdAsync(long id);

    Task<List<TinTucAdminResponseDto>> GetAllAsync();

    Task<TinTucAdminResponseDto> GetByIdAsync(long id);

    Task<TinTucAdminResponseDto> CreateAsync(CreateTinTucRequestDto request);

    Task<TinTucAdminResponseDto> UpdateAsync(long id, UpdateTinTucRequestDto request);

    Task UpdateStatusAsync(long id, UpdateTinTucStatusRequestDto request);
}
