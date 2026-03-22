using Entity.Entities;

namespace DAL.Interfaces;

public interface ITourRepository
{
    Task<List<Tour>> GetVisibleAsync();

    Task<Tour?> GetVisibleByIdAsync(ulong id);

    Task<List<Tour>> GetAllAsync();

    Task<Tour?> GetByIdAsync(ulong id);

    Task<Tour?> GetTrackedByIdAsync(ulong id);

    Task<Tour?> GetByMaTourAsync(string maTour);

    Task AddAsync(Tour tour);

    Task<int> SaveChangesAsync();
}
