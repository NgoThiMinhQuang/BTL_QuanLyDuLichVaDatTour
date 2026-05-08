using BE_QuanLyDuLichVaDatTour.DTOs.YeuThich;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using BE_QuanLyDuLichVaDatTour.Services.Interfaces;

namespace BE_QuanLyDuLichVaDatTour.Services;

public class YeuThichService : IYeuThichService
{
    private readonly IYeuThichRepository _yeuThichRepository;
    private readonly ITourRepository _tourRepository;

    public YeuThichService(IYeuThichRepository yeuThichRepository, ITourRepository tourRepository)
    {
        _yeuThichRepository = yeuThichRepository;
        _tourRepository = tourRepository;
    }

    public async Task<List<YeuThichResponseDto>> GetMyFavoritesAsync(long userId)
    {
        var items = await _yeuThichRepository.GetAllByUserIdAsync(userId);
        return items.Select(MapToDto).ToList();
    }

    public async Task<YeuThichResponseDto> AddAsync(long userId, long tourId)
    {
        var tour = await _tourRepository.GetByIdAsync(tourId);
        if (tour == null)
            throw new KeyNotFoundException("Tour không tồn tại.");

        var existing = await _yeuThichRepository.GetByUserAndTourAsync(userId, tourId);
        if (existing != null)
            throw new InvalidOperationException("Tour đã có trong danh sách yêu thích.");

        var entity = new YeuThich
        {
            UserId = userId,
            TourId = tourId,
            CreatedAt = DateTime.UtcNow
        };

        await _yeuThichRepository.AddAsync(entity);
        await _yeuThichRepository.SaveChangesAsync();

        entity.Tour = tour;
        return MapToDto(entity);
    }

    public async Task RemoveAsync(long userId, long tourId)
    {
        var existing = await _yeuThichRepository.GetByUserAndTourAsync(userId, tourId);
        if (existing == null)
            throw new KeyNotFoundException("Tour không có trong danh sách yêu thích.");

        await _yeuThichRepository.RemoveAsync(existing);
        await _yeuThichRepository.SaveChangesAsync();
    }

    private static YeuThichResponseDto MapToDto(YeuThich entity)
    {
        var tour = entity.Tour;
        var avatar = tour?.AnhTours?.FirstOrDefault(x => x.IsAvatar);
        return new YeuThichResponseDto
        {
            Id = entity.Id,
            TourId = entity.TourId,
            MaTour = tour?.MaTour ?? string.Empty,
            TenTour = tour?.TenTour ?? string.Empty,
            TenLoaiTour = tour?.LoaiTour?.Ten ?? string.Empty,
            SoNgay = tour?.SoNgay ?? 0,
            SoDem = tour?.SoDem ?? 0,
            AnhDaiDien = avatar?.LinkAnh,
            GiaTuThamKhao = tour?.GiaTuThamKhao ?? 0,
            TrangThai = tour?.TrangThai.ToString() ?? string.Empty,
            CreatedAt = entity.CreatedAt
        };
    }
}