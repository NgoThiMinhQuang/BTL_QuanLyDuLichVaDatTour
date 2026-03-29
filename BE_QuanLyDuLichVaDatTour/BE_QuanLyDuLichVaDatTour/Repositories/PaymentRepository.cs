using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly AppDbContext _dbContext;

    public PaymentRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(ThanhToan thanhToan)
    {
        await _dbContext.ThanhToans.AddAsync(thanhToan);
    }

    public async Task<ThanhToan?> GetByIdAsync(long id)
    {
        return await _dbContext.ThanhToans
            .AsNoTracking()
            .Include(x => x.Booking)
                .ThenInclude(x => x!.KhachHang)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<ThanhToan?> GetTrackedByIdAsync(long id)
    {
        return await _dbContext.ThanhToans
            .Include(x => x.Booking)
                .ThenInclude(x => x!.KhachHang)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<List<ThanhToan>> GetByBookingIdAsync(long bookingId)
    {
        return await _dbContext.ThanhToans
            .AsNoTracking()
            .Include(x => x.Booking)
                .ThenInclude(x => x!.KhachHang)
            .Where(x => x.BookingId == bookingId)
            .OrderByDescending(x => x.ThoiGianTao)
            .ToListAsync();
    }

    public async Task<List<ThanhToan>> GetAllAsync()
    {
        return await _dbContext.ThanhToans
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
            var exists = await _dbContext.ThanhToans.AnyAsync(x => x.MaGiaoDichNoiBo == code);
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
