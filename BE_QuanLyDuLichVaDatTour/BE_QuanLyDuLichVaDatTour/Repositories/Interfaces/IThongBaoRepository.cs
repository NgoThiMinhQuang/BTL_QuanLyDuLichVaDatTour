using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface IThongBaoRepository
{
    Task AddAsync(ThongBao entity);
    Task AddRangeAsync(List<ThongBao> entities);
    Task<List<ThongBao>> GetByUserIdAsync(long userId, int limit, int offset);
    Task<int> GetUnreadCountAsync(long userId);
    Task<ThongBao?> GetTrackedByIdAsync(long id);
    Task SaveChangesAsync();
}