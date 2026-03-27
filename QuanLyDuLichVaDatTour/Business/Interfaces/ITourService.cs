using BLL.DTOs.Tour;

namespace BLL.Interfaces;

public interface ITourService
{
    Task<List<TourResponseDto>> GetVisibleAsync();

    Task<List<TourResponseDto>> SearchVisibleAsync(SearchTourRequestDto request);

    Task<TourResponseDto> GetVisibleByIdAsync(long id);

    Task<List<TourAdminResponseDto>> GetAllAsync();

    Task<TourAdminResponseDto> GetByIdAsync(long id);

    Task<TourAdminResponseDto> CreateAsync(CreateTourRequestDto request);

    Task<TourAdminResponseDto> UpdateAsync(long id, UpdateTourRequestDto request);

    Task UpdateStatusAsync(long id, UpdateTourStatusRequestDto request);

    Task HideAsync(long id);
}
