using BE_QuanLyDuLichVaDatTour.Models.Entities;

namespace BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;

public interface IVoucherRepository
{
    Task AddAsync(Voucher voucher);

    Task<Voucher?> GetByIdAsync(long id);

    Task<Voucher?> GetTrackedByIdAsync(long id);

    Task<Voucher?> GetByMaVoucherAsync(string maVoucher);

    Task<List<Voucher>> GetAllAsync();

    Task<int> SaveChangesAsync();
}
