using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface IYeuCauHuyTourRepository
{
    Task AddAsync(YeuCauHuyTour entity);
    Task<YeuCauHuyTour?> GetByIdAsync(long id);
    Task<YeuCauHuyTour?> GetTrackedByIdAsync(long id);
    Task<YeuCauHuyTour?> GetByBookingIdAsync(long bookingId);
    Task<List<YeuCauHuyTour>> GetByUserIdAsync(long userId);
    Task<List<YeuCauHuyTour>> GetPendingAsync();
    Task SaveChangesAsync();
}