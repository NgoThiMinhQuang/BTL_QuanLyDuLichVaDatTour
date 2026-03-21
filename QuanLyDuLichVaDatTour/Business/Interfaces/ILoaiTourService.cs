using BLL.DTOs.LoaiTour;

namespace BLL.Interfaces;

public interface ILoaiTourService
{
    Task<List<LoaiTourResponseDto>> GetVisibleAsync();

    Task<LoaiTourResponseDto> GetVisibleByIdAsync(ulong id);

    Task<List<LoaiTourAdminResponseDto>> GetAllAsync();

    Task<LoaiTourAdminResponseDto> GetByIdAsync(ulong id);

    Task<LoaiTourAdminResponseDto> CreateAsync(CreateLoaiTourRequestDto request);

    Task<LoaiTourAdminResponseDto> UpdateAsync(ulong id, UpdateLoaiTourRequestDto request);

    Task UpdateStatusAsync(ulong id, UpdateLoaiTourStatusRequestDto request);
}
