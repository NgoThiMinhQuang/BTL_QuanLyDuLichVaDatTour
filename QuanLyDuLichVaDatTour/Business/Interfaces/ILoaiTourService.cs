using BLL.DTOs.LoaiTour;

namespace BLL.Interfaces;

public interface ILoaiTourService
{
    Task<List<LoaiTourResponseDto>> GetVisibleAsync();

    Task<LoaiTourResponseDto> GetVisibleByIdAsync(long id);

    Task<List<LoaiTourAdminResponseDto>> GetAllAsync();

    Task<LoaiTourAdminResponseDto> GetByIdAsync(long id);

    Task<LoaiTourAdminResponseDto> CreateAsync(CreateLoaiTourRequestDto request);

    Task<LoaiTourAdminResponseDto> UpdateAsync(long id, UpdateLoaiTourRequestDto request);

    Task UpdateStatusAsync(long id, UpdateLoaiTourStatusRequestDto request);
}
