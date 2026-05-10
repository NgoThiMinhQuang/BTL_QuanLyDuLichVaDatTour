using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface ITinNhanRepository
{
    Task AddAsync(TinNhan tinNhan);
    Task<List<TinNhan>> GetByBookingIdAsync(long bookingId);
    Task<List<TinNhan>> GetGeneralMessagesAsync(long userId, bool isAdmin);
    Task MarkAsReadAsync(long bookingId, long userId);
    Task<int> SaveChangesAsync();
}
