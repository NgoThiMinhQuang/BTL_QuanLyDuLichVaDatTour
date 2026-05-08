using BE_QuanLyDuLichVaDatTour.DTOs.YeuThich;

namespace BE_QuanLyDuLichVaDatTour.Services.Interfaces;

public interface IYeuThichService
{
    Task<List<YeuThichResponseDto>> GetMyFavoritesAsync(long userId);
    Task<YeuThichResponseDto> AddAsync(long userId, long tourId);
    Task RemoveAsync(long userId, long tourId);
}