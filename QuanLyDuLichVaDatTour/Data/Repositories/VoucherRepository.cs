using DAL.DbContexts;
using DAL.Interfaces;
using Entity.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class VoucherRepository : IVoucherRepository
{
    private readonly AppDbContext _dbContext;

    public VoucherRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<List<Voucher>> GetAllAsync()
    {
        return await _dbContext.Vouchers
            .AsNoTracking()
            .Include(x => x.Tour)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<Voucher?> GetByIdAsync(long id)
    {
        return await _dbContext.Vouchers
            .AsNoTracking()
            .Include(x => x.Tour)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Voucher?> GetTrackedByIdAsync(long id)
    {
        return await _dbContext.Vouchers
            .Include(x => x.Tour)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<Voucher?> GetByMaVoucherAsync(string maVoucher)
    {
        return await _dbContext.Vouchers
            .AsNoTracking()
            .Include(x => x.Tour)
            .FirstOrDefaultAsync(x => x.MaVoucher == maVoucher);
    }

    public async Task AddAsync(Voucher voucher)
    {
        await _dbContext.Vouchers.AddAsync(voucher);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
