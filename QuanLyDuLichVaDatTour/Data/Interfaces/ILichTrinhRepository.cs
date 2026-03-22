using Entity.Entities;

namespace DAL.Interfaces;

public interface ILichTrinhRepository
{
    Task<List<LichTrinh>> GetAllAsync();

    Task<LichTrinh?> GetByIdAsync(ulong id);

    Task<LichTrinh?> GetTrackedByIdAsync(ulong id);

    Task<List<LichTrinh>> GetByTourIdAsync(ulong tourId);

    Task<List<LichTrinh>> GetVisibleByTourIdAsync(ulong tourId);

    Task<LichTrinh?> GetByTourDayOrderAsync(ulong tourId, byte ngayThu, ushort thuTuTrongNgay);

    Task AddAsync(LichTrinh lichTrinh);

    void Delete(LichTrinh lichTrinh);

    Task<int> SaveChangesAsync();
}
