using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface ITourRepository
{
    Task<List<Tour>> GetVisibleAsync();

    Task<List<Tour>> SearchVisibleAsync(string? keyword, long? diemXuatPhatId, List<long>? loaiTourIds, List<string>? phuongTiens, decimal? minPrice, decimal? maxPrice, int? minSoNgay, int? maxSoNgay);

    Task<Tour?> GetVisibleByIdAsync(long id);

    Task<List<Tour>> GetAllAsync();

    Task<Tour?> GetByIdAsync(long id);

    Task<Tour?> GetTrackedByIdAsync(long id);

    Task<Tour?> GetByMaTourAsync(string maTour);

    Task AddAsync(Tour tour);

    Task<int> SaveChangesAsync();
}
