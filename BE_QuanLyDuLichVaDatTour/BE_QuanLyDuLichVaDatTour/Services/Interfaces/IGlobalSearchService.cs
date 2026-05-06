using BE_QuanLyDuLichVaDatTour.DTOs.Admin;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface IGlobalSearchService
{
    Task<GlobalSearchResponseDto> SearchAsync(GlobalSearchRequestDto request);
}