using BLL.DTOs.LichKhoiHanh;

namespace BLL.Interfaces;

public interface ILichKhoiHanhService
{
    Task<List<LichKhoiHanhAdminResponseDto>> GetAllAsync();

    Task<LichKhoiHanhAdminResponseDto> GetByIdAsync(ulong id);

    Task<List<LichKhoiHanhAdminResponseDto>> GetByTourIdAsync(ulong tourId);

    Task<List<LichKhoiHanhResponseDto>> GetVisibleByTourIdAsync(ulong tourId);

    Task<LichKhoiHanhAdminResponseDto> CreateAsync(CreateLichKhoiHanhRequestDto request);

    Task<LichKhoiHanhAdminResponseDto> UpdateAsync(ulong id, UpdateLichKhoiHanhRequestDto request);

    Task UpdateStatusAsync(ulong id, UpdateLichKhoiHanhStatusRequestDto request);
}
