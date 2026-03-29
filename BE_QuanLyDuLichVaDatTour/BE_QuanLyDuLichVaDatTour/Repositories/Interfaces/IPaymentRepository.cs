using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface IPaymentRepository
{
    Task AddAsync(ThanhToan thanhToan);

    Task<ThanhToan?> GetByIdAsync(long id);

    Task<ThanhToan?> GetTrackedByIdAsync(long id);

    Task<List<ThanhToan>> GetByBookingIdAsync(long bookingId);

    Task<List<ThanhToan>> GetAllAsync();

    Task<string> GenerateInternalTransactionCodeAsync();

    Task<int> SaveChangesAsync();
}
