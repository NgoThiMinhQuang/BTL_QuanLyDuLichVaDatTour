using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface ILoaiTourRepository
{
    Task<List<LoaiTour>> GetVisibleAsync();

    Task<LoaiTour?> GetVisibleByIdAsync(long id);

    Task<List<LoaiTour>> GetAllAsync();

    Task<LoaiTour?> GetByIdAsync(long id);

    Task<LoaiTour?> GetTrackedByIdAsync(long id);

    Task<LoaiTour?> GetByTenAsync(string ten);

    Task AddAsync(LoaiTour loaiTour);

    Task<int> SaveChangesAsync();
}
