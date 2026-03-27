using BLL.DTOs.LichTrinh;

namespace BLL.Interfaces;

public interface ILichTrinhService
{
    Task<List<LichTrinhAdminResponseDto>> GetAllAsync();

    Task<LichTrinhAdminResponseDto> GetByIdAsync(long id);

    Task<List<LichTrinhAdminResponseDto>> GetByTourIdAsync(long tourId);

    Task<List<LichTrinhResponseDto>> GetVisibleByTourIdAsync(long tourId);

    Task<LichTrinhAdminResponseDto> CreateAsync(CreateLichTrinhRequestDto request);

    Task<LichTrinhAdminResponseDto> UpdateAsync(long id, UpdateLichTrinhRequestDto request);

    Task DeleteAsync(long id);
}
