using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly AppDbContext _dbContext;

    public ReviewRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task AddAsync(DanhGia danhGia)
    {
        await _dbContext.DanhGias.AddAsync(danhGia);
    }

    public async Task<DanhGia?> GetByIdAsync(long id)
    {
        return await _dbContext.DanhGias
            .AsNoTracking()
            .Include(x => x.Booking)
                .ThenInclude(x => x!.LichKhoiHanh)
            .Include(x => x.Tour)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<DanhGia?> GetByBookingIdAsync(long bookingId)
    {
        return await _dbContext.DanhGias
            .AsNoTracking()
            .Include(x => x.Booking)
                .ThenInclude(x => x!.LichKhoiHanh)
            .Include(x => x.Tour)
            .FirstOrDefaultAsync(x => x.BookingId == bookingId);
    }

    public async Task<List<DanhGia>> GetByKhachHangIdAsync(long khachHangId)
    {
        return await _dbContext.DanhGias
            .AsNoTracking()
            .Include(x => x.Booking)
                .ThenInclude(x => x!.LichKhoiHanh)
            .Include(x => x.Tour)
            .Where(x => x.KhachHangId == khachHangId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public Task<bool> ExistsByBookingIdAsync(long bookingId)
    {
        return _dbContext.DanhGias.AnyAsync(x => x.BookingId == bookingId);
    }

    public Task<int> SaveChangesAsync()
    {
        return _dbContext.SaveChangesAsync();
    }
}
