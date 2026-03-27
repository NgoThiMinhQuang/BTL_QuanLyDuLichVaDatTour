using DAL.DbContexts;
using DAL.Interfaces;
using Entity.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly AppDbContext _dbContext;

    public PaymentRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(ThanhToan thanhToan)
    {
        await _dbContext.Set<ThanhToan>().AddAsync(thanhToan);
    }

    public async Task<ThanhToan?> GetByIdAsync(long id)
    {
        return await _dbContext.Set<ThanhToan>()
            .AsNoTracking()
            .Include(x => x.Booking)
                .ThenInclude(x => x!.KhachHang)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<ThanhToan?> GetTrackedByIdAsync(long id)
    {
        return await _dbContext.Set<ThanhToan>()
            .Include(x => x.Booking)
                .ThenInclude(x => x!.KhachHang)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<ThanhToan>> GetByBookingIdAsync(long bookingId)
    {
        return await _dbContext.Set<ThanhToan>()
            .AsNoTracking()
            .Include(x => x.Booking)
                .ThenInclude(x => x!.KhachHang)
            .Where(x => x.BookingId == bookingId)
            .OrderByDescending(x => x.ThoiGianTao)
            .ToListAsync();
    }

    public async Task<List<ThanhToan>> GetAllAsync()
    {
        return await _dbContext.Set<ThanhToan>()
            .AsNoTracking()
            .Include(x => x.Booking)
                .ThenInclude(x => x!.KhachHang)
            .OrderByDescending(x => x.ThoiGianTao)
            .ToListAsync();
    }

    public async Task<string> GenerateInternalTransactionCodeAsync()
    {
        for (var i = 0; i < 10; i++)
        {
            var code = $"TT-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(1000, 10000)}";
            var exists = await _dbContext.Set<ThanhToan>().AnyAsync(x => x.MaGiaoDichNoiBo == code);
            if (!exists)
            {
                return code;
            }
        }

        throw new InvalidOperationException("Không thể tạo mã giao dịch nội bộ duy nhất.");
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
