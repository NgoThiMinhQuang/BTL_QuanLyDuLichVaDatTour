using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface ILichTrinhRepository
{
    Task<List<LichTrinh>> GetAllAsync();

    Task<LichTrinh?> GetByIdAsync(long id);

    Task<LichTrinh?> GetTrackedByIdAsync(long id);

    Task<List<LichTrinh>> GetByTourIdAsync(long tourId);

    Task<List<LichTrinh>> GetVisibleByTourIdAsync(long tourId);

    Task<LichTrinh?> GetByTourDayOrderAsync(long tourId, int ngayThu, int thuTuTrongNgay);

    Task AddAsync(LichTrinh lichTrinh);

    void Delete(LichTrinh lichTrinh);

    Task<int> SaveChangesAsync();
}
