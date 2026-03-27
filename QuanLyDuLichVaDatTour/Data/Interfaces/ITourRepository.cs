using Entity.Entities;

namespace DAL.Interfaces;

public interface ITourRepository
{
    Task<List<Tour>> GetVisibleAsync();

    Task<List<Tour>> SearchVisibleAsync(string? keyword, ulong? diemXuatPhatId, List<ulong>? loaiTourIds, List<string>? phuongTiens, decimal? minPrice, decimal? maxPrice, byte? minSoNgay, byte? maxSoNgay);

    Task<Tour?> GetVisibleByIdAsync(ulong id);

    Task<List<Tour>> GetAllAsync();

    Task<Tour?> GetByIdAsync(ulong id);

    Task<Tour?> GetTrackedByIdAsync(ulong id);

    Task<Tour?> GetByMaTourAsync(string maTour);

    Task AddAsync(Tour tour);

    Task<int> SaveChangesAsync();
}
