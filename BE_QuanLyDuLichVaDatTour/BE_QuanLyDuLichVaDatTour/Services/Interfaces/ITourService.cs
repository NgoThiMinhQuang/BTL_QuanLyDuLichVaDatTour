using BE_QuanLyDuLichVaDatTour.DTOs.Tour;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface ITourService
{
    Task<List<TourResponseDto>> GetVisibleAsync();

    Task<List<TourResponseDto>> SearchVisibleAsync(SearchTourRequestDto request);

    Task<TourResponseDto> GetVisibleByIdAsync(long id);

    Task<List<AnhTourResponseDto>> GetVisibleImagesByTourIdAsync(long id);

    Task<AnhTourResponseDto?> GetVisibleThumbnailByTourIdAsync(long id);

    Task<List<TourAdminResponseDto>> GetAllAsync();

    Task<TourAdminResponseDto> GetByIdAsync(long id);

    Task<TourAdminResponseDto> CreateAsync(CreateTourRequestDto request);

    Task<TourAdminResponseDto> UpdateAsync(long id, UpdateTourRequestDto request);

    Task UpdateStatusAsync(long id, UpdateTourStatusRequestDto request);

    Task HideAsync(long id);

    Task<TourDiemDenResponseDto> AddDiemDenAsync(long tourId, AddTourDiemDenRequestDto request);
    Task DeleteDiemDenAsync(long tourDiemDenId);
    Task<TourDiemDenResponseDto> UpdateDiemDenAsync(long tourDiemDenId, UpdateTourDiemDenRequestDto request);
    Task<List<TourDiemDenResponseDto>> ReorderDiemDensAsync(long tourId, List<long> diemDenIds);

    Task<AnhTourResponseDto> AddAnhTourAsync(long tourId, AddAnhTourRequestDto request);
    Task DeleteAnhTourAsync(long anhTourId);
    Task<AnhTourResponseDto> UpdateAnhTourAsync(long anhTourId, UpdateAnhTourRequestDto request);
    Task<AnhTourResponseDto> SetAvatarAsync(long anhTourId);
    Task<List<AnhTourResponseDto>> ReorderAnhToursAsync(long tourId, List<long> anhTourIds);
}
