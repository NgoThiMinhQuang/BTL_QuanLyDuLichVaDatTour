using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface ITinTucRepository
{
    Task<List<TinTuc>> GetVisibleAsync();

    Task<TinTuc?> GetVisibleByIdAsync(long id);

    Task<List<TinTuc>> GetAllAsync();

    Task<TinTuc?> GetByIdAsync(long id);

    Task<TinTuc?> GetTrackedByIdAsync(long id);

    Task<TinTuc?> GetBySlugAsync(string slug);

    Task AddAsync(TinTuc tinTuc);

    Task<int> SaveChangesAsync();
}
