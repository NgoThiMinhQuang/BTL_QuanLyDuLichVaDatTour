using Entity.Entities;

namespace DAL.Interfaces;

public interface ILoaiTourRepository
{
    Task<List<LoaiTour>> GetVisibleAsync();

    Task<LoaiTour?> GetVisibleByIdAsync(ulong id);

    Task<List<LoaiTour>> GetAllAsync();

    Task<LoaiTour?> GetByIdAsync(ulong id);

    Task<LoaiTour?> GetTrackedByIdAsync(ulong id);

    Task<LoaiTour?> GetByTenAsync(string ten);

    Task AddAsync(LoaiTour loaiTour);

    Task<int> SaveChangesAsync();
}
