using Entity.Entities;

namespace DAL.Interfaces;

public interface IBookingRepository
{
    Task AddAsync(Booking booking);

    Task<Booking?> GetByIdAsync(ulong id);

    Task<Booking?> GetTrackedByIdAsync(ulong id);

    Task<Booking?> GetByMaBookingAsync(string maBooking);

    Task<List<Booking>> GetByNguoiDungIdAsync(ulong nguoiDungId);

    Task<List<Booking>> GetAllAsync();

    Task<int> SaveChangesAsync();
}
