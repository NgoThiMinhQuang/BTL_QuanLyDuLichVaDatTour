using Entity.Entities;

namespace DAL.Interfaces;

public interface IBookingRepository
{
    Task AddAsync(Booking booking);

    Task<Booking?> GetByIdAsync(long id);

    Task<Booking?> GetTrackedByIdAsync(long id);

    Task<Booking?> GetByMaBookingAsync(string maBooking);

    Task<List<Booking>> GetByNguoiDungIdAsync(long nguoiDungId);

    Task<List<Booking>> GetAllAsync();

    Task<int> SaveChangesAsync();
}
