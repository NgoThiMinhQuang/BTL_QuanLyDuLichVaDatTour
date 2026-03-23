using Entity.Entities;

namespace DAL.Interfaces;

public interface IPaymentRepository
{
    Task AddAsync(ThanhToan thanhToan);

    Task<ThanhToan?> GetByIdAsync(ulong id);

    Task<ThanhToan?> GetTrackedByIdAsync(ulong id);

    Task<List<ThanhToan>> GetByBookingIdAsync(ulong bookingId);

    Task<List<ThanhToan>> GetAllAsync();

    Task<string> GenerateInternalTransactionCodeAsync();

    Task<int> SaveChangesAsync();
}
