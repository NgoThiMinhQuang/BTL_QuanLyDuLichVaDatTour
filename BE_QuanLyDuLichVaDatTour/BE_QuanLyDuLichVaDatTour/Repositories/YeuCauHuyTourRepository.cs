using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class YeuCauHuyTourRepository : IYeuCauHuyTourRepository
{
    private readonly AppDbContext _context;

    public YeuCauHuyTourRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(YeuCauHuyTour entity)
    {
        await _context.YeuCauHuyTours.AddAsync(entity);
    }

    public async Task<YeuCauHuyTour?> GetByIdAsync(long id)
    {
        return await _context.YeuCauHuyTours
            .AsNoTracking()
            .Include(x => x.Booking!)
                .ThenInclude(x => x.LichKhoiHanh!)
                .ThenInclude(x => x.Tour)
            .Include(x => x.User)
            .Include(x => x.NguoiXuLy)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<YeuCauHuyTour?> GetTrackedByIdAsync(long id)
    {
        return await _context.YeuCauHuyTours
            .Include(x => x.Booking!)
                .ThenInclude(x => x.LichKhoiHanh!)
                .ThenInclude(x => x.Tour)
            .Include(x => x.User)
            .Include(x => x.NguoiXuLy)
            .FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task<YeuCauHuyTour?> GetByBookingIdAsync(long bookingId)
    {
        return await _context.YeuCauHuyTours
            .AsNoTracking()
            .Include(x => x.Booking!)
                .ThenInclude(x => x.LichKhoiHanh!)
                .ThenInclude(x => x.Tour)
            .FirstOrDefaultAsync(x => x.BookingId == bookingId);
    }

    public async Task<List<YeuCauHuyTour>> GetByUserIdAsync(long userId)
    {
        return await _context.YeuCauHuyTours
            .AsNoTracking()
            .Include(x => x.Booking!)
                .ThenInclude(x => x.LichKhoiHanh!)
                .ThenInclude(x => x.Tour)
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<YeuCauHuyTour>> GetPendingAsync()
    {
        return await _context.YeuCauHuyTours
            .AsNoTracking()
            .Include(x => x.Booking!)
                .ThenInclude(x => x.LichKhoiHanh!)
                .ThenInclude(x => x.Tour)
            .Include(x => x.User)
            .Where(x => x.TrangThai == "cho_duyet")
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}