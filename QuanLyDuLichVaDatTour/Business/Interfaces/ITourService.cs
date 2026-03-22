using BLL.DTOs.Tour;

namespace BLL.Interfaces;

public interface ITourService
{
    Task<List<TourResponseDto>> GetVisibleAsync();

    Task<TourResponseDto> GetVisibleByIdAsync(ulong id);

    Task<List<TourAdminResponseDto>> GetAllAsync();

    Task<TourAdminResponseDto> GetByIdAsync(ulong id);

    Task<TourAdminResponseDto> CreateAsync(CreateTourRequestDto request);

    Task<TourAdminResponseDto> UpdateAsync(ulong id, UpdateTourRequestDto request);

    Task UpdateStatusAsync(ulong id, UpdateTourStatusRequestDto request);

    Task HideAsync(ulong id);
}
