using BE_QuanLyDuLichVaDatTour.Data;
using BE_QuanLyDuLichVaDatTour.Models.Entities;
using BE_QuanLyDuLichVaDatTour.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BE_QuanLyDuLichVaDatTour.Repositories;

public class ThongBaoRepository : IThongBaoRepository
{
    private readonly AppDbContext _context;

    public ThongBaoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(ThongBao entity)
    {
        await _context.ThongBaos.AddAsync(entity);
    }

    public async Task AddRangeAsync(List<ThongBao> entities)
    {
        await _context.ThongBaos.AddRangeAsync(entities);
    }

    public async Task<List<ThongBao>> GetByUserIdAsync(long userId, int limit, int offset)
    {
        return await _context.ThongBaos
            .AsNoTracking()
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.ThoiGian)
            .Skip(offset)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(long userId)
    {
        return await _context.ThongBaos
            .AsNoTracking()
            .CountAsync(x => x.UserId == userId && !x.DaDoc);
    }

    public async Task<ThongBao?> GetTrackedByIdAsync(long id)
    {
        return await _context.ThongBaos.FirstOrDefaultAsync(x => x.Id == id);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}