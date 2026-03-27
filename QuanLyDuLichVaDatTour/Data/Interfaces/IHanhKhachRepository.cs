using Entity.Entities;

namespace DAL.Interfaces;

public interface IHanhKhachRepository
{
    Task<List<HanhKhach>> GetByBookingIdAsync(long bookingId);

    Task<HanhKhach?> GetByIdAsync(long id);

    Task<HanhKhach?> GetTrackedByIdAsync(long id);

    Task AddAsync(HanhKhach hanhKhach);

    Task AddRangeAsync(IEnumerable<HanhKhach> hanhKhachs);

    void Delete(HanhKhach hanhKhach);

    Task<int> SaveChangesAsync();
}
