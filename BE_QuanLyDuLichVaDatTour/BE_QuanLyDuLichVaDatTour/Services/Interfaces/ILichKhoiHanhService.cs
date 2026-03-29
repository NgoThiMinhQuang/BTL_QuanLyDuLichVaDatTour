using BE_QuanLyDuLichVaDatTour.DTOs.LichKhoiHanh;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface ILichKhoiHanhService
{
    Task<List<LichKhoiHanhAdminResponseDto>> GetAllAsync();

    Task<LichKhoiHanhAdminResponseDto> GetByIdAsync(long id);

    Task<List<LichKhoiHanhAdminResponseDto>> GetByTourIdAsync(long tourId);

    Task<List<LichKhoiHanhResponseDto>> GetVisibleByTourIdAsync(long tourId);

    Task<LichKhoiHanhAdminResponseDto> CreateAsync(CreateLichKhoiHanhRequestDto request);

    Task<LichKhoiHanhAdminResponseDto> UpdateAsync(long id, UpdateLichKhoiHanhRequestDto request);

    Task UpdateStatusAsync(long id, UpdateLichKhoiHanhStatusRequestDto request);
}
