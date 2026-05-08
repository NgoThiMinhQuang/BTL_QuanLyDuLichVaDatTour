using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class YeuThichRepository : IYeuThichRepository
{
    private readonly AppDbContext _context;

    public YeuThichRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<YeuThich>> GetAllByUserIdAsync(long userId)
    {
        return await _context.YeuThichs
            .Include(x => x.Tour!)
                .ThenInclude(x => x.AnhTours)
            .Include(x => x.Tour!)
                .ThenInclude(x => x.LoaiTour)
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<YeuThich?> GetByUserAndTourAsync(long userId, long tourId)
    {
        return await _context.YeuThichs
            .FirstOrDefaultAsync(x => x.UserId == userId && x.TourId == tourId);
    }

    public async Task AddAsync(YeuThich entity)
    {
        await _context.YeuThichs.AddAsync(entity);
    }

    public async Task RemoveAsync(YeuThich entity)
    {
        _context.YeuThichs.Remove(entity);
        await Task.CompletedTask;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}