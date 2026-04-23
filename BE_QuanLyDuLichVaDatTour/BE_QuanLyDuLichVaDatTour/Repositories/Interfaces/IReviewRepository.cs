using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface IReviewRepository
{
    Task AddAsync(DanhGia danhGia);

    Task<DanhGia?> GetByIdAsync(long id);

    Task<DanhGia?> GetTrackedByIdAsync(long id);

    Task<DanhGia?> GetByBookingIdAsync(long bookingId);

    Task<List<DanhGia>> GetByKhachHangIdAsync(long khachHangId);

    Task<List<DanhGia>> GetPendingAsync(int limit);

    Task<List<DanhGia>> GetAllAsync();

    Task<bool> ExistsByBookingIdAsync(long bookingId);

    Task<int> SaveChangesAsync();
}
