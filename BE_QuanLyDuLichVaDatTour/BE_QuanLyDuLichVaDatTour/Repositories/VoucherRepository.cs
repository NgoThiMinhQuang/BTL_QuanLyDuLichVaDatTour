using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class VoucherRepository : IVoucherRepository
{
    private readonly AppDbContext _dbContext;

    public VoucherRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(Voucher voucher)
    {
        await _dbContext.Vouchers.AddAsync(voucher);
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

    public async Task<List<Voucher>> GetAllAsync()
    {
        return await _dbContext.Vouchers
            .AsNoTracking()
            .Include(x => x.Tour)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }

    public async Task<List<Voucher>> GetAvailableVouchersAsync()
    {
        var now = DateTime.UtcNow;
        return await _dbContext.Vouchers
            .AsNoTracking()
            .Include(x => x.Tour)
            .Where(x => x.TrangThai == Models.Enums.TrangThaiVoucher.hoat_dong
                        && x.NgayBatDau <= now
                        && x.NgayKetThuc >= now
                        && x.SoLuongDaDung < x.SoLuongToiDa)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<long>> GetUsedVoucherIdsByUserAsync(long userId)
    {
        return await _dbContext.Bookings
            .AsNoTracking()
            .Where(x => x.KhachHangId == userId
                        && x.VoucherId != null
                        && x.TrangThaiBooking != Models.Enums.TrangThaiBooking.da_huy)
            .Select(x => x.VoucherId!.Value)
            .Distinct()
            .ToListAsync();
    }
}
