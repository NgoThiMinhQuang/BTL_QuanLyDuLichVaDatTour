using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface IYeuThichRepository
{
    Task<List<YeuThich>> GetAllByUserIdAsync(long userId);
    Task<YeuThich?> GetByUserAndTourAsync(long userId, long tourId);
    Task AddAsync(YeuThich entity);
    Task RemoveAsync(YeuThich entity);
    Task SaveChangesAsync();
}