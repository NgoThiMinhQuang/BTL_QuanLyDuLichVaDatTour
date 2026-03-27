using Entity.Entities;

namespace DAL.Interfaces;

public interface ITourDiemDenRepository
{
    Task<List<TourDiemDen>> GetByTourIdAsync(long tourId);

    Task<TourDiemDen?> GetByIdAsync(long id);

    Task<TourDiemDen?> GetTrackedByIdAsync(long id);

    Task<TourDiemDen?> GetByTourThuTuAsync(long tourId, int thuTu);

    Task AddAsync(TourDiemDen tourDiemDen);

    void Delete(TourDiemDen tourDiemDen);

    Task<int> SaveChangesAsync();
}
