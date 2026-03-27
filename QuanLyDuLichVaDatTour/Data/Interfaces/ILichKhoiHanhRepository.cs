using Entity.Entities;

namespace DAL.Interfaces;

public interface ILichKhoiHanhRepository
{
    Task<List<LichKhoiHanh>> GetAllAsync();

    Task<LichKhoiHanh?> GetByIdAsync(long id);

    Task<LichKhoiHanh?> GetTrackedByIdAsync(long id);

    Task<List<LichKhoiHanh>> GetByTourIdAsync(long tourId);

    Task<List<LichKhoiHanh>> GetVisibleByTourIdAsync(long tourId);

    Task<LichKhoiHanh?> GetByMaDotTourAsync(string maDotTour);

    Task AddAsync(LichKhoiHanh lichKhoiHanh);

    Task<int> SaveChangesAsync();
}
