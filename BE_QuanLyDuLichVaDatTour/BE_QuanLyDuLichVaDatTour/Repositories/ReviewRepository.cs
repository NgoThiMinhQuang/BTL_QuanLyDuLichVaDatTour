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
        return await BuildReviewQuery(_dbContext.DanhGias.AsNoTracking())
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<DanhGia?> GetTrackedByIdAsync(long id)
    {
        return await BuildReviewQuery(_dbContext.DanhGias)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<DanhGia?> GetByBookingIdAsync(long bookingId)
    {
        return await BuildReviewQuery(_dbContext.DanhGias.AsNoTracking())
            .FirstOrDefaultAsync(x => x.BookingId == bookingId);
    }

    public async Task<List<DanhGia>> GetByKhachHangIdAsync(long khachHangId)
    {
        return await BuildReviewQuery(_dbContext.DanhGias.AsNoTracking())
            .Where(x => x.KhachHangId == khachHangId)
            .OrderByDescending(x => x.NgayDanhGia)
            .ToListAsync();
    }

    public async Task<List<DanhGia>> GetApprovedByTourIdAsync(long tourId)
    {
        return await BuildReviewQuery(_dbContext.DanhGias.AsNoTracking())
            .Where(x => x.TourId == tourId && x.TrangThai == "da_duyet")
            .OrderByDescending(x => x.NgayDanhGia)
            .ToListAsync();
    }

    public async Task<List<DanhGia>> GetPendingAsync(int limit)
    {
        return await BuildReviewQuery(_dbContext.DanhGias.AsNoTracking())
            .Where(x => x.TrangThai == "cho_duyet")
            .OrderByDescending(x => x.NgayDanhGia)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<List<DanhGia>> GetAllAsync()
    {
        return await BuildReviewQuery(_dbContext.DanhGias.AsNoTracking())
            .OrderByDescending(x => x.NgayDanhGia)
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

    private static IQueryable<DanhGia> BuildReviewQuery(IQueryable<DanhGia> query)
    {
        return query
            .Include(x => x.Booking)
                .ThenInclude(x => x!.LichKhoiHanh)
                    .ThenInclude(x => x!.Tour)
            .Include(x => x.Tour)
            .Include(x => x.KhachHang);
    }
}
