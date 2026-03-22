using Entity.Entities;

namespace DAL.Interfaces;

public interface ILichKhoiHanhRepository
{
    Task<List<LichKhoiHanh>> GetAllAsync();

    Task<LichKhoiHanh?> GetByIdAsync(ulong id);

    Task<LichKhoiHanh?> GetTrackedByIdAsync(ulong id);

    Task<List<LichKhoiHanh>> GetByTourIdAsync(ulong tourId);

    Task<List<LichKhoiHanh>> GetVisibleByTourIdAsync(ulong tourId);

    Task<LichKhoiHanh?> GetByMaDotTourAsync(string maDotTour);

    Task AddAsync(LichKhoiHanh lichKhoiHanh);

    Task<int> SaveChangesAsync();
}
