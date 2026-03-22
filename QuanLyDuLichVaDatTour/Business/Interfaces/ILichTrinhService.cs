using BLL.DTOs.LichTrinh;

namespace BLL.Interfaces;

public interface ILichTrinhService
{
    Task<List<LichTrinhAdminResponseDto>> GetAllAsync();

    Task<LichTrinhAdminResponseDto> GetByIdAsync(ulong id);

    Task<List<LichTrinhAdminResponseDto>> GetByTourIdAsync(ulong tourId);

    Task<List<LichTrinhResponseDto>> GetVisibleByTourIdAsync(ulong tourId);

    Task<LichTrinhAdminResponseDto> CreateAsync(CreateLichTrinhRequestDto request);

    Task<LichTrinhAdminResponseDto> UpdateAsync(ulong id, UpdateLichTrinhRequestDto request);

    Task DeleteAsync(ulong id);
}
