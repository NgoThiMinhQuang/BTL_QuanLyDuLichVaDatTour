using Entity.Entities;

namespace DAL.Interfaces;

public interface IVoucherRepository
{
    Task<List<Voucher>> GetAllAsync();

    Task<Voucher?> GetByIdAsync(long id);

    Task<Voucher?> GetTrackedByIdAsync(long id);

    Task<Voucher?> GetByMaVoucherAsync(string maVoucher);

    Task AddAsync(Voucher voucher);

    Task<int> SaveChangesAsync();
}
